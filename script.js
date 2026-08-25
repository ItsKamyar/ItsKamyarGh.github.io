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

editBtn?.addEventListener('click', () => {
  document.body.classList.toggle('edit-mode');
  editBtn.classList.toggle('active');
  editBtn.textContent = document.body.classList.contains('edit-mode')
    ? '✓ Done Editing'
    : '✎ Edit Photos';
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
    const dataUrl = reader.result;
    // Apply image
    currentEditEl.style.backgroundImage = `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.65)), url('${dataUrl}')`;
    currentEditEl.style.backgroundSize = 'cover';
    currentEditEl.style.backgroundPosition = 'center top';

    // Save to localStorage
    try {
      localStorage.setItem('itskamyar-' + currentEditKey, dataUrl);
    } catch (err) {
      alert('Could not save image (storage full). Try a smaller photo.');
    }
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
