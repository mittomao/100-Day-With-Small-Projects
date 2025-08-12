const SphereApp = () => {
  const MAX_POLAR_ROT_DEG = 15;
  const PAN_SENSITIVTY = 18;
  const TRANSITION_DUR_MS = 300; // todo - use a transitionend event

  const DOM = {
    sphere: document.querySelector(".sphere"),
    main: document.querySelector("main"),
    items: document.querySelectorAll(".item__image"),
    frame: document.querySelector(".frame"),
    viewer: document.querySelector(".viewer"),
    scrim: document.querySelector(".scrim"),
  };

  const state = {
    rotation: { x: 0, y: 0 },
    startRotation: { x: 0, y: 0 },
    inertiaFrame: null,
    cancelTap: false,
  };

  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  const applyTransform = () => {
    DOM.sphere.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${state.rotation.x}deg) rotateY(${state.rotation.y}deg)`;
  };

  const stopInertia = () => {
    if (state.inertiaFrame) {
      cancelAnimationFrame(state.inertiaFrame);
      state.inertiaFrame = null;
    }
  };

  const startInertia = (velocityX, velocityY) => {
    let vx = velocityX * 100;
    let vy = velocityY * 100;

    const friction = 0.92;
    const minVelocity = 0.1;
    const maxFrames = 120;
    let frameCount = 0;

    const step = () => {
      vx *= friction;
      vy *= friction;

      if (Math.abs(vx) < minVelocity && Math.abs(vy) < minVelocity) {
        state.inertiaFrame = null;
        return;
      }

      const proposedX = state.rotation.x - vy / 200;

      state.rotation.x = clamp(
        proposedX,
        -MAX_POLAR_ROT_DEG,
        MAX_POLAR_ROT_DEG
      );
      state.rotation.y += vx / 200;

      applyTransform();

      frameCount++;
      if (frameCount > maxFrames) {
        state.inertiaFrame = null;
        return;
      }

      state.inertiaFrame = requestAnimationFrame(step);
    };

    stopInertia();
    state.inertiaFrame = requestAnimationFrame(step);
  };

  const setupGestures = () => {
    const hammer = new Hammer(DOM.main);
    hammer.get("pan").set({ direction: Hammer.DIRECTION_ALL });

    hammer.on("panstart", () => {
      state.cancelTap = true;
      stopInertia();
      state.startRotation.x = state.rotation.x;
      state.startRotation.y = state.rotation.y;
    });

    hammer.on("panmove", ({ deltaX, deltaY }) => {
      const proposedX = state.startRotation.x - deltaY / PAN_SENSITIVTY;

      state.rotation.y = state.startRotation.y + deltaX / PAN_SENSITIVTY;
      state.rotation.x = clamp(
        proposedX,
        -MAX_POLAR_ROT_DEG,
        MAX_POLAR_ROT_DEG
      );

      applyTransform();
    });

    hammer.on("panend", ({ velocityX, velocityY }) => {
      setTimeout(() => (state.cancelTap = false), 100);
      startInertia(velocityX, velocityY);
    });
  };

  const setupTaps = () => {
    const getTransformRotation = (el) => {
      const str = el.style.transform;
      const matchX = str.match(/rotateX\((-?\d+(\.\d+)?)deg\)/);
      const matchY = str.match(/rotateY\((-?\d+(\.\d+)?)deg\)/);

      const rotateX = matchX ? parseFloat(matchX[1]) : 0;
      const rotateY = matchY ? parseFloat(matchY[1]) : 0;

      return { rotateX, rotateY };
    };

    const getRotationXY = (el) => {
      const style = window.getComputedStyle(el);
      const transform = style.transform;

      if (!transform || transform === "none") {
        return { rotateX: 0, rotateY: 0 };
      }

      if (!transform.startsWith("matrix3d")) {
        console.warn("Transform is not 3D. rotateX/Y won't be accurate.");
        return { rotateX: 0, rotateY: 0 };
      }

      const values = transform
        .match(/matrix3d\((.+)\)/)[1]
        .split(",")
        .map(parseFloat);

      const rotateX = Math.asin(-values[9]) * (180 / Math.PI);
      const rotateY = Math.atan2(values[8], values[10]) * (180 / Math.PI);

      return { rotateX, rotateY };
    };

    const handleClickScrim = () => {
      const el = document.querySelector('[data-focused="true"]');
      const parentEl = el.parentNode;

      const referenceDiv = document.querySelector(".item__image--reference");
      referenceDiv.remove();

      const enlargedImg = document.querySelector(".enlarge");
      enlargedImg.remove();

      parentEl.style.setProperty("--rot-y-delta", `0deg`);
      parentEl.style.setProperty("--rot-x-delta", `0deg`);
      el.style.transform = ``;
      el.style.zIndex = 0;

      setTimeout(() => {
        document.body.setAttribute("data-enlarging", "false");
        el.setAttribute("data-focused", "false");
      }, TRANSITION_DUR_MS);
    };

    const handleClick = (e) => {
      if (state.cancelTap) return;

      // .item__image
      const el = e.target;
      const parentEl = el.parentNode;

      el.setAttribute("data-focused", "true");

      const parentRotation = getRotationXY(parentEl);
      const globalRotation = getTransformRotation(DOM.sphere);

      const normalizeDegrees = (deg) => ((deg % 360) + 360) % 360;
      const parentY = normalizeDegrees(parentRotation.rotateY);
      const globalY = normalizeDegrees(globalRotation.rotateY);

      let rotY = -(parentY + globalY) % 360;
      if (rotY < -180) rotY += 360;

      parentEl.style.setProperty("--rot-y-delta", `${rotY}deg`);

      const rotX = -parentRotation.rotateX - globalRotation.rotateX;
      parentEl.style.setProperty("--rot-x-delta", `${rotX}deg`);

      const referenceDiv = document.createElement("div");
      parentEl.appendChild(referenceDiv);
      referenceDiv.style.opacity = 0;
      referenceDiv.classList.add("item__image", "item__image--reference");
      referenceDiv.style.transform = `rotateX(${-parentRotation.rotateX}deg) rotateY(${-parentRotation.rotateY}deg)`;

      const sourceRect = referenceDiv.getBoundingClientRect();
      const targetRect = DOM.frame.getBoundingClientRect();
      const deltaScaleX = targetRect.width / sourceRect.width;
      const deltaScaleY = targetRect.height / sourceRect.height;
      const deltaScale = Math.min(deltaScaleX, deltaScaleY);

      el.style.transform = `scale(${deltaScale}) translateZ(30px)`;
      el.style.zIndex = 3;

      const img = document.createElement("img");
      const newSrc = `${parentEl.getAttribute("data-src")}`;
      img.src = newSrc;

      // When the image loads, replace the src with a higher res version
      //https://assets.codepen.io/215059/photo-1589156191108-c762ff4b96ab_1.jpg
      img.addEventListener("load", () => {
        img.classList.add("loaded");
      });

      DOM.scrim.addEventListener("click", handleClickScrim, { once: true });

      setTimeout(() => {
        const renderedRect = el.getBoundingClientRect();
        const enlargementEl = document.createElement("div");

        Object.assign(enlargementEl.style, {
          top: renderedRect.top - DOM.main.getBoundingClientRect().top + "px",
          left: renderedRect.left + "px",
          width: renderedRect.width + "px",
          height: renderedRect.height + "px",
          opacity: 0,
        });

        setTimeout(() => {
          enlargementEl.style.opacity = 1;
          document.body.setAttribute("data-enlarging", "true");
        }, TRANSITION_DUR_MS);

        enlargementEl.classList.add("enlarge");
        enlargementEl.appendChild(img);
        DOM.viewer.appendChild(enlargementEl);
      }, TRANSITION_DUR_MS);
    };

    DOM.items.forEach((el) => el.addEventListener("click", handleClick));
  };

  const init = () => {
    setupGestures();
    setupTaps();
  };

  return { init };
};

SphereApp().init();
