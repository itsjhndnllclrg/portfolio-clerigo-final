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
document.getElementById("soft-menu").addEventListener("click", function () { menuDlg.showModal(); });
document.getElementById("menu-close").addEventListener("click", function () { menuDlg.close(); });
document.getElementById("soft-top").addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
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
var timelineMount = document.getElementById("timeline-mount");

function setupExpandableDescriptions() {
  document.querySelectorAll(".project-summary.is-collapsible").forEach(function (p) {
    var card = p.closest(".phone-card");
    if (!card) return;
    if (card.querySelector(".read-more-toggle")) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "read-more-toggle";
    btn.setAttribute("aria-expanded", "false");
    btn.textContent = "Read more";
    btn.addEventListener("click", function () {
      var isExpanded = p.classList.toggle("is-expanded");
      card.classList.toggle("is-expanded", isExpanded);
      btn.setAttribute("aria-expanded", String(isExpanded));
      btn.textContent = isExpanded ? "Read less" : "Read more";
    });

    p.insertAdjacentElement("afterend", btn);
  });
}

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
  document.querySelectorAll("#featured-mount > [data-type]").forEach(function (card) {
    card.hidden = !(filter === "all" || card.getAttribute("data-type") === filter);
  });
  document.getElementById("featured-part").hidden = filter === "assignment";
  document.getElementById("timeline-part").hidden = filter === "website" || filter === "design";
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

setupExpandableDescriptions();
updateProgress();
applyFilter();

function forcePreviewTheme(iframe) {
  if (!iframe) return;
  iframe.style.background = "#ffffff";
  iframe.style.border = "0";

  var apply = function () {
    try {
      var doc = iframe.contentDocument || iframe.contentWindow.document;
      if (!doc || !doc.head) return;
      var style = doc.createElement("style");
      style.textContent = "" +
        "html, body { background: #ffffff !important; color: #111111 !important; }" +
        "body * { color: inherit !important; background-color: transparent !important; }" +
        "img, picture, video, canvas, svg { filter: none !important; -webkit-filter: none !important; }" +
        "a, a * { color: #0b57d0 !important; }";
      doc.head.appendChild(style);
      if (doc.body) {
        doc.body.style.background = "#ffffff";
        doc.body.style.color = "#111111";
      }
    } catch (e) {}
  };

  if (iframe.contentDocument && iframe.contentDocument.readyState === "complete") {
    apply();
  } else {
    iframe.addEventListener("load", apply, { once: true });
  }
}

document.getElementById("work").addEventListener("click", function (e) {
  var figmaBtn = e.target.closest("[data-figma]");
  if (figmaBtn) {
    var article = figmaBtn.closest("article");
    var slot = article.querySelector(".figma-embed, .figma-slot");
    if (slot && !slot.hidden) {
      slot.hidden = true;
      slot.innerHTML = "";
      figmaBtn.textContent = "Load interactive prototype";
      return;
    }
    if (!slot) {
      slot = document.createElement("div");
      slot.className = "figma-slot";
      article.appendChild(slot);
    }
    var url = figmaBtn.getAttribute("data-figma");
    var embed = "https://www.figma.com/embed?embed_host=share&url=" + encodeURIComponent(url);
    slot.className = "figma-embed";
    slot.hidden = false;
    slot.innerHTML = '<iframe title="Interactive prototype" src="' + embed + '" loading="lazy" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>' +
      '<p><a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">Open prototype if the embed does not load</a></p>';
    figmaBtn.textContent = "Close prototype";
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
      var iframe = document.createElement("iframe");
      iframe.title = "Assignment preview";
      iframe.loading = "lazy";
      iframe.setAttribute("sandbox", "allow-scripts");
      iframe.src = src;
      frame.innerHTML = "";
      frame.appendChild(iframe);
      forcePreviewTheme(iframe);
    }
  }
});
