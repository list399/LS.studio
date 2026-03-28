const SHEET_URL = 'https://corsproxy.io/?url=' + encodeURIComponent('https://docs.google.com/spreadsheets/d/e/2PACX-1vT2iJmf1kMKA9tz9pzc7nv9s4nUEvdJGSIstnfGvwzTDavSkbNyaedtqSsxD16twPvd-6eKfoicWU2b/pub?output=csv');

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    const cols = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQuotes = !inQuotes; }
      else if (ch === ',' && !inQuotes) { cols.push(current.trim()); current = ''; }
      else { current += ch; }
    }
    cols.push(current.trim());
    const row = {};
    headers.forEach((h, i) => { row[h] = (cols[i] || '').replace(/^"|"$/g, ''); });
    return row;
  });
}

function renderPosts(posts, containerId) {
  const container = document.getElementById(containerId);
  if (!posts.length) {
    container.innerHTML = '<p class="loading">no posts yet</p>';
    return;
  }
  container.innerHTML = posts.map((p, i) => `
    <div class="post" style="animation-delay:${i * 0.07}s">
      ${p.image ? `<img class="post-image" src="${p.image}" alt="${p.title}">` : ''}
      <div class="post-title">
        <a href="${p.url}" target="_blank" rel="noopener">${p.title}</a>
      </div>
      ${p.blurb ? `<p class="post-blurb">${p.blurb}</p>` : ''}
    </div>
  `).join('');
}

function loadPosts(pageKey, containerId) {
  fetch(SHEET_URL)
    .then(r => r.text())
    .then(text => {
      const all = parseCSV(text);
      const filtered = all.filter(p => (p.page || '').trim().toLowerCase() === pageKey.toLowerCase());
      renderPosts(filtered, containerId);
    })
    .catch(() => {
      document.getElementById(containerId).innerHTML =
        '<p class="error">could not load posts</p>';
    });
}
