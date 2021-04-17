; (() => {

  window.disableScroll = (disableScr = false) => {

    const body = document.body;

    if (disableScr) {
      let pagePosition = window.scrollY;

      body.classList.add(`disable-scroll`);
      body.dataset.position = pagePosition;
      body.style.top = -pagePosition + `px`;

    } else {
      body.style.top = `auto`;
      body.classList.remove(`disable-scroll`);
      window.scrollTo({
        top: parseInt(body.dataset.position, 10),
        left: 0
      });
      body.removeAttribute(`data-position`);
    };
  };

  // Изменяем прозрачность подложки фиксированной шапки
  // трансформация высоты шапки при прокрутки вниз

  window.addEventListener(`scroll`, function () {
    const coords = -document.querySelector(`.hero`).getBoundingClientRect().top;
    const headerEl = document.querySelector(`.header`).classList;
    const viewportHeight = Math.trunc(window.visualViewport.height);
    const SSTART_BLINDING = 20;

    if (coords > 20 && !headerEl.contains(`scroll`)) {
      headerEl.add(`scroll`);
    };
    if (coords < 20 && headerEl.contains(`scroll`)) {
      headerEl.remove(`scroll`);
    };

    if (coords > viewportHeight / 3 * 2 && !headerEl.contains(`_min`)) {
      headerEl.add(`_min`);
    };
    if (coords < viewportHeight / 3 * 2 && headerEl.contains(`_min`)) {
      headerEl.remove(`_min`);
    };

  });

  // обработка бургера
  const burgerEl = document.querySelector(`.js-header__burger`);
  const changesBurgerAttributes = (el) => {
    const visibilityBurger = window.getComputedStyle(burgerEl).display;
    if (visibilityBurger === `none`) return;

    const menuHeadEl = document.querySelectorAll(`.js-burger-open, .js-header__burger`);
    if (menuHeadEl.length > 0) {
      menuHeadEl.forEach(el => {
        el.classList.toggle(`activ`);
      });
    };
  };

  if (burgerEl) {
    burgerEl.addEventListener(`click`, (e) => {
      changesBurgerAttributes(e);
      if (burgerEl.classList.contains(`activ`)) window.disableScroll('true');
      if (!burgerEl.classList.contains(`activ`)) window.disableScroll();
    });
  };

  // переход от пункта меню к разделу
  const menuLinksEl = document.querySelectorAll(`.header__link[data-goto]`);
  if (menuLinksEl.length > 0) {
    const gotoBlock = (e) => {
      const linkEl = e.target;
      const classEl = linkEl.dataset.goto;
      const outBlock = document.querySelector(classEl);
      let headerHeight = +document.querySelector(`.header`).offsetHeight;
      const viewportWidth = Math.trunc(window.visualViewport.width);

      viewportWidth > 800 ? headerHeight = headerHeight / 2 : headerHeight;

      if (classEl && outBlock) {
        document.body.style.top = `auto`;
        document.body.classList.remove(`disable-scroll`);
        document.body.removeAttribute(`data-position`);
        const outBlockValue = outBlock.getBoundingClientRect().top + pageYOffset - headerHeight;

        changesBurgerAttributes();
        window.scrollTo({
          top: outBlockValue,
          behavior: "smooth"
        });

      };
    };

    menuLinksEl.forEach(el => {
      el.addEventListener(`click`, (ev) => {
        ev.preventDefault();
        gotoBlock(ev);
      });
    });

  };

  // Вызов модалки при первой загрузке страницы
  if (!sessionStorage.getItem('firstVisit')) {

    document.querySelector(`.js-modal__start`).classList.add('modal--visible');
    document.querySelector('.modal-overlay ').classList.add('modal-overlay--visible');

    // sessionStorage.setItem('firstVisit', '1');
  }

  //Модальные окна1 
  const btns = document.querySelectorAll(`.modal__btn`);
  const modalOverlay = document.querySelector(`.modal-overlay `);
  const modals = document.querySelectorAll(`.modal`);

  removeVisibleClass = (modalsAll) => {
    modalsAll.forEach((el) => { el.classList.remove(`modal--visible`) });
  };

  btns.forEach((el) => {
    el.addEventListener(`click`, (e) => {
      e.preventDefault();

      let path = e.currentTarget.getAttribute(`data-path`);

      removeVisibleClass(modals);
      modalOverlay.classList.remove(`modal-overlay--visible`);

      document.querySelector(`[data-target="${path}"]`).classList.add(`modal--visible`);
      modalOverlay.classList.add(`modal-overlay--visible`);
      window.disableScroll();
    });
  });

  modalOverlay.addEventListener(`click`, (e) => {
    const modalStart = document.querySelector(`.js-modal__start`);
    console.log();

    if (e.target == modalOverlay && !modalStart) {
      modalOverlay.classList.remove(`modal-overlay--visible`);
      removeVisibleClass(modals);
      window.disableScroll(false);

    };
  });

})();