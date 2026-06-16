/* ============================================
   auth.js — Fix v2: relative paths for GitHub Pages
   ============================================ */

// Deteksi base path otomatis (bekerja di localhost, XAMPP, dan GitHub Pages)
function getBasePath() {
  const path = window.location.pathname;
  // Kalau ada /pages/ di path, naik satu level
  if (path.includes('/pages/')) {
    return path.substring(0, path.indexOf('/pages/')) + '/';
  }
  // Kalau di root
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) return '/';
  // Cek apakah file html ada di root
  if (path.endsWith('.html') || path.endsWith('/')) {
    return path.substring(0, path.lastIndexOf('/') + 1);
  }
  return '/';
}

function goTo(relativePath) {
  const base = getBasePath();
  // Dari pages/ naik ke root dulu kalau perlu
  if (relativePath.startsWith('pages/') && window.location.pathname.includes('/pages/')) {
    window.location.href = '../' + relativePath;
  } else if (!relativePath.startsWith('pages/') && window.location.pathname.includes('/pages/')) {
    window.location.href = '../' + relativePath;
  } else if (relativePath.startsWith('pages/') && !window.location.pathname.includes('/pages/')) {
    window.location.href = relativePath;
  } else {
    window.location.href = relativePath;
  }
}

// Seed akun default
(function seedDefaultUsers() {
  const existing = JSON.parse(localStorage.getItem('rw_users')) || [];
  if (existing.length === 0) {
    const defaults = [
      { id: 'u1', nama: 'Admin Petugas', email: 'petugas@roadwatch.id', password: 'petugas123', role: 'petugas' },
      { id: 'u2', nama: 'Budi Warga',    email: 'warga@roadwatch.id',   password: 'warga123',   role: 'warga'   }
    ];
    localStorage.setItem('rw_users', JSON.stringify(defaults));
  }
})();

function getAllUsers()    { return JSON.parse(localStorage.getItem('rw_users')) || []; }
function getCurrentUser(){ return JSON.parse(sessionStorage.getItem('rw_current')); }
function isLoggedIn()    { return !!getCurrentUser(); }
function isPetugas()     { return getCurrentUser()?.role === 'petugas'; }

function register(nama, email, password, role = 'warga') {
  const users = getAllUsers();
  if (users.find(u => u.email === email)) return { ok: false, msg: 'Email sudah terdaftar.' };
  const newUser = { id: 'u_' + Date.now(), nama, email, password, role };
  users.push(newUser);
  localStorage.setItem('rw_users', JSON.stringify(users));
  return { ok: true, msg: 'Registrasi berhasil! Silakan login.' };
}

function login(email, password) {
  const users = getAllUsers();
  const user  = users.find(u => u.email === email && u.password === password);
  if (!user) return { ok: false, msg: 'Email atau password salah.' };
  sessionStorage.setItem('rw_current', JSON.stringify(user));
  return { ok: true, user };
}

// FIX UTAMA: logout pakai relative path, bukan absolute /
function logout() {
  sessionStorage.removeItem('rw_current');
  // Deteksi apakah sedang di subfolder /pages/
  if (window.location.pathname.includes('/pages/')) {
    window.location.href = '../index.html';
  } else {
    window.location.href = 'index.html';
  }
}

function requireLogin() {
  if (!isLoggedIn()) {
    alert('Silakan login terlebih dahulu.');
    if (window.location.pathname.includes('/pages/')) {
      window.location.href = 'login.html';
    } else {
      window.location.href = 'pages/login.html';
    }
  }
}

function requirePetugas() {
  requireLogin();
  if (!isPetugas()) {
    alert('Halaman ini hanya untuk petugas.');
    if (window.location.pathname.includes('/pages/')) {
      window.location.href = '../index.html';
    } else {
      window.location.href = 'index.html';
    }
  }
}

function updateNavbar() {
  const user         = getCurrentUser();
  const navLogin     = document.getElementById('nav-login');
  const navLogout    = document.getElementById('nav-logout');
  const navLapor     = document.getElementById('nav-lapor');
  const navDashboard = document.getElementById('nav-dashboard');
  const navRiwayat   = document.getElementById('nav-riwayat');

  if (user) {
    if (navLogin)     navLogin.style.display     = 'none';
    if (navLogout)    navLogout.style.display    = 'list-item';
    if (navLapor)     navLapor.style.display     = 'list-item';
    if (navRiwayat)   navRiwayat.style.display   = 'list-item';
    if (navDashboard) navDashboard.style.display = user.role === 'petugas' ? 'list-item' : 'none';
  } else {
    if (navLogin)     navLogin.style.display     = 'list-item';
    if (navLogout)    navLogout.style.display    = 'none';
    if (navLapor)     navLapor.style.display     = 'none';
    if (navRiwayat)   navRiwayat.style.display   = 'none';
    if (navDashboard) navDashboard.style.display = 'none';
  }
}

function showToast(msg, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
  }
  const id = 'toast_' + Date.now();
  container.insertAdjacentHTML('beforeend', `
    <div id="${id}" class="toast align-items-center text-white bg-${type} border-0 show mb-2" role="alert">
      <div class="d-flex">
        <div class="toast-body">${msg}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" onclick="document.getElementById('${id}').remove()"></button>
      </div>
    </div>
  `);
  setTimeout(() => document.getElementById(id)?.remove(), 3500);
}
