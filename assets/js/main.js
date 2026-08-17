// Société Gauss — interactions & scrollytelling engine
(function () {
  "use strict";

  /* Mobile nav panel */
  var burger = document.querySelector(".burger");
  var panel = document.querySelector(".mobile-panel");
  if (burger && panel) {
    burger.addEventListener("click", function () {
      panel.classList.toggle("open");
      document.body.style.overflow = panel.classList.contains("open") ? "hidden" : "";
    });
    panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        panel.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* Reveal-on-scroll (fade/slide-in as sections enter view).
     Also drives .service-story (image lands, then text follows) and the
     showreel — anything that should animate in only once it's on screen. */
  var revealEls = document.querySelectorAll(".reveal, .service-story");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -80px 0px" }
    );
    revealEls.forEach(function (el, i) {
      el.style.setProperty("--i", i % 8);
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* Scroll-linked parallax on hero/section media — the "scrollytelling" video-like motion.
     Background photos drift and scale relative to scroll position, layered on top of the
     autoplay Ken Burns animation, so imagery keeps evolving as the visitor scrolls. */
  var kbLayers = Array.prototype.slice.call(document.querySelectorAll(".kb-media"));
  var ticking = false;
  function updateParallax() {
    var vh = window.innerHeight;
    kbLayers.forEach(function (layer) {
      var rect = layer.parentElement.getBoundingClientRect();
      var progress = 1 - Math.min(Math.max((rect.top + rect.height / 2) / (vh + rect.height), 0), 1);
      var shift = (progress - 0.5) * 40; // px drift
      layer.style.transform = "translate3d(0," + shift.toFixed(1) + "px,0)";
    });
    ticking = false;
  }
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }
  if (kbLayers.length) {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    updateParallax();
  }

  /* Quote / contact forms — no backend wired yet, so we confirm locally rather than
     pretending a submission happened. Replace with a real endpoint before launch. */
  document.querySelectorAll("form[data-quote-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = form.querySelector(".form-feedback");
      if (!note) {
        note = document.createElement("p");
        note.className = "form-feedback";
        note.style.cssText = "margin-top:16px;color:#8fe000;font-weight:600;";
        form.appendChild(note);
      }
      note.textContent =
        "Merci, votre demande est prête à être envoyée — branchez ce formulaire à votre adresse e-mail ou votre CRM pour la recevoir automatiquement. En attendant, appelez directement le 06 71 99 72 94.";
      form.reset();
    });
  });
})();
