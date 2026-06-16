/* ============================================
   data.js — CRUD Laporan & Filter
   ============================================ */

const STORAGE_KEY = 'rw_laporan';

/* ---- Seed data contoh ---- */
(function seedContoh() {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  if (existing.length === 0) {
    const contoh = [
      {
        id: 'l1', userId: 'u2', namaWarga: 'Budi Warga', emailWarga: 'warga@roadwatch.id',
        kategori: 'Jalan Berlubang', urgensi: 'Tinggi', status: 'Menunggu',
        deskripsi: 'Lubang besar di tengah jalan, berbahaya untuk pengendara motor.',
        alamat: 'Jl. Ahmad Yani No. 45, Surabaya', lat: -7.2575, lng: 112.7521,
        foto: null, tanggal: new Date(Date.now() - 86400000).toISOString(), catatan: ''
      },
      {
        id: 'l2', userId: 'u2', namaWarga: 'Budi Warga', emailWarga: 'warga@roadwatch.id',
        kategori: 'Lampu Jalan Mati', urgensi: 'Sedang', status: 'Diproses',
        deskripsi: '3 lampu jalan mati sejak seminggu lalu, jalan jadi gelap di malam hari.',
        alamat: 'Jl. Pemuda, Surabaya', lat: -7.2555, lng: 112.7380,
        foto: null, tanggal: new Date(Date.now() - 172800000).toISOString(), catatan: 'Sedang dalam penanganan tim PJU.'
      },
      {
        id: 'l3', userId: 'u2', namaWarga: 'Budi Warga', emailWarga: 'warga@roadwatch.id',
        kategori: 'Got Tersumbat', urgensi: 'Rendah', status: 'Selesai',
        deskripsi: 'Saluran drainase tersumbat sampah, menyebabkan genangan saat hujan.',
        alamat: 'Jl. Basuki Rahmat, Surabaya', lat: -7.2654, lng: 112.7426,
        foto: null, tanggal: new Date(Date.now() - 259200000).toISOString(), catatan: 'Selesai dibersihkan oleh tim kebersihan.'
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contoh));
  }
})();

/* ---- Ambil semua laporan ---- */
function getAllLaporan() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

/* ---- Tambah laporan baru ---- */
function tambahLaporan(data) {
  const laporan = getAllLaporan();
  const newLaporan = {
    id: 'l_' + Date.now(),
    status: 'Menunggu',
    tanggal: new Date().toISOString(),
    catatan: '',
    ...data
  };
  laporan.push(newLaporan);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(laporan));
  return newLaporan;
}

/* ---- Update status laporan (oleh petugas) ---- */
function updateStatus(id, status, catatan = '') {
  const laporan = getAllLaporan();
  const idx = laporan.findIndex(l => l.id === id);
  if (idx === -1) return false;
  laporan[idx].status       = status;
  laporan[idx].catatan      = catatan;
  laporan[idx].updatedAt    = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(laporan));
  return laporan[idx];
}

/* ---- Hapus laporan ---- */
function hapusLaporan(id) {
  const laporan = getAllLaporan().filter(l => l.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(laporan));
}

/* ---- Filter & search laporan ---- */
function filterLaporan({ keyword = '', kategori = '', status = '', urgensi = '', userId = null } = {}) {
  let hasil = getAllLaporan();

  if (userId)   hasil = hasil.filter(l => l.userId === userId);
  if (kategori) hasil = hasil.filter(l => l.kategori === kategori);
  if (status)   hasil = hasil.filter(l => l.status === status);
  if (urgensi)  hasil = hasil.filter(l => l.urgensi === urgensi);
  if (keyword) {
    const q = keyword.toLowerCase();
    hasil = hasil.filter(l =>
      l.deskripsi?.toLowerCase().includes(q) ||
      l.alamat?.toLowerCase().includes(q) ||
      l.kategori?.toLowerCase().includes(q) ||
      l.namaWarga?.toLowerCase().includes(q)
    );
  }
  return hasil.reverse();
}

/* ---- Ambil laporan by ID ---- */
function getLaporanById(id) {
  return getAllLaporan().find(l => l.id === id);
}

/* ---- Format tanggal ---- */
function formatTanggal(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

/* ---- Badge status HTML ---- */
function badgeStatus(status) {
  const map = {
    'Menunggu':  'bg-warning text-dark',
    'Diproses':  'bg-info text-dark',
    'Selesai':   'bg-success',
    'Ditolak':   'bg-danger'
  };
  return `<span class="badge ${map[status] || 'bg-secondary'}">${status}</span>`;
}

/* ---- Badge urgensi HTML ---- */
function badgeUrgensi(urgensi) {
  const map = { 'Tinggi': 'bg-danger', 'Sedang': 'bg-warning text-dark', 'Rendah': 'bg-secondary' };
  return `<span class="badge ${map[urgensi] || 'bg-secondary'}">${urgensi}</span>`;
}
