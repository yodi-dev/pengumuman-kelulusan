const countdownElement = document.getElementById("countdown");
const infoCountdown = document.getElementById("infoCountdown");
const cekForm = document.getElementById("cekForm");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");
const announcementStatus = document.getElementById("announcementStatus");


const tanggalPengumuman = new Date("2025-05-02T20:00:00").getTime();

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
    modalTitle.textContent = "Detail Kelulusan";
  const isLulus = siswa.status === "LULUS";

  announcementStatus.classList.remove("hidden");

  modalContent.innerHTML = `
  <table class="w-full text-sm text-left text-gray-700 border-separate [border-spacing:0.5rem]">
    <tr>
      <td class="font-semibold w-1/3">Nama</td>
      <td>: ${siswa.nama}</td>
    </tr>
    <tr>
      <td class="font-semibold">NISN</td>
      <td>: ${siswa.nisn}</td>
    </tr>
    <tr>
      <td class="font-semibold">Rata-rata Nilai</td>
      <td>: ${siswa.rata_rata_nilai}</td>
    </tr>
  </table>
  <div class="mt-4 w-full px-4 py-3 rounded-xl text-white text-center font-semibold
    ${siswa.status === "LULUS" ? "bg-green-500" : "bg-red-500"}">
    ${siswa.status === "LULUS" ? "🎉 Selamat! Anda dinyatakan <strong>LULUS</strong>." : "Mohon maaf, Anda <strong>TIDAK LULUS</strong>."}
  </div>
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
