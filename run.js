let params = new URLSearchParams(window.location.search);
let slug = params.get("g");
let total = Number(params.get("t"));
let face = document.getElementById("timer");
let stage = document.getElementById("stage");
let rest = total;

stage.src = "games/" + slug + "/index.html";

let tick = setInterval(function () {
    rest -= 1;
    let m = Math.floor(rest / 60);
    let s = rest % 60;
    face.textContent = m + ":" + String(s).padStart(2, "0");
    if (rest <= 0) {
        clearInterval(tick);
        window.location.href = "q.html?g=" + slug;
    }
}, 1000);
