(() => {
  "use strict";

  function mountAuthorSocial() {
    const card = document.querySelector(".card-widget.card-info");
    if (!card) return;

    const old = card.querySelector(".author-social");
    if (old) old.remove();

    const social = document.createElement("div");
    social.className = "author-social";
    social.innerHTML = `
      <a href="https://github.com/szy321123" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
        <i class="fab fa-github"></i>
      </a>
      <a href="mailto:szy007700@163.com" aria-label="Email">
        <i class="fas fa-envelope"></i>
      </a>
      <a href="https://t.me/boluo12334" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
        <i class="fab fa-telegram-plane"></i>
      </a>
    `;

    card.appendChild(social);
  }

  document.addEventListener("DOMContentLoaded", mountAuthorSocial);
  document.addEventListener("pjax:complete", mountAuthorSocial);
})();
