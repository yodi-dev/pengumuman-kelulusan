const infoCountdown = document.getElementById("infoCountdown");
const cekForm = document.getElementById("cekForm");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");

const tanggalPengumuman = new Date("2025-05-05T10:00:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const selisih = tanggalPengumuman - now;

  if (selisih <= 0) {
    cekForm.classList.remove("hidden");
    infoCountdown.style.display = "none";
    return;
  }

  const hari = Math.floor(selisih / (1000 * 60 * 60 * 24));
  const jam = Math.floor((selisih % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const menit = Math.floor((selisih % (1000 * 60 * 60)) / (1000 * 60));
  const detik = Math.floor((selisih % (1000 * 60)) / 1000);

  countdownElement.textContent = `${hari}h ${jam}j ${menit}m ${detik}d`;

  requestAnimationFrame(updateCountdown);
}

updateCountdown();

document.getElementById("cekForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nisn = document.getElementById("nisn").value.trim();
  const tanggalLahir = document.getElementById("tanggal_lahir").value;

  const response = await fetch("data/siswa.json");
  const data = await response.json();

  const siswa = data.find(
    s => s.nisn === nisn && s.tanggal_lahir === tanggalLahir
  );

  modal.classList.remove("hidden");

  if (siswa) {
    modalTitle.textContent = "Hasil Kelulusan";
    modalContent.innerHTML = `
      <p><span class="font-semibold">Nama:</span> ${siswa.nama}</p>
      <p><span class="font-semibold">NISN:</span> ${siswa.nisn}</p>
      <p><span class="font-semibold">Rata-rata Nilai:</span> ${siswa.rata_rata_nilai}</p>
      <p class="mt-2 text-lg font-semibold ${siswa.status === "LULUS" ? "text-green-600" : "text-red-600"}">
        ${siswa.status === "LULUS" ? "Selamat! Anda dinyatakan LULUS." : "Mohon maaf, Anda TIDAK LULUS."}
      </p>
    `;
  } else {
    modalTitle.textContent = "Data Tidak Ditemukan";
    modalContent.innerHTML = `
      <p class="text-yellow-600">Pastikan NISN dan Tanggal Lahir sudah benar.</p>
    `;
  }
});

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});
