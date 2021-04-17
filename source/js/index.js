; (() => {

  document.addEventListener(`DOMContentLoaded`, () => {

    //= modules/utilities.js
    //= modules/wave.js.js
    //= modules/swiper-bundle.min.js

    const swiper = new Swiper(`.swiper-container`, {
      loop: true,
      effect: `fade`,
      fadeEffect: {
        crossFade: false
      },
      pagination: {
        el: `.swiper-pagination`,
      },
      scrollbar: {
        el: `.swiper-scrollbar`,
      },
    });

    const swiperHeroBody = new Swiper(`.hero__container`, {
      loop: true,
      autoHeight: true,
      // spaceBetween: '10%',
      autoplay: {
        delay: 6000,
        disableOnInteraction: false,
      },
      speed: 800,
      controller: {
        control: swiper
      },
      effect: `fade`,
      fadeEffect: {
        crossFade: false
      },
      navigation: {
        nextEl: `.swiper-button-next`,
        prevEl: `.swiper-button-prev`,
      },

    });


    const beerMapSwiper = new Swiper(`.beer-map__swiper`, {
      loop: true,
      autoplay: {
        delay: 1500,
        disableOnInteraction: false,
      },
      speed: 1500,
      slidesPerView: 4,
      spaceBetween: 20,
    });


    const paralaxEl = document.querySelector(`.parallax`);
    const paralaxBgEl = document.querySelector(`.parallax__back`);
    const elemInViewport = (elem, full) => {
      const box = elem.getBoundingClientRect();
      const width = document.documentElement.clientWidth;
      const height = document.documentElement.clientHeight;
      const top = box.top;
      const left = box.left;
      const bottom = box.bottom;
      const right = box.right;
      const maxWidth = 0;
      const maxHeight = 0;
      if (full) { maxWidth = right - left; maxHeight = bottom - top };
      return Math.min(height, bottom) - Math.max(0, top) >= maxHeight && Math.min(width, right) - Math.max(0, left) >= maxWidth
    }

    const addTab = (parentInEl, parentOutEl = false) => {

      const inAllEl = document.querySelector(parentInEl);
      const itemsEl = inAllEl.querySelectorAll(`[data-namber-item]`);

      let outAllEl = null;
      !parentOutEl ? outAllEl = inAllEl : outAllEl = document.querySelector(parentOutEl);

      itemsEl.forEach(element => {

        element.addEventListener(`click`, (e) => {
          e.preventDefault();

          const indexEl = e.target.getAttribute(`data-namber-item`);
          const tabAllEl = outAllEl.querySelectorAll(`[data-element-tab]`);

          tabAllEl.forEach((tab, i) => {
            tab.classList.remove(`activ`);
            if (+i === +indexEl) tab.classList.add(`activ`);
          });

        });

      });

    };

    addTab(`.beer-map`);
    window.addAnimationWave()


  });

})();
