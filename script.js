// ========== THREE.JS BACKGROUND ==========
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

camera.position.z = 30;

// Particles - R6S orange / dark theme
const particlesCount = 1100;
const positions = new Float32Array(particlesCount * 3);
const colors = new Float32Array(particlesCount * 3);

const color1 = new THREE.Color(0xff6b00);
const color2 = new THREE.Color(0xe63900);
const color3 = new THREE.Color(0x555555);

for (let i = 0; i < particlesCount; i++) {
  const i3 = i * 3;
  positions[i3] = (Math.random() - 0.5) * 80;
  positions[i3 + 1] = (Math.random() - 0.5) * 80;
  positions[i3 + 2] = (Math.random() - 0.5) * 60;

  const mixedColor = Math.random() > 0.55 ? color1 : (Math.random() > 0.45 ? color2 : color3);
  colors[i3] = mixedColor.r;
  colors[i3 + 1] = mixedColor.g;
  colors[i3 + 2] = mixedColor.b;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
  size: 0.11,
  vertexColors: true,
  transparent: true,
  opacity: 0.75,
  sizeAttenuation: true
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// Floating wireframe shapes
const shapes = [];
const shapeGeo = new THREE.IcosahedronGeometry(0.55, 0);
const shapeMat = new THREE.MeshBasicMaterial({
  color: 0xff6b00,
  wireframe: true,
  transparent: true,
  opacity: 0.22
});

for (let i = 0; i < 7; i++) {
  const mesh = new THREE.Mesh(shapeGeo, shapeMat.clone());
  mesh.position.set(
    (Math.random() - 0.5) * 40,
    (Math.random() - 0.5) * 30,
    (Math.random() - 0.5) * 20
  );
  mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
  scene.add(mesh);
  shapes.push(mesh);
}

// Mouse parallax
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
  requestAnimationFrame(animate);

  particles.rotation.y += 0.0007;
  particles.rotation.x += 0.00025;

  shapes.forEach((shape, i) => {
    shape.rotation.x += 0.0035 + i * 0.0004;
    shape.rotation.y += 0.005 + i * 0.0003;
  });

  camera.position.x += (mouseX * 2.5 - camera.position.x) * 0.03;
  camera.position.y += (mouseY * 1.8 - camera.position.y) * 0.03;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ========== 3D CARD TILT ==========
document.querySelectorAll('.card-3d').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -11;
    const rotateY = ((x - centerX) / centerX) * 11;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
  });
});

// ========== NAV ACTIVE STATE ==========
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// ========== MOBILE MENU ==========
const menuToggle = document.querySelector('.menu-toggle');
const navLinksContainer = document.querySelector('.nav-links');

menuToggle?.addEventListener('click', () => {
  navLinksContainer.classList.toggle('open');
  menuToggle.classList.toggle('active');
});

const style = document.createElement('style');
style.textContent = `
  @media (max-width: 900px) {
    .nav-links.open {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      background: rgba(10, 10, 12, 0.96);
      padding: 1.5rem;
      gap: 1.2rem;
      border-bottom: 1px solid rgba(255, 107, 0, 0.15);
    }
    .menu-toggle.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    .menu-toggle.active span:nth-child(2) {
      opacity: 0;
    }
    .menu-toggle.active span:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
    }
  }
`;
document.head.appendChild(style);

// ========== CONTACT FORM ==========
document.getElementById('contact-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  const original = btn.textContent;
  btn.textContent = 'SENT ✓';
  btn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = '';
    e.target.reset();
  }, 2500);
});

// ========== INTERSECTION OBSERVER ==========
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card-3d, .map-card, .about-content, .contact-form').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(40px)';
  el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  observer.observe(el);
});

// ========== VIDEO UPLOAD ==========
const uploadZone = document.getElementById('upload-zone');
const videoInput = document.getElementById('video-input');
const browseBtn = document.getElementById('browse-btn');
const clipsGallery = document.getElementById('clips-gallery');
const uploadStatus = document.getElementById('upload-status');

let uploadedClips = [];

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function addClip(file) {
  if (!file.type.startsWith('video/')) {
    uploadStatus.textContent = '⚠️ Only video files are allowed.';
    return;
  }

  const url = URL.createObjectURL(file);
  const id = Date.now() + Math.random().toString(36).slice(2);

  const clip = {
    id,
    name: file.name,
    size: file.size,
    url
  };

  uploadedClips.push(clip);
  renderClips();
  uploadStatus.textContent = `✓ Added: ${file.name}`;
  setTimeout(() => {
    if (uploadStatus.textContent.includes(file.name)) {
      uploadStatus.textContent = '';
    }
  }, 3000);
}

function removeClip(id) {
  const clip = uploadedClips.find(c => c.id === id);
  if (clip) {
    URL.revokeObjectURL(clip.url);
  }
  uploadedClips = uploadedClips.filter(c => c.id !== id);
  renderClips();
  uploadStatus.textContent = 'Clip removed.';
  setTimeout(() => uploadStatus.textContent = '', 2000);
}

function renderClips() {
  if (uploadedClips.length === 0) {
    clipsGallery.innerHTML = '<p class="empty-clips">No clips uploaded yet. Drop your best Siege highlights above.</p>';
    return;
  }

  clipsGallery.innerHTML = uploadedClips.map(clip => `
    <div class="clip-card" data-id="${clip.id}">
      <video src="${clip.url}" controls preload="metadata"></video>
      <div class="clip-info">
        <div>
          <h4 title="${clip.name}">${clip.name}</h4>
          <span class="clip-meta">${formatSize(clip.size)}</span>
        </div>
        <button class="clip-remove" onclick="window.removeClipById('${clip.id}')" title="Remove">✕</button>
      </div>
    </div>
  `).join('');
}

// Expose for inline onclick
window.removeClipById = removeClip;

// Browse button
browseBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  videoInput.click();
});

// Click on zone
uploadZone?.addEventListener('click', () => {
  videoInput.click();
});

// File input change
videoInput?.addEventListener('change', () => {
  const files = Array.from(videoInput.files || []);
  files.forEach(addClip);
  videoInput.value = '';
});

// Drag & drop
uploadZone?.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadZone.classList.add('dragover');
});

uploadZone?.addEventListener('dragleave', () => {
  uploadZone.classList.remove('dragover');
});

uploadZone?.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadZone.classList.remove('dragover');
  const files = Array.from(e.dataTransfer.files || []);
  files.forEach(addClip);
});

// Initial empty state
renderClips();

// ========== CUSTOM PHOTO EDITOR ==========
const editBtn = document.getElementById('edit-mode-btn');
const photoInput = document.getElementById('photo-input');
let currentEditKey = null;
let currentEditEl = null;

// Admin password for Edit Photos (change this to your own secret)
const ADMIN_PASSWORD = 'ItsKamyar2026';

editBtn?.addEventListener('click', () => {
  // If already in edit mode → just exit
  if (document.body.classList.contains('edit-mode')) {
    document.body.classList.remove('edit-mode');
    editBtn.classList.remove('active');
    editBtn.textContent = '✎ Edit Photos';
    sessionStorage.removeItem('itskamyar-edit-unlocked');
    return;
  }

  // Already unlocked this session?
  if (sessionStorage.getItem('itskamyar-edit-unlocked') === '1') {
    document.body.classList.add('edit-mode');
    editBtn.classList.add('active');
    editBtn.textContent = '✓ Done Editing';
    return;
  }

  // Ask for password
  const pass = prompt('Enter admin password to edit photos:');
  if (pass === null) return; // cancelled

  if (pass === ADMIN_PASSWORD) {
    sessionStorage.setItem('itskamyar-edit-unlocked', '1');
    document.body.classList.add('edit-mode');
    editBtn.classList.add('active');
    editBtn.textContent = '✓ Done Editing';
  } else {
    alert('Wrong password. Only the site owner can edit photos.');
  }
});

document.querySelectorAll('.change-photo-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    currentEditKey = btn.dataset.key;
    // Find the image element related to this button
    if (btn.classList.contains('map-btn')) {
      currentEditEl = btn.closest('.map-card')?.querySelector('.map-visual');
    } else {
      currentEditEl = btn.closest('.card-front')?.querySelector('.card-img');
    }
    photoInput.click();
  });
});

photoInput?.addEventListener('change', () => {
  const file = photoInput.files?.[0];
  if (!file || !file.type.startsWith('image/') || !currentEditKey || !currentEditEl) {
    photoInput.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      // Compress: max width 900px, JPEG quality 0.72
      const MAX_W = 900;
      let w = img.width;
      let h = img.height;
      if (w > MAX_W) {
        h = Math.round(h * (MAX_W / w));
        w = MAX_W;
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.72);

      currentEditEl.style.backgroundImage = `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.65)), url('${dataUrl}')`;
      currentEditEl.style.backgroundSize = 'cover';
      currentEditEl.style.backgroundPosition = 'center top';

      try {
        localStorage.setItem('itskamyar-' + currentEditKey, dataUrl);
      } catch (err) {
        // Still full: apply for this session only
        console.warn('localStorage full', err);
        alert('Storage almost full. Photo applied for this session only. Try clearing old photos or use a smaller image.');
      }
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
  photoInput.value = '';
});

// Restore saved images on load
function restoreCustomPhotos() {
  document.querySelectorAll('.change-photo-btn').forEach(btn => {
    const key = btn.dataset.key;
    const saved = localStorage.getItem('itskamyar-' + key);
    if (!saved) return;

    let target = null;
    if (btn.classList.contains('map-btn')) {
      target = btn.closest('.map-card')?.querySelector('.map-visual');
    } else {
      target = btn.closest('.card-front')?.querySelector('.card-img');
    }
    if (target) {
      target.style.backgroundImage = `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.65)), url('${saved}')`;
      target.style.backgroundSize = 'cover';
      target.style.backgroundPosition = 'center top';
    }
  });
}

restoreCustomPhotos();

// ========== OPERATOR TABS ==========
document.querySelectorAll('.op-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.op-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const side = tab.dataset.side;
    document.querySelectorAll('.card-3d[data-side]').forEach(card => {
      if (side === 'all' || card.dataset.side === side) {
        card.classList.remove('hidden-side');
      } else {
        card.classList.add('hidden-side');
      }
    });
  });
});

// ========== COMMENTS (localStorage) ==========
const commentForm = document.getElementById('comment-form');
const commentsList = document.getElementById('comments-list');
const COMMENTS_KEY = 'itskamyar-comments';

function loadComments() {
  let comments = [];
  try {
    comments = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '[]');
  } catch (e) {}
  if (!comments.length) {
    commentsList.innerHTML = '<p class="comment-empty">No comments yet. Be the first!</p>';
    return;
  }
  commentsList.innerHTML = comments.map(c => `
    <div class="comment-item">
      <div class="comment-header">
        <span class="comment-author">${escapeHtml(c.name)}</span>
        <span class="comment-time">${c.time}</span>
      </div>
      <div class="comment-body">${escapeHtml(c.text)}</div>
    </div>
  `).join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

commentForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('comment-name').value.trim();
  const text = document.getElementById('comment-text').value.trim();
  if (!name || !text) return;

  let comments = [];
  try {
    comments = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '[]');
  } catch (e) {}

  comments.unshift({
    name,
    text,
    time: new Date().toLocaleString()
  });
  // Keep last 50
  comments = comments.slice(0, 50);
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
  commentForm.reset();
  loadComments();
});

loadComments();

// ========== ONLINE / VISIT COUNTER ==========
// Visit counter (local + optional public API)
const visitEl = document.getElementById('visit-count');
const onlineEl = document.getElementById('online-count');

function updateVisitCount() {
  let visits = parseInt(localStorage.getItem('itskamyar-visits') || '0', 10);
  visits += 1;
  localStorage.setItem('itskamyar-visits', String(visits));
  if (visitEl) visitEl.textContent = visits;

  // Try public free counter (optional, fails silently)
  fetch('https://api.countapi.xyz/hit/itskamyar-r6s/visits')
    .then(r => r.json())
    .then(d => { if (visitEl && d.value) visitEl.textContent = d.value; })
    .catch(() => {});
}

// Simulated "online" based on recent activity in this browser + small random
function updateOnlineCount() {
  const now = Date.now();
  localStorage.setItem('itskamyar-last-active', String(now));
  // Base 1 (you) + small variation for demo feel
  const base = 1 + Math.floor(Math.random() * 3);
  if (onlineEl) onlineEl.textContent = base;
}

updateVisitCount();
updateOnlineCount();
setInterval(updateOnlineCount, 20000);

// ========== OPERATORS FROM TIER LISTS ==========
const OPERATORS = [
  // ATTACKERS - S
  { name: 'Ace', side: 'atk', tier: 'S', org: 'NIGHTHAVEN', ability: 'S.E.L.M.A. Aqua Breacher — hard breach device that creates line of sight holes.' },
  { name: 'Dokkaebi', side: 'atk', tier: 'S', org: '707th SMB', ability: 'Logic Bomb — calls enemy phones, reveals positions and distracts.' },
  { name: 'Grim', side: 'atk', tier: 'S', org: 'NIGHTHAVEN', ability: 'Kawan Hive Launcher — deploys tracking insects that reveal enemies.' },
  { name: 'Montagne', side: 'atk', tier: 'S', org: 'GIGN', ability: 'Extendable Shield — full-body coverage for entry and plant protection.' },
  { name: 'Nomad', side: 'atk', tier: 'S', org: 'GIGR', ability: 'Airjab Launcher — repulsion grenades that knock back enemies.' },
  { name: 'Ram', side: 'atk', tier: 'S', org: 'NIGHTHAVEN', ability: 'BU-GI Auto-Breacher — robotic device that destroys floors above.' },
  { name: 'Solid Snake', side: 'atk', tier: 'S', org: 'FOXHOUND', ability: 'Cardboard Box / stealth tools — infiltration and intel (crossover).' },
  { name: 'Striker', side: 'atk', tier: 'S', org: 'ROS', ability: 'Flexible loadout — customizable primary gadgets for any role.' },
  // ATTACKERS - A
  { name: 'Ash', side: 'atk', tier: 'A', org: 'FBI SWAT', ability: 'M120 CREM — breaching rounds that destroy soft walls and gadgets.' },
  { name: 'Blackbeard', side: 'atk', tier: 'A', org: 'Navy SEALs', ability: 'Rifle-Shield — ballistic shield on primary weapon.' },
  { name: 'Deimos', side: 'atk', tier: 'A', org: 'Unknown', ability: 'Deathmark Tracker — marks and hunts a chosen target.' },
  { name: 'Lion', side: 'atk', tier: 'A', org: 'GIGN', ability: 'EE-ONE-D — drone scan that reveals moving enemies.' },
  { name: 'Maverick', side: 'atk', tier: 'A', org: 'GSUTR', ability: 'Breaching Torch — silently creates peep holes in reinforced walls.' },
  { name: 'Thatcher', side: 'atk', tier: 'A', org: 'SAS', ability: 'EMP Grenade — disables electronic gadgets in radius.' },
  { name: 'Twitch', side: 'atk', tier: 'A', org: 'GIGN', ability: 'Shock Drone — destroys gadgets and gathers intel remotely.' },
  { name: 'Ying', side: 'atk', tier: 'A', org: 'SDU', ability: 'Candela — cluster flash charges that blind defenders.' },
  { name: 'Zofia', side: 'atk', tier: 'A', org: 'GROM', ability: 'KS79 LIFELINE — impact grenades and concussions.' },
  { name: 'Blitz', side: 'atk', tier: 'A', org: 'GSG 9', ability: 'Flash Shield — blinding flashes while advancing with shield.' },
  // ATTACKERS - B
  { name: 'Brava', side: 'atk', tier: 'B', org: 'BOPE', ability: 'Kludge Drone — hacks defender gadgets to turn them friendly.' },
  { name: 'Buck', side: 'atk', tier: 'B', org: 'JTF2', ability: 'Skeleton Key — underbarrel shotgun for soft destruction.' },
  { name: 'Capitao', side: 'atk', tier: 'B', org: 'BOPE', ability: 'Tactical Crossbow — fire and smoke bolts for area control.' },
  { name: 'Flores', side: 'atk', tier: 'B', org: 'Unauthorized', ability: 'RCE-Ratero Charge — remote explosive drone.' },
  { name: 'Finka', side: 'atk', tier: 'B', org: 'Spetsnaz', ability: 'Adrenal Surge — team-wide health boost and revive assist.' },
  { name: 'Gridlock', side: 'atk', tier: 'B', org: 'SASR', ability: 'Trax Stingers — area denial spikes that slow enemies.' },
  { name: 'Hibana', side: 'atk', tier: 'B', org: 'SAT', ability: 'X-KAIROS — pellet charges that open reinforced walls.' },
  { name: 'IQ', side: 'atk', tier: 'B', org: 'GSG 9', ability: 'Electronics Detector — sees gadgets through walls.' },
  { name: 'Thermite', side: 'atk', tier: 'B', org: 'FBI SWAT', ability: 'Exothermic Charge — large hard-breach openings.' },
  // ATTACKERS - C
  { name: 'Osa', side: 'atk', tier: 'C', org: 'NIGHTHAVEN', ability: 'TALON-8 Clear Shield — deployable transparent hard shield.' },
  // ATTACKERS - D
  { name: 'Amaru', side: 'atk', tier: 'D', org: 'APCA', ability: 'Garra Hook — grapple to windows and hatches quickly.' },
  { name: 'Fuze', side: 'atk', tier: 'D', org: 'Spetsnaz', ability: 'Cluster Charge — explosive clusters through soft surfaces.' },
  { name: 'Glaz', side: 'atk', tier: 'D', org: 'Spetsnaz', ability: 'Flip Sight — thermal scope through smoke.' },
  { name: 'Kali', side: 'atk', tier: 'D', org: 'NIGHTHAVEN', ability: 'LV Explosive Lance — long-range soft/hard utility destruction.' },
  { name: 'Rauora', side: 'atk', tier: 'D', org: 'NZSAT', ability: 'D.O.T. Shield — deployable door soft-destruction shield.' },
  { name: 'Sens', side: 'atk', tier: 'D', org: 'SFG', ability: 'R.O.U. Projector System — light walls that block vision.' },
  { name: 'Sledge', side: 'atk', tier: 'D', org: 'SAS', ability: 'Tactical Breaching Hammer — destroys soft walls and floors.' },
  { name: 'Zero', side: 'atk', tier: 'D', org: 'ROS', ability: 'Argus Launcher — cameras that punch through walls.' },
  // ATTACKERS - E
  { name: 'Iana', side: 'atk', tier: 'E', org: 'REU', ability: 'Gemini Replicator — holographic decoy of herself.' },
  { name: 'Jackal', side: 'atk', tier: 'E', org: 'GEO', ability: 'Eyenox Model III — tracks enemy footprints.' },
  { name: 'Nøkk', side: 'atk', tier: 'E', org: 'Jaeger Corps', ability: 'HEL Presence Reduction — reduces residual traces and is harder to see on cams.' },

  // DEFENDERS - S
  { name: 'Azami', side: 'def', tier: 'S', org: 'Unaffiliated', ability: 'Kiba Barrier — throwable barriers that harden into cover.' },
  { name: 'Clash', side: 'def', tier: 'S', org: 'GSUTR', ability: 'CCE Shield — taser shield that slows and damages attackers.' },
  { name: 'Melusi', side: 'def', tier: 'S', org: 'Inkaba Task Force', ability: 'Banshee Sonic Defense — slows enemies in radius.' },
  { name: 'Mira', side: 'def', tier: 'S', org: 'GEO', ability: 'Black Mirror — one-way bulletproof window.' },
  { name: 'Kaid', side: 'def', tier: 'S', org: 'GIGR', ability: 'Rtila Electroclaw — electrifies hatches and reinforced walls.' },
  { name: 'Thorn', side: 'def', tier: 'S', org: 'GARDA', ability: 'Razorbloom Shell — proximity explosive that launches blades.' },
  { name: 'Tubarão', side: 'def', tier: 'S', org: 'ITF', ability: 'Zoto Canister — freezes area, disables electronics and slows.' },
  { name: 'Aruni', side: 'def', tier: 'S', org: 'NIGHTHAVEN', ability: 'Surya Gate — laser gates that damage and destroy projectiles.' },
  { name: 'Skopós', side: 'def', tier: 'S', org: 'Greek Unit', ability: 'Advanced defensive gadget (tier S utility).' },
  { name: 'Denari', side: 'def', tier: 'S', org: 'Nighthaven', ability: 'T.R.I.P. Connector — deploys devices that form laser webs; attackers take damage and are slowed when crossing lasers. Defenders pass safely.' },
  // DEFENDERS - A
  { name: 'Echo', side: 'def', tier: 'A', org: 'SAT', ability: 'Yokai — floating drone with disorienting ultrasonic bursts.' },
  { name: 'Fenrir', side: 'def', tier: 'A', org: 'Unaffiliated', ability: 'F-NATT Dread Mine — fear gas that limits vision.' },
  { name: 'Goyo', side: 'def', tier: 'A', org: 'FES', ability: 'Volcán Shield — exploding incendiary shield.' },
  { name: 'Smoke', side: 'def', tier: 'A', org: 'SAS', ability: 'Remote Gas Grenade — toxic area denial.' },
  { name: 'Solis', side: 'def', tier: 'A', org: 'APCA', ability: 'SPEC-IO Electro-Sensor — detects electronics and movement.' },
  { name: 'Valkyrie', side: 'def', tier: 'A', org: 'Navy SEALs', ability: 'Black Eye — sticky cameras for intel.' },
  { name: 'Vigil', side: 'def', tier: 'A', org: '707th SMB', ability: 'ERC-7 — wipes himself from defender cameras/drones.' },
  { name: 'Wamai', side: 'def', tier: 'A', org: 'NIGHTHAVEN', ability: 'MAG-NET — attracts and captures projectiles.' },
  // DEFENDERS - B
  { name: 'Bandit', side: 'def', tier: 'B', org: 'GSG 9', ability: 'Crude Electrical Device — electrifies walls, destroys breach gadgets.' },
  { name: 'Kapkan', side: 'def', tier: 'B', org: 'Spetsnaz', ability: 'Entry Denial Device — door/window frame explosives.' },
  { name: 'Lesion', side: 'def', tier: 'B', org: 'SDU', ability: 'Gu Mines — poison mines that damage and slow.' },
  { name: 'Mozzie', side: 'def', tier: 'B', org: 'SASR', ability: 'Pest — hacks attacker drones for defender use.' },
  { name: 'Pulse', side: 'def', tier: 'B', org: 'FBI SWAT', ability: 'Heartbeat Sensor — detects nearby heartbeats through walls.' },
  { name: 'Warden', side: 'def', tier: 'B', org: 'Secret Service', ability: 'Glance Smart Glasses — sees through smoke and resists flashes.' },
  { name: 'Jäger', side: 'def', tier: 'B', org: 'GSG 9', ability: 'Active Defense System — intercepts grenades and projectiles.' },
  // DEFENDERS - C
  { name: 'Alibi', side: 'def', tier: 'C', org: 'GIS', ability: 'Prisma — holographic decoys that ping attackers who shoot them.' },
  { name: 'Castle', side: 'def', tier: 'C', org: 'FBI SWAT', ability: 'Armor Panel — reinforces doors and windows.' },
  { name: 'Ela', side: 'def', tier: 'C', org: 'GROM', ability: 'Grzmot Mine — concussion proximity mines.' },
  { name: 'Maestro', side: 'def', tier: 'C', org: 'GIS', ability: 'Evil Eye — bulletproof camera with laser.' },
  { name: 'Frost', side: 'def', tier: 'C', org: 'JTF2', ability: 'Welcome Mat — floor traps that down attackers.' },
  { name: 'Thunderbird', side: 'def', tier: 'C', org: 'Unaffiliated', ability: 'Kóna Station — heal stations for defenders.' },
  // DEFENDERS - D
  { name: 'Doc', side: 'def', tier: 'D', org: 'GIGN', ability: 'Stim Pistol — heals/overheals teammates from range.' },
  { name: 'Oryx', side: 'def', tier: 'D', org: 'Unaffiliated', ability: 'Remah Dash — breaks soft walls and climbs hatches fast.' },
  { name: 'Tachanka', side: 'def', tier: 'D', org: 'Spetsnaz', ability: 'Shumikha Launcher — incendiary grenade launcher + turret.' },
  { name: 'Caveira', side: 'def', tier: 'D', org: 'BOPE', ability: 'Silent Step + Interrogation — silent movement and intel from downs.' },
  { name: 'Sentry', side: 'def', tier: 'D', org: 'ROS', ability: 'Flexible defender loadout — customizable gadgets.' },
  { name: 'Rook', side: 'def', tier: 'D', org: 'GIGN', ability: 'Armor Pack — armor plates for the whole team.' },
];

function tierColor(t) {
  const map = { S: '#ff3b3b', A: '#ff8c00', B: '#e6d600', C: '#7cff6b', D: '#6bb3ff', E: '#c77dff' };
  return map[t] || '#888';
}

function renderOperators() {
  const gallery = document.getElementById('operators-gallery');
  if (!gallery) return;

  gallery.innerHTML = OPERATORS.map(op => {
    const key = 'op-' + op.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const sideLabel = op.side === 'atk' ? 'ATK' : 'DEF';
    const sideClass = op.side === 'atk' ? 'atk' : 'def';
    return `
      <div class="card-3d" data-side="${op.side}" data-tier="${op.tier}">
        <div class="card-inner">
          <div class="card-front">
            <div class="card-img" style="background:linear-gradient(160deg,#111,#1a1a24 40%,#0d0d12);display:flex;align-items:center;justify-content:center;">
              <span style="font-family:Orbitron,sans-serif;font-size:1.6rem;color:${tierColor(op.tier)};text-shadow:0 0 20px ${tierColor(op.tier)}">${op.tier}</span>
            </div>
            <div class="op-badge ${sideClass}">${sideLabel}</div>
            <div class="tier-badge" style="background:${tierColor(op.tier)}">${op.tier}</div>
            <h3>${op.name}</h3>
            <p>${op.org}</p>
            <button class="change-photo-btn" data-key="${key}">📷</button>
          </div>
          <div class="card-back">
            <h3>${op.name}</h3>
            <p class="op-role">${sideLabel} • Tier ${op.tier}</p>
            <p><strong>Ability:</strong> ${op.ability}</p>
            <span class="tag">Tier ${op.tier}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Re-bind change photo buttons
  document.querySelectorAll('.change-photo-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      currentEditKey = btn.dataset.key;
      if (btn.classList.contains('map-btn')) {
        currentEditEl = btn.closest('.map-card')?.querySelector('.map-visual');
      } else {
        currentEditEl = btn.closest('.card-front')?.querySelector('.card-img');
      }
      photoInput?.click();
    });
  });

  // Re-bind tilt
  document.querySelectorAll('.card-3d').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (document.body.classList.contains('edit-mode')) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -11;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 11;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
  });

  restoreCustomPhotos();
}

renderOperators();
