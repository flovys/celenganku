const STORAGE_KEY = 'celenganku_coquette_v2';

// Fungsi membuat state awal yang selalu bersih dan aman
function getDefaultState() {
    return {
        initialBalance: 4250000,
        totalBalance: 5250000,
        totalSetoran: 1250000,
        totalPenarikan: 250000,
        activeTargetKey: 'darurat',
        inputNominal: 0,
        bingoState: [true, true, false, false, false, false],
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
        transactions: [
            {
                id: 1,
                type: 'setor',
                targetName: 'Dana Darurat',
                icon: '🦢',
                amount: 100000,
                dateGroup: '28 Oktober 2026',
                time: '09.41 WIB'
            },
            {
                id: 2,
                type: 'setor',
                targetName: 'Laptop Impian',
                icon: '💻',
                amount: 50000,
                dateGroup: '28 Oktober 2026',
                time: '08.15 WIB'
            },
            {
                id: 3,
                type: 'tarik',
                targetName: 'Dana Darurat',
                icon: '🦢',
                amount: 250000,
                dateGroup: '25 Oktober 2026',
                time: '14.20 WIB'
            }
        ]
    };
}

// Muat Data dari localStorage dengan validasi aman
function loadState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.targets && Array.isArray(parsed.transactions)) {
                return parsed;
            }
        }
    } catch (err) {
        console.warn('Gagal memuat localStorage, menggunakan data default.');
    }
    return getDefaultState();
}

// Simpan Data ke localStorage
function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
        console.warn('Gagal menyimpan ke localStorage.');
    }
}

let state = loadState();
let currentFilterType = 'all';
let currentFilterTarget = 'all';

const formatRupiah = (angka) => 'Rp' + Number(angka).toLocaleString('id-ID');

// Render Halaman Beranda (index.html)
function renderBeranda() {
    const totalEl = document.getElementById('total-balance');
    if (!totalEl) return;

    totalEl.innerText = formatRupiah(state.totalBalance);

    const bannerStrong = document.getElementById('banner-total-setoran');
    if (bannerStrong) bannerStrong.innerText = formatRupiah(state.totalSetoran);

    ['darurat', 'laptop'].forEach(key => {
        const t = state.targets[key];
        const amountEl = document.getElementById(t.amountId);
        const progressEl = document.getElementById(t.progressId);
        const percentEl = document.getElementById(t.percentId);

        if (amountEl) amountEl.innerText = formatRupiah(t.current);
        const pct = Math.min((t.current / t.max) * 100, 100);
        if (progressEl) progressEl.style.width = `${pct}%`;
        if (percentEl) percentEl.innerText = `${pct.toFixed(0)}%`;
    });

    const recentList = document.getElementById('recent-trx-list');
    if (recentList) {
        recentList.innerHTML = '';
        const recentSetoran = state.transactions.filter(trx => trx.type === 'setor').slice(0, 3);
        recentSetoran.forEach(trx => {
            const item = document.createElement('div');
            item.className = 'mini-trx-item';
            item.innerHTML = `
                <div class="mini-trx-left">
                    <span class="mini-icon">${trx.icon}</span>
                    <div>
                        <strong>Setor ke ${trx.targetName}</strong>
                        <small class="muted">${trx.dateGroup} · ${trx.time}</small>
                    </div>
                </div>
                <span class="amount-plus">+${formatRupiah(trx.amount)}</span>
            `;
            recentList.appendChild(item);
        });
    }

    const bingoBoxes = document.querySelectorAll('.bingo-box');
    bingoBoxes.forEach((box, idx) => {
        if (state.bingoState && state.bingoState[idx]) {
            box.classList.add('done');
        } else {
            box.classList.remove('done');
        }
    });
}

// Render Halaman Riwayat (riwayat.html)
function renderRiwayat() {
    const sumSetoran = document.getElementById('summary-setoran');
    if (!sumSetoran) return;

    const sumPenarikan = document.getElementById('summary-penarikan');
    const sumBersih = document.getElementById('summary-bersih');
    const sumInfo = document.getElementById('summary-info-text');
    const totalSaldoEl = document.getElementById('riwayat-total-saldo');

    sumSetoran.innerText = formatRupiah(state.totalSetoran);
    if (sumPenarikan) sumPenarikan.innerText = formatRupiah(state.totalPenarikan);

    const arusBersih = state.totalSetoran - state.totalPenarikan;
    if (sumBersih) {
        sumBersih.innerText = (arusBersih >= 0 ? '+' : '-') + formatRupiah(Math.abs(arusBersih));
    }

    if (sumInfo) {
        sumInfo.innerText = `✨ Saldo awal ${formatRupiah(state.initialBalance)} → saldo akhir ${formatRupiah(state.totalBalance)}. Ringkasan hanya menghitung transaksi berhasil.`;
    }

    if (totalSaldoEl) totalSaldoEl.innerText = formatRupiah(state.totalBalance);

    const daruratNom = state.targets.darurat.current;
    const laptopNom = state.targets.laptop.current;
    const totalAlokasi = daruratNom + laptopNom;

    const daruratPersen = totalAlokasi > 0 ? (daruratNom / totalAlokasi) * 100 : 50;
    const laptopPersen = totalAlokasi > 0 ? (laptopNom / totalAlokasi) * 100 : 50;

    const elDaruratNom = document.getElementById('alokasi-darurat-nominal');
    const elDaruratPct = document.getElementById('alokasi-darurat-persen');
    const elLaptopNom = document.getElementById('alokasi-laptop-nominal');
    const elLaptopPct = document.getElementById('alokasi-laptop-persen');
    const donutChart = document.getElementById('alokasi-donut');

    if (elDaruratNom) elDaruratNom.innerText = formatRupiah(daruratNom);
    if (elDaruratPct) elDaruratPct.innerText = daruratPersen.toFixed(1).replace('.', ',') + '%';
    if (elLaptopNom) elLaptopNom.innerText = formatRupiah(laptopNom);
    if (elLaptopPct) elLaptopPct.innerText = laptopPersen.toFixed(1).replace('.', ',') + '%';

    if (donutChart) {
        donutChart.style.background = `conic-gradient(var(--color-primary) 0% ${daruratPersen}%, #f7b2c4 ${daruratPersen}% 100%)`;
    }

    renderDaftarTransaksi();
}

// Render Daftar Transaksi & Filter di riwayat.html
function renderDaftarTransaksi() {
    const listContainer = document.getElementById('riwayat-trx-list');
    const badgeCount = document.getElementById('trx-count-badge');
    if (!listContainer) return;

    const filtered = state.transactions.filter(trx => {
        const matchType = currentFilterType === 'all' || trx.type === currentFilterType;
        const matchTarget = currentFilterTarget === 'all' || trx.targetName === currentFilterTarget;
        return matchType && matchTarget;
    });

    if (badgeCount) badgeCount.innerText = `${filtered.length} transaksi`;

    if (filtered.length === 0) {
        listContainer.innerHTML = `<p class="muted" style="text-align:center; padding: 24px 0;">Belum ada transaksi untuk filter ini 🌸</p>`;
        return;
    }

    const grouped = {};
    filtered.forEach(trx => {
        if (!grouped[trx.dateGroup]) grouped[trx.dateGroup] = [];
        grouped[trx.dateGroup].push(trx);
    });

    listContainer.innerHTML = '';
    const dates = Object.keys(grouped);

    dates.forEach((dateStr, idx) => {
        const header = document.createElement('h4');
        header.className = idx === 0 ? 'date-header' : 'date-header mt-lg';
        header.innerText = `🌸 ${dateStr}`;
        listContainer.appendChild(header);

        grouped[dateStr].forEach(trx => {
            const isSetor = trx.type === 'setor';
            const item = document.createElement('div');
            item.className = 'transaction-item';
            item.innerHTML = `
                <div class="trx-left">
                    <div class="trx-icon ${isSetor ? 'bg-primary-light text-primary' : 'error-bg error-text'}">
                        ${isSetor ? '↙' : '↗'}
                    </div>
                    <div class="trx-details">
                        <strong>${isSetor ? 'Setor ke' : 'Tarik dari'} ${trx.targetName} ${trx.icon}</strong>
                        <span class="muted">${trx.time}</span>
                    </div>
                </div>
                <strong class="${isSetor ? 'text-primary' : ''}">
                    ${isSetor ? '+' : '-'}${formatRupiah(trx.amount)}
                </strong>
            `;
            listContainer.appendChild(item);
        });
    });
}

// --- INISIALISASI SAAT HALAMAN DIMUAT ---
document.addEventListener('DOMContentLoaded', () => {
    const modalSetor = document.getElementById('modal-setor');
    const modalSukses = document.getElementById('modal-sukses');
    const inputNominal = document.getElementById('input-nominal');
    const btnKonfirmasi = document.getElementById('btn-konfirmasi');
    const chipButtons = document.querySelectorAll('.btn-chip[data-nominal]');

    function resetChips() {
        chipButtons.forEach(btn => btn.classList.remove('active'));
    }

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

    function openSetorModal(targetKey) {
        state.activeTargetKey = targetKey;
        state.inputNominal = 0;

        const target = state.targets[targetKey];
        const currentDisplay = targetKey === 'umum' ? state.totalBalance : target.current;

        const prevTujuan = document.getElementById('preview-tujuan');
        const prevSaldo = document.getElementById('preview-saldo');
        if (prevTujuan) prevTujuan.innerText = target.name;
        if (prevSaldo) prevSaldo.innerText = formatRupiah(currentDisplay);

        if (inputNominal) inputNominal.value = '';
        updatePreview();
        resetChips();

        if (modalSetor) modalSetor.showModal();
    }

    function konfirmasiSetoran() {
        if (modalSetor) modalSetor.close();

        const key = state.activeTargetKey;
        const target = state.targets[key];
        const amount = state.inputNominal;

        state.totalBalance += amount;
        state.totalSetoran += amount;

        let newTargetBalance = state.totalBalance;
        if (key !== 'umum') {
            target.current += amount;
            newTargetBalance = target.current;
        }

        const now = new Date();
        const namaBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const dateGroup = `${now.getDate()} ${namaBulan[now.getMonth()]} ${now.getFullYear()}`;
        const jam = String(now.getHours()).padStart(2, '0');
        const menit = String(now.getMinutes()).padStart(2, '0');
        const timeStr = `${jam}.${menit} WIB`;

        state.transactions.unshift({
            id: Date.now(),
            type: 'setor',
            targetName: target.name,
            icon: target.icon,
            amount: amount,
            dateGroup: dateGroup,
            time: timeStr
        });

        saveState();
        renderBeranda();

        const successDesc = document.getElementById('success-desc');
        const successLabel = document.getElementById('success-label');
        const successNewBal = document.getElementById('success-new-balance');

        if (successDesc) successDesc.innerText = `${formatRupiah(amount)} ditambahkan ke ${target.name} 🌷`;
        if (successLabel) successLabel.innerText = `Saldo ${target.name} sekarang`;
        if (successNewBal) successNewBal.innerText = formatRupiah(newTargetBalance);

        if (modalSukses) modalSukses.showModal();
    }

    // Render awal
    renderBeranda();
    renderRiwayat();

    // Event Listeners Tombol Setor & Modal
    const btnSetorUmum = document.getElementById('btn-setor-umum');
    const btnSetorDarurat = document.getElementById('btn-setor-darurat');
    const btnSetorLaptop = document.getElementById('btn-setor-laptop');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnTutupSukses = document.getElementById('btn-tutup-sukses');
    const btnResetData = document.getElementById('btn-reset-data');

    if (btnSetorUmum) btnSetorUmum.addEventListener('click', () => openSetorModal('umum'));
    if (btnSetorDarurat) btnSetorDarurat.addEventListener('click', () => openSetorModal('darurat'));
    if (btnSetorLaptop) btnSetorLaptop.addEventListener('click', () => openSetorModal('laptop'));

    if (btnCloseModal) btnCloseModal.addEventListener('click', () => modalSetor && modalSetor.close());
    if (btnKonfirmasi) btnKonfirmasi.addEventListener('click', konfirmasiSetoran);
    if (btnTutupSukses) btnTutupSukses.addEventListener('click', () => modalSukses && modalSukses.close());

    if (inputNominal) {
        inputNominal.addEventListener('input', (e) => {
            const val = parseInt(e.target.value, 10);
            state.inputNominal = isNaN(val) ? 0 : val;
            resetChips();
            updatePreview();
        });
    }

    chipButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const amount = parseInt(btn.getAttribute('data-nominal'), 10);
            if (amount) {
                state.inputNominal = amount;
                if (inputNominal) inputNominal.value = amount;
                updatePreview();
                resetChips();
                btn.classList.add('active');
            }
        });
    });

    // Reset Data localStorage
    if (btnResetData) {
        btnResetData.addEventListener('click', () => {
            if (confirm('Ingin mereset semua data tabungan kembali ke awal? 🌸')) {
                localStorage.removeItem(STORAGE_KEY);
                state = getDefaultState();
                renderBeranda();
                renderRiwayat();
            }
        });
    }

    // Kotak Sweet Weekly Bingo
    const bingoBoxes = document.querySelectorAll('.bingo-box');
    bingoBoxes.forEach((box, idx) => {
        box.addEventListener('click', () => {
            box.classList.toggle('done');
            state.bingoState[idx] = box.classList.contains('done');
            saveState();
        });
    });

    // Filter di Halaman Riwayat
    const filterTypeBtns = document.querySelectorAll('#filter-type-buttons .btn-chip');
    filterTypeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterTypeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilterType = btn.getAttribute('data-filter');
            renderDaftarTransaksi();
        });
    });

    const filterTargetSelect = document.getElementById('filter-target-select');
    if (filterTargetSelect) {
        filterTargetSelect.addEventListener('change', (e) => {
            currentFilterTarget = e.target.value;
            renderDaftarTransaksi();
        });
    }

    // Hamburger Menu Mobile
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