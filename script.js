// State Aplikasi
let state = {
    totalBalance: 5250000,
    activeTargetName: '',
    activeTargetCurrent: 0,
    activeTargetMax: 10000000,
    inputNominal: 0
};

// Formatting Rupiah
const formatRupiah = (angka) => 'Rp' + angka.toLocaleString('id-ID');

// DOM Elements
const modalSetor = document.getElementById('modal-setor');
const modalSukses = document.getElementById('modal-sukses');
const inputNominal = document.getElementById('input-nominal');
const btnKonfirmasi = document.getElementById('btn-konfirmasi');
const chipButtons = document.querySelectorAll('.btn-chip');

// Buka Modal Setor
function openSetorModal(targetName, currentSaved) {
    state.activeTargetName = targetName;
    state.activeTargetCurrent = currentSaved;
    state.inputNominal = 0;
    
    document.getElementById('preview-tujuan').innerText = targetName;
    document.getElementById('preview-saldo').innerText = formatRupiah(currentSaved);
    
    if(inputNominal) inputNominal.value = '';
    updatePreview();
    resetChips();
    
    if(modalSetor) modalSetor.showModal();
}

// Tutup Modal Setor
function closeSetorModal() {
    if(modalSetor) modalSetor.close();
}

// Interaksi Tombol Chip (Nominal Cepat)
function setNominal(amount, targetElement) {
    state.inputNominal = amount;
    if(inputNominal) inputNominal.value = amount;
    updatePreview();
    
    resetChips();
    if(targetElement) targetElement.classList.add('active');
}

function resetChips() {
    chipButtons.forEach(btn => btn.classList.remove('active'));
}

// Validasi Input Nominal Manual
if(inputNominal) {
    inputNominal.addEventListener('input', (e) => {
        let val = parseInt(e.target.value);
        state.inputNominal = isNaN(val) ? 0 : val;
        resetChips();
        updatePreview();
    });
}

// Update Teks Pratinjau
function updatePreview() {
    const nominalElement = document.getElementById('preview-nominal');
    const saldoElement = document.getElementById('preview-saldo');
    
    if (!nominalElement || !saldoElement) return;

    if (state.inputNominal >= 10000) {
        if(btnKonfirmasi) btnKonfirmasi.disabled = false;
        nominalElement.innerText = '+' + formatRupiah(state.inputNominal);
        saldoElement.innerText = formatRupiah(state.activeTargetCurrent + state.inputNominal);
    } else {
        if(btnKonfirmasi) btnKonfirmasi.disabled = true;
        nominalElement.innerText = 'Rp0';
        saldoElement.innerText = formatRupiah(state.activeTargetCurrent);
    }
}

// Eksekusi Konfirmasi Setoran
function konfirmasiSetoran() {
    if(modalSetor) modalSetor.close();
    
    // Update State
    state.totalBalance += state.inputNominal;
    state.activeTargetCurrent += state.inputNominal;
    
    // Update DOM Beranda
    document.getElementById('total-balance').innerText = formatRupiah(state.totalBalance);
    document.getElementById('darurat-amount').innerText = formatRupiah(state.activeTargetCurrent);
    
    let newPercent = (state.activeTargetCurrent / state.activeTargetMax) * 100;
    document.getElementById('darurat-progress').style.width = `${newPercent}%`;
    document.getElementById('darurat-percent').innerText = `${newPercent.toFixed(0)}%`;

    // Siapkan & Buka Modal Sukses
    document.getElementById('success-desc').innerText = `${formatRupiah(state.inputNominal)} ditambahkan ke ${state.activeTargetName}`;
    document.getElementById('success-new-balance').innerText = formatRupiah(state.activeTargetCurrent);
    
    if(modalSukses) modalSukses.showModal();
}

function tutupSukses() {
    if(modalSukses) modalSukses.close();
}

// --- EVENT LISTENERS (Pengganti Handler Inline) ---
document.addEventListener('DOMContentLoaded', () => {
    const btnSetorUmum = document.getElementById('btn-setor-umum');
    const btnSetorDarurat = document.getElementById('btn-setor-darurat');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnTutupSukses = document.getElementById('btn-tutup-sukses');
    
    // Hubungkan tombol ke fungsi
    if(btnSetorUmum) btnSetorUmum.addEventListener('click', () => openSetorModal('Dana Umum', 0));
    if(btnSetorDarurat) btnSetorDarurat.addEventListener('click', () => openSetorModal('Dana Darurat', 3000000));
    if(btnCloseModal) btnCloseModal.addEventListener('click', closeSetorModal);
    if(btnKonfirmasi) btnKonfirmasi.addEventListener('click', konfirmasiSetoran);
    if(btnTutupSukses) btnTutupSukses.addEventListener('click', tutupSukses);

    // Hubungkan tombol chip nominal
    const chips = document.querySelectorAll('.btn-chip[data-nominal]');
    chips.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const amount = parseInt(e.target.getAttribute('data-nominal'));
            if(amount) setNominal(amount, e.target);
        });
    });
});