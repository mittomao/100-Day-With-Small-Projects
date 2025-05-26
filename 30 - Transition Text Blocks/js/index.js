const splittingOutput = Splitting();

const texts = [...document.querySelectorAll('.content__text')];

const chars = texts.map(text => {
    const words = text.querySelectorAll('.word');
    return [...words].map(word => word.querySelectorAll('.char'));
});

let currentTextPos = 0;

let isAnimating = false;

texts[currentTextPos].classList.add('content__text--current');

// Demo 1
const animationText1 = () => {

    // If an animation is ongoing, do nothing.
    if (isAnimating) return false;
    // Set isAnimating to true as we start the animation.
    isAnimating = true;

    // Calculate the position of the upcoming text.
    const upcomingTextPos = currentTextPos ? 0 : 1;

    // Get the words of the current and upcoming texts.
    const currentWords = splittingOutput[currentTextPos].words;
    const upcomingtWords = splittingOutput[upcomingTextPos].words;
    const upcomingWordsTotal = upcomingtWords.length;

    // Define the animation using GSAP.
    gsap
        .timeline({
            defaults: {
                duration: 0.05,
                ease: 'expo'
            },
            onComplete: () => {
                // Update currentTextPos
                currentTextPos = upcomingTextPos;
                isAnimating = false;
            }
        })
        .to(currentWords, {
            opacity: 0,
            onComplete: () => {
                texts[currentTextPos].classList.remove('content__text--current');
            }
        })
        .fromTo(upcomingtWords, {
            willChange: 'transform, opacity',
            transformOrigin: pos => pos <= upcomingWordsTotal / 2 ? '100% 100%' : '0% 100%',
            opacity: 0,
            yPercent: 30,
            rotation: pos => pos <= upcomingWordsTotal / 2 ? -3 : 3
        }, {
            duration: 0.8,
            onStart: () => {
                texts[upcomingTextPos].classList.add('content__text--current');
            },
            opacity: 1,
            yPercent: 0,
            rotation: 0,
            stagger: {
                each: 0.02,
                from: 'center'
            }
        }, 0)

};

// Demo 2
const animationText2 = () => {

    if (isAnimating) return false;
    isAnimating = true;

    const upcomingTextPos = currentTextPos ? 0 : 1;

    // All current text words
    const currentWords = splittingOutput[currentTextPos].words;

    // All upcoming text words
    const upcomingtWords = splittingOutput[upcomingTextPos].words;

    gsap
        .timeline({
            defaults: {
                duration: 0.05,
                ease: 'expo'
            },
            onComplete: () => {
                // Update currentTextPos
                currentTextPos = upcomingTextPos;
                isAnimating = false;
            }
        })
        .to(currentWords, {
            duration: 0.01,
            opacity: 0,
            onComplete: () => {
                texts[currentTextPos].classList.remove('content__text--current');
            }
        })
        .fromTo(upcomingtWords, {
            opacity: 0
        }, {
            onStart: () => {
                texts[upcomingTextPos].classList.add('content__text--current');
            },
            opacity: 1,
            stagger: {
                each: 0.009,
                from: 'random',

            }
        })

};

// Demo 3
const animationText3 = () => {
    if (isAnimating) return false;
    isAnimating = true;

    const upcomingTextPos = currentTextPos ? 0 : 1;

    // All current text words
    const currentWords = splittingOutput[currentTextPos].words;

    // All upcoming text words
    const upcomingtWords = splittingOutput[upcomingTextPos].words;

    const tl = gsap.timeline({
        onComplete: () => {
            // Update currentTextPos
            currentTextPos = upcomingTextPos;
            isAnimating = false;
        }
    });
    currentWords.forEach((_, wordIndex) => {
        const wordTimeline = gsap.timeline()
            .fromTo(chars[currentTextPos][wordIndex], {
                willChange: 'transform',
                rotationY: 0
            }, {
                duration: .6,
                ease: 'expo',
                opacity: 0,
                rotationY: 90,
                stagger: {
                    each: 0.04,
                    from: 'end'
                },
            });
        tl.add(wordTimeline, Math.random() * .5);
    });

    tl.add(() => {
        texts[currentTextPos].classList.remove('content__text--current');
    })
    tl.add(() => {
        texts[upcomingTextPos].classList.add('content__text--current');
    }, '>-=.8')
        .addLabel('previous', '>');

    upcomingtWords.forEach((_, wordIndex) => {
        const wordTimeline = gsap.timeline()
            .fromTo(chars[upcomingTextPos][wordIndex], {
                willChange: 'transform',
                opacity: 0,
                rotationY: 90,
            }, {
                duration: .6,
                ease: 'expo',
                opacity: 1,
                rotationY: 0,
                stagger: {
                    each: 0.04,
                    from: 'end'
                },
            });
        tl.add(wordTimeline, `previous+=${Math.random() * .5}`);
    });

};

// Demo 4
const animationText4 = () => {

    if (isAnimating) return false;
    isAnimating = true;

    const upcomingTextPos = currentTextPos ? 0 : 1;

    // All current text words
    const currentWords = splittingOutput[currentTextPos].words;

    // All upcoming text words
    const upcomingtWords = splittingOutput[upcomingTextPos].words;

    const tl = gsap.timeline({
        onComplete: () => {
            // Update currentTextPos
            currentTextPos = upcomingTextPos;
            isAnimating = false;
        }
    });
    currentWords.forEach((_, wordIndex) => {
        const wordTimeline = gsap.timeline()
            .fromTo(chars[currentTextPos][wordIndex], {
                willChange: 'transform, opacity',
                scale: 1
            }, {
                duration: .2,
                ease: 'power1.in',
                opacity: 0,
                scale: 0,
                stagger: {
                    each: 0.03,
                    from: 'edges'
                },
            });
        tl.add(wordTimeline, Math.random() * .5);
    });

    tl.add(() => {
        texts[currentTextPos].classList.remove('content__text--current');
        texts[upcomingTextPos].classList.add('content__text--current');
    })
        .addLabel('previous', '>');

    upcomingtWords.forEach((_, wordIndex) => {
        const wordTimeline = gsap.timeline()
            .fromTo(chars[upcomingTextPos][wordIndex], {
                willChange: 'transform, opacity',
                opacity: 0,
                scale: 1.7
            }, {
                duration: .5,
                ease: 'power3',
                opacity: 1,
                scale: 1,
                stagger: {
                    each: 0.015,
                    from: 'edges'
                },
            });
        tl.add(wordTimeline, `previous+=${Math.random() * .5}`);
    });

};

//Demo 5 
const animationText5 = () => {

    if (isAnimating) return false;
    isAnimating = true;

    const upcomingTextPos = currentTextPos ? 0 : 1;

    // All current text words
    const currentWords = splittingOutput[currentTextPos].words;

    // All upcoming text words
    const upcomingtWords = splittingOutput[upcomingTextPos].words;

    const tl = gsap.timeline({
        onComplete: () => {
            // Update currentTextPos
            currentTextPos = upcomingTextPos;
            isAnimating = false;
        }
    });
    currentWords.forEach((_, wordIndex) => {
        const wordTimeline = gsap.timeline()
            .fromTo(chars[currentTextPos][wordIndex], {
                willChange: 'transform',
                transformOrigin: '50% 0%',
                scaleY: 1
            }, {
                duration: .3,
                ease: 'sine.in',
                scaleY: 0,
                stagger: {
                    each: 0.02,
                    from: 'start'
                },
            });
        tl.add(wordTimeline, wordIndex * 0.015);
    });

    tl.add(() => {
        texts[currentTextPos].classList.remove('content__text--current');
    })
    tl.add(() => {
        texts[upcomingTextPos].classList.add('content__text--current');
    }, '>-=0.6')
        .addLabel('previous', '>');

    upcomingtWords.forEach((_, wordIndex) => {
        const wordTimeline = gsap.timeline()
            .fromTo(chars[upcomingTextPos][wordIndex], {
                willChange: 'transform',
                transformOrigin: '50% 100%',
                scaleY: 0
            }, {
                duration: .3,
                ease: 'power4',
                scaleY: 1,
                stagger: {
                    each: 0.015,
                    from: 'start'
                },
            });
        tl.add(wordTimeline, `previous+=${wordIndex * 0.015}`);
    });

};

//Demo 6
const animationText6 = () => {

    if (isAnimating) return false;
    isAnimating = true;

    const upcomingTextPos = currentTextPos ? 0 : 1;

    // All current text words
    const currentWords = splittingOutput[currentTextPos].words;

    // All upcoming text words
    const upcomingtWords = splittingOutput[upcomingTextPos].words;

    gsap
        .timeline({
            defaults: {
                duration: 0.05,
                ease: 'expo'
            },
            onComplete: () => {
                // Update currentTextPos
                currentTextPos = upcomingTextPos;
                isAnimating = false;
            }
        })
        .fromTo(currentWords, {
            willChange: 'transform',
            transformOrigin: '100% 50%',
            yPercent: 0,
            rotation: 0
        }, {
            duration: .15,
            ease: 'power1.in',
            yPercent: -125,
            rotation: 3,
            stagger: {
                each: 0.02,
                from: 'start'
            },
            onComplete: () => {
                texts[currentTextPos].classList.remove('content__text--current');
            }
        })
        .fromTo(upcomingtWords, {
            willChange: 'transform',
            transformOrigin: '0% 50%',
            yPercent: 125,
            rotation: -3,
        }, {
            onStart: () => {
                texts[upcomingTextPos].classList.add('content__text--current');
            },
            duration: .6,
            ease: 'back',
            yPercent: 0,
            rotation: 0,
            stagger: {
                each: 0.02,
                from: 'start'
            }
        }, '>-=0.6')

};

//Demo 7
const animationText7 = () => {

    if (isAnimating) return false;
    isAnimating = true;

    const upcomingTextPos = currentTextPos ? 0 : 1;

    // All current text words
    const currentWords = splittingOutput[currentTextPos].words;

    // All upcoming text words
    const upcomingtWords = splittingOutput[upcomingTextPos].words;
    const upcomingWordsTotal = upcomingtWords.length;

    gsap
        .timeline({
            defaults: {
                duration: 0.05,
                ease: 'expo'
            },
            onComplete: () => {
                // Update currentTextPos
                currentTextPos = upcomingTextPos;
                isAnimating = false;
            }
        })
        .fromTo(currentWords, {
            xPercent: 0
        }, {
            duration: .15,
            ease: 'power1.in',
            xPercent: -100,
            stagger: {
                each: 0.01,
                from: 'start'
            },
            onComplete: () => {
                texts[currentTextPos].classList.remove('content__text--current');
            }
        })
        .fromTo(currentWords.map(word => word.parentNode), {
            xPercent: 0
        }, {
            duration: .15,
            ease: 'power1.in',
            xPercent: 100,
            stagger: {
                each: 0.01,
                from: 'start'
            },
            onComplete: () => {
                texts[currentTextPos].classList.remove('content__text--current');
            }
        }, 0)
        .addLabel('currentPanel', '>-=0.2')

        .fromTo(upcomingtWords, {
            xPercent: 100
        }, {
            onStart: () => {
                texts[upcomingTextPos].classList.add('content__text--current');
            },
            duration: 0.6,
            ease: 'expo',
            xPercent: 0,
            stagger: {
                each: 0.01,
                from: 'start'
            }
        }, 'currentPanel')
        .fromTo(upcomingtWords.map(word => word.parentNode), {
            xPercent: -100
        }, {
            onStart: () => {
                texts[upcomingTextPos].classList.add('content__text--current');
            },
            duration: 0.6,
            ease: 'expo',
            xPercent: 0,
            stagger: {
                each: 0.01,
                from: 'start'
            }
        }, 'currentPanel')
};

//Demo 8
const animationText8 = () => {

    if (isAnimating) return false;
    isAnimating = true;

    const upcomingTextPos = currentTextPos ? 0 : 1;

    // All current text words
    const currentWords = splittingOutput[currentTextPos].words;

    // All upcoming text words
    const upcomingtWords = splittingOutput[upcomingTextPos].words;

    gsap
        .timeline({
            defaults: {
                duration: 0.05,
                ease: 'expo'
            },
            onComplete: () => {
                // Update currentTextPos
                currentTextPos = upcomingTextPos;
                isAnimating = false;
            }
        })
        .fromTo(currentWords, {
            willChange: 'transform',
            scaleY: 1
        }, {
            duration: .5,
            ease: 'back.in(3)',
            scaleY: 0,
            stagger: {
                each: 0.03,
                from: 'start'
            },
            onComplete: () => {
                texts[currentTextPos].classList.remove('content__text--current');
            }
        }, 0)
        .fromTo(upcomingtWords, {
            willChange: 'transform',
            scaleY: 0,
        }, {
            onStart: () => {
                texts[upcomingTextPos].classList.add('content__text--current');
            },
            duration: .7,
            ease: 'elastic.out(0.7)',
            scaleY: 1,
            stagger: {
                each: 0.025,
                from: 'start'
            }
        }, '>-=0.65')

};

//Demo 9
const animationText9 = () => {

    if (isAnimating) return false;
    isAnimating = true;

    const upcomingTextPos = currentTextPos ? 0 : 1;

    // All current text words
    const currentWords = splittingOutput[currentTextPos].words;

    // All upcoming text words
    const upcomingtWords = splittingOutput[upcomingTextPos].words;

    gsap
        .timeline({
            defaults: {
                duration: 0.05,
                ease: 'expo'
            },
            onComplete: () => {
                // Update currentTextPos
                currentTextPos = upcomingTextPos;
                isAnimating = false;
            }
        })
        .fromTo(currentWords, {
            willChange: 'transform, opacity',
            opacity: 1,
            rotationX: 0,
            rotationY: 0,
            xPercent: 0,
            yPercent: 0,
            z: 0,
        }, {
            duration: 0.5,
            ease: 'power1.in',
            z: () => gsap.utils.random(-700, -400),
            opacity: 0,
            xPercent: () => gsap.utils.random(-50, 50),
            yPercent: () => gsap.utils.random(-10, 10),
            rotationX: () => gsap.utils.random(-90, 90),
            stagger: {
                each: 0.006,
                from: 'random'
            },
            onComplete: () => {
                texts[currentTextPos].classList.remove('content__text--current');
            }
        }, 0)

        .fromTo(upcomingtWords, {
            willChange: 'transform, opacity',
            z: () => gsap.utils.random(400, 700),
            opacity: 0,
            xPercent: () => gsap.utils.random(-50, 50),
            yPercent: () => gsap.utils.random(-10, 10),
            rotationX: () => gsap.utils.random(-90, 90)
        }, {
            onStart: () => {
                texts[upcomingTextPos].classList.add('content__text--current');
            },
            duration: .8,
            ease: 'expo',
            opacity: 1,
            rotationX: 0,
            rotationY: 0,
            xPercent: 0,
            yPercent: 0,
            z: 0,
            stagger: {
                each: 0.006,
                from: 'random'
            }
        }, '>-=0.45')

};

//Demo 10
const animationText10 = () => {

    if (isAnimating) return false;
    isAnimating = true;

    const upcomingTextPos = currentTextPos ? 0 : 1;

    // All current text words
    const currentWords = splittingOutput[currentTextPos].words;

    // All upcoming text words
    const upcomingtWords = splittingOutput[upcomingTextPos].words;

    const tl = gsap.timeline({
        onComplete: () => {
            // Update currentTextPos
            currentTextPos = upcomingTextPos;
            isAnimating = false;
        }
    });
    currentWords.forEach((_, wordIndex) => {
        const wordTimeline = gsap.timeline()
            .fromTo(chars[currentTextPos][wordIndex], {
                willChange: 'transform',
                transformOrigin: '50% 0%',
                opacity: 1,
                xPercent: 0,
                yPercent: 0
            }, {
                duration: .3,
                ease: 'power4',
                opacity: 0,
                xPercent: () => gsap.utils.random(-50, 50),
                yPercent: () => gsap.utils.random(-50, 50),
                stagger: {
                    each: 0.03,
                    from: 'random'
                },
            });
        tl.add(wordTimeline, Math.random() * .3);
    });

    tl.add(() => {
        texts[currentTextPos].classList.remove('content__text--current');
    })
    tl.add(() => {
        texts[upcomingTextPos].classList.add('content__text--current');
    }, '>-=0.6')
        .addLabel('previous', '>');

    upcomingtWords.forEach((_, wordIndex) => {
        const wordTimeline = gsap.timeline()
            .fromTo(chars[upcomingTextPos][wordIndex], {
                willChange: 'transform',
                transformOrigin: '50% 100%',
                opacity: 0,
                xPercent: () => gsap.utils.random(-50, 50),
                yPercent: () => gsap.utils.random(-50, 50),
            }, {
                duration: .4,
                ease: 'power4',
                opacity: 1,
                xPercent: 0,
                yPercent: 0,
                stagger: {
                    each: 0.02,
                    from: 'random'
                },
            });
        tl.add(wordTimeline, `previous+=${Math.random() * .3}`);
    });

};

//Demo 11
const animationText11 = () => {

    if (isAnimating) return false;
    isAnimating = true;

    const upcomingTextPos = currentTextPos ? 0 : 1;

    // All current text words
    const currentWords = splittingOutput[currentTextPos].words;

    // All upcoming text words
    const upcomingtWords = splittingOutput[upcomingTextPos].words;

    gsap
        .timeline({
            defaults: {
                duration: 0.05,
                ease: 'expo'
            },
            onComplete: () => {
                // Update currentTextPos
                currentTextPos = upcomingTextPos;
                isAnimating = false;
            }
        })
        .fromTo(currentWords, {
            willChange: 'transform, opacity',
            transformOrigin: '50% 100%',
            opacity: 1,
            rotationX: 0,
            rotationY: 0,
            xPercent: 0,
            yPercent: 0,
            z: 0,
        }, {
            duration: 0.2,
            ease: 'power1.in',
            opacity: 0,
            rotationX: -90,
            stagger: {
                each: 0.015,
                from: 'start'
            },
            onComplete: () => {
                texts[currentTextPos].classList.remove('content__text--current');
            }
        }, 0)

        .fromTo(upcomingtWords, {
            willChange: 'transform, opacity',
            transformOrigin: '50% 100%',
            opacity: 0,
            rotationX: 90
        }, {
            onStart: () => {
                texts[upcomingTextPos].classList.add('content__text--current');
            },
            duration: .7,
            ease: 'expo',
            opacity: 1,
            rotationX: 0,
            stagger: {
                each: 0.015,
                from: 'start'
            }
        }, '>-=0.4')

};

//Demo 12
const animationText12 = () => {

    if (isAnimating) return false;
    isAnimating = true;

    const upcomingTextPos = currentTextPos ? 0 : 1;

    // All current text words
    const currentWords = splittingOutput[currentTextPos].words;

    // All upcoming text words
    const upcomingtWords = splittingOutput[upcomingTextPos].words;

    const tl = gsap.timeline({
        onComplete: () => {
            // Update currentTextPos
            currentTextPos = upcomingTextPos;
            isAnimating = false;
        }
    });
    currentWords.forEach((_, wordIndex) => {
        const wordTimeline = gsap.timeline()
            .fromTo(chars[currentTextPos][wordIndex], {
                willChange: 'transform',
                transformOrigin: '0% 50%',
                opacity: 1,
                rotationY: 0,
                z: 0,
            }, {
                duration: .3,
                ease: 'sine.in',
                opacity: 0,
                rotationY: -45,
                z: 30,
                stagger: {
                    each: 0.05,
                    from: 'end'
                },
            });
        tl.add(wordTimeline, (currentWords.length - (wordIndex - 1)) * 0.02);
    });

    tl.add(() => {
        texts[currentTextPos].classList.remove('content__text--current');
    })
    tl.add(() => {
        texts[upcomingTextPos].classList.add('content__text--current');
    }, '>-=0.6')
        .addLabel('previous', '>');

    upcomingtWords.forEach((_, wordIndex) => {
        const wordTimeline = gsap.timeline()
            .fromTo(chars[upcomingTextPos][wordIndex], {
                willChange: 'transform',
                transformOrigin: '0% 50%',
                opacity: 0,
                rotationY: 90,
                z: -60
            }, {
                duration: .6,
                ease: 'back.out(4)',
                opacity: 1,
                rotationY: 0,
                z: 0,
                stagger: {
                    each: 0.05,
                    from: 'start'
                },
            });
        tl.add(wordTimeline, `previous+=${(upcomingtWords.length - (wordIndex - 1)) * 0.02}`);
    });

};

function switchDemos(key) {
    switch (key) {
        case 'demo-2':
            animationText2();
            break;
        case 'demo-3':
            animationText3();
            break;
        case 'demo-4':
            animationText4();
            break;
        case 'demo-5':
            animationText5();
            break;
        case 'demo-6':
            animationText6();
            break;
        case 'demo-7':
            animationText7();
            break;
        case 'demo-8':
            animationText8();
            break;
        case 'demo-9':
            animationText9();
            break;
        case 'demo-10':
            animationText10();
            break;
        case 'demo-11':
            animationText11();
            break;
        case 'demo-12':
            animationText12();
            break;

        default:
            animationText1();
    }
}

let key = window.location.hash.substring(1);
let demoItem = document.querySelectorAll('.demos__item');
demoItem.forEach(item => {
    item.addEventListener('click', function (e) {
        var location = window.location;
        window.location.href = location.origin + location.pathname + e.currentTarget.getAttribute('href');
        window.location.reload();
    });
});

document.addEventListener('DOMContentLoaded', function (e) {
    switchDemos(key);
    document.body.classList.add(key);
    demoItem.forEach(item => item.classList.remove('active'));
    document.querySelectorAll(`[href="#${key}"]`).forEach(item => item.classList.add('active'));
});

