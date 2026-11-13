// State Aplikasi (Mendukung Dana Umum, Dana Darurat, dan Laptop Impian)
let state = {
    totalBalance: 5250000,
    activeTargetKey: 'darurat',
    targets: {
        umum: {
            name: 'Tabungan Umum',
            current: 5250000,
            max: 0,
            icon: '🎀'
        },
        darurat: {
            name: 'Dana Darurat',
            current: 3000000,
            max: 10000000,
            amountId: 'darurat-amount',
            progressId: 'darurat-progress',
            percentId: 'darurat-percent',
            icon: '🦢'
        },
        laptop: {
            name: 'Laptop Impian',
            current: 2250000,
            max: 7500000,
            amountId: 'laptop-amount',
            progressId: 'laptop-progress',
            percentId: 'laptop-percent',
            icon: '💻'
        }
    },
    inputNominal: 0
};

// Formatting Rupiah
const formatRupiah = (angka) => 'Rp' + angka.toLocaleString('id-ID');

// DOM Elements
const modalSetor = document.getElementById('modal-setor');
const modalSukses = document.getElementById('modal-sukses');
const inputNominal = document.getElementById('input-nominal');
const btnKonfirmasi = document.getElementById('btn-konfirmasi');
const chipButtons = document.querySelectorAll('.btn-chip[data-nominal]');

// Buka Modal Setor berdasarkan target yang diklik
function openSetorModal(targetKey) {
    state.activeTargetKey = targetKey;
    state.inputNominal = 0;

    const target = state.targets[targetKey];
    const currentDisplay = targetKey === 'umum' ? state.totalBalance : target.current;

    document.getElementById('preview-tujuan').innerText = target.name;
    document.getElementById('preview-saldo').innerText = formatRupiah(currentDisplay);

    if (inputNominal) inputNominal.value = '';
    updatePreview();
    resetChips();

    if (modalSetor) modalSetor.showModal();
}

// Tutup Modal Setor
function closeSetorModal() {
    if (modalSetor) modalSetor.close();
}

// Interaksi Tombol Chip (Nominal Cepat)
function setNominal(amount, targetElement) {
    state.inputNominal = amount;
    if (inputNominal) inputNominal.value = amount;
    updatePreview();

    resetChips();
    if (targetElement) targetElement.classList.add('active');
}

function resetChips() {
    chipButtons.forEach(btn => btn.classList.remove('active'));
}

// Validasi Input Nominal Manual
if (inputNominal) {
    inputNominal.addEventListener('input', (e) => {
        let val = parseInt(e.target.value);
        state.inputNominal = isNaN(val) ? 0 : val;
        resetChips();
        updatePreview();
    });
}

// Update Teks Pratinjau di dalam Modal
function updatePreview() {
    const nominalElement = document.getElementById('preview-nominal');
    const saldoElement = document.getElementById('preview-saldo');
    if (!nominalElement || !saldoElement) return;

    const target = state.targets[state.activeTargetKey];
    const baseBalance = state.activeTargetKey === 'umum' ? state.totalBalance : target.current;

    if (state.inputNominal >= 10000) {
        if (btnKonfirmasi) btnKonfirmasi.disabled = false;
        nominalElement.innerText = '+' + formatRupiah(state.inputNominal);
        saldoElement.innerText = formatRupiah(baseBalance + state.inputNominal);
    } else {
        if (btnKonfirmasi) btnKonfirmasi.disabled = true;
        nominalElement.innerText = 'Rp0';
        saldoElement.innerText = formatRupiah(baseBalance);
    }
}

// Eksekusi Konfirmasi Setoran (Berfungsi untuk Umum, Dana Darurat, & Laptop Impian)
function konfirmasiSetoran() {
    if (modalSetor) modalSetor.close();

    const key = state.activeTargetKey;
    const target = state.targets[key];

    // 1. Tambah ke Total Tabungan Utama
    state.totalBalance += state.inputNominal;
    const totalEl = document.getElementById('total-balance');
    if (totalEl) totalEl.innerText = formatRupiah(state.totalBalance);

    let newTargetBalance = state.totalBalance;

    // 2. Jika setor ke target spesifik (Dana Darurat / Laptop Impian), update kartu & progress bar-nya
    if (key !== 'umum') {
        target.current += state.inputNominal;
        newTargetBalance = target.current;

        const amountEl = document.getElementById(target.amountId);
        const progressEl = document.getElementById(target.progressId);
        const percentEl = document.getElementById(target.percentId);

        if (amountEl) amountEl.innerText = formatRupiah(target.current);

        let newPercent = Math.min((target.current / target.max) * 100, 100);
        if (progressEl) progressEl.style.width = `${newPercent}%`;
        if (percentEl) percentEl.innerText = `${newPercent.toFixed(0)}%`;
    }

    // 3. Tambahkan ke daftar "Catatan Setoran Terakhir" di Beranda secara live
    const recentList = document.getElementById('recent-trx-list');
    if (recentList) {
        const item = document.createElement('div');
        item.className = 'mini-trx-item';
        item.innerHTML = `
            <div class="mini-trx-left">
                <span class="mini-icon">${target.icon}</span>
                <div>
                    <strong>Setor ke ${target.name}</strong>
                    <small class="muted">Baru saja ✨</small>
                </div>
            </div>
            <span class="amount-plus">+${formatRupiah(state.inputNominal)}</span>
        `;
        recentList.prepend(item);
    }

    // 4. Tampilkan Modal Sukses
    document.getElementById('success-desc').innerText = `${formatRupiah(state.inputNominal)} ditambahkan ke ${target.name} 🌷`;
    document.getElementById('success-label').innerText = `Saldo ${target.name} sekarang`;
    document.getElementById('success-new-balance').innerText = formatRupiah(newTargetBalance);

    if (modalSukses) modalSukses.showModal();
}

function tutupSukses() {
    if (modalSukses) modalSukses.close();
}

// --- EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
    const btnSetorUmum = document.getElementById('btn-setor-umum');
    const btnSetorDarurat = document.getElementById('btn-setor-darurat');
    const btnSetorLaptop = document.getElementById('btn-setor-laptop');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnTutupSukses = document.getElementById('btn-tutup-sukses');

    // Hubungkan ketiga tombol setor ke fungsi modal
    if (btnSetorUmum) btnSetorUmum.addEventListener('click', () => openSetorModal('umum'));
    if (btnSetorDarurat) btnSetorDarurat.addEventListener('click', () => openSetorModal('darurat'));
    if (btnSetorLaptop) btnSetorLaptop.addEventListener('click', () => openSetorModal('laptop'));

    if (btnCloseModal) btnCloseModal.addEventListener('click', closeSetorModal);
    if (btnKonfirmasi) btnKonfirmasi.addEventListener('click', konfirmasiSetoran);
    if (btnTutupSukses) btnTutupSukses.addEventListener('click', tutupSukses);

    // Hubungkan tombol chip nominal cepat
    chipButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const amount = parseInt(e.target.getAttribute('data-nominal'));
            if (amount) setNominal(amount, e.target);
        });
    });

    // Interaksi klik kotak Sweet Weekly Bingo
    const bingoBoxes = document.querySelectorAll('.bingo-box');
    bingoBoxes.forEach(box => {
        box.addEventListener('click', () => {
            box.classList.toggle('done');
        });
    });

    // --- Toggle Hamburger Menu Mobile ---
    const btnHamburger = document.getElementById('btn-hamburger');
    const topNav = document.getElementById('top-nav');

    if (btnHamburger && topNav) {
        btnHamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = topNav.classList.toggle('show');
            btnHamburger.innerText = isOpen ? '✕' : '☰';
        });

        document.addEventListener('click', (e) => {
            if (!topNav.contains(e.target) && !btnHamburger.contains(e.target)) {
                topNav.classList.remove('show');
                btnHamburger.innerText = '☰';
            }
        });
    }
});