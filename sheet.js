const SHEET_URL = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://docs.google.com/spreadsheets/d/e/2PACX-1vT2iJmf1kMKA9tz9pzc7nv9s4nUEvdJGSIstnfGvwzTDavSkbNyaedtqSsxD16twPvd-6eKfoicWU2b/pub?output=csv');

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

  const withImages = posts.filter(p => p.image && p.image.trim() !== '');
  const withoutImages = posts.filter(p => !p.image || p.image.trim() === '');

  let html = '';

  if (withImages.length) {
    html += `<div class="masonry">` + withImages.map(p => `
      <div class="masonry-item">
        <img src="${p.image}" alt="${p.title}">
        <div class="masonry-caption">
          ${p.url
            ? `<a class="masonry-caption-title" href="${p.url}" target="_blank" rel="noopener">${p.title}</a>`
            : `<span class="masonry-caption-title">${p.title}</span>`
          }
          ${p.blurb ? `<p class="masonry-caption-blurb">${p.blurb}</p>` : ''}
        </div>
      </div>
    `).join('') + `</div>`;
  }

  if (withoutImages.length) {
    html += `<div class="masonry text-masonry">` + withoutImages.map(p => `
      <div class="masonry-item text-tile">
        <div class="masonry-caption static">
          ${p.url
            ? `<a class="masonry-caption-title" href="${p.url}" target="_blank" rel="noopener">${p.title}</a>`
            : `<span class="masonry-caption-title">${p.title}</span>`
          }
          ${p.blurb ? `<p class="masonry-caption-blurb">${p.blurb}</p>` : ''}
        </div>
      </div>
    `).join('') + `</div>`;
  }

  container.innerHTML = html;
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
