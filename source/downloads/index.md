---
title: 下载中心
date: 2026-05-08 14:41:29
---

<div class="zy-download-center">
  <div class="zy-download-hero">
    <h1>下载中心</h1>
    <p>精简、安静、可持续更新的资源整理页。文件来自 OpenList 自动同步。</p>
  </div>

  <div class="zy-download-groups" id="zy-download-groups">
    <section class="zy-download-group" data-platform="windows">
      <h2>Windows</h2>
      <div class="zy-download-grid"></div>
    </section>
    <section class="zy-download-group" data-platform="ios">
      <h2>iOS</h2>
      <div class="zy-download-grid"></div>
    </section>
    <section class="zy-download-group" data-platform="android">
      <h2>Android</h2>
      <div class="zy-download-grid"></div>
    </section>
  </div>

  <div id="zy-download-raw" style="display:none;">
<!-- OPENLIST:START -->
- [EasyBackup.exe](https://zyang.app/d/EasyBackup.exe) · 138 MB · 更新于 2026/5/4 10:50:07
- [PAInstall.zip](https://zyang.app/d/PAInstall.zip) · 40 MB · 更新于 2026/5/4 10:50:04
- [DGEngSetup6111742.exe](https://zyang.app/d/DGEngSetup6111742.exe) · 62 MB · 更新于 2026/4/30 16:30:25
- [Filza4.0破解.ipa](https://zyang.app/d/Filza4.0%E7%A0%B4%E8%A7%A3.ipa) · 13 MB · 更新于 2026/4/29 16:08:16
- [QPEhelper-v3.8最终版本.ipa](https://zyang.app/d/QPEhelper-v3.8%E6%9C%80%E7%BB%88%E7%89%88%E6%9C%AC.ipa) · 2.0 MB · 更新于 2026/4/29 16:08:16
- [TrollLEDs巨魔手电筒.ipa](https://zyang.app/d/TrollLEDs%E5%B7%A8%E9%AD%94%E6%89%8B%E7%94%B5%E7%AD%92.ipa) · 208 KB · 更新于 2026/4/29 16:08:16
- [巨魔Fuck法克工具箱_1.8.4.ipa](https://zyang.app/d/%E5%B7%A8%E9%AD%94Fuck%E6%B3%95%E5%85%8B%E5%B7%A5%E5%85%B7%E7%AE%B1_1.8.4.ipa) · 54 MB · 更新于 2026/4/29 16:08:16
- [虚拟定位_1.3.7.ipa](https://zyang.app/d/%E8%99%9A%E6%8B%9F%E5%AE%9A%E4%BD%8D_1.3.7.ipa) · 2.1 MB · 更新于 2026/4/29 16:08:16
- [BatteryInfo[电池助手].ipa](https://zyang.app/d/BatteryInfo%5B%E7%94%B5%E6%B1%A0%E5%8A%A9%E6%89%8B%5D.ipa) · 38 KB · 更新于 2026/4/29 16:07:31
- [ClashMetaForAndroid-v2.11.27.apk](https://zyang.app/d/ClashMetaForAndroid-v2.11.27.apk) · 75 MB · 更新于 2026/4/26 11:47:43
- [TrollInstallerX.ipa](https://zyang.app/d/TrollInstallerX.ipa) · 6.6 MB · 更新于 2026/4/26 11:45:19
- [huorong_v6_x64.exe](https://zyang.app/d/huorong_v6_x64.exe) · 49 MB · 更新于 2026/4/25 21:01:04
- [huorong_v6_x86.exe](https://zyang.app/d/huorong_v6_x86.exe) · 49 MB · 更新于 2026/4/25 21:01:04
- [Everything_v1.4.1.1032_x86_setup.exe](https://zyang.app/d/Everything_v1.4.1.1032_x86_setup.exe) · 1.8 MB · 更新于 2026/1/23 11:14:59
- [Everything_v1.4.1.1032_x64_setup.exe](https://zyang.app/d/Everything_v1.4.1.1032_x64_setup.exe) · 1.9 MB · 更新于 2026/1/23 11:14:16
<!-- OPENLIST:END -->
  </div>
</div>

<script>
(() => {
  const root = document.querySelector('.zy-download-center');
  if (!root) return;
  const raw = root.querySelector('#zy-download-raw');
  if (!raw) return;
  const parseItems = () => {
    const lis = [...raw.querySelectorAll('li')];
    if (lis.length) {
      return lis.map((li) => {
        const a = li.querySelector('a');
        if (!a) return null;
        const text = li.textContent || '';
        return { name: a.textContent.trim(), href: a.href, text };
      }).filter(Boolean);
    }
    const text = raw.textContent || '';
    const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.startsWith('- ['));
    return lines.map((line) => {
      const m = line.match(/^- \[(.+?)\]\((.+?)\)\s*·\s*(.+?)\s*·\s*(.+)$/);
      if (!m) return null;
      return { name: m[1].trim(), href: m[2].trim(), text: line };
    }).filter(Boolean);
  };
  const items = parseItems();
  const getPlatform = (name) => {
    const n = name.toLowerCase();
    if (n.endsWith('.apk')) return 'android';
    if (n.endsWith('.ipa')) return 'ios';
    return 'windows';
  };
  const getIcon = (platform) => {
    if (platform === 'ios') return '';
    if (platform === 'android') return '🤖';
    return '⊞';
  };
  const groups = {
    windows: root.querySelector('[data-platform="windows"] .zy-download-grid'),
    ios: root.querySelector('[data-platform="ios"] .zy-download-grid'),
    android: root.querySelector('[data-platform="android"] .zy-download-grid')
  };
  items.forEach((item) => {
    const text = item.text || '';
    const size = (text.split('·')[1] || '').trim();
    const updated = (text.split('·')[2] || '').trim();
    const name = item.name;
    const platform = getPlatform(name);
    const card = document.createElement('article');
    card.className = 'zy-download-card';
    card.innerHTML = `
      <div class="zy-download-icon zy-icon-${platform}">${getIcon(platform)}</div>
      <div class="zy-download-meta">
        <h3 title="${name}">${name}</h3>
        <p>${size} · ${updated}</p>
      </div>
      <a class="zy-download-btn" href="${item.href}" target="_blank" rel="noopener">立即下载</a>
    `;
    groups[platform]?.appendChild(card);
  });
  Object.entries(groups).forEach(([k, el]) => {
    if (!el || el.children.length) return;
    el.innerHTML = '<div class="zy-download-empty">暂无该平台文件</div>';
  });
})();
</script>
