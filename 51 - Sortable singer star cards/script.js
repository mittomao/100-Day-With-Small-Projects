// --- 📦 Imports ---
import { animate, hover, press } from "https://esm.sh/motion";
import { Howl } from "https://esm.sh/howler";
import { Sortable, Plugins } from "https://esm.sh/@shopify/draggable";

// --- 📱 Touch Support ---
const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

// --- 🔊 Audio Helper ---
let playAudio = true,
    ended = true,
    currentSound;

// ▶️ Play audio file with optional volume/speed
const play = async (file, volume = 0.5, speed = 1) => {
    var _currentSound;
    const context = new (AudioContext || webkitAudioContext)();
    await context.resume().catch(() => { });
    if (context.state === "suspended") return false;

    (_currentSound = currentSound) === null || _currentSound === void 0 ? void 0 : _currentSound.stop(); // stop any current sound
    ended = false;

    currentSound = new Howl({
        src: [file],
        autoplay: playAudio,
        volume,
        rate: speed,
        onend: () => {
            ended = true;
            currentSound = null;
        }
    });


    return true;
};

// --- 🧱 DOM Elements ---
const cards = document.querySelector(".cards");
if (!cards) {
    console.error("Cards container not found!");
    throw new Error("Cards container not found!");
}

// --- Sortable Cards Init ---
const sortable = new Sortable(cards, {
    draggable: ".card-wrap",
    handle: isTouchDevice ? null : ".card-handle",
    plugins: [Plugins.SortAnimation]
});


// Cancel mirror on drag end + animate disappearance
sortable.on("mirror:destroy", e => {
    e.cancel();
    const r = e.source.getBoundingClientRect();
    animate(
        e.mirror,
        {
            x: r.left,
            y: r.top,
            filter: "blur(2rem)",
            opacity: 0,
            scale: 0.5
        },

        {
            x: { duration: 0.3 },
            y: { duration: 0.3 },
            filter: { duration: 0.5 },
            opacity: { duration: 0.5 },
            scale: { duration: 0.5 },
            onComplete: () => e.mirror.remove()
        });
});

// 🟡 Play drag start sound
sortable.on("sortable:start", () => {
    play("https://cdn.freesound.org/previews/582/582898_5965684-lq.mp3");
    document.body.classList.add("grabbing");
});

// 🟢 Play drop sound and animate dropped card
sortable.on("sortable:stop", e => {
    document.body.classList.remove("grabbing");
    play("https://cdn.freesound.org/previews/370/370962_5450487-lq.mp3");

    requestAnimationFrame(() => {
        animate(
            e.data.newContainer.children[e.data.newIndex],
            { scale: [1.1, 1] },
            { type: "spring", stiffness: 200, damping: 10 });

    });
});

// --- ✨ Animate Each Card ---
[...cards.children].forEach((card, i) => {
    const bg = card.querySelector(".card-bg");
    const fade = card.querySelector(".card-fade");
    const button = card.querySelector(".card-button");
    const cardUI = card.querySelector(".card");
    const handle = card.querySelector(".card-handle");
    const name = card.querySelector(".card-name");
    const description = card.querySelector(".card-description");

    // 🖱️ Hover on card - fade + button color
    hover(card, () => {
        animate(fade, { opacity: 1 });
        animate(button, { background: "#FF004D" });
        return () => {
            animate(fade, { opacity: 0.75 });
            animate(button, { background: "rgba(255, 255, 255, 0.2)" });
        };
    });

    // 🎬 Card Fade-in Animation
    animate(
        cardUI,
        {
            opacity: [0, 1],
            filter: ["blur(1rem)", "blur(0)"]
        },

        {
            duration: 0.8,
            delay: i / 4
        });



    // 📝 Animate text entries
    animate(name, { y: [20, 0], opacity: [0, 1] }, { delay: i / 4 + 0.3 });
    animate(
        description,
        { y: [20, 0], opacity: [0, 0.4] },
        { delay: i / 4 + 0.5 });


    // 🌌 Background Pulse
    animate(
        bg,
        {
            scale: [1, 1.2]
        },

        {
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
        });



    // 👉 Button Press Feedback
    press(button, () => {
        animate(button, { scale: 1.1 });
        return () => animate(button, { scale: 1 });
    });

    // 🎯 Handle Hover - zoom in effect
    hover(handle, () => {
        animate(handle, { scale: 0.95 });
        animate(bg, { scale: 1.1 }, { type: "spring", stiffness: 50, damping: 10 });
        animate(
            card,
            { scale: 1.025 },
            { type: "spring", stiffness: 100, damping: 10 });


        // 🔁 Reset scale + resume bg animation
        return () => {
            animate(
                card,
                { scale: 1 },
                { type: "spring", stiffness: 100, damping: 10 });

            animate(handle, { scale: 1 });
            animate(
                bg,
                { scale: 1 },
                { type: "spring", stiffness: 50, damping: 10 }).
                then(() => {
                    animate(
                        bg,
                        {
                            scale: [1, 1.2]
                        },

                        {
                            duration: 15,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "linear"
                        });


                });
        };
    });
});
