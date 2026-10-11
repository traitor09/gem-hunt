let params = new URLSearchParams(window.location.search);
let slug = params.get("g") || "minecraft";
let total = Number(params.get("t")) || 30;
let clock = document.getElementById("timer");
let stage = document.getElementById("stage");
let title = document.getElementById("title");
let alert = document.getElementById("alert");
let proceed = document.getElementById("proceed");

let map = {
  minecraft: "games/minecraft/index.html",
  timeshooter: "games/timeshooter/timeshooter3.html",
  wurstclient: "games/wurstclient/wurstclient.html",
  mario: "games/mario/mariovsluigi.html",
  amongus: "games/amongus/amongus.html",
  clashofkings: "games/clashofkings/clash-of-vikings.html",
  deathrun: "games/deathrun/death-run-3D.html",
  slope: "games/slope/slope.html",
  chess: "games/chess/chess.html",
  angrybirds: "games/angrybirds/angry-birds.html",
  tombofthemask: "games/tombofthemask/tombofthemask.html",
  eattheblock: "games/eattheblock/blockeatblock.html",
  tetris: "games/tetris/index.html"
};

let rest = total;
title.textContent = slug.toUpperCase();
stage.src = map[slug] || ("games/" + slug + "/index.html");

let mins = function (val) {
  let m = Math.floor(val / 60);
  let s = val % 60;
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
};

clock.textContent = mins(rest);

let lock = function () {
  clearInterval(tick);
  stage.src = "about:blank";
  alert.classList.remove("hide");
};

let tick = setInterval(function () {
  rest -= 1;
  clock.textContent = mins(rest);
  if (rest <= 0) {
    lock();
  }
}, 1000);

proceed.addEventListener("click", function () {
  window.location.href = "index.html?review=" + slug;
});
