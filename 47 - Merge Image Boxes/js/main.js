$(function () {
  const $wrapper = $("#im_wrapper");
  const $loading = $("#im_loading");
  const $next = $("#im_next");
  const $prev = $("#im_prev");
  const per_line = 4;
  const per_col = 5;
  const total = per_line * per_col;
  let flg_click = true;
  let mode = "grid";
  let current = -1;
  const positions = Array.from({ length: total }, (_, i) => i);

  // Create thumbnails
  for (let i = 1; i <= total; i++) {
    const row = Math.floor((i - 1) / per_line);
    const col = (i - 1) % per_line;
    const $div = $("<div>").css(
      "background-position",
      `-${col * 125}px -${row * 125}px`
    );
    const $img = $("<img>").attr("src", `images/${i}.jpg`);
    $div.append($img);
    $wrapper.append($div);
  }

  const $thumbs = $wrapper.children("div");
  const $thumbImgs = $thumbs.find("img");

  // Preload images
  let loaded = 0;
  $loading.show();
  $thumbImgs.each(function () {
    const src = $(this).attr("src");
    $("<img>").on("load", checkLoad).attr("src", src);
    $("<img>").on("load", checkLoad).attr("src", src.replace("/images", ""));
  });

  function checkLoad() {
    if (++loaded === total * 2) {
      $loading.hide();
      disperse();
    }
  }

  function lock() {
    flg_click = false;
  }
  function unlock() {
    flg_click = true;
  }

  function disperse() {
    lock();
    mode = "grid";
    const space_w = $(window).width() / (per_line + 1);
    const space_h = $(window).height() / (per_col + 1);
    $thumbs.each(function (i) {
      const $thumb = $(this);
      const left = space_w * ((i % per_line) + 1) - 57;
      const top = space_h * (Math.floor(i / per_line) + 1) - 57;
      const rotate = Math.floor(Math.random() * 41) - 20;
      $thumb
        .css({
          transform: `rotate(${rotate}deg)`,
          backgroundImage: "none",
        })
        .stop()
        .animate({ left, top }, 600, function () {
          if (i === total - 1) unlock();
        });
      $thumb.find("img").fadeIn(400).css({
        width: "115px",
        height: "115px",
        marginTop: "5px",
        marginLeft: "5px",
      });
    });
  }

  function mergeToImage($targetThumb) {
    lock();
    mode = "single";
    const image_src = $targetThumb
      .find("img")
      .attr("src")
      .replace("/images", "");
    const thumbSize = 115;
    const gap = 5;
    const spacing = thumbSize + gap;

    const f_w = per_line * spacing;
    const f_h = per_col * spacing;
    const f_l = ($(window).width() - f_w) / 2;
    const f_t = ($(window).height() - f_h) / 2;

    $thumbs.each(function (i) {
      const $thumb = $(this);
      const $img = $thumb.find("img");
      $img.stop().animate(
        {
          width: "100%",
          height: "100%",
          marginTop: 0,
          marginLeft: 0,
        },
        100,
        function () {
          $thumb
            .css({
              backgroundImage: `url(${image_src})`,
            })
            .stop()
            .animate(
              {
                left: f_l + (i % per_line) * spacing,
                top: f_t + Math.floor(i / per_line) * spacing,
              },
              800
            )
            .css({ transform: "rotate(0deg)" });

          $img.fadeOut(500);

          if (i === total - 1) {
            unlock();
            showNav();
          }
        }
      );
    });
  }

  function showNav() {
    $next.stop().animate({ right: "0px" }, 300);
    $prev.stop().animate({ left: "0px" }, 300);
  }

  function hideNav() {
    $next.stop().animate({ right: "-50px" }, 300);
    $prev.stop().animate({ left: "-50px" }, 300);
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  $thumbs.on("click", function () {
    if (!flg_click) return;
    if (mode === "grid") {
      current = $(this).index();
      mergeToImage($(this));
    } else {
      // return to grid
      hideNav();
      $thumbs.each(function () {
        const $thumb = $(this);
        const $img = $thumb.find("img");
        $thumb.css({ backgroundImage: "none" });
        $img.fadeIn(400).css({
          width: "115px",
          height: "115px",
          marginTop: "5px",
          marginLeft: "5px",
        });
      });
      disperse();
    }
  });

  $next.on("click", function () {
    if (!flg_click) return;
    if (++current >= total) {
      current = total - 1;
      return;
    }
    const src = $thumbs
      .eq(current)
      .find("img")
      .attr("src")
      .replace("/images", "");
    updateImageGrid(src);
  });

  $prev.on("click", function () {
    if (!flg_click) return;
    if (--current < 0) {
      current = 0;
      return;
    }
    const src = $thumbs
      .eq(current)
      .find("img")
      .attr("src")
      .replace("/images", "");
    updateImageGrid(src);
  });

  function updateImageGrid(src) {
    lock();
    const arr = shuffle([...positions]);
    $thumbs.each(function (i) {
      const $thumb = $(this);
      setTimeout(() => {
        $thumb.css({ backgroundImage: `url(${src})` });
        if (i === total - 1) unlock();
      }, arr[i] * 15);
    });
  }

  $(window).on("resize", function () {
    if (mode === "grid") disperse();
  });
});
