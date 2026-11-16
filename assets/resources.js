(function () {
  var AR = document.documentElement.lang === "ar";
  var L = function (en, ar) { return AR ? ar : en; };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  var num = function (x) { return AR ? Number(x).toLocaleString("ar-AE-u-nu-arab") : String(x); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  // ---------- Library gate ----------
  var lib = document.getElementById("library");
  if (lib) {
    var unlock = function () {
      lib.classList.add("open");
      lib.querySelectorAll("[data-href]").forEach(function (a) { a.setAttribute("href", a.getAttribute("data-href")); a.setAttribute("download", ""); a.removeAttribute("aria-describedby"); });
      var who = store.get("lib-name");
      var w = document.getElementById("lib-welcome");
      if (w) w.textContent = who ? L("Welcome, " + who + ". The full library is open.", "أهلاً " + who + ". المكتبة الكاملة متاحة لك الآن.") : L("The full library is open.", "المكتبة الكاملة متاحة لك الآن.");
    };
    if (store.get("lib-access") || /[?&]access=library/.test(location.search)) { store.set("lib-access", "1"); unlock(); }
    lib.addEventListener("click", function (e) {
      var a = e.target.closest("a[data-href]");
      if (a && !lib.classList.contains("open")) {
        e.preventDefault();
        var f = document.getElementById("lib-form");
        f.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(function () { document.getElementById("l-name").focus(); }, 400);
      }
    });
    var form = document.getElementById("lib-form");
    var msg = document.getElementById("lib-msg");
    var val = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = val("l-name"), email = val("l-email");
      msg.classList.add("show");
      form.querySelectorAll("[aria-invalid]").forEach(function (x) { x.removeAttribute("aria-invalid"); });
      var bad = function (id, t) { var el = document.getElementById(id); el.setAttribute("aria-invalid", "true"); el.focus(); msg.textContent = t; };
      if (!name) { bad("l-name", L("Please add your name and email.", "يرجى كتابة اسمك وبريدك الإلكتروني.")); return; }
      if (!email) { bad("l-email", L("Please add your name and email.", "يرجى كتابة اسمك وبريدك الإلكتروني.")); return; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { bad("l-email", L("Please check your email address.", "يرجى التأكد من البريد الإلكتروني.")); return; }
      if (val("l-hp")) { msg.textContent = ""; return; }
      var btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      msg.textContent = L("Opening the library…", "جارٍ فتح المكتبة…");
      var link = "https://hishamelsaied.com" + (AR ? "/ar" : "") + "/resources/?access=library#library";
      var done = function (ok) {
        store.set("lib-access", "1"); store.set("lib-name", name.split(" ")[0]);
        unlock(); msg.textContent = "";
        if (!ok) { var w = document.getElementById("lib-welcome"); w.textContent += " " + L("We couldn't send the email just now, so bookmark this page.", "تعذّر إرسال البريد الآن، لذا احفظ هذه الصفحة في المفضلة."); }
        document.getElementById("lib-items").scrollIntoView({ behavior: "smooth", block: "start" });
        var a = document.querySelector("#lib-items a"); if (a) a.focus({ preventScroll: true });
      };
      var ctrl = window.AbortController ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 8000);
      fetch("https://formsubmit.co/ajax/hisham@hishamelsaied.com", {
        method: "POST",
        signal: ctrl ? ctrl.signal : undefined,
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          _subject: "Resource library sign-up: " + name,
          _template: "table",
          _captcha: "false",
          _autoresponse: L("Thank you for signing up, " + name.split(" ")[0] + ". Your free library of tools, templates and guides is here: " + link + " . I add new ones from time to time. Hisham Elsaied, executive coach, Dubai.",
                           "شكراً لتسجيلك يا " + name.split(" ")[0] + ". مكتبتك المجانية من الأدوات والنماذج والأدلة هنا: " + link + " . أضيف مصادر جديدة من وقت لآخر. هشام السعيد، كوتش تنفيذي، دبي."),
          Name: name,
          email: email,
          "Job title and organisation": val("l-role"),
          Language: AR ? "Arabic" : "English",
          Page: location.href
        })
      }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return r.ok && String(d.success) !== "false"; }); })
        .catch(function () { return false; })
        .then(function (ok) { clearTimeout(timer); btn.disabled = false; done(ok); });
    });
  }

  // ---------- Coaching, mentoring or training? ----------
  var pk = document.getElementById("picker");
  if (pk) {
    pk.addEventListener("change", function (e) { var fs = e.target.closest("fieldset"); if (fs) fs.classList.remove("miss"); });
    pk.addEventListener("submit", function (e) {
      e.preventDefault();
      var s = { t: 0, m: 0, c: 0 }, n = 0;
      pk.querySelectorAll("fieldset").forEach(function (fs) {
        var c = fs.querySelector("input:checked");
        fs.classList.toggle("miss", !c);
        if (c) { s[c.value]++; n++; }
      });
      var out = document.getElementById("pk-result");
      if (n < pk.querySelectorAll("fieldset").length) {
        out.hidden = false;
        out.innerHTML = '<p class="pk-warn" role="alert">' + L("Please answer every question to see your result.", "يرجى الإجابة عن جميع الأسئلة لرؤية النتيجة.") + "</p>";
        var first = pk.querySelector("fieldset.miss");
        first.scrollIntoView({ behavior: "smooth", block: "center" });
        first.querySelector("input").focus({ preventScroll: true });
        return;
      }
      var order = ["t", "m", "c"].sort(function (a, b) { return s[b] - s[a]; });
      var top = order[0], second = order[1], third = order[2];
      var R = JSON.parse(document.getElementById("pk-data").textContent);
      var r = R[top];
      var tied = s[top] === s[second];
      var mix = !tied && s[second] >= 2 && s[second] >= s[top] - 1;
      if (tied) {
        var names = (s[third] === s[top] ? [top, second, third] : [top, second]).map(function (k) { return R[k].name; });
        r = { title: L("A mixed need: " + names.join(" and "), "حاجة مركّبة: " + names.join(" و")),
              why: L("Your answers point equally to more than one kind of support. That's common. Start with whichever gap is most urgent, and you may need the other later.", "إجاباتك تشير بالقدر نفسه إلى أكثر من نوع من الدعم، وهذا شائع. ابدأ بالفجوة الأكثر إلحاحاً، وقد تحتاج إلى النوع الآخر لاحقاً."),
              next: (s[third] === s[top] ? [top, second, third] : [top, second]).map(function (k) { return R[k].next[0]; }),
              cta: '<a class="btn x-dark" href="' + (AR ? "/ar" : "") + '/insights/coaching-mentoring-or-training/">' + L("Read the full article", "اقرأ المقال كاملاً") + "</a>" };
      }
      var bars = ["c", "m", "t"].map(function (k) {
        return '<div class="pk-bar"><span>' + R[k].name + '</span><i style="--w:' + Math.round(s[k] / n * 100) + '%"></i><b>' + num(s[k]) + "/" + num(n) + "</b></div>";
      }).join("");
      out.hidden = false;
      out.innerHTML = '<span class="label">' + L("Your result", "النتيجة") + "</span>" +
        "<h2>" + r.title + "</h2><p>" + r.why + "</p>" + bars +
        "<h3>" + L("What to do next", "الخطوة التالية") + "</h3><ul>" + r.next.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>" +
        (mix ? '<p class="pk-mix">' + R[second].mix + "</p>" : "") +
        '<div class="pk-acts">' + r.cta + '<button type="button" class="btn line-d" onclick="window.print()">' + L("Save as PDF", "احفظ كملف PDF") + "</button></div>" +
        '<p class="pk-small">' + L("This is a guide to help you think, not a diagnosis.", "هذه أداة تساعدك على التفكير، وليست تشخيصاً.") + "</p>";
      out.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // ---------- 90-day planner ----------
  var pl = document.getElementById("planner");
  if (pl) {
    var KEY = "planner-90";
    var fields = pl.querySelectorAll("input, textarea");
    var saved = {};
    try { saved = JSON.parse(store.get(KEY) || "{}"); } catch (e) {}
    fields.forEach(function (f) { if (saved[f.name] != null) f.value = saved[f.name]; });
    var fmt = function (d) {
      return d.toLocaleDateString(AR ? "ar-AE-u-nu-arab" : "en-GB", { day: "numeric", month: "short", year: "numeric" });
    };
    var dates = function () {
      var v = pl.querySelector("[name=start]").value;
      pl.querySelectorAll("[data-day]").forEach(function (el) {
        if (!v) { el.textContent = ""; return; }
        var d = new Date(v + "T00:00:00"); d.setDate(d.getDate() + parseInt(el.getAttribute("data-day"), 10) - 1);
        el.textContent = L("by ", "بحلول ") + fmt(d);
      });
    };
    var note = document.getElementById("pl-saved");
    var t;
    pl.addEventListener("input", function () {
      var o = {}; fields.forEach(function (f) { o[f.name] = f.value; });
      store.set(KEY, JSON.stringify(o)); dates();
      clearTimeout(t); note.textContent = L("Saved on this device", "حُفظ على هذا الجهاز");
      t = setTimeout(function () { note.textContent = ""; }, 1800);
    });
    dates();
    var grow = function () { pl.querySelectorAll("textarea").forEach(function (t) { t.style.height = "auto"; t.style.height = (t.scrollHeight + 4) + "px"; }); };
    window.addEventListener("beforeprint", grow);
    document.getElementById("pl-print").addEventListener("click", function () { grow(); window.print(); });
    document.getElementById("pl-clear").addEventListener("click", function () {
      if (!window.confirm(L("Clear everything you've written?", "هل تريد مسح كل ما كتبته؟"))) return;
      fields.forEach(function (f) { f.value = ""; }); store.del(KEY); dates();
    });
  }
})();
