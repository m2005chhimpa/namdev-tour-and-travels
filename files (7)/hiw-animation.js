/**
 * hiw-animation.js
 * "How it works" section: fills the progress track and reveals each
 * step in sequence once the section scrolls into view.
 */
document.addEventListener("DOMContentLoaded", () => {
    const hiwSection = document.getElementById('hiwSection');
    const hiwFill = document.getElementById('hiwTrackFill');
    const hiwSteps = document.querySelectorAll('.hiwStep');

    if (!hiwSection || !hiwFill) return;

    const hiwObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                hiwFill.style.width = '100%';
                hiwSteps.forEach((step, i) => {
                    setTimeout(() => step.classList.add('hiwActive'), i * 400);
                });
                hiwObserver.unobserve(hiwSection);
            }
        });
    }, { threshold: 0.4 });

    hiwObserver.observe(hiwSection);
});
