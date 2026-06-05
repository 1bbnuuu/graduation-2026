  const Xf8Qn2Lm7Za1Pk4Rv9Ty6Hs3Ud0We5Bj = (() => {
  const p1 = String.fromCharCode(
    104,116,116,112,115,58,47,47
  );

  const p2 = [
    100,111,99,115,46,
    103,111,111,103,108,101,
    46,99,111,109
  ].map(c => String.fromCharCode(c)).join("");

  const p3 = [
    47,115,112,114,101,97,100,115,104,101,101,116,115,
    47,100,47,101,47
  ].map(c => String.fromCharCode(c)).join("");

  const p4 = [
    50,80,65,67,88,45,49,118,81,122,99,90,100,68,113,109,
    69,109,108,79,84,89,70,108,57,66,101,49,112,118,118,
    68,109,107,100,65,52,107,117,90,53,118,78,117,98,84,
    112,120,76,86,97,86,118,118,90,111,102,87,54,50,112,
    119,66,76,54,106,104,77,55,67,110,57,45,116,103,100,
    89,85,74,103,48,70,101,80,55,75
  ].map(c => String.fromCharCode(c)).join("");

  const p5 = [
    47,112,117,98,63,111,117,116,112,117,116,61,99,115,118
  ].map(c => String.fromCharCode(c)).join("");

  return p1 + p2 + p3 + p4 + p5 + "&t=" + Date.now();
})(); 

async function fetchData() {
    renderSkeletons(8);
    try {
        const url = Xf8Qn2Lm7Za1Pk4Rv9Ty6Hs3Ud0We5Bj + "&t=" + Date.now();
        const res = await fetch(url, { cache: "no-store" });
        // const res = await fetch(Xf8Qn2Lm7Za1Pk4Rv9Ty6Hs3Ud0We5Bj);
        const csvText = await res.text();
        const parsed = Papa.parse(csvText, { header: true });
        allRows = parsed.data;
        renderRows(allRows);
    } catch (e) {
        document.getElementById("folder").innerHTML = "";
        document.getElementById("empty").classList.remove("hidden");
        document.getElementById("empty").textContent = "Datanya ilang njay";
    }
}