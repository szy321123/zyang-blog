---
title: 资源导航
date: 2026-05-08 14:41:29
type: sites
aside: false
description: 收藏一些平时常用、觉得不错的网站与工具 ✨
---

<div class="zy-share-page">
  <div class="zy-share-head">
    <h1>资源分享</h1>
    <p>按分类整理常用网站，持续更新。</p>
  </div>

  <div class="zy-share-filters" id="zy-share-filters">
    <button class="is-active" data-filter="all">全部</button>
    <button data-filter="图片">图片</button>
    <button data-filter="AI">AI</button>
    <button data-filter="CSS">CSS</button>
    <button data-filter="组件">组件</button>
    <button data-filter="网站集">网站集</button>
    <button data-filter="学习">学习</button>
  </div>

  <div class="zy-share-grid" id="zy-share-grid">
    <article class="zy-share-card" data-tags="图片">
      <h3>iLoveIMG</h3><p>免费图片处理网站，压缩体验很好。</p>
      <div class="zy-share-meta"><span>图片</span><a href="https://www.iloveimg.com/zh-cn" target="_blank" rel="noopener">访问</a></div>
    </article>
    <article class="zy-share-card" data-tags="图片">
      <h3>TinyPNG</h3><p>经典图片压缩工具，适合日常快速处理。</p>
      <div class="zy-share-meta"><span>图片</span><a href="https://tinypng.com/" target="_blank" rel="noopener">访问</a></div>
    </article>
    <article class="zy-share-card" data-tags="图片,AI">
      <h3>removebg</h3><p>AI 抠图工具，界面简洁，处理快。</p>
      <div class="zy-share-meta"><span>图片 / AI</span><a href="https://www.remove.bg/zh" target="_blank" rel="noopener">访问</a></div>
    </article>
    <article class="zy-share-card" data-tags="CSS">
      <h3>Neumorphism</h3><p>新拟态风格在线生成器，灵感不错。</p>
      <div class="zy-share-meta"><span>CSS</span><a href="https://neumorphism.io/" target="_blank" rel="noopener">访问</a></div>
    </article>
    <article class="zy-share-card" data-tags="CSS,组件">
      <h3>Uiverse</h3><p>高质量交互组件集合，更新活跃。</p>
      <div class="zy-share-meta"><span>CSS / 组件</span><a href="https://uiverse.io/" target="_blank" rel="noopener">访问</a></div>
    </article>
    <article class="zy-share-card" data-tags="组件">
      <h3>Magic UI</h3><p>现代 UI 组件库，视觉表现很强。</p>
      <div class="zy-share-meta"><span>组件</span><a href="https://magicui.design/" target="_blank" rel="noopener">访问</a></div>
    </article>
    <article class="zy-share-card" data-tags="网站集">
      <h3>Awwwards</h3><p>优秀网站案例聚合，找灵感必备。</p>
      <div class="zy-share-meta"><span>网站集</span><a href="https://www.awwwards.com/" target="_blank" rel="noopener">访问</a></div>
    </article>
    <article class="zy-share-card" data-tags="学习">
      <h3>Qwerty Learner</h3><p>练打字 + 背单词，效率很高。</p>
      <div class="zy-share-meta"><span>学习</span><a href="https://qwerty.kaiyi.cool/" target="_blank" rel="noopener">访问</a></div>
    </article>
    <article class="zy-share-card" data-tags="图片">
      <h3>图片转 WebP（本站）</h3><p>本地无上传的 WebP 转换工具。</p>
      <div class="zy-share-meta"><span>图片</span><a href="/image-converter/">访问</a></div>
    </article>
  </div>
</div>

<script>
(() => {
  const root = document.querySelector('.zy-share-page');
  if (!root) return;
  const filters = [...root.querySelectorAll('#zy-share-filters button')];
  const cards = [...root.querySelectorAll('.zy-share-card')];
  const setFilter = (tag) => {
    filters.forEach((b) => b.classList.toggle('is-active', b.dataset.filter === tag));
    cards.forEach((c) => {
      const tags = c.dataset.tags || '';
      c.style.display = tag === 'all' || tags.includes(tag) ? '' : 'none';
    });
  };
  filters.forEach((b) => b.addEventListener('click', () => setFilter(b.dataset.filter)));
})();
</script>
