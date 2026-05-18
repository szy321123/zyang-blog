(() => {
  "use strict";

  const CARD_ID = "zy-welcome-card";
  const BLOGGER = {
    city: "安徽·芜湖",
    lat: 31.3525,
    lon: 118.4331
  };

  function getGreetingByTime() {
    const hour = new Date().getHours();
    if (hour < 6) return "夜深了，记得早点休息。";
    if (hour < 11) return "早上好，今天也要元气满满。";
    if (hour < 14) return "中午好，祝你有个轻松午后。";
    if (hour < 18) return "下午好，欢迎来这里逛逛。";
    return "晚上好，愿你今晚好梦。";
  }

  function createCard() {
    const card = document.createElement("div");
    card.className = "card-widget anzhiyu-right-widget";
    card.id = CARD_ID;
    card.innerHTML = `
      <div class="item-headline">
        <i class="fas fa-user"></i>
        <span>欢迎来访者</span>
      </div>
      <div class="item-content">
        <div class="zy-welcome-box">
          <p>👋 <span class="zy-text-strong">欢迎来到 ZYang 小站</span>，愿你今天也有好心情。</p>
          <p>这里记录 <span class="zy-text-blue">建站折腾</span>、<span class="zy-text-green">实用工具</span> 和 <span class="zy-text-purple">生活碎片</span>。</p>
          <p>有疑问可以留言，也可以通过 <span class="zy-text-pink">邮箱</span> 找我交流想法。</p>
          <p class="zy-welcome-loc">📍 正在识别你的来访地区...</p>
          <p class="zy-welcome-distance">🧭 正在计算你与博主的距离...</p>
          <p class="zy-welcome-ip">🌐 你的网络 IP：<span class="zy-ip-blur">加载中</span></p>
          <p class="zy-welcome-time">${getGreetingByTime()}</p>
        </div>
      </div>
    `;
    return card;
  }

  function toRad(value) {
    return (value * Math.PI) / 180;
  }

  function calcDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  function normalizeText(value, fallback) {
    if (typeof value !== "string") return fallback;
    const text = value.trim();
    return text || fallback;
  }

  function setMaskedValue(el, prefix, value) {
    if (!el) return;
    const span = document.createElement("span");
    span.className = "zy-ip-blur";
    span.textContent = value;
    el.textContent = prefix;
    el.appendChild(span);
  }

  async function fetchIpInfo() {
    const endpoints = [
      "https://ipapi.co/json/",
      "https://api.ip.sb/geoip"
    ];

    for (const url of endpoints) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4500);
      try {
        const res = await fetch(url, { method: "GET", signal: controller.signal });
        if (!res.ok) continue;
        const data = await res.json();
        if (data) return data;
      } catch (_) {
        // try next endpoint
      } finally {
        clearTimeout(timer);
      }
    }
    return null;
  }

  function updateIpInfo(data) {
    const card = document.getElementById(CARD_ID);
    if (!card) return;

    const locEl = card.querySelector(".zy-welcome-loc");
    const disEl = card.querySelector(".zy-welcome-distance");
    const ipEl = card.querySelector(".zy-welcome-ip");
    if (!locEl || !ipEl || !disEl) return;

    if (!data) {
      locEl.textContent = "📍 地区信息获取失败，请稍后再试。";
      disEl.textContent = `🧭 与博主（${BLOGGER.city}）的距离暂不可用。`;
      setMaskedValue(ipEl, "🌐 你的网络 IP：", "未知");
      return;
    }

    const city = data.city || "";
    const region = data.region || data.prov || "";
    const country = data.country_name || data.country || "";
    const org = data.org || data.isp || "";
    const ip = normalizeText(data.ip, "未知");
    const lat = Number(data.latitude ?? data.lat);
    const lon = Number(data.longitude ?? data.lon);

    const locationText = [country, region, city].filter(Boolean).join(" · ");
    locEl.textContent = locationText
      ? `📍 你来自 ${locationText}${org ? `（${org}）` : ""}`
      : "📍 已连接，地区信息暂不可用。";
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      const km = calcDistanceKm(lat, lon, BLOGGER.lat, BLOGGER.lon);
      disEl.innerHTML = `🧭 你目前距博主（${BLOGGER.city}）约 <span class="zy-text-blue">${km}</span> 公里。`;
    } else {
      disEl.textContent = `🧭 与博主（${BLOGGER.city}）的距离暂不可用。`;
    }
    setMaskedValue(ipEl, "🌐 你的网络 IP：", ip);
  }

  async function mountWelcomeCard() {
    const wechatCard = document.querySelector("#card-wechat");
    if (!wechatCard) return;

    const oldCard = document.getElementById(CARD_ID);
    if (oldCard) oldCard.remove();

    const card = createCard();
    wechatCard.insertAdjacentElement("afterend", card);
    const data = await fetchIpInfo();
    updateIpInfo(data);
  }

  document.addEventListener("DOMContentLoaded", mountWelcomeCard);
  document.addEventListener("pjax:complete", mountWelcomeCard);
})();
