/* ============================================================
   main.js — 导航高亮 / 暗色模式 / 移动端菜单
============================================================ */

/* 当前页导航高亮 */
(function highlightNav(){
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if(href === current) a.classList.add('active');
  });
})();

/* 暗色模式：读取本地记忆状态 */
if(localStorage.getItem('theme') === 'dark'){
  document.body.classList.add('dark');
}
function toggleDark(){
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

/* 移动端菜单开关 */
function toggleMobileNav(){
  const nav = document.getElementById('navLinks');
  if(nav) nav.classList.toggle('open');
}