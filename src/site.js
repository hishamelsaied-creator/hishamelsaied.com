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
    var P = AR ? { l: "تقييم ذاتي مجاني", h: "كيف يرى رئيسك التنفيذي الموارد البشرية؟", p: "١٥ سؤالاً في نحو ٣ دقائق. تصلك لوحة النتائج والخريطة الحرارية على بريدك الإلكتروني خلال ٣ دقائق.", b: "ابدأ التقييم", n: "ليس الآن", x: "إغلاق", u: "/ar/hr-self-check/" }
      : { l: "Free self-check", h: "How does your CEO see HR?", p: "15 questions, about 3 minutes. Your results dashboard and heat map reach you by email within 3 minutes.", b: "Start the self-check", n: "Not now", x: "Close", u: "/hr-self-check/" };
    setTimeout(function () {
      var d = document.createElement("div");
      d.className = "pop"; d.setAttribute("role", "dialog"); d.setAttribute("aria-label", P.h);
      d.innerHTML = '<button type="button" class="pop-x" aria-label="' + P.x + '">&times;</button><span class="label">' + P.l + '</span><h2>' + P.h + '</h2><p>' + P.p + '</p><a class="btn" href="' + P.u + '">' + P.b + '</a><button type="button" class="pop-no">' + P.n + '</button>';
      document.body.appendChild(d);
      var close = function () { d.parentNode && d.parentNode.removeChild(d); };
      d.querySelector(".pop-x").onclick = close;
      d.querySelector(".pop-no").onclick = close;
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
      try { localStorage.setItem("sc-invite", "1"); } catch (e) {}
      setTimeout(function () { d.classList.add("in"); }, 30);
    }, 15000);
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
