// ACCROCHES DES CATÉGORIES : modifier les textes ci-dessous.
const categoryDescriptions = {
  "graphisme": "Le graphisme me passionne depuis le début de mon parcours de designeuse. Je mets mes compétences au service de projets variés, en élaborant des stratégies nourries par un travail de veille approfondi et par ma créativité. Cette dernière s’exprime aussi dans ma pratique de la peinture et mes autres explorations artistiques.",
  "design-engage": "Je mets mes compétences en design graphique au service de causes engagées et d’enjeux sociaux. J’aime porter des projets qui résonnent auprès des publics auxquels ils s’adressent, avec l’ambition de susciter une prise de conscience et d’avoir un impact concret.",
  "design-social": "Mon parcours m’a amenée à m’intéresser au design social, une approche qui place les usagers au cœur des projets. Ce design nourrit ma créativité et fait écho à une autre facette de ma personnalité : ma sociabilité. Les enquêtes de terrain et les échanges avec les usagers me permettent de comprendre leurs besoins et de concevoir des réponses ancrées dans leur quotidien.",
  "community-management": "Ma sociabilité m’a naturellement amenée à développer une présence active sur mes réseaux sociaux professionnels. Cette expérience m’a permis d’affiner ma compréhension des algorithmes et des interactions avec les communautés. Je mets aujourd’hui ces compétences au service de différentes entreprises à travers mes prestations de community management.",
  "tous": "Une sélection pour découvrir ma démarche, mes compétences et leurs applications."
};

// Navigation commune : aucune dépendance, fonctionne aussi en ouvrant index.html.
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
    toggle.focus();
  }
});
const currentPage = location.pathname.split('/').pop() || 'index.html';
function updateNavigation() {
  nav?.querySelectorAll('a').forEach(a => {
    const target = new URL(a.getAttribute('href'), location.href);
    const active = target.pathname.split('/').pop() === currentPage && (!target.hash || target.hash === location.hash);
    if (active) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}
updateNavigation();
nav?.addEventListener('click', event => {
  if (event.target.closest('a')) {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
  }
});
// Les cartes restent dans l’ordre éditorial du HTML lors du filtrage.
const filters = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('[data-categories]')];
function filterProjects(key) {
  const valid = filters.some(button => button.dataset.filter === key);
  if (!valid) key = 'tous';
  filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === key)));
  let count = 0;
  cards.forEach(card => {
    card.hidden = key !== 'tous' && !card.dataset.categories.split(' ').includes(key);
    if (!card.hidden) count++;
  });
  const title = document.querySelector('#projects-title');
  if (title) {
    if (key === 'tous') title.innerHTML = 'Des idées aux<br><em>réalisations.</em>';
    else title.textContent = filters.find(button => button.dataset.filter === key).textContent;
  }
  const isCategory = ['tous', 'graphisme', 'design-engage', 'design-social', 'community-management'].includes(key);
  document.querySelector('#projects-intro')?.classList.toggle('category-intro', isCategory);
  const signature = document.querySelector('#projects-signature');
  if (signature) signature.hidden = !isCategory;
  const description = document.querySelector('#projects-description');
  if (description) description.hidden = key === 'tous';
  if (description) description.textContent = categoryDescriptions[key] || '';
  updateNavigation();
  const empty = document.querySelector('#projects-empty');
  if (empty) empty.hidden = count !== 0;
  const status = document.querySelector('#project-count');
  if (status) status.textContent = `${count} projet${count > 1 ? 's' : ''}`;
}
filters.forEach(button => button.addEventListener('click', () => {
  location.hash = button.dataset.filter;
  filterProjects(button.dataset.filter);
}));
if (filters.length) {
  filterProjects(location.hash.slice(1));
  window.addEventListener('hashchange', () => filterProjects(location.hash.slice(1)));
}

// Retour aux catégories depuis les dernières réalisations.
document.querySelector('[data-open-menu]')?.addEventListener('click', event => {
  if (!nav || !toggle) return;
  event.preventDefault();
  const collapsedMenu = getComputedStyle(toggle).display !== 'none';
  nav.classList.toggle('open', collapsedMenu);
  toggle.setAttribute('aria-expanded', String(collapsedMenu));
  document.querySelector('.site-header').scrollIntoView({ behavior: 'auto', block: 'start' });
  nav.querySelector('a[href="projets.html#graphisme"]')?.focus({ preventScroll: true });
});
