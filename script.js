/* stopbattling.com — small motion layer. No dependencies. */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1. Split headline text into words so each can rise in on its own. */
  document.querySelectorAll("[data-words]").forEach(function (el) {
    var base = parseFloat(el.getAttribute("data-words")) || 0.6;
    var step = 0.09;
    var i = 0;
    function split(node) {
      if (node.nodeType === 3) {
        var frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          var s = document.createElement("span");
          s.className = "w";
          s.textContent = part;
          s.style.animationDelay = (base + i * step).toFixed(2) + "s";
          i++;
          frag.appendChild(s);
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === 1) {
        Array.prototype.slice.call(node.childNodes).forEach(split);
      }
    }
    split(el);
  });

  /* 2. Reveal on scroll. Siblings get a small stagger via --d. */
  var targets = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    targets.forEach(function (el, idx) {
      if (!el.style.getPropertyValue("--d")) {
        el.style.setProperty("--d", ((idx % 4) * 70) + "ms");
      }
      io.observe(el);
    });
  } else {
    targets.forEach(function (el) { el.classList.add("in"); });
  }

  /* 3. The road: a hairline beside the column that grows as you walk down. */
  var road = document.querySelector(".road");
  if (road && !reduce) {
    var wrap = road.parentElement;
    function onScroll() {
      var r = wrap.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = (vh * 0.7 - r.top) / r.height;
      road.style.transform = "scaleY(" + Math.max(0, Math.min(1, p)) + ")";
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }

  /* 4. Count-up for the numbers on the long page. */
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var end = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var done = false;
    function run() {
      if (done || reduce) { el.textContent = end.toLocaleString("en-US") + suffix; return; }
      done = true;
      var t0 = null, dur = 1400;
      function tick(t) {
        if (!t0) t0 = t;
        var k = Math.min(1, (t - t0) / dur);
        var eased = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(end * eased).toLocaleString("en-US") + suffix;
        if (k < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    if ("IntersectionObserver" in window && !reduce) {
      var o = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { run(); o.disconnect(); }
      }, { threshold: 0.5 });
      o.observe(el);
    } else { run(); }
  });

  /* 5. Email form: keep the original field names; show a quiet confirmation
        once it's wired to the same handler as the live site. */
  var form = document.getElementById("seven-days-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      if (form.getAttribute("action") === "#") {
        e.preventDefault();
        var btn = form.querySelector("button");
        btn.textContent = "Check your inbox.";
        btn.disabled = true;
      }
    });
  }
})();

/* ---- interaction layer (round two) ---- */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia("(hover: hover)").matches;

  /* a. Hero: the lamp follows the pointer; the portrait tilts a little toward it. */
  var hero = document.querySelector(".hero");
  var portrait = document.querySelector(".portrait");
  if (hero && canHover && !reduce) {
    var raf = null;
    hero.addEventListener("pointermove", function (e) {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = null;
        var r = hero.getBoundingClientRect();
        hero.style.setProperty("--px", (e.clientX - r.left) + "px");
        hero.style.setProperty("--py", (e.clientY - r.top) + "px");
        if (portrait) {
          var pr = portrait.getBoundingClientRect();
          var dx = (e.clientX - (pr.left + pr.width / 2)) / r.width;
          var dy = (e.clientY - (pr.top + pr.height / 2)) / r.height;
          portrait.style.transform = "perspective(700px) rotateY(" + (dx * 10) + "deg) rotateX(" + (-dy * 10) + "deg)";
        }
      });
    });
    hero.addEventListener("pointerleave", function () {
      if (portrait) portrait.style.transform = "";
    });
  }

  /* b. Cards: spotlight coordinates. */
  if (canHover && !reduce) {
    document.querySelectorAll(".card").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* c. Support: hovering a way to pay feeds the fire. */
  var gold = document.querySelector(".card.gold");
  if (gold) {
    gold.querySelectorAll(".pay a").forEach(function (a) {
      a.addEventListener("pointerenter", function () { gold.classList.add("fuel"); });
      a.addEventListener("pointerleave", function () { gold.classList.remove("fuel"); });
      a.addEventListener("focus", function () { gold.classList.add("fuel"); });
      a.addEventListener("blur", function () { gold.classList.remove("fuel"); });
    });
  }

  /* d. Tagline: hover replays the strike + underline. */
  var tag = document.querySelector(".tagline");
  if (tag && canHover && !reduce) {
    var busy = false;
    tag.addEventListener("pointerenter", function () {
      if (busy) return;
      busy = true;
      var parts = tag.querySelectorAll(".strike, .under, .strike path, .under path");
      parts.forEach(function (el) {
        el.style.animation = "none";
        void el.offsetWidth;
        el.style.animation = "";
        el.style.animationDelay = "0.15s";
        if (el.classList.contains("under") || el.closest(".under")) el.style.animationDelay = "0.9s";
      });
      setTimeout(function () { busy = false; }, 2200);
    });
  }

  /* e. Which act (home): his four acts, his words. */
  var mini = document.querySelector(".acts-mini");
  if (mini) {
    var out = document.querySelector(".act-out");
    var btns = mini.querySelectorAll("button");
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        var on = b.getAttribute("aria-pressed") === "true";
        btns.forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        if (on) {
          out.innerHTML = '<span class="hint">Tap the one that sounds like now.</span>';
          return;
        }
        b.setAttribute("aria-pressed", "true");
        var tail = b.hasAttribute("data-turn")
          ? "Nothing has gone wrong if you are in act three. That is where the turn happens."
          : "Nothing is wrong with you.";
        out.innerHTML = "<span>" + b.getAttribute("data-act") + "</span>" +
          '<span class="tail">' + tail + ' <a href="long.html">Read the long version →</a></span>';
        try { localStorage.setItem("sb-act", b.textContent.trim().slice(2)); } catch (e) {}
      });
    });
  }

  /* f. Long page: reading progress. */
  var prog = document.querySelector(".progress");
  if (prog) {
    function onScroll() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      prog.style.transform = "scaleX(" + (max > 0 ? h.scrollTop / max : 0) + ")";
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* g. Long page: tap a quadrant, the matching outsourcing lights up. */
  document.querySelectorAll(".wheel .q[data-for]").forEach(function (q) {
    function go() {
      var target = document.getElementById(q.getAttribute("data-for"));
      if (!target) return;
      document.querySelectorAll(".four article.lit, .wheel .q.lit").forEach(function (el) { el.classList.remove("lit"); });
      q.classList.add("lit");
      target.classList.add("lit");
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      setTimeout(function () { target.classList.remove("lit"); q.classList.remove("lit"); }, 4000);
    }
    q.addEventListener("click", go);
    q.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
  });

  /* h. Long page: mark the act you're in. Remembered on this device only. */
  var acts = document.querySelectorAll(".acts li[role=button]");
  if (acts.length) {
    var saved = null;
    try { saved = localStorage.getItem("sb-act"); } catch (e) {}
    acts.forEach(function (li) {
      var name = li.querySelector("h3").textContent.trim();
      if (saved && saved === name) li.setAttribute("aria-pressed", "true");
      function toggle() {
        var on = li.getAttribute("aria-pressed") === "true";
        acts.forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        li.setAttribute("aria-pressed", on ? "false" : "true");
        try { on ? localStorage.removeItem("sb-act") : localStorage.setItem("sb-act", name); } catch (e) {}
      }
      li.addEventListener("click", toggle);
      li.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
    });
  }
})();
