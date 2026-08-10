/**
 * typed-init.js
 * Hero "auto-type" text animation.
 * Requires typed.umd.js loaded before this file.
 *
 * Fixes vs. the old script.js copy: that version targeted ".autotype"
 * (no hyphen) which matches nothing in the HTML (the span's class is
 * "auto-type"), and used wrong-case options (Strings/typespeed/backspeed)
 * which Typed.js doesn't recognize. This is the corrected, single copy.
 */
var typed = new Typed(".auto-type", {
    strings: ['Best service', 'special tour', 'popular tour'],
    typeSpeed: 150,
    backSpeed: 150,
    loop: true
});
