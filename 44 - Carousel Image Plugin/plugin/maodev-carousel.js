(function ($) {
    "use strict";
    function MaoDevCarousel($container, options) {
        if ($container.length === 0) {
            console.error("Container not found.");
            return;
        }

        const settings = $.extend({
            datas: [],
            dots: true,
            selectors: {},
            breakpoints: {
                default: 5,
                mobile: 3
            }
        }, options);

        const $cards = $container.find(".card");
        const $leftArrow = $container.find(".nav-arrow.left");
        const $rightArrow = $container.find(".nav-arrow.right");

        const selectorMap = {};
        for (let key in settings.selectors) {
            selectorMap[key] = $container.find(settings.selectors[key]);
        }

        let currentIndex = 0;
        let isAnimating = false;

        function updateCarousel(newIndex) {
            if (isAnimating) return;
            isAnimating = true;

            const isMobile = window.matchMedia("(max-width: 768px)").matches;
            const visibleCount = isMobile ? settings.breakpoints.mobile
                : settings.breakpoints.default;

            currentIndex = (newIndex + $cards.length) % $cards.length;

            const currentData = settings.datas[currentIndex];

            $cards.each(function (i) {
                const $card = $(this);
                const offset = (i - currentIndex + $cards.length) % $cards.length;

                $card.removeClass("center left-1 left-2 right-1 right-2 hidden");

                if (offset === 0) {
                    $card.addClass("center");

                } else if (offset === 1) {
                    $card.addClass("right-1");
                } else if (offset === $cards.length - 1) {
                    $card.addClass("left-1");

                } else if (offset === 2 && visibleCount >= 5) {
                    $card.addClass("right-2");
                } else if (offset === $cards.length - 2 && visibleCount >= 5) {
                    $card.addClass("left-2");
                } else {
                    $card.addClass("hidden");
                }
            });

            $dots.each(function (i) {
                $(this).toggleClass("active", i === currentIndex);
            });

            for (let key in selectorMap) {
                selectorMap[key].css("opacity", 0);
            }

            let data = {
                currentIndex,
                currentData
            }

            $container.trigger('carousel:change', data);

            setTimeout(() => {
                for (let key in selectorMap) {
                    selectorMap[key].text(currentData[key] || "").css("opacity", 1);
                }

                isAnimating = false;
            }, 300);

            setTimeout(() => {
                isAnimating = false;
            }, 800);
        }

        function createDots() {
            if (!settings.dots) return;

            const $dotsContainer = $(".dots");
            $cards.each(function (i) {
                const $dot = $("<div class='dot'></div>");
                $dot.on("click", () => updateCarousel(i));
                $dotsContainer.append($dot);
            });
        }

        createDots();
        const $dots = $container.find(".dot");

        $leftArrow.on("click", () => updateCarousel(currentIndex - 1));
        $rightArrow.on("click", () => updateCarousel(currentIndex + 1));

        $dots.each(function (i) {
            $(this).on("click", () => updateCarousel(i));
        });

        $cards.each(function (i) {
            $(this).on("click", () => updateCarousel(i));
        });

        $(document).on("keydown", function (e) {
            if (e.key === "ArrowLeft") updateCarousel(currentIndex - 1);
            else if (e.key === "ArrowRight") updateCarousel(currentIndex + 1);
        });

        let touchStartX = 0;
        let touchEndX = 0;

        $container.on("touchstart", function (e) {
            touchStartX = e.originalEvent.changedTouches[0].screenX;
        });

        $container.on("touchend", function (e) {
            touchEndX = e.originalEvent.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            const threshold = 50;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) updateCarousel(currentIndex + 1);
                else updateCarousel(currentIndex - 1);
            }
        });

        updateCarousel(0);
    };

    $.fn.maoDevCarousel = function (options) {
        return this.each(function () {
            new MaoDevCarousel($(this), options);
        });
    };
})(jQuery);
