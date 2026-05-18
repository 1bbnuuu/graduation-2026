let allRows = [];
let capturedPhotoBlob = null;
let currentFacingMode = "user";
let cameraStream = null;

function renderSkeletons(n = 8) {
    const folder = document.getElementById("folder");
    folder.innerHTML = Array(n).fill(0).map(() => `
        <div class="skeleton flex flex-col items-center gap-2.5">
            <div class="w-44 h-[170px] bg-[#e5e5ea] rounded-xl"></div>
            <div class="w-24 h-3 bg-[#e5e5ea] rounded-full"></div>
        </div>
    `).join("");
}

function renderRows(rows) {
    const folder = document.getElementById("folder");
    const empty = document.getElementById("empty");
    folder.innerHTML = "";

    const valid = rows
        .filter(p => p.id)
        .sort((a, b) => {
            if (Number(a.id) === 1) return -1;
            if (Number(b.id) === 1) return 1;
            return Number(b.id) - Number(a.id);
        });

    if (valid.length === 0) { empty.classList.remove("hidden"); return; }
    empty.classList.add("hidden");

    valid.forEach((profile, i) => {
        const wrap = document.createElement("div");
        wrap.className = "folder-wrap flex flex-col items-center gap-2.5";
        wrap.style.animationDelay = `${i * 40}ms`;

        wrap.innerHTML = `
        <div class="folder relative group mt-5 md:w-44 md:h-[170px] w-28 h-20 cursor-pointer"
             onclick="window.location.href='detail.html?id=${encodeURIComponent(profile.id)}'">

            <svg class="absolute -z-40 md:w-44 text-cyan-600 w-28 md:top-0 top-3" viewBox="0 0 463 142" fill="none">
                <path d="M36.792 0C16.4723 0 0 16.4723 0 36.792L0 141.281H463V73.9973C463 53.4494 446.343 36.792 425.795 36.792H214.137L201.224 35.8936C194.135 35.4005 187.335 32.8873 181.629 28.6515L156.202 9.7758C147.651 3.42757 137.284 0 126.633 0H36.792Z" fill="currentColor"/>
            </svg>

            <div class="absolute top-4 flex justify-center w-full">
                <div class="bg-white w-5/6 md:h-32 h-20 group-hover:-translate-y-4 transition-transform duration-300 px-2 overflow-hidden">
                    <p class="font-bold text-sm">${profile.name}</p>
                    <p class="text-[8px]">${profile.note}</p>
                </div>
            </div>

            <svg class="absolute top-9 md:w-44 w-28 text-cyan-500 shadow-[0_-8px_15px_rgba(0,0,0,0.3)]" viewBox="0 0 463 323" fill="none">
                <rect width="463" height="323" rx="35" fill="currentColor"/>
            </svg>

        </div>
        `;

        folder.appendChild(wrap);
    });
}

document.getElementById("search").addEventListener("input", function () {
    const q = this.value.toLowerCase().trim();
    renderRows(q ? allRows.filter(p =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.note || "").toLowerCase().includes(q)
    ) : allRows);
});

document.getElementById("buatNote").addEventListener("click", openModal);
document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("modalBackdrop").addEventListener("click", function(e) {
    if (e.target === this) closeModal();
});

function openModal() {
    const bd = document.getElementById("modalBackdrop");
    bd.classList.remove("hidden");
    bd.style.opacity = "0";
    requestAnimationFrame(() => { bd.style.opacity = "1"; });
    startCamera();
}

function closeModal() {
    stopCamera();
    const bd = document.getElementById("modalBackdrop");
    bd.style.opacity = "0";
    setTimeout(() => bd.classList.add("hidden"), 250);
}

function closeSuccess() {
    document.getElementById("successModal").classList.add("hidden");
    fetchData();
}

async function startCamera() {
    stopCamera();
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: currentFacingMode }, 
            audio: false 
        });
        const video = document.getElementById("cameraPreview");
        video.srcObject = cameraStream;

        video.onloadedmetadata = () => {
            const isPortrait = video.videoHeight > video.videoWidth;
            video.style.aspectRatio = isPortrait ? "3/4" : "3/2";
        };
    } catch (err) {
        showError("Akses kamera ditolak: " + err.message);
    }
}

function stopCamera() {
    if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); cameraStream = null; }
}

function flipCamera() {
    currentFacingMode = currentFacingMode === "user" ? "environment" : "user";
    startCamera();
}

function capturePhoto() {
    const video = document.getElementById("cameraPreview");
    const scale = 3;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(blob => {
        if (!blob) return;
        if (blob.size > 1024 * 1024) { showError("Ukuran foto melebihi 1 MB."); return; }
        capturedPhotoBlob = blob;
        document.getElementById("photoPreview").src = URL.createObjectURL(blob);
        document.getElementById("photoSizeLabel").textContent = (blob.size / 1024).toFixed(1) + " KB";
        stopCamera();
        document.getElementById("cameraPanel").classList.add("hidden");
        document.getElementById("photoPreviewWrap").classList.remove("hidden");
        hideError();
    }, "image/jpeg", 0.85);
}

function retakePhoto() {
    capturedPhotoBlob = null;
    document.getElementById("photoPreview").src = "";
    document.getElementById("photoPreviewWrap").classList.add("hidden");
    document.getElementById("cameraPanel").classList.remove("hidden");
    startCamera(); hideError();
}

function resetForm() {
    ["f_name","f_nim","f_note"].forEach(id => document.getElementById(id).value = "");
    document.getElementById("f_dept").value = "";
    capturedPhotoBlob = null;
    document.getElementById("photoPreview").src = "";
    document.getElementById("photoPreviewWrap").classList.add("hidden");
    document.getElementById("cameraPanel").classList.remove("hidden");
    hideError();
}

function showError(msg) { const el = document.getElementById("formError"); el.textContent = msg; el.classList.remove("hidden"); }
function hideError() { document.getElementById("formError").classList.add("hidden"); }

fetchData();