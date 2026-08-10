/**
 * faq.js
 * FAQ accordion open/close + category tab filtering.
 */
document.querySelectorAll('.tfaqQuestion').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.tfaqItem');
        const wasOpen = item.classList.contains('open');

        document.querySelectorAll('.tfaqItem.open').forEach(openItem => {
            openItem.classList.remove('open');
        });

        if (!wasOpen) {
            item.classList.add('open');
        }
    });
});

document.querySelectorAll('.tfaqTab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tfaqTab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const category = tab.dataset.category;
        document.querySelectorAll('.tfaqItem').forEach(item => {
            item.style.display = item.dataset.category === category ? 'block' : 'none';
            item.classList.remove('open');
        });
    });
});
