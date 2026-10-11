let games = [
  { slug: "minecraft", name: "Minecraft", dev: 10, file: "games/minecraft/index.html" },
  { slug: "timeshooter", name: "Time Shooter 3", dev: 9, file: "games/timeshooter/timeshooter3.html" },
  { slug: "wurstclient", name: "Wurst Client", dev: 9, file: "games/wurstclient/wurstclient.html" },
  { slug: "mario", name: "Mario vs Luigi", dev: 8, file: "games/mario/mariovsluigi.html" },
  { slug: "amongus", name: "Among Us", dev: 8, file: "games/amongus/amongus.html" },
  { slug: "clashofkings", name: "Clash of Vikings", dev: 7, file: "games/clashofkings/clash-of-vikings.html" },
  { slug: "deathrun", name: "Death Run 3D", dev: 7, file: "games/deathrun/death-run-3D.html" },
  { slug: "slope", name: "Slope", dev: 6, file: "games/slope/slope.html" },
  { slug: "chess", name: "Chess", dev: 6, file: "games/chess/chess.html" },
  { slug: "angrybirds", name: "Angry Birds", dev: 5, file: "games/angrybirds/angry-birds.html" },
  { slug: "tombofthemask", name: "Tomb of the Mask", dev: 4, file: "games/tombofthemask/tombofthemask.html" },
  { slug: "eattheblock", name: "Block Eat Block", dev: 4, file: "games/eattheblock/blockeatblock.html" },
  { slug: "tetris", name: "Tetris", dev: 3, file: "games/tetris/index.html" }
];

let slots = document.querySelectorAll(".step");
let dur = document.getElementById("dur");
let row1 = document.getElementById("row1");
let row2 = document.getElementById("row2");
let full = document.getElementById("full");
let play = document.getElementById("play");
let stage = document.getElementById("stage");
let title = document.getElementById("title");
let clock = document.getElementById("timer");
let quit = document.getElementById("quit");
let alert = document.getElementById("alert");
let proceed = document.getElementById("proceed");
let review = document.getElementById("review");
let name = document.getElementById("name");
let pain = document.getElementById("pain");
let painnum = document.getElementById("pain-num");
let stars = document.querySelectorAll(".star");
let starnum = document.getElementById("star-num");
let hours = document.getElementById("hours");
let send = document.getElementById("send");
let reset = document.getElementById("reset");
let launch = document.getElementById("launch");
let board = document.getElementById("plot");
let note = document.getElementById("note");
let stats = document.getElementById("stats");
let cards = document.getElementById("cards");
let count = document.getElementById("count");

let times = [30, 60, 90, 120, 150, 180];
let shades = ["#333", "#555", "#777", "#999", "#ccc", "#fff"];
let tiers = ["1hr week", "casual 2-4h", "regular 5-9h", "heavy 10+h"];
let key = "reviews";
let saved = {};
let chosen = 30;
let current = null;
let rest = 30;
let tick = null;
let hit = 0;

let load = function () {
  let raw = localStorage.getItem(key);
  saved = JSON.parse(raw || "{}");
};

let dump = function (slug, data) {
  saved[slug] = data;
  localStorage.setItem(key, JSON.stringify(saved));
};

let mins = function (val) {
  let m = Math.floor(val / 60);
  let s = val % 60;
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
};

let lock = function () {
  clearInterval(tick);
  stage.src = "about:blank";
  play.classList.add("hide");
  alert.classList.remove("hide");
};

let open = function (item) {
  current = item;
  rest = chosen;
  title.textContent = item.name;
  clock.textContent = mins(rest);
  stage.src = item.file;
  play.classList.remove("hide");
  clearInterval(tick);
  tick = setInterval(function () {
    rest -= 1;
    clock.textContent = mins(rest);
    if (rest <= 0) {
      lock();
    }
  }, 1000);
};

let close = function () {
  clearInterval(tick);
  stage.src = "about:blank";
  play.classList.add("hide");
};

let rate = function (item) {
  current = item;
  name.textContent = item.name + " REVIEW";
  pain.value = "5";
  painnum.textContent = "5 / 10";
  hit = 0;
  starnum.textContent = "0 / 5 STARS";
  stars.forEach(function (node) {
    node.classList.remove("on");
  });
  hours.value = "3";
  review.classList.remove("hide");
};

let card = function (item) {
  let node = document.createElement("div");
  node.className = "card";
  let done = Boolean(saved[item.slug]);
  let img = document.createElement("img");
  img.className = "cover";
  img.src = "img/" + item.slug + ".png";
  img.alt = item.name;
  let over = document.createElement("div");
  over.className = "over";
  let top = document.createElement("div");
  top.className = "topline";
  let dev = document.createElement("span");
  dev.className = "dev";
  dev.textContent = "DEV " + item.dev + "/10";
  top.appendChild(dev);
  if (done) {
    let badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = "PLAYED";
    top.appendChild(badge);
  }
  let foot = document.createElement("div");
  foot.className = "foot";
  let text = document.createElement("span");
  text.className = "name";
  text.textContent = item.name;
  let cta = document.createElement("span");
  cta.className = "cta";
  cta.textContent = "SPEEDRUN";
  foot.appendChild(text);
  foot.appendChild(cta);
  over.appendChild(top);
  over.appendChild(foot);
  node.appendChild(img);
  node.appendChild(over);
  node.addEventListener("click", function () {
    open(item);
  });
  return node;
};

let bucket = function (val) {
  if (val <= 2) return 0;
  if (val <= 4) return 1;
  if (val <= 8) return 2;
  return 3;
};

let graph = function () {
  let done = Object.keys(saved);
  let total = done.length;
  count.textContent = total + " / " + games.length + " PLAYED";
  if (!total) {
    note.textContent = "RATE AT LEAST 1 GAME TO UNLOCK COORDINATE PROFILE";
    stats.innerHTML = "";
    board.innerHTML = '<text x="50%" y="50%" fill="#666" font-size="14" font-weight="700" text-anchor="middle">NO REVIEWS YET. CHOOSE A GAME ABOVE TO PLAY.</text>';
    cards.innerHTML = "";
    return;
  }
  note.textContent = total + " GAMES EVALUATED";
  let wide = 820;
  let tall = 400;
  let pad = 60;
  board.setAttribute("viewBox", "0 0 " + wide + " " + tall);
  let xs = function (val) {
    return pad + ((val - 1) / 9) * (wide - pad * 2);
  };
  let ys = function (val) {
    return tall - pad - ((val - 1) / 9) * (tall - pad * 2);
  };
  let svg = "";
  svg += '<rect x="0" y="0" width="' + wide + '" height="' + tall + '" fill="#050505"/>';
  for (let i = 1; i <= 10; i += 1) {
    let x = xs(i);
    let y = ys(i);
    svg += '<line x1="' + x + '" y1="' + pad + '" x2="' + x + '" y2="' + (tall - pad) + '" stroke="#1a1a1a" stroke-width="1"/>';
    svg += '<line x1="' + pad + '" y1="' + y + '" x2="' + (wide - pad) + '" y2="' + y + '" stroke="#1a1a1a" stroke-width="1"/>';
  }
  svg += '<line x1="' + pad + '" y1="' + (tall - pad) + '" x2="' + (wide - pad) + '" y2="' + (tall - pad) + '" stroke="#fff" stroke-width="2"/>';
  svg += '<line x1="' + pad + '" y1="' + pad + '" x2="' + pad + '" y2="' + (tall - pad) + '" stroke="#fff" stroke-width="2"/>';
  for (let i = 1; i <= 10; i += 1) {
    let x = xs(i);
    svg += '<line x1="' + x + '" y1="' + (tall - pad) + '" x2="' + x + '" y2="' + (tall - pad + 6) + '" stroke="#fff" stroke-width="1"/>';
    svg += '<text x="' + x + '" y="' + (tall - pad + 20) + '" fill="#888" font-size="10" font-weight="700" text-anchor="middle">' + i + 'h</text>';
  }
  for (let i = 1; i <= 10; i += 1) {
    let y = ys(i);
    svg += '<line x1="' + (pad - 6) + '" y1="' + y + '" x2="' + pad + '" y2="' + y + '" stroke="#fff" stroke-width="1"/>';
    svg += '<text x="' + (pad - 12) + '" y="' + (y + 4) + '" fill="#888" font-size="10" font-weight="700" text-anchor="end">LVL ' + i + '</text>';
  }
  svg += '<text x="' + (wide / 2) + '" y="' + (tall - 15) + '" fill="#fff" font-size="11" font-weight="900" letter-spacing="1" text-anchor="middle">PLAYER TYPE: CONTINUOUS PLAY HOURS (1HR/WK - 10+HR HEAVY)</text>';
  svg += '<text x="18" y="' + (tall / 2) + '" fill="#fff" font-size="11" font-weight="900" letter-spacing="1" text-anchor="middle" transform="rotate(-90 18 ' + (tall / 2) + ')">DEV DIFFICULTY (1 EASY - 10 EXTREME)</text>';
  svg += '<text x="' + (pad + 12) + '" y="' + (pad + 20) + '" fill="#333" font-size="10" font-weight="900">HARD DEV / CASUAL</text>';
  svg += '<text x="' + (wide - pad - 12) + '" y="' + (pad + 20) + '" fill="#333" font-size="10" font-weight="900" text-anchor="end">HARD DEV / HEAVY GRIND</text>';
  svg += '<text x="' + (pad + 12) + '" y="' + (tall - pad - 12) + '" fill="#333" font-size="10" font-weight="900">EASY DEV / CASUAL</text>';
  svg += '<text x="' + (wide - pad - 12) + '" y="' + (tall - pad - 12) + '" fill="#333" font-size="10" font-weight="900" text-anchor="end">EASY DEV / HEAVY GRIND</text>';
  let sumh = 0;
  let sumd = 0;
  let sump = 0;
  let sumr = 0;
  cards.innerHTML = "";
  games.forEach(function (item) {
    let r = saved[item.slug];
    if (!r) return;
    sumh += r.hours;
    sumd += item.dev;
    sump += r.pain;
    sumr += r.rush;
    let x = xs(r.hours);
    let y = ys(item.dev);
    svg += '<circle cx="' + x + '" cy="' + y + '" r="10" fill="#000" stroke="#fff" stroke-width="2"/>';
    svg += '<circle cx="' + x + '" cy="' + y + '" r="5" fill="#fff"/>';
    svg += '<text x="' + (x + 12) + '" y="' + (y + 4) + '" fill="#fff" font-size="11" font-weight="800">' + item.name + '</text>';
    let box = document.createElement("div");
    box.className = "box";
    box.innerHTML = '<div class="box-title">' + item.name + '</div>' +
      '<div class="box-row"><span>DEV DIFFICULTY</span><span class="box-val">' + item.dev + '/10</span></div>' +
      '<div class="box-row"><span>PAIN TO STOP</span><span class="box-val">' + r.pain + '/10</span></div>' +
      '<div class="box-row"><span>DOPAMINE RUSH</span><span class="box-val">' + r.rush + '/5 STARS</span></div>' +
      '<div class="box-row"><span>HOURS COMMIT</span><span class="box-val">' + r.hours + ' HRS</span></div>';
    cards.appendChild(box);
  });
  board.innerHTML = svg;
  let avgh = (sumh / total).toFixed(1);
  let avgd = (sumd / total).toFixed(1);
  let avgp = (sump / total).toFixed(1);
  let avgr = (sumr / total).toFixed(1);
  let type = "CASUAL EXPLORER";
  if (avgh >= 8) {
    type = "OBSESSIVE GRINDER";
  } else if (avgh >= 5) {
    type = "HEAVY PLAYER";
  } else if (avgh >= 3) {
    type = "REGULAR GAMER";
  }
  let meta = "BALANCED TASTE";
  if (avgd >= 7.5) {
    meta = "HARDCORE DEV ENTHUSIAST";
  } else if (avgd <= 4.5) {
    meta = "ARCADE RETRO PURIST";
  }
  stats.innerHTML = '<div class="stat"><div class="stat-label">ARCHETYPE</div><div class="stat-val">' + type + '</div></div>' +
    '<div class="stat"><div class="stat-label">DEV PREFERENCE</div><div class="stat-val">' + meta + '</div></div>' +
    '<div class="stat"><div class="stat-label">AVG COMMITTED HOURS</div><div class="stat-val">' + avgh + 'h</div></div>' +
    '<div class="stat"><div class="stat-label">AVG DOPAMINE RUSH</div><div class="stat-val">' + avgr + '/5</div></div>';
};

let render = function () {
  load();
  row1.innerHTML = "";
  row2.innerHTML = "";
  full.innerHTML = "";
  games.slice(0, 6).forEach(function (item) {
    row1.appendChild(card(item));
  });
  games.slice(6).forEach(function (item) {
    row2.appendChild(card(item));
  });
  games.forEach(function (item) {
    full.appendChild(card(item));
  });
  graph();
};

slots.forEach(function (elem, i) {
  let pip = elem.querySelector(".pip");
  if (pip) {
    pip.style.background = shades[i % shades.length];
  }
  elem.addEventListener("click", function () {
    chosen = times[i];
    slots.forEach(function (node) {
      node.removeAttribute("aria-pressed");
    });
    elem.setAttribute("aria-pressed", "true");
    let m = chosen / 60;
    dur.textContent = m + " MIN (" + chosen + "S)";
  });
});

pain.addEventListener("input", function () {
  painnum.textContent = pain.value + " / 10";
});

stars.forEach(function (elem, i) {
  elem.addEventListener("click", function () {
    hit = i + 1;
    starnum.textContent = hit + " / 5 STARS";
    stars.forEach(function (node, j) {
      if (j < hit) {
        node.classList.add("on");
      } else {
        node.classList.remove("on");
      }
    });
  });
});

send.addEventListener("click", function () {
  if (!current) return;
  let p = Number(pain.value);
  let r = hit > 0 ? hit : 1;
  let h = Number(hours.value);
  if (h < 1) h = 1;
  if (h > 10) h = 10;
  dump(current.slug, { pain: p, rush: r, hours: h });
  review.classList.add("hide");
  render();
  window.location.hash = "#catalog";
});

proceed.addEventListener("click", function () {
  alert.classList.add("hide");
  if (current) {
    rate(current);
  }
});

quit.addEventListener("click", function () {
  close();
});

reset.addEventListener("click", function () {
  localStorage.removeItem(key);
  load();
  render();
});

launch.addEventListener("click", function () {
  let target = games.find(function (item) {
    return !saved[item.slug];
  });
  if (!target) {
    target = games[0];
  }
  open(target);
});

let query = new URLSearchParams(window.location.search);
let target = query.get("review");
if (target) {
  let found = games.find(function (item) {
    return item.slug === target;
  });
  if (found) {
    rate(found);
  }
}

render();
