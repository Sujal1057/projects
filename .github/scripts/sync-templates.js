/**
 * KANVERSE Template Sync Script
 * 
 * Scans the repository for category/template folders, then upserts each
 * template into the Supabase `templates` table with its preview URL.
 * 
 * This runs inside a GitHub Action — no external dependencies required.
 * Uses only Node.js built-in modules (fs, path, https).
 * 
 * Environment variables (set as GitHub Secrets):
 *   SUPABASE_URL           – e.g. https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY – service role key for admin writes
 *   PREVIEW_DOMAIN         – e.g. preview.kanverse.live  (no protocol, no trailing slash)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// ─── Configuration ───────────────────────────────────────────────────────────

const SUPABASE_URL = (process.env.SUPABASE_URL || '').trim();
const SUPABASE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
const PREVIEW_DOMAIN = (process.env.PREVIEW_DOMAIN || 'preview.kanverse.live').trim();

// Root of the repository (two levels up from .github/scripts/)
const REPO_ROOT = path.resolve(__dirname, '..', '..');

// Folders/files at root level that are NOT categories
const IGNORE_DIRS = new Set([
  '.git',
  '.github',
  '.vercel',
  'node_modules',
  '.vscode',
  '.idea',
]);

// Files at root level that are NOT categories
const IGNORE_FILES = new Set([
  'vercel.json',
  '.gitignore',
  'TEMPLATE_STRUCTURE.md',
  'README.md',
  'package.json',
  'package-lock.json',
]);

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Pretty-print a template name from its folder name.
 * "template-01" → "Template 01"
 * "template-12" → "Template 12"
 */
function prettyName(folderName) {
  return folderName
    .split('-')
    .map(part => {
      // Keep numeric parts as-is
      if (/^\d+$/.test(part)) return part;
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Pretty-print a category name.
 * "LOVE" → "Love"
 * "wedding" → "Wedding"
 */
function prettyCategory(folderName) {
  const lower = folderName.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/**
 * Generate a slug from category + template folder names.
 * ("LOVE", "template-01") → "love-template-01"
 */
function makeSlug(category, template) {
  return `${category.toLowerCase()}-${template.toLowerCase()}`;
}

/**
 * Generate the preview URL for a template.
 * Uses the original folder name (preserving case) as the URL path.
 */
function makePreviewUrl(categoryFolder, templateFolder) {
  return `https://${PREVIEW_DOMAIN}/${categoryFolder}/${templateFolder}/`;
}

/**
 * Check if a template folder has an actual index.html (not just .gitkeep).
 */
function hasContent(categoryFolder, templateFolder) {
  const templateDir = path.join(REPO_ROOT, categoryFolder, templateFolder);
  const indexPath = path.join(templateDir, 'index.html');
  return fs.existsSync(indexPath);
}

/**
 * Make an HTTP/HTTPS request and return the response body as a string.
 * Uses only Node.js built-in modules (no fetch polyfill needed for Node 18+).
 */
function request(method, url, headers, body) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const transport = parsedUrl.protocol === 'https:' ? https : http;

    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method,
      headers,
    };

    const req = transport.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ status: res.statusCode, body: data, headers: res.headers });
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(body);
    }

    req.end();
  });
}

// ─── Core Logic ──────────────────────────────────────────────────────────────

/**
 * Scan the repository and return a list of detected templates.
 */
function scanTemplates() {
  const templates = [];
  const rootEntries = fs.readdirSync(REPO_ROOT, { withFileTypes: true });

  for (const entry of rootEntries) {
    // Skip non-directories and ignored directories
    if (!entry.isDirectory()) continue;
    if (IGNORE_DIRS.has(entry.name)) continue;
    if (entry.name.startsWith('.')) continue;

    const categoryFolder = entry.name;
    const categoryDir = path.join(REPO_ROOT, categoryFolder);
    const templateEntries = fs.readdirSync(categoryDir, { withFileTypes: true });

    for (const tplEntry of templateEntries) {
      if (!tplEntry.isDirectory()) continue;
      if (tplEntry.name.startsWith('.')) continue;

      const templateFolder = tplEntry.name;
      const hasIndex = hasContent(categoryFolder, templateFolder);

      templates.push({
        categoryFolder,
        templateFolder,
        slug: makeSlug(categoryFolder, templateFolder),
        name: prettyName(templateFolder),
        category: categoryFolder.toLowerCase(),
        displayCategory: prettyCategory(categoryFolder),
        previewUrl: makePreviewUrl(categoryFolder, templateFolder),
        hasContent: hasIndex,
      });
    }
  }

  return templates;
}

/**
 * Upsert a single template record into Supabase.
 * Uses the slug as the unique identifier (ON CONFLICT).
 */
async function upsertTemplate(template) {
  const url = `${SUPABASE_URL}/rest/v1/templates`;

  const payload = {
    slug: template.slug,
    name: template.name,
    category: template.category,
    description: `${template.displayCategory} — ${template.name}`,
    demo_url: template.previewUrl,
    active: template.hasContent,
    updated_at: new Date().toISOString(),
  };

  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'resolution=merge-duplicates,return=representation',
  };

  const res = await request('POST', url, headers, JSON.stringify(payload));

  if (res.status >= 200 && res.status < 300) {
    return { success: true, data: JSON.parse(res.body) };
  } else {
    return { success: false, status: res.status, error: res.body };
  }
}

/**
 * Remove templates from Supabase that no longer exist in the repository.
 * Only removes templates whose slug follows the pattern used by this sync.
 */
async function removeStaleTemplates(activeTemplateSlugs) {
  // Fetch all templates from Supabase
  const url = `${SUPABASE_URL}/rest/v1/templates?select=id,slug,demo_url`;
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
  };

  const res = await request('GET', url, headers, null);

  if (res.status < 200 || res.status >= 300) {
    console.warn('⚠️  Could not fetch existing templates to check for stale entries');
    return;
  }

  const existingTemplates = JSON.parse(res.body);
  const activeSlugsSet = new Set(activeTemplateSlugs);

  // Only consider templates whose demo_url points to our preview domain
  const stale = existingTemplates.filter(t =>
    t.demo_url &&
    t.demo_url.includes(PREVIEW_DOMAIN) &&
    !activeSlugsSet.has(t.slug)
  );

  for (const t of stale) {
    console.log(`🗑️  Removing stale template: ${t.slug}`);
    const delUrl = `${SUPABASE_URL}/rest/v1/templates?id=eq.${t.id}`;
    await request('DELETE', delUrl, headers, null);
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log('  KANVERSE Template Sync');
  console.log('═══════════════════════════════════════════');
  console.log('');

  // Validate environment
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing required environment variables:');
    if (!SUPABASE_URL) console.error('   - SUPABASE_URL');
    if (!SUPABASE_KEY) console.error('   - SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  console.log(`📁 Scanning repository: ${REPO_ROOT}`);
  console.log(`🌐 Preview domain: ${PREVIEW_DOMAIN}`);
  console.log('');

  // Step 1: Scan templates
  const templates = scanTemplates();

  if (templates.length === 0) {
    console.log('⚠️  No templates detected in the repository.');
    return;
  }

  // Group by category for display
  const byCategory = {};
  for (const t of templates) {
    if (!byCategory[t.displayCategory]) byCategory[t.displayCategory] = [];
    byCategory[t.displayCategory].push(t);
  }

  console.log('📋 Detected templates:');
  console.log('');
  for (const [cat, tpls] of Object.entries(byCategory)) {
    console.log(`  ${cat}`);
    for (const t of tpls) {
      const status = t.hasContent ? '✅' : '📦';
      console.log(`    ${status} ${t.name}  →  ${t.previewUrl}`);
    }
  }
  console.log('');

  // Step 2: Upsert each template to Supabase
  console.log('🔄 Syncing to Supabase...');
  console.log('');

  let successCount = 0;
  let failCount = 0;

  for (const template of templates) {
    const result = await upsertTemplate(template);
    if (result.success) {
      console.log(`  ✅ ${template.slug}  →  synced`);
      successCount++;
    } else {
      console.log(`  ❌ ${template.slug}  →  FAILED (${result.status}: ${result.error})`);
      failCount++;
    }
  }

  // Step 3: Remove stale templates
  console.log('');
  console.log('🧹 Checking for stale templates...');
  await removeStaleTemplates(templates.map(t => t.slug));

  // Summary
  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log(`  ✅ Synced: ${successCount}    ❌ Failed: ${failCount}`);
  console.log('═══════════════════════════════════════════');
  console.log('');

  if (failCount > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
