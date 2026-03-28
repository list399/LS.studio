function renderNav(activePage) {
  const pages = [
    { label: 'Lisa Staugaard', href: '/index.html', key: 'home' },
    { label: 'Iridium Interiors', href: '/iridium-interiors.html', key: 'iridium' },
    { label: 'Fizzy Ceramics', href: '/fizzy-ceramics.html', key: 'fizzy' },
    { label: 'Science Toast', href: '/science-toast.html', key: 'sciencetoast' },
  ];

  const projects = [
    { label: 'Rubber', href: '/projects/rubber.html', key: 'rubber' },
    { label: 'Air', href: '/projects/air.html', key: 'air' },
    { label: 'Corrosion', href: '/projects/corrosion.html', key: 'corrosion' },
    { label: 'Sky', href: '/projects/sky.html', key: 'sky' },
    { label: 'Lab', href: '/projects/lab.html', key: 'lab' },
  ];

  const projectKeys = projects.map(p => p.key);
  const projectsActive = projectKeys.includes(activePage);

  const navItems = pages.map(p => `
    <a href="${p.href}" class="nav-link ${activePage === p.key ? 'active' : ''}">${p.label}</a>
  `).join('');

  const dropdownItems = projects.map(p => `
    <a href="${p.href}" class="dropdown-item ${activePage === p.key ? 'active' : ''}">${p.label}</a>
  `).join('');

  document.getElementById('nav-placeholder').innerHTML = `
    <nav>
      <div class="nav-inner">
        ${navItems}
        <div class="nav-dropdown">
          <button class="nav-link dropdown-toggle ${projectsActive ? 'active' : ''}">
            Projects <span class="caret">▾</span>
          </button>
          <div class="dropdown-menu">
            ${dropdownItems}
          </div>
        </div>
      </div>
    </nav>
  `;

  // Dropdown toggle
  const toggle = document.querySelector('.dropdown-toggle');
  const menu = document.querySelector('.dropdown-menu');
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('open');
  });
  document.addEventListener('click', () => menu.classList.remove('open'));
}
