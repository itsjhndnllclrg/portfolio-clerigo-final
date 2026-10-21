(function () {
  var theme = "light";
  try {
    var saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") theme = saved;
    else if (window.matchMedia("(prefers-color-scheme: dark)").matches) theme = "dark";
  } catch (e) {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) theme = "dark";
  }
  document.documentElement.setAttribute("data-theme", theme);
})();


function syncThemeButton() {
  var dark = document.documentElement.getAttribute("data-theme") === "dark";
  var btn = document.getElementById("theme-toggle");
  btn.setAttribute("aria-pressed", dark ? "true" : "false");
  btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
}

document.getElementById("theme-toggle").addEventListener("click", function () {
  var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  try { localStorage.setItem("theme", next); } catch (e) {}
  syncThemeButton();
});
syncThemeButton();

function tickClock() {
  var el = document.getElementById("status-clock");
  var d = new Date();
  el.textContent = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
tickClock();
setInterval(tickClock, 60000);

var sections = ["about", "skills", "work", "contact"].map(function (id) { return document.getElementById(id); });
var navLinks = document.querySelectorAll("[data-nav]");
if ("IntersectionObserver" in window) {
  var ratios = {};
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) { ratios[entry.target.id] = entry.intersectionRatio; });
    var topId = "about";
    var best = 0;
    sections.forEach(function (s) {
      var r = ratios[s.id] || 0;
      if (r > best) { best = r; topId = s.id; }
    });
    navLinks.forEach(function (a) {
      if (a.getAttribute("data-nav") === topId) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }, { rootMargin: "-25% 0px -50% 0px", threshold: [0, 0.15, 0.4, 0.75, 1] });
  sections.forEach(function (s) { if (s) io.observe(s); });
}

document.addEventListener("keydown", function (e) {
  if (e.target.closest("input, textarea, select, [contenteditable='true']")) return;
  var map = { Digit1: "#about", Digit2: "#skills", Digit3: "#work", Digit4: "#contact", Numpad1: "#about", Numpad2: "#skills", Numpad3: "#work", Numpad4: "#contact" };
  if (map[e.code]) {
    e.preventDefault();
    location.hash = map[e.code];
  }
});

var menuDlg = document.getElementById("menu-dialog");
document.getElementById("menu-open").addEventListener("click", function () { menuDlg.showModal(); });
document.getElementById("menu-close").addEventListener("click", function () { menuDlg.close(); });
document.getElementById("back-to-top").addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
menuDlg.querySelectorAll("[data-go]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    menuDlg.close();
    location.hash = btn.getAttribute("data-go");
  });
});

function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
  });
}

/* ===== PROJECTS AND TIMELINE (content lives in index.html) ===== */
var filter = "all";
var newestFirst = false;
var timelineMount = document.getElementById("assignment-timeline");

function updateProgress() {
  var chips = timelineMount.querySelectorAll(".status-chip");
  var done = timelineMount.querySelectorAll(".status-chip.completed").length;
  var label = done + " of " + chips.length + " assignments completed";
  document.getElementById("progress-label").textContent = label;
  var track = document.getElementById("progress-track");
  track.setAttribute("aria-label", label);
  track.innerHTML = "";
  chips.forEach(function (chip) {
    var block = document.createElement("span");
    block.className = "progress-block" + (chip.classList.contains("completed") ? " on" : "");
    block.title = chip.textContent;
    track.appendChild(block);
  });
}

function applyFilter() {
  document.querySelectorAll("#project-grid > [data-type]").forEach(function (card) {
    card.hidden = !(filter === "all" || card.getAttribute("data-type") === filter);
  });
  document.getElementById("featured-projects").hidden = filter === "assignment";
  document.getElementById("assignments-progress").hidden = filter === "website" || filter === "design";
}

document.querySelectorAll("[data-filter]").forEach(function (chip) {
  chip.addEventListener("click", function () {
    filter = chip.getAttribute("data-filter");
    document.querySelectorAll("[data-filter]").forEach(function (c) {
      c.setAttribute("aria-pressed", c === chip ? "true" : "false");
    });
    applyFilter();
  });
});

document.getElementById("sort-toggle").addEventListener("click", function () {
  newestFirst = !newestFirst;
  this.textContent = newestFirst ? "Newest first" : "Oldest first";
  var items = Array.prototype.slice.call(timelineMount.children).reverse();
  items.forEach(function (li) { timelineMount.appendChild(li); });
});

updateProgress();
applyFilter();

document.getElementById("work").addEventListener("click", function (e) {
  var figmaBtn = e.target.closest("[data-figma]");
  if (figmaBtn) {
    var slot = figmaBtn.closest("article").querySelector(".figma-slot") || (function () {
      var d = document.createElement("div");
      d.className = "figma-slot";
      figmaBtn.closest("article").appendChild(d);
      return d;
    })();
    var url = figmaBtn.getAttribute("data-figma");
    var embed = "https://www.figma.com/embed?embed_host=share&url=" + encodeURIComponent(url);
    slot.className = "figma-embed";
    slot.innerHTML = '<iframe title="APIR interactive Figma prototype" src="' + embed + '" loading="lazy" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>' +
      '<p><a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">Open prototype if the embed does not load</a></p>';
    return;
  }
  var prev = e.target.closest("[data-preview]");
  if (prev) {
    var frame = prev.closest("article").querySelector(".preview-frame");
    var open = frame.classList.toggle("open");
    frame.hidden = !open;
    prev.setAttribute("aria-pressed", open ? "true" : "false");
    if (open && !frame.querySelector("iframe")) {
      var src = prev.getAttribute("data-preview");
      frame.innerHTML = '<iframe title="' + esc(prev.closest('article').querySelector('strong').textContent) + ' preview" src="' + esc(src) + '" loading="lazy" sandbox="allow-scripts"></iframe>';
    }
  }
});
