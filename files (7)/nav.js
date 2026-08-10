/**
 * nav.js
 * Sidebar open/close + nav scroll-shadow effect.
 * Consolidates: showsidebar()/hidesidebar() and the nav-scroll listener
 * that was previously duplicated/misplaced across inline script and
 * experimental_claude.js / formverif.js.
 */
function showsidebar() {
    document.querySelector('.sidebar').classList.add('show');
}

function hidesidebar() {
    document.querySelector('.sidebar').classList.remove('show');
}

window.addEventListener("scroll", () => {
    const nav = document.querySelector("nav");
    if (window.scrollY > 40) {
        nav.classList.add("scrolled");
    } else {
        nav.classList.remove("scrolled");
    }
});
