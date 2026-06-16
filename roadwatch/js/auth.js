/* ============================================
   auth.js — Sistem Login, Register, Session
   ============================================ */

// Seed akun default (petugas & warga demo)
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

/* ---- Helpers ---- */
function getAllUsers()   { return JSON.parse(localStorage.getItem('rw_users')) || []; }
function getCurrentUser(){ return JSON.parse(sessionStorage.getItem('rw_current')); }
function isLoggedIn()   { return !!getCurrentUser(); }
function isPetugas()    { return getCurrentUser()?.role === 'petugas'; }

/* ---- Register ---- */
function register(nama, email, password, role = 'warga') {
  const users = getAllUsers();
  if (users.find(u => u.email === email)) {
    return { ok: false, msg: 'Email sudah terdaftar.' };
  }
  const newUser = {
    id: 'u_' + Date.now(),
    nama, email, password, role
  };
  users.push(newUser);
  localStorage.setItem('rw_users', JSON.stringify(users));
  return { ok: true, msg: 'Registrasi berhasil! Silakan login.' };
}

/* ---- Login ---- */
function login(email, password) {
  const users = getAllUsers();
  const user  = users.find(u => u.email === email && u.password === password);
  if (!user) return { ok: false, msg: 'Email atau password salah.' };
  sessionStorage.setItem('rw_current', JSON.stringify(user));
  return { ok: true, user };
}

/* ---- Logout ---- */
function logout() {
  sessionStorage.removeItem('rw_current');
  window.location.href = '/index.html';
}

/* ---- Guard: redirect jika belum login ---- */
function requireLogin() {
  if (!isLoggedIn()) {
    alert('Silakan login terlebih dahulu.');
    window.location.href = '/pages/login.html';
  }
}

/* ---- Guard: redirect jika bukan petugas ---- */
function requirePetugas() {
  requireLogin();
  if (!isPetugas()) {
    alert('Halaman ini hanya untuk petugas.');
    window.location.href = '/index.html';
  }
}

/* ---- Update tampilan navbar ---- */
function updateNavbar() {
  const user    = getCurrentUser();
  const navLogin    = document.getElementById('nav-login');
  const navLogout   = document.getElementById('nav-logout');
  const navLapor    = document.getElementById('nav-lapor');
  const navDashboard= document.getElementById('nav-dashboard');

  if (user) {
    if (navLogin)     navLogin.style.display    = 'none';
    if (navLogout)    navLogout.style.display   = 'block';
    if (navLapor)     navLapor.style.display    = 'block';
    if (navDashboard && user.role === 'petugas') navDashboard.style.display = 'block';
  } else {
    if (navLogin)     navLogin.style.display    = 'block';
    if (navLogout)    navLogout.style.display   = 'none';
    if (navLapor)     navLapor.style.display    = 'none';
    if (navDashboard) navDashboard.style.display= 'none';
  }
}

/* ---- Toast notifikasi ---- */
function showToast(msg, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
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
