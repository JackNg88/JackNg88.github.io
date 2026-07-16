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

/* 5. Tutorials / Podcast */
function renderTutorials(containerId, data){
  const el = document.getElementById(containerId);
  if(!el) return;
  el.innerHTML = data.map(t => `
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
  `).join('');
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

  /* 空结果提示 */
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

  /* 存一份当前渲染列表供 lightbox 点击使用 */
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

/* 按 sortDate 降序排序（最新的在前），返回新数组，不修改原数组 */
function sortByDateDesc(data){
  return [...data].sort((a, b) => {
    if (!a.sortDate) return 1;
    if (!b.sortDate) return -1;
    return b.sortDate.localeCompare(a.sortDate);
  });
}

/* 从 sortDate（YYYY-MM-DD）中提取年份，用于分组标题 */
function getYearFromItem(item){
  if (item.sortDate) return item.sortDate.slice(0, 4);
  if (item.year) return String(item.year); // 兼容旧数据，仍带 year 字段的情况
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

  // 关键修复：先按真实日期排序，年份分组标题也从同一日期字段推导
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

  // Count items per category
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

  // Attach filter click handlers
  const tabs = tabsContainer.querySelectorAll(".news-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const selected = tab.dataset.category;
      const filtered = selected === "all" ? data : data.filter(item => item.category === selected);
      renderNews(timelineContainerId, filtered); // renderNews 内部会自动重新排序
    });
  });
}

// ============================================================
// Render Compact News Highlights (for homepage preview module)
// Auto-sorted by sortDate, shows the latest N items,
// no year grouping / tabs
// ============================================================
function renderNewsHighlights(containerId, data, count = 3) {
  const el = document.getElementById(containerId);
  if (!el) return;

  if (!data || data.length === 0) {
    el.innerHTML = `<p class="news-empty">No news items yet.</p>`;
    return;
  }

  // 关键修复：预览模块也先排序，再取最新 N 条
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