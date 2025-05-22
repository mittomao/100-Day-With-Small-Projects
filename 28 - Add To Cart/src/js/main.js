import '../scss/reset.scss';
import '../scss/base.scss';
import '../scss/globals.scss';
import '../scss/products.scss';
import '../scss/cart.scss';

import { preloadImages } from './utils';
import Products from './products';

window.addEventListener('load', async () => {
  new Products();
  const images = [...document.querySelectorAll('img')];

  await preloadImages(images).then(() => {
    document.body.classList.remove('loading');
  })
});