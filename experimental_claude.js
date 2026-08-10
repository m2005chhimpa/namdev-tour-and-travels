window.addEventListener("scroll", () => {
    const nav = document.querySelector("nav");
    if (window.scrollY > 40) {
        nav.classList.add("scrolled");
    } else {
        nav.classList.remove("scrolled");
    }
});