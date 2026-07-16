/* ============================================================
   render.js — 通用渲染引擎
   以后新增内容只需修改 assets/js/data/*.js，本文件无需改动
============================================================ */

/* 1. Experience */
function renderExperience(containerId, data){
  const el = document.getElementById(containerId);
  if(!el) return;
  el.innerHTML = data.map(e => `
    <div class="exp-block">
      <div class="exp-logo">${e.icon}</div>
      <div>
        <p class="exp-role">${e.role}</p>
        <p class="exp-org">${e.org}</p>
        <p class="exp-date">${e.date}</p>
        <div class="exp-body">
          ${e.advisor ? `<p><strong>${e.advisor}</strong></p>` : ''}
          <ul>${e.points.map(p => `<li>${p}</li>`).join('')}</ul>
          <div class="tags">
            ${e.tags.map(t => `<span class="tag tag-${t.type}">${t.label}</span>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

/* 2. Publications */
function renderPublications(containerId, data, featuredOnly = false){
  const el = document.getElementById(containerId);
  if(!el) return;
  const list = featuredOnly ? data.filter(p => p.featured) : data;
  el.innerHTML = list.map((p, i) => `
    <div class="pub-row">
      <span class="pub-num">${i + 1}</span>
      <div>
        <span class="pub-badge badge-${p.badgeType}">${p.badge}</span>
        <p class="pub-title">${p.title}</p>
        <p class="pub-authors">${p.authors}</p>
        <p class="pub-journal">${p.journal || ''}</p>
        <div class="pub-links">
          ${p.links.map(l => `<a href="${l.url}" class="pub-link ${l.primary ? 'primary' : ''}" target="_blank">${l.label}</a>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

/* 3. Conferences */
function renderConferences(containerId, data){
  const el = document.getElementById(containerId);
  if(!el) return;
  el.innerHTML = data.map((c, i) => `
    <div class="conf-row">
      <span class="conf-num">${i + 1}</span>
      <p class="conf-text"><strong>${c.year}</strong> — ${c.text}</p>
    </div>
  `).join('');
}

/* 4. Expertise */
function renderExpertise(containerId, data){
  const el = document.getElementById(containerId);
  if(!el) return;
  el.innerHTML = data.map(group => `
    <div class="exp-card">
      <p class="exp-card-label">${group.label}</p>
      <div class="skill-tags tags">
        ${group.skills.map(s => `<span class="tag tag-${s.type}">${s.name}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

/* ============================================================
   5. Tutorials / Podcast
   ------------------------------------------------------------
   设计说明：
   - renderTutorials() 内部永远自己做一次"按 date 降序排序"，
     不信任调用方传入数组的原始顺序。
     （历史 bug：之前调用方各自用 .reverse() / .slice(-2).reverse()
      去"猜"数据顺序，猜错了导致首页和列表页顺序相反、且首页展示的
      是最旧的两篇。现在把排序责任收归到渲染函数内部，调用方只需要
      声明"要不要分组"和"要不要限制数量"这两个展示层意图。）
   - options.groupByYear: 是否按年份插入分组标题（用于 tutorials.html
     的完整列表页，类似 News 页面的年份分组，但不引入分类筛选）。
   - options.limit: 只取最新 N 条（用于首页 "Latest Tutorials" 预览）。
     limit 在排序 *之后* 应用，保证拿到的一定是"最新的 N 条"，
     而不是数组物理位置上的最后 N 条。
============================================================ */

/* 从 'YYYY-MM-DD' 形式的日期字符串中提取年份；
   容错处理空值/异常格式，避免生成 "Undefined" 分组标题 */
function getYearFromDate(dateStr){
  if(!dateStr || typeof dateStr !== 'string' || dateStr.length < 4){
    return "Undated";
  }
  return dateStr.slice(0, 4);
}

/* 生成单个教程卡片的 HTML，抽成独立小函数，
   避免 groupByYear 分支和非分组分支各写一遍卡片模板导致重复维护 */
function tutorialCardHTML(t){
  return `
    <a class="tut-card" href="${t.url}">
      <div class="tut-cover">
        ${t.cover ? `<img src="${t.cover}" alt="${t.title}">` : (t.type === 'podcast' ? '🎙️' : '📝')}
      </div>
      <div class="tut-body">
        <p class="tut-date">${t.date}</p>
        <p class="tut-title">${t.title}</p>
        <p class="tut-summary">${t.summary}</p>
        <div class="tags tut-tags">
          ${t.tags.map(x => `<span class="tag tag-g">${x}</span>`).join('')}
        </div>
      </div>
    </a>
  `;
}

function renderTutorials(containerId, data, options = {}){
  const el = document.getElementById(containerId);
  if(!el) return;

  const { groupByYear = false, limit = null } = options;

  // 关键修复点：排序永远在函数内部完成，调用方不需要也不应该自己 reverse/slice
  let sorted = sortByDateDesc(data, 'date');

  // limit 在排序之后应用 —— 保证 "最新 N 条" 是按真实日期算出来的，
  // 而不是数组物理顺序的头 N 条或尾 N 条
  if (limit !== null){
    sorted = sorted.slice(0, limit);
  }

  if (!groupByYear){
    // 首页 "Latest Tutorials" 走这个分支：扁平网格，不需要年份标题
    el.innerHTML = sorted.map(t => tutorialCardHTML(t)).join('');
    return;
  }

  // tutorials.html 完整列表页走这个分支：按年份插入分组标题
  // 注意：.tut-year-label 需要在 CSS 里设置 grid-column: 1 / -1，
  // 否则它会被当成 grid 里的一个普通格子，而不是跨行标题
  const years = [...new Set(sorted.map(t => getYearFromDate(t.date)))];

  let html = "";
  years.forEach(year => {
    html += `<div class="tut-year-label">${year}</div>`;
    sorted
      .filter(t => getYearFromDate(t.date) === year)
      .forEach(t => { html += tutorialCardHTML(t); });
  });

  el.innerHTML = html;
}

/* ============================================================
   6. Gallery — 支持 type（photo/video）+ source（local/drive）
      双重筛选，并提供数量统计辅助函数
============================================================ */

/* 统计各分类的数量，供 Tab 徽章显示 */
function getGalleryCounts(data){
  return {
    all:   data.length,
    photo: data.filter(g => g.type === 'photo').length,
    video: data.filter(g => g.type === 'video').length,
    local: data.filter(g => g.source === 'local').length,
    drive: data.filter(g => g.source === 'drive').length
  };
}

/* 渲染 Gallery 列表；filters = {type:'all'|'photo'|'video', source:'all'|'local'|'drive'} */
function renderGallery(containerId, data, filters = {type:'all', source:'all'}){
  const el = document.getElementById(containerId);
  if(!el) return;

  let list = data;
  if(filters.type && filters.type !== 'all'){
    list = list.filter(g => g.type === filters.type);
  }
  if(filters.source && filters.source !== 'all'){
    list = list.filter(g => g.source === filters.source);
  }

  if(list.length === 0){
    el.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--text-3);padding:2rem 0">
      没有符合条件的内容 · No items match this filter
    </p>`;
    window.__currentGalleryList = [];
    return;
  }

  el.innerHTML = list.map((g, i) => `
    <div class="gal-item" onclick="openLightboxByIndex(${i})">
      ${g.type === 'video'
        ? `<img src="${g.thumb}" alt="${g.caption || ''}"><div class="gal-play">▶</div>`
        : `<img src="${g.src}" alt="${g.caption || ''}">`}
      <span class="gal-source-badge">${g.source === 'drive' ? '☁️ Drive' : '💾 Local'}</span>
      <div class="gal-caption">${g.caption || ''}</div>
    </div>
  `).join('');

  window.__currentGalleryList = list;
}

function openLightboxByIndex(idx){
  const item = window.__currentGalleryList[idx];
  if(item) openLightbox(item);
}

function openLightbox(item){
  const lb = document.getElementById('lightbox');
  const body = document.getElementById('lightboxBody');
  if(!lb || !body) return;

  if(item.type === 'video' && item.source === 'drive'){
    body.innerHTML = `<iframe src="${item.src}" width="800" height="480" allow="autoplay" frameborder="0"></iframe>`;
  } else if(item.type === 'video'){
    body.innerHTML = `<video src="${item.src}" controls autoplay></video>`;
  } else {
    body.innerHTML = `<img src="${item.src}" alt="${item.caption || ''}">`;
  }
  lb.classList.add('open');
}

function closeLightbox(){
  const lb = document.getElementById('lightbox');
  const body = document.getElementById('lightboxBody');
  if(lb) lb.classList.remove('open');
  if(body) body.innerHTML = '';
}

document.addEventListener('DOMContentLoaded', () => {
  const lb = document.getElementById('lightbox');
  if(lb){
    lb.addEventListener('click', (e) => { if(e.target === lb) closeLightbox(); });
  }
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeLightbox(); });
});

// ============================================================
// News helpers — single source of truth: item.sortDate (YYYY-MM-DD)
// Year labels and chronological order are ALWAYS derived from
// sortDate automatically. Never rely on a manually-typed `year`
// field — this avoids "year label vs. displayed date" mismatches.
// ============================================================

/* 通用日期降序排序：优先使用调用方指定的 field，
   其次回退 sortDate，再回退 date（兼容 News 和 Tutorials 两套数据结构）*/
function sortByDateDesc(data, field){
  return [...data].sort((a, b) => {
    const da = (field && a[field]) || a.sortDate || a.date;
    const db = (field && b[field]) || b.sortDate || b.date;
    if (!da) return 1;
    if (!db) return -1;
    return String(db).localeCompare(String(da));
  });
}

/* 从 sortDate（YYYY-MM-DD）中提取年份，用于 News 分组标题
   （Tutorials 用的是上面新增的 getYearFromDate，字段名不同，故分开写，
    避免为了共用一个函数而引入 "field 名称到底是 date 还是 sortDate" 的隐藏耦合）*/
function getYearFromItem(item){
  if (item.sortDate) return item.sortDate.slice(0, 4);
  if (item.year) return String(item.year);
  return "Undated";
}

const NEWS_BADGE_MAP = {
  publication: { label: "Publication", cls: "news-badge-pub" },
  grant:       { label: "Grant",       cls: "news-badge-grant" },
  award:       { label: "Award",       cls: "news-badge-award" },
  talk:        { label: "Talk",        cls: "news-badge-talk" },
  media:       { label: "Media",       cls: "news-badge-media" },
  team:        { label: "Team",        cls: "news-badge-team" },
  tool:        { label: "Tool / Release", cls: "news-badge-tool" }
};

// ============================================================
// Render News Timeline (auto-sorted by sortDate, grouped by
// year derived from sortDate — reverse chronological)
// ============================================================
function renderNews(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!data || data.length === 0) {
    container.innerHTML = `<p class="news-empty">No news items in this category yet.</p>`;
    return;
  }

  const sorted = sortByDateDesc(data);
  const years = [...new Set(sorted.map(item => getYearFromItem(item)))];

  let html = "";
  years.forEach(year => {
    html += `<div class="news-year-label">${year}</div>`;
    sorted.filter(item => getYearFromItem(item) === year).forEach(item => {
      const badge = NEWS_BADGE_MAP[item.category] || { label: item.category, cls: "news-badge-team" };
      html += `
        <div class="news-item">
          <div class="news-date">${item.date}</div>
          <div class="news-content">
            <span class="news-badge ${badge.cls}">${badge.label}</span>
            <p class="news-title">${item.title}</p>
            <p class="news-summary">${item.summary}</p>
            ${item.link ? `<a class="news-link" href="${item.link}" target="${item.link.startsWith('http') ? '_blank' : '_self'}" rel="noopener">${item.linkText || 'Read more →'}</a>` : ''}
          </div>
        </div>`;
    });
  });

  container.innerHTML = html;
}

// ============================================================
// Render News Category Filter Tabs (All / Publication / Grant / ...)
// ============================================================
function renderNewsTabs(tabsContainerId, timelineContainerId, data) {
  const tabsContainer = document.getElementById(tabsContainerId);
  if (!tabsContainer) return;

  const categoryOrder = ["all", "publication", "grant", "award", "talk", "media", "team", "tool"];
  const categoryLabels = {
    all: "All",
    publication: "Publication",
    grant: "Grant",
    award: "Award",
    talk: "Talk",
    media: "Media",
    team: "Team",
    tool: "Tool / Release"
  };

  const counts = { all: data.length };
  categoryOrder.slice(1).forEach(cat => {
    counts[cat] = data.filter(item => item.category === cat).length;
  });

  let html = "";
  categoryOrder.forEach(cat => {
    const activeClass = cat === "all" ? " active" : "";
    html += `
      <button class="news-tab${activeClass}" data-category="${cat}">
        ${categoryLabels[cat]}
        <span class="news-tab-count">${counts[cat]}</span>
      </button>`;
  });
  tabsContainer.innerHTML = html;

  const tabs = tabsContainer.querySelectorAll(".news-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const selected = tab.dataset.category;
      const filtered = selected === "all" ? data : data.filter(item => item.category === selected);
      renderNews(timelineContainerId, filtered);
    });
  });
}

// ============================================================
// Render Compact News Highlights (for homepage preview module)
// ============================================================
function renderNewsHighlights(containerId, data, count = 3) {
  const el = document.getElementById(containerId);
  if (!el) return;

  if (!data || data.length === 0) {
    el.innerHTML = `<p class="news-empty">No news items yet.</p>`;
    return;
  }

  const sorted = sortByDateDesc(data);
  const list = sorted.slice(0, count);

  el.innerHTML = list.map(item => {
    const badge = NEWS_BADGE_MAP[item.category] || { label: item.category, cls: "news-badge-team" };
    return `
      <div class="highlight-item">
        <div class="highlight-date">${item.date}</div>
        <div class="highlight-content">
          <span class="news-badge ${badge.cls}">${badge.label}</span>
          <p class="highlight-title">${item.title}</p>
          <p class="highlight-summary">${item.summary}</p>
          ${item.link ? `<a class="news-link" href="${item.link}" target="${item.link.startsWith('http') ? '_blank' : '_self'}" rel="noopener">${item.linkText || 'Read more →'}</a>` : ''}
        </div>
      </div>`;
  }).join('');
}