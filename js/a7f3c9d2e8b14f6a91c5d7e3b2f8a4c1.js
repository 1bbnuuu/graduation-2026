const b4d9a7c1e8f3b2a6d5c0e7f1a9b8c3d6e = (() => {
  const p1 = [104,116,116,112,115,58,47,47]
    .map(c => String.fromCharCode(c)).join("");

  const p2 = [
    115,99,114,105,112,116,46,
    103,111,111,103,108,101,46,99,111,109
  ].map(c => String.fromCharCode(c)).join("");

  const p3 = [
    47,109,97,99,114,111,115,47,115,47
  ].map(c => String.fromCharCode(c)).join("");

  const p4 = [
    65,75,102,121,99,98,120,71,108,82,89,108,98,98,71,84,
    52,88,95,69,100,56,86,52,74,97,116,109,84,76,67,99,
    86,115,82,121,76,57,79,106,57,55,105,108,56,104,111,
    85,72,80,86,105,57,117,57,120,121,74,82,82,71,116,75,
    87,111,54,67,69,80,68,110,71
  ].map(c => String.fromCharCode(c)).join("");

  const p5 = [47,101,120,101,99]
    .map(c => String.fromCharCode(c)).join("");

  return p1 + p2 + p3 + p4 + p5;
})();

async function submitForm() {
    hideError();
    const name = document.getElementById("f_name").value.trim();
    const nim  = document.getElementById("f_nim").value.trim();
    const dept = document.getElementById("f_dept").value;
    const note = document.getElementById("f_note").value.trim();
    if (!name || !nim || !dept || !note) { showError("Semua field wajib diisi ya!"); return; }

    const btn = document.getElementById("submitBtn");
    btn.disabled = true; btn.textContent = "Mengirim...";

    try {
        let photoBase64 = "", photoMime = "";
        if (capturedPhotoBlob) {
            photoMime = capturedPhotoBlob.type || "image/jpeg";
            photoBase64 = await new Promise((res, rej) => {
                const r = new FileReader();
                r.onload = () => res(r.result.split(",")[1]); r.onerror = rej;
                r.readAsDataURL(capturedPhotoBlob);
            });
        }
        const resp = await fetch(b4d9a7c1e8f3b2a6d5c0e7f1a9b8c3d6e, {
            method: "POST",
            body: JSON.stringify({ name, nim, department: dept, note, photoBase64, photoMime }),
            headers: { "Content-Type": "text/plain" },
        });
        const data = await resp.json();
        if (data.ok) {
            closeModal(); resetForm();
            document.getElementById("successModal").classList.remove("hidden");
        } else { showError(data.error || "Terjadi kesalahan."); }
    } catch (err) { showError("Gagal mengirim."); }

    btn.disabled = false; btn.textContent = "Kirim";
}
