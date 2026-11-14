(function () {
  // Old single-page links (hishamelsaied.com/#coaching) go to the new pages.
  var AR = document.documentElement.lang === "ar";
  var T = AR ? {
    copied: "تم النسخ.",
    copyFail: "تعذّر النسخ. يرجى تحديد النص ونسخه.",
    missing: "يرجى كتابة اسمك وبريدك الإلكتروني وبضعة أسطر عما تريده.",
    badEmail: "يبدو أن البريد الإلكتروني غير صحيح. يرجى التحقق منه.",
    notSent: "هذا النموذج غير مفعّل بعد، لذلك لم يُرسل استفسارك. يرجى التواصل عبر hisham@hishamelsaied.com حالياً.",
    photo: "صورة "
  } : {
    copied: "Copied.",
    copyFail: "Couldn't copy. Please select the text and copy it.",
    missing: "Please add your name, your email and a few lines about what you'd like.",
    badEmail: "That email address doesn't look right. Please check it.",
    notSent: "This form is not connected yet, so your enquiry has not been sent. Please email hisham@hishamelsaied.com for now.",
    photo: "Photo "
  };
  var legacy = { about: "/about/", coaching: "/coaching/", articles: "/speaking/", speaking: "/speaking/", media: "/media/", contact: "/contact/" };
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
      b.setAttribute("aria-label", T.photo + (n + 1));
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
          copyNote.textContent = T.copied;
        }, function () {
          copyNote.textContent = T.copyFail;
        });
      } catch (e) {
        copyNote.textContent = T.copyFail;
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
        msg.textContent = T.missing;
        return;
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        msg.textContent = T.badEmail;
        return;
      }
      msg.textContent = T.notSent;
    });
  }
})();

document.addEventListener("click", function (e) {
  var b = e.target.closest ? e.target.closest(".yt") : null;
  if (!b) return;
  var f = document.createElement("iframe");
  f.src = "https://www.youtube-nocookie.com/embed/" + b.getAttribute("data-id") + "?autoplay=1&rel=0&start=" + (b.getAttribute("data-t") || 0);
  f.title = b.getAttribute("aria-label") || "Video";
  f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  f.allowFullscreen = true;
  b.parentNode.replaceChild(f, b);
});
