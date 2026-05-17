const params = new URLSearchParams(window.location.search);

const targetId = params.get("id");

async function loadProfile() {

    try {

        const res = await fetch(Xf8Qn2Lm7Za1Pk4Rv9Ty6Hs3Ud0We5Bj);

        const csv = await res.text();

        const parsed = Papa.parse(csv, { header: true });

        const allRows = parsed.data.filter(r => r.id);

        const profile =
            allRows.find(r => String(r.id) === String(targetId));

        if (!profile) {

            document.getElementById("loading")
                .classList.add("hidden");

            document.getElementById("errorState")
                .classList.remove("hidden");

            return;
        }

        document.title =
            profile.name + " · STMIK Class of 2026";

        document.getElementById("profileName").textContent =
            profile.name || "–";

        document.getElementById("profileNim").textContent =
            (profile.NIM || profile.nim || "–");

        document.getElementById("profileNote").textContent =
            profile.note || "–";

        document.getElementById("profileDept").textContent =
            profile.department || "–";

        document.getElementById("infoId").textContent =
            "#" + profile.id;

        const link =
            (profile.link || "").trim();

        if (link) {

            document.getElementById("profilePhoto").src =
                link;

        } else {

            document.getElementById("profilePhoto").remove();
        }

        document.getElementById("loading")
            .classList.add("hidden");

        document.getElementById("profileContent")
            .classList.remove("hidden");

    } catch (e) {

        document.getElementById("loading")
            .classList.add("hidden");

        document.getElementById("errorState")
            .classList.remove("hidden");
    }
}

loadProfile();