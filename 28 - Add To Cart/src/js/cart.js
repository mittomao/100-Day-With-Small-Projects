import { gsap } from 'gsap';

class Cart {
  constructor() {
    this.cart = document.querySelector('.cart');
    this.cartItems = []

    this.cartButton = document.querySelector('.cart-button');
    this.cartButtonLabel = document.querySelector('.cart-button__label-wrap');
    this.cartButtonNumber = document.querySelector('.cart-button__number');
    this.cartButtonBg = document.querySelector('.cart-button__number-bg');
    this.cartClose = document.querySelector('.cart__inner-close');
    this.cartTotal = document.querySelector('.cart-total__amount');
    this.cartItemsList = document.querySelector('.cart-items');

    this.cartOpened = false;

    this.animatingElements = {
      bg: this.cart.querySelector('.cart__bg'),
      innerBg: this.cart.querySelector('.cart__inner-bg'),
      close: this.cart.querySelector('.cart__inner-close'),
      items: [...this.cart.querySelectorAll('.cart-item')],
      total: [...this.cart.querySelectorAll('.cart-total > *')],
    }

    this.init();
  }

  init() {
    this.cartButtonAnimationSetup();
    this.cartAnimationSetup();

    this.cartButton.addEventListener('click', () => {
      if (this.isAnimating) return;
      document.body.classList.add('locked');

      this.isAnimating = true;

      this.cartAnimationEnter().then(() => { 
        this.cartOpened = true;
        this.isAnimating = false;
      })
    })
    
    this.cartClose.addEventListener('click', () => {
      if (this.isAnimating) return;
      document.body.classList.remove('locked');

      this.isAnimating = true;

      this.cartAnimationLeave().then(() => { 
        this.cartOpened = false;
        this.isAnimating = false;
      })
    })
  }

  updateCart() {
    const cartElementsQuantities = [...document.querySelectorAll('.cart-item__quantity')];
    this.cartButtonNumber.innerHTML = Object.values(this.cartItems).length;
    
    let cartAmount = 0;

    Object.values(this.cartItems).forEach((item, i) => {
      cartElementsQuantities[i].innerHTML = item.quantity;
      cartAmount+= item.price * item.quantity
    })

    this.cartTotal.innerHTML = `€ ${cartAmount}`;
  }

  appendItem(item) {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item', 'cart-grid');
    
    cartItem.innerHTML = `
      <img class="cart-item__img" src="${item.cover}" alt="${item.name}">
    
      <div class="cart-item__details">
        <span class="cart-item__details-title">${item.name}</span>

        <button class="cart-item__remove-btn">Remove</button>

        <div class="cart-item__details-wrap">
          <span class="cart-item__details-label">Quantity:</span>

          <div class="cart-item__details-actions">
            <button class="cart-item__minus-button">-</button>
            <span class="cart-item__quantity">${item.quantity}</span>
            <button class="cart-item__plus-button">+</button>
          </div>
          <span class="cart-item__details-price">€ ${item.price}</span>
        </div>
      </div>
    `;

    const removeButton = cartItem.querySelector('.cart-item__remove-btn');
    const plusButton = cartItem.querySelector('.cart-item__plus-button');
    const minusButton = cartItem.querySelector('.cart-item__minus-button');

    removeButton.addEventListener('click', () => this.removeItemFromCart(item.id));
    plusButton.addEventListener('click', () => this.updateQuantity(item.id, 1));
    minusButton.addEventListener('click', () => this.updateQuantity(item.id, -1));

    return cartItem;
  }

  addItemToCart(el) {
    const { id, price, name, cover } = el.dataset;

    const index = this.cartItems.findIndex((el) => el.id === id);

    if (index < 0) {
      const newItem = { id, price, name, cover, quantity: 1 };
      this.cartItems.push(newItem);

      const newCartItem = this.appendItem(newItem);
      this.cartItemsList.append(newCartItem);
    } else this.cartItems[index].quantity += 1;

    this.updateCart();
  }

  updateQuantity(id, quantity) {
    const index = this.cartItems.findIndex((el) => el.id === id);
    const newQuantity = this.cartItems[index].quantity + quantity;

    if (newQuantity > 0) {
      this.cartItems[index].quantity = newQuantity
    } else if (newQuantity === 0) {
      this.removeItemFromCart(id);
    }

    this.updateCart();
  }

  removeItemFromCart(id){
    const index = this.cartItems.findIndex((el) => el.id === id);

    this.cartItems.splice(index, 1);

    const cartHTMLNodes = [...document.querySelectorAll('.cart-item')];
    cartHTMLNodes[index].remove();

    this.updateCart();
  }

  cartButtonAnimationSetup() {
    gsap.set([this.cartButtonNumber, this.cartButtonBg], { scale: 0 });
  }

  cartButtonAnimationEnter() {
    const tl = gsap.timeline();
    tl.addLabel('start');

    tl.to(this.cartButtonLabel, { x: -35, duration: 0.4, ease: 'power2.out' }, 'start');
    tl.to([this.cartButtonNumber, this.cartButtonBg], {
      scale: 1, stagger: 0.1, duration: 0.8, ease: 'elastic.out(1.3, 0.9)',
    }, 'start');
    return tl;
  }

  cartAnimationSetup() { 
    gsap.set(this.cart, { xPercent: 100 });
    
    gsap.set([this.animatingElements.bg, this.animatingElements.innerBg], { xPercent: 110 });
    gsap.set(this.animatingElements.close, { x: 30, autoAlpha: 0 });
    gsap.set(this.animatingElements.total, { scale: 0.9, autoAlpha: 0 });
  };
  
  cartAnimationEnter() {
    this.animatingElements.items = [...this.cart.querySelectorAll('.cart-item')];
    if (this.animatingElements.items.length > 0) gsap.set(this.animatingElements.items, { x: 30, autoAlpha: 0 });

    const tl = gsap.timeline({
      onStart: () => gsap.set(this.cart, { xPercent: 0 })
    });
    tl.addLabel('start');

    tl.to([this.animatingElements.bg, this.animatingElements.innerBg], {
      xPercent: 0, stagger: 0.1, duration: 2.2, ease: 'expo.inOut',
    }, 'start');

    tl.to(this.animatingElements.close, {
      x: 0, autoAlpha: 1, stagger: 0.1, duration: 1, ease: 'power2.out',
    }, 'start+=1.3');
  
    if (this.animatingElements.items.length > 0) {
      tl.to(this.animatingElements.items, {
        x: 0, autoAlpha: 1, stagger: 0.1, duration: 1, ease: 'power2.out',
      }, 'start+=1.4');
    }
    if (this.animatingElements.noProds) {
      tl.to(this.animatingElements.noProds, {
        x: 0, autoAlpha: 1, stagger: 0.1, duration: 1, ease: 'power2.out',
      }, 'start+=1.4');
    }
  
    tl.to(this.animatingElements.total, {
      scale: 1, autoAlpha: 1, stagger: 0.1, duration: 1, ease: 'power2.out',
    }, 'start+=1.6');

    return tl;
  }
  
  cartAnimationLeave() {
    const tl = gsap.timeline({
      onComplete: () => gsap.set(this.cart, { xPercent: 100 })
    });
    tl.addLabel('start');

    tl.to([this.animatingElements.bg, this.animatingElements.innerBg], {
      xPercent: 110, stagger: 0.1, duration: 1.5, ease: 'expo.inOut',
    }, 'start');

    if (this.animatingElements.items.length > 0) {
      tl.to(this.animatingElements.items, {
        x: 30, autoAlpha: 0, stagger: 0.1, duration: 0.8, ease: 'power2.out',
      }, 'start');
    }
    if (this.animatingElements.noProds) {
      tl.to(this.animatingElements.noProds, {
        x: 30, autoAlpha: 0, stagger: 0.1, duration: 0.8, ease: 'power2.out',
      }, 'start');
    }

    tl.to(this.animatingElements.close, {
      x: 30, autoAlpha: 0, stagger: 0.1, duration: 0.8, ease: 'power2.out',
    }, 'start');

    tl.to(this.animatingElements.total, {
      scale: 0.9, autoAlpha: 0, stagger: 0.1, duration: 0.8, ease: 'power2.out',
    }, 'start');
    return tl;
  }
}

export default new Cart();