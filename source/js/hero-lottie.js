const HERO_LOTTIE = {
  jsonPath: "/json/lovely-cat.json",
  speed: 1,
  autoplay: true
};

(function () {
  "use strict";

  if (window.__zyHeroLottieBound) return;
  window.__zyHeroLottieBound = true;

  let heroAnimation = null;

  function removeWrap() {
    const wrap = document.querySelector(".hero-lottie-wrap");
    if (wrap) wrap.remove();
  }

  function destroyHeroLottie(keepWrap) {
    if (heroAnimation) {
      heroAnimation.destroy();
      heroAnimation = null;
    }
    if (!keepWrap) removeWrap();
  }

  function createHeroLottie() {
    const header = document.querySelector("#page-header.full_page");
    if (!header) {
      destroyHeroLottie(false);
      return;
    }

    if (!window.lottie) return;

    destroyHeroLottie(false);

    const wrap = document.createElement("div");
    wrap.className = "hero-lottie-wrap";

    const container = document.createElement("div");
    container.id = "hero-lottie";

    wrap.appendChild(container);
    header.appendChild(wrap);

    heroAnimation = window.lottie.loadAnimation({
      container,
      renderer: "svg",
      loop: true,
      autoplay: HERO_LOTTIE.autoplay,
      path: HERO_LOTTIE.jsonPath,
      rendererSettings: {
        progressiveLoad: true,
        preserveAspectRatio: "xMidYMid meet"
      }
    });

    heroAnimation.setSpeed(HERO_LOTTIE.speed);
  }

  function initHeroLottie() {
    createHeroLottie();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeroLottie, { once: true });
  } else {
    initHeroLottie();
  }

  document.addEventListener("pjax:complete", initHeroLottie);
})();
