(function () {
  "use strict";

  if (window.__zyPreloaderBound) return;
  window.__zyPreloaderBound = true;

  var preloadAnimation = null;
  var stopTimer = null;
  var fallbackCloseTimer = null;
  var firstLoadCloseTimer = null;
  var pjaxCloseTimer = null;
  var PRELOADER_JSON = "/json/running-cat.json";

  function ensureLottie() {
    if (preloadAnimation || !window.lottie) return;
    var container = document.getElementById("preloader-lottie");
    if (!container) return;

    preloadAnimation = window.lottie.loadAnimation({
      container: container,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: PRELOADER_JSON
    });
  }

  function getOrCreatePreloader() {
    var loadingBox = document.getElementById("loading-box");
    if (loadingBox) {
      ensureLottie();
      return loadingBox;
    }

    loadingBox = document.createElement("div");
    loadingBox.id = "loading-box";
    loadingBox.innerHTML =
      '<div class="spinner-box">' +
      '<div class="preloader-scene"><div id="preloader-lottie" class="preloader-lottie"></div></div>' +
      '<div class="loading-text">Loading...</div>' +
      "</div>";

    document.body.appendChild(loadingBox);
    ensureLottie();
    return loadingBox;
  }

  function showPreloader() {
    var loadingBox = getOrCreatePreloader();
    if (!loadingBox) return;

    loadingBox.classList.remove("loaded");
    document.body.classList.add("preload-blur");
    ensureLottie();
    if (preloadAnimation) preloadAnimation.play();
  }

  function closePreloader() {
    var loadingBox = document.getElementById("loading-box");
    document.body.classList.remove("preload-blur");
    if (!loadingBox) return;

    loadingBox.classList.add("loaded");

    if (stopTimer) clearTimeout(stopTimer);
    stopTimer = setTimeout(function () {
      if (preloadAnimation) preloadAnimation.stop();
    }, 1000);
  }

  function bootPreloader() {
    showPreloader();
    window.addEventListener("load", function () {
      if (firstLoadCloseTimer) clearTimeout(firstLoadCloseTimer);
      firstLoadCloseTimer = setTimeout(closePreloader, 1800);
    }, { once: true });

    if (fallbackCloseTimer) clearTimeout(fallbackCloseTimer);
    fallbackCloseTimer = setTimeout(closePreloader, 6000);
  }

  if (document.body) {
    bootPreloader();
  } else {
    document.addEventListener("DOMContentLoaded", bootPreloader, { once: true });
  }

  document.addEventListener("pjax:send", function () {
    showPreloader();
  });

  document.addEventListener("pjax:complete", function () {
    if (pjaxCloseTimer) clearTimeout(pjaxCloseTimer);
    pjaxCloseTimer = setTimeout(closePreloader, 900);
  });
})();
