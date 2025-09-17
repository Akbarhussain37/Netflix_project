// Guard (left relaxed for local preview)
(function () {
  const u = localStorage.getItem('nf_user');
  // if (!u) window.location.href = 'index.html';
})();

const slidesEl = document.getElementById('slides');
const dotsEl = document.getElementById('dots');
const rowsEl = document.getElementById('rows');
const logoutBtn = document.getElementById('logout');
const searchInput = document.getElementById('search');

const modal = document.getElementById('video-modal');
const closeBtn = document.getElementById('close-video');
const player = document.getElementById('player');

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('nf_user');
  window.location.href = 'index.html';
});

/* ---------------------------
   Related, open-license videos
   --------------------------- */
const VIDEOS = {
  ACTION:   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  FANTASY:  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  COMEDY:   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  DRAMA:    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
};

// Carousel with 3 distinct images + related videos
const featured = [
  { title: 'Squid Games',   img: './asserts/carousel1.jpeg', desc: 'High-stakes survival.',         video: VIDEOS.ACTION },
  { title: 'Featured Two',  img: './asserts/carousel2.jpeg', desc: 'Fantasy quest awakens.',       video: VIDEOS.FANTASY },
  { title: 'Featured Three',img: './asserts/carousel3.jpeg', desc: 'Light-hearted adventure.',     video: VIDEOS.COMEDY },
];

// Only 3 categories with related trailers
const catalogue = {
  'Trending Now': [
    { name: 'The Witcher',         img: './asserts/witcher.jpeg',          video: VIDEOS.FANTASY },
    { name: 'Black Clover',        img: './asserts/blackclover.jpeg',      video: VIDEOS.FANTASY },
    { name: 'Peaky Blinders',      img: './asserts/PeakyBlinders.jpeg',    video: VIDEOS.DRAMA },
    { name: 'Business Proposal',   img: './asserts/BusinessProposal.jpeg', video: VIDEOS.COMEDY },
    { name: 'Lucifer',             img: './asserts/Lucifer.jpeg',          video: VIDEOS.ACTION },
  ],
  'Action': [
    { name: 'Edge Strike',   img: './asserts/EdgeStrike.jpeg',   video: VIDEOS.ACTION },
    { name: 'Neon Chase',    img: './asserts/NeonChase.jpeg',    video: VIDEOS.ACTION },
    { name: 'Skyfall Ops',   img: './asserts/SkyfallOps.jpeg',   video: VIDEOS.ACTION },
    { name: 'Crimson Tide',  img: './asserts/CrimsonTide.jpeg',  video: VIDEOS.ACTION },
    { name: 'Lift',          img: './asserts/lift.jpeg',         video: VIDEOS.ACTION },
  ],
  'Comedy': [
    { name: 'Laugh Track',   img: './asserts/LaughTrack.jpeg',   video: VIDEOS.COMEDY },
    { name: 'Sunny Side',    img: './asserts/SunnySide.jpeg',    video: VIDEOS.COMEDY },
    { name: 'Odd Couple',    img: './asserts/OddCouple.jpeg',    video: VIDEOS.COMEDY },
    { name: 'Office Pranks', img: './asserts/OfficePranks.jpeg', video: VIDEOS.COMEDY },
    { name: 'Hit Man',       img: './asserts/HitMan.jpeg',       video: VIDEOS.COMEDY },
  ],
};

/* ------------ Video modal ------------ */
function openVideo(url, poster) {
  if (!url) return;
  if (poster) player.setAttribute('poster', poster);
  player.src = url;
  player.currentTime = 0;
  player.play().catch(() => {});
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
}
function closeVideo() {
  player.pause();
  player.removeAttribute('src');
  player.removeAttribute('poster');
  player.load();
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
}
closeBtn.addEventListener('click', closeVideo);
modal.addEventListener('click', (e) => { if (e.target === modal) closeVideo(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeVideo(); });

/* ------------ Carousel ------------ */
let idx = 0;
function renderSlides() {
  slidesEl.innerHTML = '';
  dotsEl.innerHTML = '';
  featured.forEach((f, i) => {
    const s = document.createElement('div');
    s.className = 'slide';
    s.style.backgroundImage = `url(${f.img})`;
    s.innerHTML = `
      <div class="content">
        <h2>${f.title}</h2>
        <p>${f.desc}</p>
        <div class="actions">
          <button class="btn primary">▶ Play</button>
          <button class="btn secondary">More Info</button>
        </div>
      </div>
    `;
    s.querySelector('.btn.primary').addEventListener('click', () => openVideo(f.video, f.img));
    slidesEl.appendChild(s);

    const d = document.createElement('div');
    d.className = 'dot' + (i === idx ? ' active' : '');
    d.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(d);
  });
  updateSlide();
}
function updateSlide() {
  slidesEl.style.transform = `translateX(-${idx * 100}%)`;
  [...dotsEl.children].forEach((el, i) => el.classList.toggle('active', i === idx));
}
function goTo(i) { idx = (i + featured.length) % featured.length; updateSlide(); }
document.querySelector('.nav.prev').addEventListener('click', () => goTo(idx - 1));
document.querySelector('.nav.next').addEventListener('click', () => goTo(idx + 1));
let timer = setInterval(() => goTo(idx + 1), 5000);
slidesEl.addEventListener('pointerdown', () => { clearInterval(timer); });
renderSlides();

/* ------------- Rows ------------- */
function makeCard(item) {
  const card = document.createElement('article');
  card.className = 'card';
  card.tabIndex = 0;
  card.innerHTML = `
    <img src="${item.img}" alt="${item.name}" loading="lazy" />
    <div class="overlay">
      <button class="play">▶ Play</button>
    </div>
    <div class="title">${item.name}</div>
  `;
  card.querySelector('.play').addEventListener('click', () => openVideo(item.video, item.img));
  return card;
}

function renderRows(data) {
  rowsEl.innerHTML = '';
  Object.entries(data).forEach(([label, items]) => {
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `<h3>${label}</h3>`;
    const scroller = document.createElement('div');
    scroller.className = 'scroller';
    items.forEach(it => scroller.appendChild(makeCard(it)));
    row.appendChild(scroller);
    rowsEl.appendChild(row);
  });
}
renderRows(catalogue);

/* ------ Search (within the 3 categories) ------ */
searchInput.addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase().trim();
  if (!q) { renderRows(catalogue); return; }
  const filtered = {};
  Object.entries(catalogue).forEach(([label, items]) => {
    const f = items.filter(it => it.name.toLowerCase().includes(q));
    if (f.length) filtered[label] = f;
  });
  renderRows(filtered);
});
