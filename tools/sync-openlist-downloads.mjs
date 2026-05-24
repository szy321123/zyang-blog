import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, "openlist-sync.json");
const DOWNLOADS_MD_PATH = path.join(ROOT, "source", "downloads", "index.md");
const DATA_JSON_PATH = path.join(ROOT, "source", "_data", "downloads.json");

const START_MARK = "<!-- OPENLIST:START -->";
const END_MARK = "<!-- OPENLIST:END -->";
const DOWNLOAD_ICON = "fa-solid fa-download";

const CATEGORY_META = {
  Android: {
    title: "Android",
    subtitle: "安卓应用安装包",
    icon: "fa-brands fa-android",
  },
  iOS: {
    title: "iOS",
    subtitle: "IPA 与越狱相关工具",
    icon: "fa-brands fa-apple",
  },
  Windows: {
    title: "Windows",
    subtitle: "Windows 常用软件与安装包",
    icon: "fa-brands fa-windows",
  },
  bandizip: {
    title: "压缩解压",
    subtitle: "Bandizip 安装包与便携版",
    icon: "fa-regular fa-file-zipper",
  },
  geek: {
    title: "卸载清理",
    subtitle: "轻量软件卸载工具",
    icon: "fa-solid fa-broom",
  },
  v2ray: {
    title: "网络工具",
    subtitle: "V2Ray 多平台客户端核心",
    icon: "fa-solid fa-network-wired",
  },
  其他: {
    title: "其他",
    subtitle: "暂未归类的文件",
    icon: "fa-regular fa-folder-open",
  },
};

function formatSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let i = 0;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i += 1;
  }
  return `${size.toFixed(size >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

function normalizeBaseUrl(baseUrl) {
  return String(baseUrl || "").trim().replace(/\/+$/, "");
}

async function readConfig() {
  const raw = await fs.readFile(CONFIG_PATH, "utf8");
  const conf = JSON.parse(raw);
  if (!conf.baseUrl || !conf.path) {
    throw new Error("openlist-sync.json 缺少 baseUrl 或 path");
  }
  return {
    baseUrl: normalizeBaseUrl(conf.baseUrl),
    path: conf.path,
    password: conf.password || "",
    token: conf.token || "",
    perPage: Number.isInteger(conf.perPage) ? conf.perPage : 0,
    refresh: conf.refresh !== false,
  };
}

async function fetchOpenListEntries(conf, currentPath) {
  const url = `${conf.baseUrl}/api/fs/list`;
  const headers = { "Content-Type": "application/json" };
  if (conf.token) headers.Authorization = conf.token;

  const body = {
    path: currentPath,
    password: conf.password,
    page: 1,
    per_page: conf.perPage,
    refresh: conf.refresh,
  };

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`OpenList API 请求失败：${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (json.code !== 200 || !json.data) {
    throw new Error(`OpenList API 返回异常：${json.message || "unknown error"}`);
  }

  const content = Array.isArray(json.data.content) ? json.data.content : [];
  return content.map((item) => ({
    ...item,
    parentPath: currentPath,
  }));
}

async function fetchOpenListTree(conf, currentPath = conf.path, seen = new Set()) {
  const normalized = normalizeOpenListPath(currentPath);
  if (seen.has(normalized)) return [];
  seen.add(normalized);

  const entries = await fetchOpenListEntries(conf, normalized);
  const files = [];

  for (const entry of entries) {
    if (entry.is_dir) {
      const childPath = joinOpenListPath(normalized, entry.name);
      const childFiles = await fetchOpenListTree(conf, childPath, seen);
      files.push(...childFiles);
    } else {
      files.push(entry);
    }
  }

  return files;
}

function normalizeOpenListPath(value) {
  const pathValue = String(value || "/").trim();
  if (!pathValue || pathValue === "/") return "/";
  return `/${pathValue.replace(/^\/+|\/+$/g, "")}`;
}

function joinOpenListPath(parent, name) {
  const normalizedParent = normalizeOpenListPath(parent);
  const safeName = String(name || "").replace(/^\/+|\/+$/g, "");
  return normalizedParent === "/" ? `/${safeName}` : `${normalizedParent}/${safeName}`;
}

function toPublicUrl(conf, file) {
  if (file.raw_url) return file.raw_url;
  const dir = normalizeOpenListPath(file.parentPath || conf.path);
  const encodedPath = dir
    .split("/")
    .filter(Boolean)
    .map(encodeURIComponent)
    .join("/");
  const encodedName = encodeURIComponent(file.name);
  const publicPath = [encodedPath, encodedName].filter(Boolean).join("/");
  return `${conf.baseUrl}/d/${publicPath}`;
}

function getFileExt(name) {
  const match = String(name || "").match(/\.([^.]+)$/);
  return match ? match[1].toLowerCase() : "";
}

function classifyFile(file) {
  const ext = getFileExt(file.name);
  const parent = normalizeOpenListPath(file.parentPath || "/");
  const topDir = parent.split("/").filter(Boolean)[0];

  if (topDir) return topDir;
  if (["exe", "msi", "zip", "7z", "rar"].includes(ext)) return "Windows";
  if (["ipa"].includes(ext)) return "iOS";
  if (["apk", "apks", "xapk"].includes(ext)) return "Android";
  if (["dmg", "pkg"].includes(ext)) return "macOS";
  return "其他";
}

function getCategoryMeta(category) {
  return CATEGORY_META[category] || {
    title: category,
    subtitle: "来自下载站目录",
    icon: "fa-regular fa-folder-open",
  };
}

function getFileType(name) {
  const ext = getFileExt(name);
  const map = {
    exe: "Windows",
    msi: "Windows",
    zip: "压缩包",
    "7z": "压缩包",
    rar: "压缩包",
    ipa: "iOS",
    apk: "Android",
    apks: "Android",
    xapk: "Android",
    dmg: "macOS",
    pkg: "macOS",
  };
  return map[ext] || (ext ? ext.toUpperCase() : "文件");
}

function getFileDescription(file) {
  const lower = file.name.toLowerCase();
  if (lower.includes("everything")) return "本地文件快速搜索工具";
  if (lower.includes("huorong")) return "火绒安全软件安装包";
  if (lower.includes("easybackup")) return "备份工具安装包";
  if (lower.includes("bandizip")) return "压缩解压工具";
  if (lower.includes("geek")) return "软件卸载清理工具";
  if (lower.includes("v2ray")) return "网络代理核心文件";
  if (lower.includes("clash")) return "Android 网络代理客户端";
  if (lower.includes("trollinstaller")) return "iOS TrollStore 安装相关工具";
  if (lower.includes("filza")) return "iOS 文件管理工具";
  if (lower.includes("batteryinfo")) return "iOS 电池信息工具";
  if (lower.includes("虚拟定位")) return "iOS 虚拟定位工具";
  return "来自 zyang.app 下载站";
}

function isFeatured(file) {
  const lower = file.name.toLowerCase();
  return [
    "easybackup.exe",
    "clashmetaforandroid",
    "bandizip-x64.exe",
    "geek.zip",
    "v2ray-windows-64.zip",
    "trollinstallerx.ipa",
  ].some((keyword) => lower.includes(keyword));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function toCategorySummary(items) {
  const groups = groupItems(items);
  const parts = Object.entries(groups).map(([name, files]) => `${name} ${files.length}`);
  return parts.join(" · ");
}

function groupItems(items) {
  return items.reduce((groups, item) => {
    const group = item.category || "其他";
    groups[group] ||= [];
    groups[group].push(item);
    return groups;
  }, {});
}

function getFeaturedItems(items) {
  return items.filter(isFeatured).slice(0, 6);
}

function toCard(file, options = {}) {
  const displayPath = normalizeOpenListPath(file.parentPath || "/");
  const meta = getCategoryMeta(file.category);
  const searchText = [
    file.name,
    file.category,
    meta.title,
    displayPath,
    getFileType(file.name),
    getFileDescription(file),
  ].join(" ");
  const classes = ["download-card"];
  if (options.featured) classes.push("download-card-featured");

  return [
    '<a class="' + classes.join(" ") + '" href="' + escapeHtml(file.url) + '" target="_blank" rel="noopener" data-download-card data-category="' + escapeHtml(file.category) + '" data-search="' + escapeHtml(searchText.toLowerCase()) + '">',
    '  <span class="download-card-icon"><i class="' + escapeHtml(options.featured ? meta.icon : DOWNLOAD_ICON) + '"></i></span>',
    '  <span class="download-card-main">',
    '    <strong>' + escapeHtml(file.name) + "</strong>",
    '    <span class="download-card-desc">' + escapeHtml(getFileDescription(file)) + "</span>",
    '    <span class="download-card-tags"><em>' + escapeHtml(getFileType(file.name)) + "</em><em>" + escapeHtml(displayPath) + "</em></span>",
    "  </span>",
    '  <span class="download-card-meta">',
    '    <span>' + escapeHtml(formatSize(file.size)) + "</span>",
    '    <span>' + escapeHtml(formatDate(file.modified)) + "</span>",
    "  </span>",
    "</a>",
  ].join("\n");
}

function toDownloadScript() {
  return [
    "<script>",
    "(function () {",
    "  const root = document.querySelector('[data-download-root]');",
    "  if (!root) return;",
    "  const input = root.querySelector('[data-download-search]');",
    "  const chips = Array.from(root.querySelectorAll('[data-download-filter]'));",
    "  const cards = Array.from(root.querySelectorAll('[data-download-card]'));",
    "  const sections = Array.from(root.querySelectorAll('[data-download-section]'));",
    "  const empty = root.querySelector('[data-download-empty]');",
    "  let active = 'all';",
    "  function update() {",
    "    const keyword = (input && input.value ? input.value : '').trim().toLowerCase();",
    "    let visibleCount = 0;",
    "    cards.forEach(function (card) {",
    "      const matchCategory = active === 'all' || card.dataset.category === active;",
    "      const matchSearch = !keyword || (card.dataset.search || '').includes(keyword);",
    "      const show = matchCategory && matchSearch;",
    "      card.hidden = !show;",
    "      if (show) visibleCount += 1;",
    "    });",
    "    sections.forEach(function (section) {",
    "      const visibleCards = Array.from(section.querySelectorAll('[data-download-card]')).filter(function (card) { return !card.hidden; });",
    "      section.hidden = visibleCards.length === 0;",
    "    });",
    "    if (empty) empty.hidden = visibleCount !== 0;",
    "  }",
    "  chips.forEach(function (chip) {",
    "    chip.addEventListener('click', function () {",
    "      active = chip.dataset.downloadFilter || 'all';",
    "      chips.forEach(function (item) { item.classList.toggle('is-active', item === chip); });",
    "      update();",
    "    });",
    "  });",
    "  if (input) input.addEventListener('input', update);",
    "}());",
    "</script>",
  ].join("\n");
}

function toMarkdownBlock(items) {
  if (!items.length) {
    return `${START_MARK}\n\n> 当前目录暂无可下载文件。\n\n${END_MARK}`;
  }

  const groups = groupItems(items);
  const featuredItems = getFeaturedItems(items);
  const groupEntries = Object.entries(groups);
  const filterChips = [
    '<button class="download-filter-chip is-active" type="button" data-download-filter="all">全部</button>',
    ...groupEntries.map(([groupName, files]) => {
      const meta = getCategoryMeta(groupName);
      return '<button class="download-filter-chip" type="button" data-download-filter="' + escapeHtml(groupName) + '">' + escapeHtml(meta.title) + '<span>' + files.length + "</span></button>";
    }),
  ].join("\n");

  const sections = Object.entries(groups).map(([groupName, files]) => {
    const meta = getCategoryMeta(groupName);
    const cards = files.map((file) => toCard(file)).join("\n");

    return [
      '<section class="download-section" data-download-section>',
      '  <div class="download-section-head">',
      '    <span class="download-section-icon"><i class="' + escapeHtml(meta.icon) + '"></i></span>',
      '    <div><h2>' + escapeHtml(meta.title) + "</h2><p>" + escapeHtml(meta.subtitle) + "</p></div>",
      "    <span>" + files.length + " 个文件</span>",
      "  </div>",
      '  <div class="download-grid">',
      cards,
      "  </div>",
      "</section>",
    ].join("\n");
  });

  return [
    START_MARK,
    "",
    '<div class="download-center" data-download-root>',
    '<section class="download-hero">',
    '  <div class="download-hero-main">',
    '    <span class="download-eyebrow">ZYang OpenList</span>',
    "    <h2>常用文件快速下载</h2>",
    "    <p>按平台和用途整理公开文件，适合快速找到 Windows、iOS、Android 与网络工具。</p>",
    "  </div>",
    '  <div class="download-overview">',
    '    <div class="download-overview-item"><strong>' + items.length + "</strong><span>文件总数</span></div>",
    '    <div class="download-overview-item"><strong>' + escapeHtml(formatSize(items.reduce((sum, item) => sum + item.size, 0))) + "</strong><span>总体积</span></div>",
    '    <div class="download-overview-item"><strong>' + Object.keys(groups).length + "</strong><span>分类</span></div>",
    "  </div>",
    "</section>",
    "",
    '<section class="download-toolbar">',
    '  <label class="download-search"><i class="fa-solid fa-magnifying-glass"></i><input type="search" placeholder="搜索文件、平台或用途" data-download-search></label>',
    '  <div class="download-filters">' + filterChips + "</div>",
    "</section>",
    "",
    featuredItems.length
      ? [
          '<section class="download-featured" data-download-section>',
          '  <div class="download-section-head download-section-head-plain">',
          '    <span class="download-section-icon"><i class="fa-solid fa-bolt"></i></span>',
          "    <div><h2>常用推荐</h2><p>优先展示更常下载的工具</p></div>",
          "  </div>",
          '  <div class="download-featured-grid">',
          featuredItems.map((file) => toCard(file, { featured: true })).join("\n"),
          "  </div>",
          "</section>",
        ].join("\n")
      : "",
    "",
    '<p class="download-sync-note">同步自 <a href="https://zyang.app/" target="_blank" rel="noopener">zyang.app</a>，点击条目即可打开下载链接。</p>',
    "",
    '<div class="download-empty" data-download-empty hidden>没有找到匹配的文件</div>',
    "",
    '<div class="download-sections">',
    sections.join("\n\n"),
    "</div>",
    "",
    toDownloadScript(),
    "</div>",
    "",
    END_MARK,
  ].join("\n");
}

async function ensureDownloadsPage() {
  let md = "";
  try {
    md = await fs.readFile(DOWNLOADS_MD_PATH, "utf8");
  } catch {
    md = `---\ntitle: 下载中心\ndate: ${new Date().toISOString()}\n---\n\n# 下载中心\n\n${START_MARK}\n${END_MARK}\n`;
  }

  if (!md.includes(START_MARK) || !md.includes(END_MARK)) {
    md += `\n\n${START_MARK}\n${END_MARK}\n`;
  }

  return md;
}

async function writeOutputs(items) {
  await fs.mkdir(path.dirname(DATA_JSON_PATH), { recursive: true });
  await fs.writeFile(
    DATA_JSON_PATH,
    `${JSON.stringify({
      updatedAt: new Date().toISOString(),
      total: items.length,
      summary: toCategorySummary(items),
      items,
    }, null, 2)}\n`,
    "utf8",
  );

  const current = await ensureDownloadsPage();
  const replaced = current.replace(
    new RegExp(`${START_MARK}[\\s\\S]*?${END_MARK}`),
    toMarkdownBlock(items),
  );
  await fs.writeFile(DOWNLOADS_MD_PATH, replaced, "utf8");
}

async function main() {
  const conf = await readConfig();
  const files = await fetchOpenListTree(conf);
  const items = files
    .map((file) => ({
      name: file.name,
      size: file.size || 0,
      modified: file.modified || "",
      parentPath: normalizeOpenListPath(file.parentPath || conf.path),
      category: classifyFile(file),
      url: toPublicUrl(conf, file),
    }))
    .sort((a, b) => {
      const group = a.category.localeCompare(b.category, "zh-CN");
      if (group !== 0) return group;
      return a.name.localeCompare(b.name, "zh-CN");
    });

  await writeOutputs(items);
  console.log(`OpenList 同步完成：${items.length} 个文件`);
}

main().catch((err) => {
  console.error("OpenList 同步失败：", err.message);
  process.exit(1);
});
