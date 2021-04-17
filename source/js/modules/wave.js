
; (() => {


  window.addAnimationWave = () => {
    const btnWaveAllEl = document.querySelectorAll(`[data-btn-wave]`);
    if (btnWaveAllEl.length === 0) return;

    btnWaveAllEl.forEach(el => {

      // if (el.dataset.btnWave) {
      const contentEl = el.innerHTML;
      el.innerText = ``;
      el.classList.add(`btn-wave`);
      el.insertAdjacentHTML('afterbegin', `
      <span class="btn-wave__text">${contentEl}</span>
      `);


    });

  };


})();