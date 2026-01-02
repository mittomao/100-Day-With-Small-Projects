import { preloadImages } from './utils.js'

gsap.registerPlugin(Draggable, Flip, SplitText)

class Grid {
  constructor() {
    this.dom = document.querySelector(".container")
    this.grid = document.querySelector(".grid")
    this.products = [...document.querySelectorAll(".product div")]

    this.details = document.querySelector(".details")
    this.detailsThumb = this.details.querySelector(".details__thumb")

    this.cross = document.querySelector(".cross")

    this.isDragging = false
  }

  init() {
    this.intro()
  }

  intro() {
    this.centerGrid()

    const timeline = gsap.timeline()

    timeline.set(this.dom, { scale: .5 })
    timeline.set(this.products, {
      scale: 0.5,
      opacity: 0,
    })

    timeline.to(this.products, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: "power3.out",
      stagger: {
        amount: 1.2,
        from: "random"
      }
    })
    timeline.to(this.dom, {
      scale: 1,
      duration: 1.2,
      ease: "power3.inOut",
      onComplete: () => {
        this.setupDraggable()
        this.addEvents()
        this.observeProducts()
        this.handleDetails()
      }
    })
  }

  centerGrid() {
    const gridWidth = this.grid.offsetWidth
    const gridHeight = this.grid.offsetHeight
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    const centerX = (windowWidth - gridWidth) / 2
    const centerY = (windowHeight - gridHeight) / 2

    gsap.set(this.grid, {
      x: centerX,
      y: centerY
    })
  }

  setupDraggable() {
    this.dom.classList.add("--is-loaded")

    this.draggable = Draggable.create(this.grid, {
      type: "x,y",
      bounds: {
        minX: -(this.grid.offsetWidth - window.innerWidth) - 200,
        maxX: 200,
        minY: -(this.grid.offsetHeight - window.innerHeight) - 100,
        maxY: 100
      },
      inertia: true,
      allowEventDefault: true,
      edgeResistance: 0.9,

      onDragStart: () => {
        this.isDragging = true
        this.grid.classList.add("--is-dragging")
      },

      onDragEnd: () => {
        this.isDragging = false
        this.grid.classList.remove("--is-dragging")
      }
    })[0]
  }

  addEvents() {
    window.addEventListener("wheel", (e) => {
      e.preventDefault()

      const deltaX = -e.deltaX * 7
      const deltaY = -e.deltaY * 7

      const currentX = gsap.getProperty(this.grid, "x")
      const currentY = gsap.getProperty(this.grid, "y")

      const newX = currentX + deltaX
      const newY = currentY + deltaY

      const bounds = this.draggable.vars.bounds
      const clampedX = Math.max(bounds.minX, Math.min(bounds.maxX, newX))
      const clampedY = Math.max(bounds.minY, Math.min(bounds.maxY, newY))

      gsap.to(this.grid, {
        x: clampedX,
        y: clampedY,
        duration: 0.3,
        ease: "power3.out"
      })
    }, { passive: false })

    window.addEventListener("resize", () => {
      this.updateBounds()
    })

    window.addEventListener("mousemove", (e) => {
      if (this.SHOW_DETAILS) {
        this.handleCursor(e)
      }
    })
  }

  updateBounds() {
    if (this.draggable) {
      this.draggable.vars.bounds = {
        minX: -(this.grid.offsetWidth - window.innerWidth) - 50,
        maxX: 50,
        minY: -(this.grid.offsetHeight - window.innerHeight) - 50,
        maxY: 50
      }
    }
  }

  observeProducts() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {

        if (entry.target === this.currentProduct) return

        if (entry.isIntersecting) {
          gsap.to(entry.target, {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out"
          })
        } else {
          gsap.to(entry.target, {
            opacity: 0,
            scale: 0.5,
            duration: 0.5,
            ease: "power2.in"
          })
        }
      })
    }, {
      root: null,
      threshold: 0.1
    })

    this.products.forEach(product => {
      observer.observe(product)
    })
  }

  handleDetails() {
    this.SHOW_DETAILS = false

    this.titles = this.details.querySelectorAll(".details__title p")
    this.texts = this.details.querySelectorAll(".details__body [data-text]")

    const splitTitles = new SplitText(this.titles, {
      type: "lines, chars",
      mask: "lines",
      charsClass: "char"
    })

    const splitTexts = new SplitText(this.texts, {
      type: "lines",
      mask: "lines",
      linesClass: "line"
    })

    this.products.forEach(product => {
      product.addEventListener("click", (e) => {
        e.stopPropagation()
        this.showDetails(product)
      })
    })

    this.dom.addEventListener("click", (e) => {
      if (this.SHOW_DETAILS) this.hideDetails()
    })
  }

  showDetails(product) {
    if (this.SHOW_DETAILS) return
    this.SHOW_DETAILS = true
    this.details.classList.add("--is-showing")
    this.dom.classList.add("--is-details-showing")

    gsap.to(this.dom, {
      x: "-50vw",
      duration: 1.2,
      ease: "power3.inOut",
    })

    gsap.to(this.details, {
      x: 0,
      duration: 1.2,
      ease: "power3.inOut",
    })

    this.flipProduct(product)

    const title = this.details.querySelector(`[data-title="${product.dataset.id}"]`)
    const text = this.details.querySelector(`[data-desc="${product.dataset.id}"]`)

    if (title) {
      gsap.to(title.querySelectorAll(".char"), {
        y: 0,
        duration: 1.1,
        delay: .4,
        ease: "power3.inOut",
        stagger: 0.025
      })
    }

    if (text) {
      gsap.to(text.querySelectorAll(".line"), {
        y: 0,
        duration: 1.1,
        delay: .4,
        ease: "power3.inOut",
        stagger: .05,
      })
    }
  }

  hideDetails() {
    this.SHOW_DETAILS = false

    this.dom.classList.remove("--is-details-showing")

    gsap.to(this.dom, {
      x: 0,
      duration: 1.2,
      delay: .3,
      ease: "power3.inOut",
      onComplete: () => {
        this.details.classList.remove("--is-showing")
      }
    })

    gsap.to(this.details, {
      x: "50vw",
      duration: 1.2,
      delay: .3,
      ease: "power3.inOut"
    })

    this.unFlipProduct()

    this.titles.forEach(title => {
      gsap.to(title.querySelectorAll(".char"), {
        y: "100%",
        duration: 0.6,
        ease: "power3.inOut",
        stagger: {
          amount: 0.025,
          from: "end"
        }
      })
    })

    this.texts.forEach(text => {
      gsap.to(text.querySelectorAll(".line"), {
        y: "100%",
        duration: 0.6,
        ease: "power3.inOut",
        stagger: 0.05,
      })
    })
  }

  flipProduct(product) {
    this.currentProduct = product
    this.originalParent = product.parentNode

    if (this.observer) {
      this.observer.unobserve(product)
    }

    const state = Flip.getState(product)

    this.detailsThumb.appendChild(product)

    Flip.from(state, {
      absolute: true,
      duration: 1.2,
      ease: "power3.inOut",
    })

    gsap.to(this.cross, {
      scale: 1,
      duration: 0.4,
      delay: .5,
      ease: "power2.out"
    })
  }

  unFlipProduct() {
    if (!this.currentProduct || !this.originalParent) return

    gsap.to(this.cross, {
      scale: 0,
      duration: 0.4,
      ease: "power2.out"
    })

    const state = Flip.getState(this.currentProduct)

    const finalRect = this.originalParent.getBoundingClientRect()
    const currentRect = this.currentProduct.getBoundingClientRect()

    gsap.set(this.currentProduct, {
      position: "absolute",
      top: currentRect.top - this.detailsThumb.getBoundingClientRect().top + "px",
      left: currentRect.left - this.detailsThumb.getBoundingClientRect().left + "px",
      width: currentRect.width + "px",
      height: currentRect.height + "px",
      zIndex: 10000,
    })

    gsap.to(this.currentProduct, {
      top: finalRect.top - this.detailsThumb.getBoundingClientRect().top + "px",
      left: finalRect.left - this.detailsThumb.getBoundingClientRect().left + "px",
      width: finalRect.width + "px",
      height: finalRect.height + "px",
      duration: 1.2,
      delay: .3,
      ease: "power3.inOut",
      onComplete: () => {
        this.originalParent.appendChild(this.currentProduct)

        gsap.set(this.currentProduct, {
          position: "",
          top: "",
          left: "",
          width: "",
          height: "",
          zIndex: "",
        })

        this.currentProduct = null
        this.originalParent = null
      },
    })
  }

  handleCursor(e) {
    const x = e.clientX
    const y = e.clientY

    gsap.to(this.cross, {
      x: x - this.cross.offsetWidth / 2,
      y: y - this.cross.offsetHeight / 2,
      duration: 0.4,
      ease: "power2.out"
    })
  }
}

const grid = new Grid()

preloadImages('.grid img').then(() => {
  grid.init()
  document.body.classList.remove('loading')
})
