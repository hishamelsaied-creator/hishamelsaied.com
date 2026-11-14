(function () {
  // Old single-page links (hishamelsaied.com/#coaching) go to the new pages.
  var legacy = { about: "/about/", coaching: "/coaching/", articles: "/speaking/", speaking: "/speaking/", contact: "/contact/" };
  var h = (location.hash || "").replace("#", "");
  if (location.pathname === "/" && legacy[h]) { location.replace(legacy[h]); return; }

  var nav = document.getElementById("nav");
  var toggle = document.getElementById("menu-toggle");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Home page photo slideshow
  var slides = Array.prototype.slice.call(document.querySelectorAll("#show .slide"));
  var dots = document.getElementById("dots");
  if (slides.length && dots) {
    var current = 0, timer = null;
    var go = function (i) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (sl, n) { sl.classList.toggle("on", n === current); });
      Array.prototype.forEach.call(dots.children, function (d, n) { d.setAttribute("aria-current", n === current ? "true" : "false"); });
    };
    var play = function () {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      clearInterval(timer);
      timer = setInterval(function () { go(current + 1); }, 5000);
    };
    slides.forEach(function (sl, n) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Photo " + (n + 1));
      b.addEventListener("click", function () { go(n); play(); });
      dots.appendChild(b);
    });
    go(0); play();
  }

  // About page: copy biography
  var copyBtn = document.getElementById("copy-bio");
  if (copyBtn) {
    var copyNote = document.getElementById("copy-note");
    copyBtn.addEventListener("click", function () {
      var text = document.getElementById("bio-text").textContent;
      try {
        navigator.clipboard.writeText(text).then(function () {
          copyNote.textContent = "Copied.";
        }, function () {
          copyNote.textContent = "Couldn't copy. Please select the text and copy it.";
        });
      } catch (e) {
        copyNote.textContent = "Couldn't copy. Please select the text and copy it.";
      }
    });
  }

  // Contact page: enquiry form (not yet connected to a form service)
  var form = document.getElementById("enquiry-form");
  if (form) {
    var msg = document.getElementById("form-msg");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("f-name").value.trim();
      var email = document.getElementById("f-email").value.trim();
      var text = document.getElementById("f-msg").value.trim();
      msg.classList.add("show");
      if (!name || !email || !text) {
        msg.textContent = "Please add your name, your email and a few lines about what you'd like.";
        return;
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        msg.textContent = "That email address doesn't look right. Please check it.";
        return;
      }
      msg.textContent = "This form is not connected yet, so your enquiry has not been sent. Please email hisham@hishamelsaied.com for now.";
    });
  }
})();
