(function ($, window, document) {
    "use strict";

    var reinitialized = false;
    console.log("[NivoSwiperOverride] Script loaded");

    function buildOptions() {
        return {
            autoHeight: false,
            loopAdditionalSlides: 2,
            slidesPerView: 1,
            slidesPerGroup: 1,
            effect: "fade",
            autoplay: {
                delay: 6000,
                disableOnInteraction: false,
                pauseOnMouseEnter: false
            },
            loop: true,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev"
            },
            breakpoints: {
                769: {
                    slidesPerView: 2,
                    // slidesPerGroup: 2,
                    effect: "slide"
                }
            },
            on: {
                init: function () {
                    var elem = $(".swiper").detach();
                    elem.insertBefore("#main");
                    $(".swiper").css("visibility", "visible");
                }
            }
        };
    }

    function reinitNivoSwiper() {
        if (reinitialized || typeof window.Swiper === "undefined") {
            return;
        }

        var slider = document.querySelector(".nop-slider");
        if (!slider) {
            return;
        }

        var existing = slider.swiper;
        if (existing && typeof existing.destroy === "function") {
            existing.destroy(true, true);
        }

        // Keep the same variable name as the plugin view for easier troubleshooting.
        var swiper6 = new window.Swiper(".nop-slider", buildOptions());
        reinitialized = !!swiper6;
        if (reinitialized) {
            console.log("[NivoSwiperOverride] Swiper reinitialized with override config");
        }
    }

    $(window).on("load", function () {
        // Run just after other load handlers so this override wins without editing plugin source.
        window.setTimeout(reinitNivoSwiper, 0);
    });
})(jQuery, window, document);
