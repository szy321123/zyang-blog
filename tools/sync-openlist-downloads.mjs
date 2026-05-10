import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, "openlist-sync.json");
const DOWNLOADS_MD_PATH = path.join(ROOT, "source", "downloads", "index.md");
const DATA_JSON_PATH = path.join(ROOT, "source", "_data", "downloads.json");

const START_MARK = "<!-- OPENLIST:START -->";
const END_MARK = "<!-- OPENLIST:END -->";

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

async function fetchOpenListFiles(conf) {
  const url = `${conf.baseUrl}/api/fs/list`;
  const headers = { "Content-Type": "application/json" };
  if (conf.token) headers.Authorization = conf.token;

  const body = {
    path: conf.path,
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
  return content.filter((item) => !item.is_dir);
}

function toPublicUrl(conf, file) {
  if (file.raw_url) return file.raw_url;
  const dir = conf.path.startsWith("/") ? conf.path : `/${conf.path}`;
  const cleanDir = dir.endsWith("/") ? dir.slice(0, -1) : dir;
  const encodedName = encodeURIComponent(file.name);
  return `${conf.baseUrl}/d${cleanDir}/${encodedName}`;
}

function toMarkdownBlock(items) {
  if (!items.length) {
    return `${START_MARK}\n> 当前目录暂无可下载文件。\n${END_MARK}`;
  }

  const rows = items.map((f) => {
    const time = f.modified ? new Date(f.modified).toLocaleString("zh-CN", { hour12: false }) : "-";
    return `- [${f.name}](${f.url}) · ${formatSize(f.size)} · 更新于 ${time}`;
  });
  return `${START_MARK}\n${rows.join("\n")}\n${END_MARK}`;
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
    `${JSON.stringify({ updatedAt: new Date().toISOString(), items }, null, 2)}\n`,
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
  const files = await fetchOpenListFiles(conf);
  const items = files
    .map((file) => ({
      name: file.name,
      size: file.size || 0,
      modified: file.modified || "",
      url: toPublicUrl(conf, file),
    }))
    .sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());

  await writeOutputs(items);
  console.log(`OpenList 同步完成：${items.length} 个文件`);
}

main().catch((err) => {
  console.error("OpenList 同步失败：", err.message);
  process.exit(1);
});
