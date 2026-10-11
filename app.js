let games = [
    { slug: "minecraft", name: "Minecraft", dev: 9 },
{ slug: "tetris", name: "Tetris", dev: 4 }
];

let slots = document.querySelectorAll(".step");
let picks = document.querySelectorAll("[data-pick]");
let marks = document.querySelectorAll("[data-mark]");
let clock = document.getElementById("timer");
let stage = document.getElementById("stage");
let board = document.getElementById("plot");
let note = document.getElementById("note");
let stars = document.querySelectorAll(".star");
let send = document.getElementById("send");

let times = [30, 60, 90, 120, 150, 180];
let tiers = ["casual", "regular", "heavy", "obsessive"];
let shades = ["#000", "#333", "#666", "#999", "#ccc", "#fff"];

let key = "reviews";
let saved = JSON.parse(localStorage.getItem(key) || "{}");

let mins = function (n) {
    return Math.round(n / 60);
};

let bucket = function (h) {
    if (h < 2) return 0;
    if (h <= 5) return 1;
    if (h <= 9) return 2;
    return 3;
};

let load = function () {
    let raw = localStorage.getItem(key);
    saved = JSON.parse(raw || "{}");
};

let dump = function (slug, data) {
    saved[slug] = data;
    localStorage.setItem(key, JSON.stringify(saved));
};

let chosen = 30;
let tier = 0;

slots.forEach(function (el, i) {
    el.style.background = shades[i % shades.length];
    el.addEventListener("click", function () {
        chosen = times[i];
        slots.forEach(function (o) { o.removeAttribute("aria-pressed"); });
        el.setAttribute("aria-pressed", "true");
        let out = document.getElementById("dur");
        out.textContent = mins(chosen) + " min";
    });
});

marks.forEach(function (el, i) {
    el.style.background = shades[(i + 1) % shades.length];
    el.addEventListener("click", function () {
        tier = i;
        marks.forEach(function (o) { o.removeAttribute("aria-pressed"); });
        el.setAttribute("aria-pressed", "true");
        let out = document.getElementById("tier");
        out.textContent = tiers[tier];
    });
});

picks.forEach(function (el) {
    let slug = el.dataset.pick;
    if (saved[slug]) {
        let badge = document.createElement("b");
        badge.className = "tag";
        badge.textContent = "played";
        el.appendChild(badge);
    }
    el.addEventListener("click", function (e) {
        e.preventDefault();
        sessionStorage.setItem("playing", slug);
        sessionStorage.setItem("seconds", String(chosen));
        window.location.href = "play.html?g=" + slug + "&t=" + chosen;
    });
});

if (board) {
    load();
    let done = Object.keys(saved);
    if (!done.length) {
        note.textContent = "rate a game to unlock your chart";
    } else {
        note.textContent = done.length + " rated";
        let wide = 720;
        let tall = 360;
        board.setAttribute("viewBox", "0 0 " + wide + " " + tall);
        let pad = 40;
        let xs = function (i) { return pad + i * ((wide - pad * 2) / 3); };
        let ys = function (d) { return tall - pad - (d / 10) * (tall - pad * 2); };
        let svg = "";
        tiers.forEach(function (t, i) {
            svg += '<line x1="' + xs(i) + '" y1="' + pad + '" x2="' + xs(i) + '" y2="' + (tall - pad) + '" stroke="#fff"/>';
            svg += '<text x="' + xs(i) + '" y="' + (tall - 12) + '" fill="#fff" font-size="12" text-anchor="middle">' + t + "</text>";
        });
        [2, 4, 6, 8, 10].forEach(function (d) {
            svg += '<text x="8" y="' + (ys(d) + 4) + '" fill="#fff" font-size="11">' + d + "</text>";
        });
        games.forEach(function (g) {
            let r = saved[g.slug];
            if (!r) return;
            let x = xs(bucket(r.hours));
            let y = ys(g.dev);
            svg += '<circle cx="' + x + '" cy="' + y + '" r="7" fill="#fff"/>';
            svg += '<text x="' + (x + 12) + '" y="' + (y + 4) + '" fill="#fff" font-size="12">' + g.name + "</text>";
        });
        board.innerHTML = svg;
    }
}

if (stars.length) {
    let hit = 0;
    stars.forEach(function (el, i) {
        el.addEventListener("click", function () {
            hit = i + 1;
            stars.forEach(function (o, j) {
                o.classList.toggle("on", j < hit);
            });
        });
    });
    send.addEventListener("click", function () {
        let slug = document.body.dataset.game;
        let pain = Number(document.getElementById("pain").value);
        let rush = hit;
        let hours = Number(document.getElementById("hours").value);
        dump(slug, { pain: pain, rush: rush, hours: hours });
        window.location.href = "index.html";
    });
}
