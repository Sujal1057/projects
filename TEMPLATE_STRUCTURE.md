# KANVERSE Template Repository Rules

## 1. Repository Structure

The repository uses:

CATEGORY/
    TEMPLATE/

Examples:

love/
    template-01/
    template-02/

wedding/
    template-01/
    template-02/

birthday/
    template-01/

The first folder always represents the category.
The second folder always represents an individual template/product.

## 2. Adding Templates

To add a new template, simply create it inside the correct category.

Example:

love/template-05/

or:

wedding/template-03/

Then push the changes to the existing GitHub repository.

## 3. Adding New Categories

If a new category is required, create a new category folder and place its templates inside it.

Example:

proposal/template-01/

## 4. Metadata / JSON Rule

Do NOT require the user to manually create `template.json` files.

Do NOT require the user to manually enter template metadata.

If `template.json` or any other metadata/configuration JSON file is required, the agent/system must automatically create it, populate it, and maintain/update it based on the template folder structure.

For every new template, the user should only need to create the category/template folder and push it to GitHub.

The system must automatically handle any required JSON metadata.

## 5. Preview URL Rule

The user must NOT manually enter or maintain preview URLs.

Preview URLs should be generated automatically from the category + template structure.

Example:

love/template-05/

should automatically map to the appropriate preview URL.

## 6. Admin Rule

The Admin Panel should automatically detect:

Category
→ Templates inside that category
→ Preview link for each template

The user should not have to manually create database entries for every new template.

## 7. Existing Templates

Never delete, rename, or break an existing template unless explicitly requested.

Existing template folders and their functionality must remain intact.

## 8. GitHub Rule

Always use the existing KANVERSE GitHub repository.

Never create a new repository for templates unless explicitly requested.

## 9. Future Automation Workflow

The intended workflow is:

Create template folder
→ Push to GitHub
→ Automatically detect category/template
→ Automatically sync required metadata
→ Automatically update Admin
→ Automatically generate preview URL
→ Vercel deploys automatically

The user's only regular task should be creating the correct category/template folder and pushing it to GitHub.

## 10. React / Vite / Compiled Templates Rule

Since the Vercel repository is served statically (`buildCommand: ""`), if a template uses a framework like React or Vite that requires compilation:
1. The project MUST be built locally (e.g., `npm run build`) to generate a `dist/` folder before pushing to GitHub.
2. In `vite.config.ts`, `base: './'` must be set so built assets use relative paths.
3. The `previewUrl` in the generated `template.json` MUST point to the `/dist/` folder (e.g., `/LOVE/tempate-02/dist/`) so that Vercel serves the compiled HTML/JS, preventing a blank screen on live preview.

## 11. Important Principle

Keep the repository clean, predictable, scalable, and easy to maintain.

Do not introduce unnecessary manual configuration for individual templates.
