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