(function () {
  // Old single-page links (hishamelsaied.com/#coaching) go to the new pages.
  var AR = document.documentElement.lang === "ar";
  var T = AR ? {
    copied: "تم النسخ.",
    copyFail: "تعذّر النسخ. يرجى تحديد النص ونسخه.",
    missing: "يرجى كتابة اسمك وبريدك الإلكتروني وبضعة أسطر عما تريده.",
    badEmail: "يبدو أن البريد الإلكتروني غير صحيح. يرجى التحقق منه.",
    sending: "جارٍ الإرسال...",
    sent: "شكراً لك. وصلني استفسارك وسأرد عليك شخصياً.",
    notSent: "تعذّر إرسال استفسارك. يرجى مراسلتي مباشرة على hisham@hishamelsaied.com.",
    photo: "صورة "
  } : {
    copied: "Copied.",
    copyFail: "Couldn't copy. Please select the text and copy it.",
    missing: "Please add your name, your email and a few lines about what you'd like.",
    badEmail: "That email address doesn't look right. Please check it.",
    sending: "Sending...",
    sent: "Thank you. Your enquiry has reached me and I will reply personally.",
    notSent: "Your enquiry could not be sent. Please email me directly at hisham@hishamelsaied.com.",
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


  // Home page testimonials
  var xq = Array.prototype.slice.call(document.querySelectorAll("#x-quotes .x-q"));
  var xd = document.getElementById("x-dots");
  if (xq.length && xd) {
    var xi = 0, xt = null;
    var xgo = function (n) {
      xq[xi].classList.remove("on"); xd.children[xi].classList.remove("on");
      xi = n; xq[xi].classList.add("on"); xd.children[xi].classList.add("on");
    };
    xq.forEach(function (_, n) {
      var b = document.createElement("button");
      b.type = "button"; b.setAttribute("aria-label", String(n + 1));
      if (!n) b.className = "on";
      b.addEventListener("click", function () { clearInterval(xt); xgo(n); });
      xd.appendChild(b);
    });
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) xt = setInterval(function () { xgo((xi + 1) % xq.length); }, 7000);
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

  // Invitation to the self-check: once per visitor, after 15 seconds
  (function () {
    if (/self-check|contact/.test(location.pathname)) return;
    var seen = false;
    try { seen = !!localStorage.getItem("sc-invite"); } catch (e) {}
    if (seen) return;
    var P = AR ? { l: "تقييم ذاتي مجاني", h: "كيف يرى رئيسك التنفيذي الموارد البشرية؟", p: "١٥ سؤالاً عن مواقف حقيقية في نحو ٣ دقائق. يصلك تقريرك على بريدك الإلكتروني خلال ٣ دقائق.", g: ["المستوى الذي يراك فيه رئيسك التنفيذي على الأرجح", "خطة ٩٠ يوماً لمجالي الأولوية، بصيغة PDF", "خمسة أسئلة تطرحها على رئيسك التنفيذي", "اختياري: قارن رؤيتك برؤيته"], b: "ابدأ التقييم", n: "ليس الآن", x: "إغلاق", u: "/ar/hr-self-check/" }
      : { l: "Free self-check", h: "How does your CEO see HR?", p: "15 questions about real situations, about 3 minutes. Your report reaches you by email within 3 minutes.", g: ["The level your CEO probably sees you at", "A 90-day plan for your two priority areas, as a PDF", "Five questions to ask your CEO", "Optional: compare your view with your CEO's"], b: "Start the self-check", n: "Not now", x: "Close", u: "/hr-self-check/" };
    var shown = false, show = function () {
      if (shown) return; shown = true;
      window.removeEventListener("scroll", onScroll);
      var bg = document.createElement("div");
      bg.className = "pop-bg";
      var cells = ["#4f8f72","#c9ae82","#b9783c","#c9ae82","#8f3b34","#4f8f72","#b9783c","#4f8f72","#c9ae82"].map(function (c) { return '<i style="background:' + c + '"></i>'; }).join("");
      bg.innerHTML = '<div class="pop" role="dialog" aria-modal="true" aria-label="' + P.h + '"><button type="button" class="pop-x" aria-label="' + P.x + '">&times;</button><span class="label">' + P.l + '</span><h2>' + P.h + '</h2><p>' + P.p + '</p><div class="pop-map" aria-hidden="true">' + cells + '</div><ul>' + P.g.map(function (x) { return "<li>" + x + "</li>"; }).join("") + '</ul><a class="btn" href="' + P.u + '">' + P.b + '</a><button type="button" class="pop-no">' + P.n + '</button></div>';
      document.body.appendChild(bg);
      var close = function () { bg.parentNode && bg.parentNode.removeChild(bg); };
      bg.querySelector(".pop-x").onclick = close;
      bg.querySelector(".pop-no").onclick = close;
      bg.addEventListener("click", function (e) { if (e.target === bg) close(); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
      try { localStorage.setItem("sc-invite", "1"); } catch (e) {}
      setTimeout(function () { bg.classList.add("in"); bg.querySelector(".btn").focus(); }, 30);
    };
    var onScroll = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      if (h > 0 && window.scrollY / h >= 0.4) show();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    var t0 = Date.now();
    if (window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      document.addEventListener("mouseout", function (e) {
        if (!e.relatedTarget && e.clientY <= 0 && Date.now() - t0 > 5000) show();
      });
    }
    setTimeout(show, 30000);
  })();

  // Contact page: enquiry form, delivered by email
  var form = document.getElementById("enquiry-form");
  if (form) {
    var msg = document.getElementById("form-msg");
    var val = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = val("f-name"), email = val("f-email"), text = val("f-msg");
      msg.classList.add("show");
      if (!name || !email || !text) { msg.textContent = T.missing; return; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { msg.textContent = T.badEmail; return; }
      if (val("f-hp")) { msg.textContent = T.sent; return; }
      var btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      msg.textContent = T.sending;
      fetch("https://formsubmit.co/ajax/hisham@hishamelsaied.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          _subject: "Website enquiry from " + name,
          _template: "table",
          _captcha: "false",
          Name: name,
          "Job title and organisation": val("f-role"),
          email: email,
          "Preferred language": val("f-lang"),
          About: val("f-type"),
          Message: text,
          Page: location.href
        })
      }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) {
          if (res.ok && String(res.d.success) !== "false") { msg.textContent = T.sent; form.reset(); }
          else { msg.textContent = T.notSent; }
        })
        .catch(function () { msg.textContent = T.notSent; })
        .then(function () { btn.disabled = false; });
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
