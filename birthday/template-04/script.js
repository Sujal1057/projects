document.addEventListener('DOMContentLoaded', () => {
    const envelope = document.querySelector('.envelope-container');

    if (envelope) {
        envelope.addEventListener('click', () => {
            window.location.href = 'page2.html';
        });
    }
});
