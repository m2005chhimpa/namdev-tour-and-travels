/**
 * sliders.js
 * All slick-carousel initializations for the homepage, each run ONCE.
 * Requires jQuery + slick.min.js loaded before this file.
 *
 * Previously: .reviewslider was initialized twice with different
 * settings (once in a combined block, once again standalone) — that's
 * removed here, kept as a single definitive config.
 */
$(function () {
    const responsiveDefaults = [
        { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1, infinite: true, dots: true } },
        { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } }
    ];

    $('.slider1').slick({
        dots: true,
        infinite: true,
        speed: 800,
        autoplay: true,
        autoplaySpeed: 300,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: responsiveDefaults
    });

    $('.slider2').slick({
        slidesToShow: 3,
        dots: true,
        arrows: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: responsiveDefaults
    });

    $('.feedslider').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: true,
        responsive: responsiveDefaults
    });

    $('.reviewslider').slick({
        slidesToShow: 3,
        dots: true,
        arrows: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: responsiveDefaults
    });

    $('.tjSlider').slick({
        slidesToShow: 3,
        dots: true,
        arrows: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: responsiveDefaults
    });
});
