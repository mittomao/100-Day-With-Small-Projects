/**
 * Preloads images specified by the CSS selector.
 * @function
 * @param {string} [selector='img'] - CSS selector for target images.
 * @returns {Promise} - Resolves when all specified images are loaded.
 */

const preload = (image) => new Promise((resolve, reject) => {
  const img = new Image()
  img.onload = resolve
  img.onerror = reject
  img.src = image.src
})

const preloadImages = (images) => Promise.all(images.map(preload))

const debounce = (callback, timeout = 250) => {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { callback.apply(this, args); }, timeout);
  };
};

// Exporting utility functions for use in other modules.
export {
  preloadImages, debounce
};