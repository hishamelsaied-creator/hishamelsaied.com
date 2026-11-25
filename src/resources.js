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

  // ---------- Shared email gate for tool results ----------
  var hasAccess = function () { return !!store.get("lib-access"); };
  var plainOf = function (html) { var d = document.createElement("div"); d.innerHTML = html.replace(/<\/(p|li|h2|h3|div)>/g, "\n"); return d.textContent.replace(/\n{3,}/g, "\n\n").trim(); };
  var gated = function (out, teaser, full, o) {
    var show = function () { out.innerHTML = full; if (o.after) o.after(); };
    out.hidden = false;
    if (hasAccess()) { show(); out.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    out.innerHTML = teaser + (o.fade ? '<div class="gate-fade" aria-hidden="true">' + o.fade + "</div>" : "") +
      '<form class="gate" novalidate><h3>' + (o.title || L("See your full result", "اعرض نتيجتك كاملة")) + "</h3><p>" + o.what +
      " " + L("It's free and opens the full resource library.", "الأمر مجاني، ويفتح لك مكتبة المصادر كاملة.") + "</p>" +
      '<div style="position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)" aria-hidden="true"><input name="company_site" type="text" tabindex="-1" autocomplete="off"></div>' +
      '<div class="gate-fields"><div class="field"><label>' + L("Your name", "اسمك") + '<input name="name" type="text" autocomplete="name" required aria-describedby="gate-msg-' + o.tool.length + '"></label></div>' +
      '<div class="field"><label>' + L("Email", "البريد الإلكتروني") + '<input name="email" type="email" autocomplete="email" required aria-describedby="gate-msg-' + o.tool.length + '"></label></div></div>' +
      '<div><button class="btn" type="submit">' + (o.button || L("Show my full result", "اعرض نتيجتي كاملة")) + "</button></div>" +
      '<p class="gate-msg" id="gate-msg-' + o.tool.length + '" role="alert"></p></form>';
    out.scrollIntoView({ behavior: "smooth", block: "start" });
    var f = out.querySelector("form.gate"), m = f.querySelector(".gate-msg");
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = f.name.value.trim(), email = f.email.value.trim();
      f.querySelectorAll("[aria-invalid]").forEach(function (x) { x.removeAttribute("aria-invalid"); });
      if (!name) { f.name.setAttribute("aria-invalid", "true"); f.name.focus(); m.textContent = L("Please add your name and email.", "يرجى كتابة اسمك وبريدك الإلكتروني."); return; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { f.email.setAttribute("aria-invalid", "true"); f.email.focus(); m.textContent = L("Please check your email address.", "يرجى التأكد من البريد الإلكتروني."); return; }
      if (f.company_site.value) return;
      var btn = f.querySelector("button"); btn.disabled = true; m.textContent = L("One moment…", "لحظة من فضلك…");
      var first = name.split(" ")[0];
      var link = "https://hishamelsaied.com" + (AR ? "/ar" : "") + "/resources/?access=library#library";
      var res = o.summary ? o.summary() : "";
      var ctrl = window.AbortController ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 8000);
      fetch("https://formsubmit.co/ajax/hisham@hishamelsaied.com", {
        method: "POST", signal: ctrl ? ctrl.signal : undefined,
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          _subject: "Tool sign-up (" + o.tool + "): " + name, _template: "table", _captcha: "false",
          _autoresponse: L("Thank you, " + first + ". ", "شكراً لك يا " + first + ". ") +
            (res ? L("Here is your result from the " + o.toolName + ":\n\n", "هذه نتيجتك من " + o.toolName + ":\n\n") + res + "\n\n" : "") +
            L("Your free library of tools, templates and guides is here: ", "مكتبتك المجانية من الأدوات والنماذج والأدلة هنا: ") + link +
            L("\n\nHisham Elsaied, executive coach, Dubai", "\n\nهشام السعيد، كوتش تنفيذي، دبي"),
          Name: name, email: email, Tool: o.tool, Result: res || "(not shared)", Language: AR ? "Arabic" : "English", Page: location.href
        })
      }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return r.ok && String(d.success) !== "false"; }); }).catch(function () { return false; }).then(function (ok) {
        clearTimeout(timer);
        store.set("lib-access", "1"); store.set("lib-name", first);
        show();
        var note = document.createElement("p"); note.className = "gate-after";
        note.innerHTML = (!ok && o.summary ? L("We couldn't email your copy just now, so use Save as PDF. ", "تعذّر إرسال النسخة بالبريد الآن، لذا احفظها كملف PDF. ") : "") +
          '<a href="' + (AR ? "/ar" : "") + '/resources/#library">' + L("Your free resource library is now open", "مكتبة المصادر المجانية مفتوحة لك الآن") + "</a>";
        out.appendChild(note);
        var h = out.querySelector("h2, h3, ol"); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
      });
    });
  };

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
      var s = { t: 0, m: 0, c: 0 }, n = 0, mods = {};
      pk.querySelectorAll("fieldset").forEach(function (fs) {
        var c = fs.querySelector("input:checked");
        fs.classList.toggle("miss", !c);
        if (!c) return;
        if (fs.hasAttribute("data-mod")) { mods[fs.getAttribute("data-mod")] = +c.value; return; }
        var w = +(fs.getAttribute("data-w") || 1);
        s[c.value] += w; n += w;
      });
      var out = document.getElementById("pk-result");
      if (pk.querySelector("fieldset.miss")) {
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
      var margin = s[top] - s[second];
      var conf = margin >= 3 ? "clear" : margin >= 1 ? "lean" : "mixed";
      var tied = margin === 0;
      var mix = !tied && margin <= 2 && s[second] >= 2;
      if (tied) {
        var keys = s[third] === s[top] ? [top, second, third] : [top, second];
        r = { title: L("A mixed need: " + keys.map(function (k) { return R[k].name; }).join(" and "), "حاجة مركّبة: " + keys.map(function (k) { return R[k].name; }).join(" و")),
              why: L("Your answers point equally to more than one kind of support. That's common. Start with whichever gap is most urgent, and you may need the other later.", "إجاباتك تشير بالقدر نفسه إلى أكثر من نوع من الدعم، وهذا شائع. ابدأ بالفجوة الأكثر إلحاحاً، وقد تحتاج إلى النوع الآخر لاحقاً."),
              next: keys.map(function (k) { return R[k].next[0]; }),
              ev: keys.map(function (k) { return R[k].ev; }).join("</p><p>"),
              cta: '<a class="btn x-dark" href="' + (AR ? "/ar" : "") + '/insights/coaching-mentoring-or-training/">' + L("Read the full article", "اقرأ المقال كاملاً") + "</a>" };
      }
      var bars = ["c", "m", "t"].map(function (k) {
        return '<div class="pk-bar"><span>' + R[k].name + '</span><i style="--w:' + Math.round(s[k] / n * 100) + '%"></i><b>' + num(s[k]) + "/" + num(n) + "</b></div>";
      }).join("");
      var warn = [];
      if (mods.ready === 0) warn.push(R.mod.ready0);
      if (mods.support === 0) warn.push(R.mod.support0); else if (mods.support === 1 && (top === "t" || tied)) warn.push(R.mod.support1);
      var head = '<span class="label">' + L("Your result", "النتيجة") + ' &nbsp;·&nbsp; <span class="pk-conf pk-' + conf + '">' + R.conf[conf] + "</span></span><h2>" + r.title + "</h2>";
      var full = head + "<p>" + r.why + "</p>" + bars +
        (warn.length ? '<div class="pk-flags">' + warn.map(function (w) { return "<p>" + w + "</p>"; }).join("") + "</div>" : "") +
        "<h3>" + L("What to do next", "الخطوة التالية") + "</h3><ul>" + r.next.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>" +
        (mix ? '<p class="pk-mix">' + R[second].mix + "</p>" : "") +
        '<div class="pk-ev"><p>' + r.ev + "</p></div>" +
        '<div class="pk-acts">' + r.cta + '<button type="button" class="btn line-d" onclick="window.print()">' + L("Save as PDF", "احفظ كملف PDF") + "</button></div>" +
        '<p class="pk-small">' + L("This is a guide to help you think, not a diagnosis.", "هذه أداة تساعدك على التفكير، وليست تشخيصاً.") + "</p>";
      gated(out, head, full, { tool: "Coaching, mentoring or training picker", toolName: L("coaching, mentoring or training tool", "أداة كوتشينج أم إرشاد أم تدريب"),
        what: L("Enter your name and email to see why, your scores, what the research says and what to do next. I'll email you a copy too.", "اكتب اسمك وبريدك الإلكتروني لترى السبب، ودرجاتك، وماذا تقول الأبحاث، والخطوة التالية. وسأرسل لك نسخة بالبريد أيضاً."),
        fade: "<p>" + r.why + "</p>" + bars,
        summary: function () { return plainOf("<p>" + r.title + " (" + R.conf[conf] + ")</p><p>" + r.why + "</p>" + ["c", "m", "t"].map(function (k) { return "<p>" + R[k].name + ": " + num(s[k]) + "/" + num(n) + "</p>"; }).join("") + warn.map(function (w) { return "<p>" + w + "</p>"; }).join("") + r.next.map(function (x) { return "<p>- " + x + "</p>"; }).join("")); } });
    });
  }

  // ---------- 90-day planner ----------
  var pl = document.getElementById("planner");
  if (pl) {
    var KEY = "planner-90";
    var fields = pl.querySelectorAll("input, textarea, select");
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
    var starsSel = document.getElementById("p-stars"), starsTip = document.getElementById("pl-stars-tip");
    if (starsSel) {
      var SD = JSON.parse(document.getElementById("pl-stars-data").textContent);
      var starsSync = function () { var v = starsSel.value; starsTip.hidden = !v; starsTip.textContent = v ? SD[v] : ""; };
      starsSel.addEventListener("change", starsSync); starsSync();
    }
    var grow = function () { pl.querySelectorAll("textarea").forEach(function (t) { t.style.height = "auto"; t.style.height = (t.scrollHeight + 4) + "px"; }); };
    window.addEventListener("beforeprint", grow);
    var pbox = document.createElement("div"); pbox.className = "pk-result"; pbox.hidden = true;
    pl.after(pbox);
    document.getElementById("pl-print").addEventListener("click", function () {
      if (hasAccess()) { grow(); window.print(); return; }
      gated(pbox, "", '<p class="pl-ok">' + L("Done. You can now save or print your plan.", "تم. يمكنك الآن حفظ خطتك أو طباعتها.") + '</p><div class="pk-acts"><button type="button" class="btn x-dark" id="pl-print2">' + L("Save as PDF or print", "احفظ كملف PDF أو اطبع") + "</button></div>",
        { tool: "90-day planner", toolName: "", title: L("Save or print your plan", "احفظ خطتك أو اطبعها"), button: L("Save my plan", "احفظ خطتي"),
          what: L("Enter your name and email to save or print your plan. What you wrote stays on this device and isn't sent to anyone.", "اكتب اسمك وبريدك الإلكتروني لحفظ خطتك أو طباعتها. ما كتبته يبقى على هذا الجهاز ولا يُرسل إلى أحد."),
          after: function () { var b2 = document.getElementById("pl-print2"); b2.addEventListener("click", function () { grow(); window.print(); }); setTimeout(function () { b2.focus(); }, 50); } });
    });
    document.getElementById("pl-clear").addEventListener("click", function () {
      if (!window.confirm(L("Clear everything you've written?", "هل تريد مسح كل ما كتبته؟"))) return;
      fields.forEach(function (f) { f.value = ""; }); store.del(KEY); dates(); if (starsSel) starsSel.dispatchEvent(new Event("change"));
    });
  }
  // ---------- Feedback conversation builder ----------
  var fb = document.getElementById("fb");
  if (fb) {
    var LABELS = AR ? ["كسول", "وقح", "مهمل", "سلبي", "غير مهني", "متكبر", "دائماً", "دائما", "أبداً", "ابدا", "مستهتر", "دائمًا", "أبدًا", "أبدا", "دوماً", "غير ملتزم", "لا مبالي", "فوضوي", "متعجرف"]
                    : ["lazy", "rude", "careless", "unprofessional", "arrogant", "always", "never", "attitude", "disrespectful", "useless", "sloppy"];
    var v = function (n) { var el = fb.querySelector("[name=" + n + "]"); return el ? el.value.trim().replace(/[.!?؟。،,;:\s]+$/, "") : ""; };
    var low1 = function (t) { return AR ? t : t.charAt(0).toLowerCase() + t.slice(1); };
    var cap = function (t) { return AR ? t : t.charAt(0).toUpperCase() + t.slice(1); };
    var kindSync = function () { fb.querySelector(".fb-dev").hidden = fb.querySelector("[name=kind]:checked").value === "pos"; };
    fb.addEventListener("change", kindSync); kindSync();
    var warn = document.getElementById("fb-warn");
    fb.querySelector("[name=beh]").addEventListener("input", function (e) {
      var t = e.target.value.toLowerCase(), hit = LABELS.filter(function (w) { return AR ? t.indexOf(w) > -1 : new RegExp("\\b" + w + "\\b", "i").test(t); });
      warn.hidden = !hit.length;
      if (hit.length) warn.textContent = L("“" + hit[0] + "” sounds like a label or a generalisation. Describe what they actually did, once, so they can recognise it.", "كلمة «" + hit[0] + "» تبدو وصفاً أو تعميماً. صف ما فعله فعلاً في موقف محدد، ليتعرّف عليه.");
    });
    document.getElementById("fb-go").addEventListener("click", function () {
      var pos = fb.querySelector("[name=kind]:checked").value === "pos";
      var name = v("name"), sit = v("sit"), beh = v("beh"), imp = v("imp"), ask = v("ask");
      if (!AR) ask = ask.replace(/^(i'?d like (you )?to|please|to)\s+/i, ""); else if (ask && !/^أن\s/.test(ask)) ask = "أن " + ask.replace(/^(أرجو|رجاءً|رجاء)\s+/, "");
      var out = document.getElementById("fb-out");
      var need = pos ? [sit, beh, imp] : [sit, beh, imp, ask];
      out.hidden = false;
      if (need.some(function (x) { return !x; })) {
        out.innerHTML = '<p class="pk-warn" role="alert">' + L("Please fill in each box so the conversation makes sense.", "يرجى ملء كل الخانات لتكتمل المحادثة.") + "</p>";
        return;
      }
      var hi = name ? (AR ? " يا " + esc(name) : ", " + esc(name)) : "";
      var steps = pos ? [
        [L("Open", "البداية"), L("Have you got a minute" + hi + "? There's something I wanted to mention.", "هل لديك دقيقة" + hi + "؟ هناك أمر أردت أن أذكره لك.")],
        [L("What you noticed", "ما لاحظته"), esc(cap(sit)) + (AR ? "، " : ", ") + esc(low1(beh)) + "."],
        [L("Why it mattered", "لماذا كان مهماً"), L("It made a real difference: ", "وقد أحدث ذلك فرقاً حقيقياً: ") + esc(imp) + "."],
        [L("Close", "الختام"), L("Thank you. Please keep doing it.", "شكراً لك، واستمر في ذلك.")]
      ] : [
        [L("Open", "البداية"), L("Thanks for making time" + hi + ". There's something I'd like to talk through with you.", "شكراً على وقتك" + hi + ". هناك أمر أود أن نتحدث فيه معاً.")],
        [L("What happened", "ما حدث"), esc(cap(sit)) + (AR ? "، " : ", ") + esc(low1(beh)) + "."],
        [L("The impact", "الأثر"), L("As a result, ", "ونتيجةً لذلك، ") + esc(imp) + "."],
        [L("Their view", "وجهة نظر الطرف الآخر"), L("How did you see it? (Then listen, and don't interrupt.)", "كيف رأيت الأمر؟ (ثم أنصت، ولا تقاطع.)")],
        [L("Your request", "طلبك"), L("Going forward, I'd like you to ", "في المرات القادمة، أرجو ") + esc(ask) + L(". What would help you do that?", ". ما الذي سيساعدك على ذلك؟")],
        [L("Agree and follow up", "الاتفاق والمتابعة"), L("Let's agree the next step, and check in on how it's going in two weeks.", "لنتفق على الخطوة التالية، ونتابع كيف تسير الأمور بعد أسبوعين.")]
      ];
      // ---- Quality check: five research-based criteria ----
      var when = +fb.querySelector("[name=when]:checked").value, feel = +fb.querySelector("[name=feel]:checked").value;
      var moment = AR ? /(أمس|البارحة|اليوم|صباح|مساء|الأسبوع|الشهر|اجتماع|مكالمة|رسالة|بريد|عرض|تقرير|الأحد|الاثنين|الإثنين|الثلاثاء|الأربعاء|الخميس|الجمعة|السبت|[0-9٠-٩])/
                      : /\b(yesterday|today|this morning|this afternoon|last (week|month|night)|monday|tuesday|wednesday|thursday|friday|saturday|sunday|meeting|call|email|review|presentation|report|workshop|session|\d)/i;
      var labelHit = LABELS.filter(function (w) { return AR ? beh.indexOf(w) > -1 : new RegExp("\\b" + w + "\\b", "i").test(beh); }).length > 0 ||
                     (AR ? /^(أنت|انت)\s/.test(beh) : /\b(you are|you're|he is|she is|they are)\b/i.test(beh));
      var vague = AR ? /(أفضل|أكثر احترافية|احترافي|تحسّن|تحسن|بشكل جيد|مبادرة أكثر)/ : /\b(better|more professional|improve|be more|attitude|proactive|step up)\b/i;
      var Q = [
        [moment.test(sit), L("A specific moment", "موقف محدد"), L("Name when and where, so they can picture it.", "اذكر متى وأين، ليستحضر الموقف.")],
        [!labelHit, L("Behaviour, not a label", "تصرف لا وصف للشخص"), L("Describe what they did, not what they are.", "صف ما فعله، لا ما هو عليه.")],
        [imp.length >= 15, L("A clear impact", "أثر واضح"), L("Say what it meant for the work, the team or customers.", "اذكر ما ترتّب على ذلك في العمل أو الفريق أو العملاء.")],
        pos ? [beh.length >= 20, L("Specific praise", "ثناء محدد"), L("Add detail. Specific praise teaches; general thanks only pleases.", "أضف تفاصيل. الثناء المحدد يُعلّم، والشكر العام يُرضي فقط.")]
            : [ask.length >= 12 && !vague.test(ask), L("An actionable request", "طلب قابل للتنفيذ"), L("Ask for something you could see them do, not a quality like 'more professional'.", "اطلب أمراً يمكنك أن تراه يحدث، لا صفة عامة مثل «أكثر احترافية».")],
        [when === 0, L("Good timing", "توقيت مناسب"), when === 1 ? L("Still workable, but say it this week before memories fade.", "ما زال ممكناً، لكن قله هذا الأسبوع قبل أن تبهت التفاصيل.") : L("This is old now. Raise it only if it's still happening, and use a recent example if you can.", "مضى عليه وقت طويل. أثره فقط إن كان ما زال يتكرر، واستخدم مثالاً حديثاً إن أمكن.")]
      ];
      var passed = Q.filter(function (q) { return q[0]; }).length;
      var qhtml = '<div class="fb-q"><p class="fb-score"><b>' + num(passed) + "/" + num(5) + "</b> " + L("quality check", "فحص الجودة") + "</p><ul>" +
        Q.map(function (q) { return '<li class="' + (q[0] ? "ok" : "tip") + '"><b>' + q[1] + "</b>" + (q[0] ? "" : "<span>" + q[2] + "</span>") + "</li>"; }).join("") + "</ul>" +
        (feel === 2 ? '<p class="fb-hold">' + L("You said you're still angry. Wait until you're calmer, ideally a day. Feedback given in anger tends to land on the person, not the task.", "ذكرت أنك ما زلت غاضباً. انتظر حتى تهدأ، ويُفضّل يوماً كاملاً. الملاحظات التي تُقال في لحظة غضب تصيب الشخص غالباً لا المهمة.") + "</p>"
          : feel === 1 ? '<p class="fb-hold">' + L("You feel a bit tense. Read your words out loud once before the conversation, and slow down when you get to the impact.", "تشعر بشيء من التوتر. اقرأ كلماتك بصوت مسموع مرة قبل المحادثة، وتمهّل حين تصل إلى الأثر.") + "</p>" : "") + "</div>";
      var plain = steps.map(function (s) { return s[1].replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"'); }).join("\n\n");
      var lab = '<span class="label">' + L("Your conversation", "محادثتك") + "</span>";
      var li = function (st) { return "<li><b>" + st[0] + "</b><p>" + st[1] + "</p></li>"; };
      var full = lab + qhtml + '<ol class="fb-script">' + steps.map(li).join("") + "</ol>" +
        "<h3>" + L("Before you go in", "قبل أن تبدأ") + "</h3><ul>" +
        (pos ? [L("Say it soon after it happened. Specific praise lands better than general thanks.", "قلها بعد الموقف بوقت قصير. الثناء المحدد أعمق أثراً من الشكر العام."), L("In public or in private both work for praise, but know the person. Some prefer it quietly.", "يصلح الثناء أمام الآخرين أو على انفراد، لكن راعِ طبيعة الشخص، فبعض الناس يفضّلونه بعيداً عن الأضواء.")]
             : [L("Have it in private, and leave the person a way to keep their dignity.", "اجعل المحادثة على انفراد، واترك للشخص طريقاً يحفظ به كرامته."), L("Use your own words. This is a structure, not a script to read out.", "استخدم كلماتك. هذا هيكل للمحادثة، لا نصّ تقرؤه حرفياً."), L("Be ready to hear something you didn't know.", "كن مستعداً لسماع أمر لم تكن تعرفه.")]).map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>" +
        '<div class="pk-acts"><button type="button" class="btn x-dark" id="fb-copy">' + L("Copy", "انسخ") + '</button><button type="button" class="btn line-d" onclick="window.print()">' + L("Save as PDF", "احفظ كملف PDF") + "</button></div>";
      gated(out, lab + '<p class="fb-score"><b>' + num(passed) + "/" + num(5) + "</b> " + L("quality check", "فحص الجودة") + '</p><ol class="fb-script">' + steps.slice(0, 2).map(li).join("") + "</ol>", full, { tool: "Feedback conversation builder", toolName: "", title: L("See your full conversation", "اعرض المحادثة كاملة"),
        what: L("Enter your name and email to see the full conversation, ready to copy or save. What you typed stays on this page and isn't sent to anyone.", "اكتب اسمك وبريدك الإلكتروني لترى المحادثة كاملة، جاهزة للنسخ أو الحفظ. ما كتبته يبقى في هذه الصفحة ولا يُرسل إلى أحد."),
        button: L("Show my conversation", "اعرض محادثتي"),
        fade: '<ol class="fb-script">' + steps.slice(2, 4).map(li).join("") + "</ol>",
        after: function () {
          document.getElementById("fb-copy").addEventListener("click", function (e) {
            var b = e.target;
            (navigator.clipboard ? navigator.clipboard.writeText(plain) : Promise.reject()).then(function () { b.textContent = L("Copied", "تم النسخ"); }, function () { b.textContent = L("Select and copy the text", "حدد النص وانسخه"); });
          });
        } });
    });
  }

  // ---------- Leadership transition check ----------
  var tc = document.getElementById("tc");
  if (tc) {
    tc.addEventListener("change", function (e) { var fs = e.target.closest("fieldset"); if (fs) fs.classList.remove("miss"); });
    tc.addEventListener("submit", function (e) {
      e.preventDefault();
      var miss = null, A = {}, order = [];
      tc.querySelectorAll("fieldset").forEach(function (fs) {
        var c = fs.querySelector("input:checked");
        fs.classList.toggle("miss", !c);
        if (!c && !miss) miss = fs;
        var a = fs.getAttribute("data-area");
        if (!a) return;
        if (!(a in A)) { A[a] = { fwd: [], rev: [] }; order.push(a); }
        if (c) { var rv = fs.hasAttribute("data-rev"); (rv ? A[a].rev : A[a].fwd).push(rv ? 6 - +c.value : +c.value); }
      });
      var out = document.getElementById("tc-result");
      out.hidden = false;
      if (miss) {
        out.innerHTML = '<p class="pk-warn" role="alert">' + L("Please answer every question to see your result.", "يرجى الإجابة عن جميع الأسئلة لرؤية النتيجة.") + "</p>";
        miss.scrollIntoView({ behavior: "smooth", block: "center" }); miss.querySelector("input").focus({ preventScroll: true });
        return;
      }
      var D = JSON.parse(document.getElementById("tc-data").textContent);
      var time = +tc.querySelector("[name=ctime]:checked").value, move = +tc.querySelector("[name=cmove]:checked").value;
      var mean = function (x) { return x.reduce(function (p, c) { return p + c; }, 0) / x.length; };
      var S = {}, flags = [];
      order.forEach(function (a) {
        var all = A[a].fwd.concat(A[a].rev);
        S[a] = Math.round((mean(all) - 1) / 4 * 100);
        // Consistency: positively and negatively worded items disagree by 2+ points on the 1-5 scale
        if (A[a].fwd.length && A[a].rev.length && Math.abs(mean(A[a].fwd) - mean(A[a].rev)) >= 2) flags.push(a);
      });
      var overall = Math.round(mean(order.map(function (a) { return S[a]; })));
      var band = function (v) { return v >= 75 ? "hi" : v >= 50 ? "mid" : "lo"; };
      var bandName = { hi: L("Strong", "قوي"), mid: L("Building", "قيد البناء"), lo: L("Priority", "أولوية") };
      var low = order.slice().sort(function (a, b) { return S[a] - S[b]; }).filter(function (a) { return S[a] < 75; }).slice(0, 2);
      var head = '<span class="label">' + L("Your result", "النتيجة") + "</span><h2>" +
        (overall >= 75 ? L("You're settling in well", "أنت تستقر في دورك بشكل جيد") : overall >= 50 ? L("A solid start, with gaps to close", "بداية جيدة، مع فجوات تحتاج إلى سدّها") : L("Worth focusing on now", "هناك ما يستحق تركيزك الآن")) +
        '</h2><p class="tc-index"><b>' + num(overall) + "</b><span>/" + num(100) + "</span> " + L("overall transition index", "مؤشر الانتقال العام") + "</p>";
      var bars = order.map(function (a) {
        var b = band(S[a]);
        return '<div class="pk-bar tc-bar tc-' + b + '"><span>' + D.names[a] + '</span><i style="--w:' + Math.max(S[a], 3) + '%"></i><b>' + num(S[a]) + '</b><em>' + bandName[b] + "</em></div>";
      }).join("");
      // Stage reading: what's normal early, what's a risk later
      var stage = time === 0
        ? L("You're in your first three months, so lower scores on relationships and your team are normal. Treat them as the plan for the next few weeks, not as a warning.", "أنت في أشهرك الثلاثة الأولى، لذا فإن انخفاض الدرجات في العلاقات والفريق أمر طبيعي. اعتبرها خطة الأسابيع القادمة، لا إنذاراً.")
        : time === 1
        ? L("By around six months, most new leaders are expected to be adding as much value as they've taken to get up to speed. Gaps in role clarity or relationships deserve attention now, because they get harder to close later.", "بحلول الشهر السادس تقريباً، يُتوقع من معظم القادة الجدد أن يضيفوا من القيمة بقدر ما استهلكه استقرارهم في الدور. والفجوات في وضوح الدور أو العلاقات تستحق الانتباه الآن، لأن سدّها يصبح أصعب لاحقاً.")
        : L("After six months, people expect you to be fully up to speed. Any area marked as a priority is now a real risk to how you're seen, and worth acting on this month.", "بعد ستة أشهر يتوقع الناس أنك أصبحت متمكناً تماماً من دورك. وأي مجال يظهر كأولوية أصبح خطراً حقيقياً على صورتك، ويستحق أن تتحرك فيه هذا الشهر.");
      var moveNote = move === 2 ? L("You've also changed country. Expect relationships and how decisions get made to take longer to read than in past moves, and ask more questions than feels comfortable.", "لقد انتقلت أيضاً إلى بلد جديد. توقّع أن يستغرق فهم العلاقات وطريقة اتخاذ القرار وقتاً أطول مما في انتقالاتك السابقة، واسأل أكثر مما تعتاد.")
                 : move === 0 ? L("You were promoted from inside, so people know the old you. Letting go of your old job, and being seen to, matters more than usual.", "لقد رُقّيت من الداخل، والناس يعرفونك في دورك السابق. لذا فإن التخلي عن عملك القديم، وأن يرى الناس ذلك، أهم من المعتاد.")
                 : L("You've joined a new organisation, so understanding how things really work here comes before changing them.", "لقد انضممت إلى جهة جديدة، لذا فإن فهم كيف تسير الأمور فعلاً يأتي قبل تغييرها.");
      if (flags.length >= 3) low = [];
      var focus = flags.length >= 3 ? "" : low.length ? "<h3>" + L("Where to focus next", "أين تركّز بعد ذلك") + "</h3>" + low.map(function (a) { return "<p><b>" + D.names[a] + ".</b> " + D.adv[a] + "</p>"; }).join("")
        : "<p>" + L("No area stands out as a risk. Run this check again in a month: things shift quickly in a new role.", "لا يبدو أي مجال مصدر خطر. أعد هذه المراجعة بعد شهر، فالأمور تتغير بسرعة في الدور الجديد.") + "</p>";
      var fn = flags.map(function (a) { return D.names[a]; });
      var listEn = fn.length > 1 ? fn.slice(0, -1).join(", ") + " and " + fn[fn.length - 1] : fn[0];
      var cons = flags.length >= 3 ? '<p class="pk-mix">' + L("Many of your answers agree with both the positive and the negative statements. That usually means agreeing across the board rather than a real pattern. Read the statements again slowly, especially the negative ones, and answer for how things are today.", "كثير من إجاباتك يوافق العبارات الإيجابية والسلبية معاً، وهذا يعني عادة ميلاً عاماً إلى الموافقة لا نمطاً حقيقياً. اقرأ العبارات مرة أخرى بتمهّل، وخاصة السلبية منها، وأجب بحسب واقعك اليوم.") + "</p>"
        : flags.length ? '<p class="pk-mix">' + L("Your answers in " + listEn + " point in different directions. Read those statements again, or ask someone who works closely with you how they'd answer.",
        "إجاباتك في " + (fn.length === 2 ? "مجالَي " + fn[0] + " و" + fn[1] : "مجال " + fn[0]) + " تشير إلى اتجاهات مختلفة. اقرأ تلك العبارات مرة أخرى، أو اسأل شخصاً يعمل معك عن قرب كيف كان سيجيب.") + "</p>" : "";
      var full = head + '<div class="tc-bars">' + bars + "</div>" + '<p class="tc-key">' + L("75 and above: strong. 50 to 74: building. Below 50: a priority.", "٧٥ فأكثر: قوي. من ٥٠ إلى ٧٤: قيد البناء. أقل من ٥٠: أولوية.") + "</p>" +
        "<h3>" + L("Reading it for your stage", "قراءة النتيجة في ضوء مرحلتك") + "</h3><p>" + stage + " " + moveNote + "</p>" + cons + focus +
        '<div class="pk-acts">' + D.links + '<button type="button" class="btn line-d" onclick="window.print()">' + L("Save as PDF", "احفظ كملف PDF") + "</button></div>" +
        '<p class="pk-small">' + L("A structured reflection to help you decide where to look, not a validated assessment.", "أداة تأمل منظّم تساعدك على تحديد أين تنظر، وليست تقييماً مقنّناً.") + "</p>";
      gated(out, head, full, { tool: "Leadership transition check", toolName: L("leadership transition check", "مراجعة الانتقال إلى دور قيادي"),
        what: L("Enter your name and email to see your score in each area, what it means at your stage and where to focus next. I'll email you a copy too.", "اكتب اسمك وبريدك الإلكتروني لترى درجتك في كل مجال، وماذا تعني في مرحلتك، وأين تركّز بعد ذلك. وسأرسل لك نسخة بالبريد أيضاً."),
        fade: bars,
        summary: function () { return plainOf("<p>" + L("Overall transition index: ", "مؤشر الانتقال العام: ") + num(overall) + "/" + num(100) + "</p>" + order.map(function (a) { return "<p>" + D.names[a] + ": " + num(S[a]) + " (" + bandName[band(S[a])] + ")</p>"; }).join("") + "<p>" + stage + "</p>" + focus); } });
    });
  }
  // ---------- HR director readiness check ----------
  var hd = document.getElementById("hd");
  if (hd) {
    hd.addEventListener("change", function (e) { var fs = e.target.closest("fieldset"); if (fs) fs.classList.remove("miss"); });
    hd.addEventListener("submit", function (e) {
      e.preventDefault();
      var miss = null, A = {}, order = [];
      hd.querySelectorAll("fieldset").forEach(function (fs) {
        var c = fs.querySelector("input:checked");
        fs.classList.toggle("miss", !c);
        if (!c && !miss) miss = fs;
        var a = fs.getAttribute("data-area");
        if (!a) return;
        if (!(a in A)) { A[a] = { fwd: [], rev: [] }; order.push(a); }
        if (c) { var rv = fs.hasAttribute("data-rev"); (rv ? A[a].rev : A[a].fwd).push(rv ? 6 - +c.value : +c.value); }
      });
      var out = document.getElementById("hd-result");
      out.hidden = false;
      if (miss) {
        out.innerHTML = '<p class="pk-warn" role="alert">' + L("Please answer every question to see your result.", "يرجى الإجابة عن جميع الأسئلة لرؤية النتيجة.") + "</p>";
        miss.scrollIntoView({ behavior: "smooth", block: "center" }); miss.querySelector("input").focus({ preventScroll: true });
        return;
      }
      var D = JSON.parse(document.getElementById("hd-data").textContent);
      var role = +hd.querySelector("[name=crole]:checked").value, sector = +hd.querySelector("[name=csector]:checked").value;
      var mean = function (x) { return x.reduce(function (p, c) { return p + c; }, 0) / x.length; };
      var S = {}, flags = [];
      order.forEach(function (a) {
        var all = A[a].fwd.concat(A[a].rev);
        S[a] = Math.round((mean(all) - 1) / 4 * 100);
        if (A[a].fwd.length && A[a].rev.length && Math.abs(mean(A[a].fwd) - mean(A[a].rev)) >= 2) flags.push(a);
      });
      var overall = Math.round(mean(order.map(function (a) { return S[a]; })));
      var band = function (v) { return v >= 75 ? "hi" : v >= 50 ? "mid" : "lo"; };
      var bandName = { hi: L("Strong", "قوي"), mid: L("Building", "قيد البناء"), lo: L("Priority", "أولوية") };
      var low = order.slice().sort(function (a, b) { return S[a] - S[b]; }).filter(function (a) { return S[a] < 75; }).slice(0, 2);
      var head = '<span class="label">' + L("Your result", "النتيجة") + "</span><h2>" +
        (flags.length >= 3 ? L("Worth a second look", "تستحق نظرة ثانية") : role === 3 ? L("You're in the role: here's where to strengthen it", "أنت في المنصب: إليك أين تقوّي موقعك") : overall >= 75 ? L("You look ready for a director conversation", "تبدو جاهزاً للحديث عن منصب مدير إدارة") : overall >= 50 ? L("Real strengths, with gaps to close", "نقاط قوة حقيقية، مع فجوات تحتاج إلى سدّها") : L("A clear list of what to build next", "قائمة واضحة بما تبنيه في المرحلة القادمة")) +
        '</h2><p class="tc-index"><b>' + num(overall) + "</b><span>/" + num(100) + "</span> " + L("overall readiness index", "مؤشر الجاهزية العام") + "</p>";
      var bars = order.map(function (a) {
        var b = band(S[a]);
        return '<div class="pk-bar tc-bar tc-' + b + '"><span>' + D.names[a] + '</span><i style="--w:' + Math.max(S[a], 3) + '%"></i><b>' + num(S[a]) + '</b><em>' + bandName[b] + "</em></div>";
      }).join("");
      if (flags.length >= 3) low = [];
      var focus = flags.length >= 3 ? "" : low.length ? "<h3>" + L("Where to focus next", "أين تركّز بعد ذلك") + "</h3>" + low.map(function (a) { return "<p><b>" + D.names[a] + ".</b> " + (a === "visibility" && role === 3 ? D.advVis3 : D.adv[a]) + "</p>"; }).join("")
        : "<p>" + L("No area stands out as a gap. The next step is a direct conversation with your manager or sponsor about a director role, and what they would need to see.", "لا يظهر أي مجال كفجوة. الخطوة التالية محادثة مباشرة مع مديرك أو داعمك حول منصب مدير إدارة، وما الذي يحتاج أن يراه منك.") + "</p>";
      var fn = flags.map(function (a) { return D.names[a]; });
      var listEn = fn.length > 1 ? fn.slice(0, -1).join(", ") + " and " + fn[fn.length - 1] : fn[0];
      var cons = flags.length >= 3 ? '<p class="pk-mix">' + L("Many of your answers agree with both the positive and the negative statements. That usually means agreeing across the board rather than a real pattern. Read the statements again slowly, especially the negative ones, and answer for how things are today.", "كثير من إجاباتك يوافق العبارات الإيجابية والسلبية معاً، وهذا يعني عادة ميلاً عاماً إلى الموافقة لا نمطاً حقيقياً. اقرأ العبارات مرة أخرى بتمهّل، وخاصة السلبية منها، وأجب بحسب واقعك اليوم.") + "</p>"
        : flags.length ? '<p class="pk-mix">' + L("Your answers in " + listEn + " point in different directions. Read those statements again, or ask someone senior who knows your work how they'd answer.",
        "إجاباتك في " + (fn.length === 2 ? "مجالَي " + fn[0] + " و" + fn[1] : "مجال " + fn[0]) + " تشير إلى اتجاهات مختلفة. اقرأ تلك العبارات مرة أخرى، أو اسأل قيادياً يعرف عملك كيف كان سيجيب.") + "</p>" : "";
      var full = head + '<div class="tc-bars">' + bars + "</div>" + '<p class="tc-key">' + L("75 and above: strong. 50 to 74: building. Below 50: a priority.", "٧٥ فأكثر: قوي. من ٥٠ إلى ٧٤: قيد البناء. أقل من ٥٠: أولوية.") + "</p>" +
        "<h3>" + L("Reading it for where you are", "قراءة النتيجة في ضوء موقعك") + "</h3><p>" + D.stage[role] + (role === 1 && low.length === 2 ? " " + D.stage1extra : "") + " " + D.sector[sector] + "</p>" + cons + focus +
        '<div class="pk-acts">' + D.links + '<button type="button" class="btn line-d" onclick="window.print()">' + L("Save as PDF", "احفظ كملف PDF") + "</button></div>" +
        '<p class="pk-small">' + L("A structured reflection to help you decide where to focus, not a validated assessment.", "أداة تأمل منظّم تساعدك على تحديد أين تركّز، وليست تقييماً مقنّناً.") + "</p>";
      gated(out, head, full, { tool: "HR director readiness check", toolName: L("HR director readiness check", "مراجعة الجاهزية لمنصب مدير إدارة الموارد البشرية"),
        what: L("Enter your name and email to see your score in each area, what it means for where you are now and where to focus next. I'll email you a copy too.", "اكتب اسمك وبريدك الإلكتروني لترى درجتك في كل مجال، وماذا تعني في موقعك الحالي، وأين تركّز بعد ذلك. وسأرسل لك نسخة بالبريد أيضاً."),
        fade: bars,
        summary: function () { return plainOf("<p>" + L("Overall readiness index: ", "مؤشر الجاهزية العام: ") + num(overall) + "/" + num(100) + "</p>" + order.map(function (a) { return "<p>" + D.names[a] + ": " + num(S[a]) + " (" + bandName[band(S[a])] + ")</p>"; }).join("") + "<p>" + D.stage[role] + "</p>" + focus); } });
    });
  }
})();
