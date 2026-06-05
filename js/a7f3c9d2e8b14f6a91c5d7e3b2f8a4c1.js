const b4d9a7c1e8f3b2a6d5c0e7f1a9b8c3d6e = (() => {
  const p1 = String.fromCharCode(
    104,116,116,112,115,58,47,47
  );

  const p2 = [
    115,99,114,105,112,116,46,
    103,111,111,103,108,101,46,99,111,109
  ].map(c => String.fromCharCode(c)).join("");

  const p3 = [
    47,109,97,99,114,111,115,47,115,47
  ].map(c => String.fromCharCode(c)).join("");

  const p4 = [
    65,75,102,121,99,98,119,70,50,85,104,54,51,48,113,77,
    83,76,85,84,68,57,90,80,74,87,51,101,77,110,76,74,
    103,57,103,68,68,72,51,107,114,113,52,82,90,68,48,
    75,66,86,52,55,51,65,105,111,67,120,110,103,112,78,
    51,57,45,87,56,72,71,48,49,89
  ].map(c => String.fromCharCode(c)).join("");

  const p5 = [
    47,101,120,101,99
  ].map(c => String.fromCharCode(c)).join("");

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
