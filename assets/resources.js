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
      var head = '<span class="label">' + L("Your result", "النتيجة") + "</span><h2>" + r.title + "</h2>";
      var full = head + "<p>" + r.why + "</p>" + bars +
        "<h3>" + L("What to do next", "الخطوة التالية") + "</h3><ul>" + r.next.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>" +
        (mix ? '<p class="pk-mix">' + R[second].mix + "</p>" : "") +
        '<div class="pk-acts">' + r.cta + '<button type="button" class="btn line-d" onclick="window.print()">' + L("Save as PDF", "احفظ كملف PDF") + "</button></div>" +
        '<p class="pk-small">' + L("This is a guide to help you think, not a diagnosis.", "هذه أداة تساعدك على التفكير، وليست تشخيصاً.") + "</p>";
      gated(out, head, full, { tool: "Coaching, mentoring or training picker", toolName: L("coaching, mentoring or training tool", "أداة كوتشينج أم إرشاد أم تدريب"),
        what: L("Enter your name and email to see why, your scores and what to do next. I'll email you a copy too.", "اكتب اسمك وبريدك الإلكتروني لترى السبب، ودرجاتك، والخطوة التالية. وسأرسل لك نسخة بالبريد أيضاً."),
        fade: "<p>" + r.why + "</p>" + bars,
        summary: function () { return plainOf("<p>" + r.title + "</p><p>" + r.why + "</p>" + ["c", "m", "t"].map(function (k) { return "<p>" + R[k].name + ": " + num(s[k]) + "/" + num(n) + "</p>"; }).join("") + r.next.map(function (x) { return "<p>- " + x + "</p>"; }).join("")); } });
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
      fields.forEach(function (f) { f.value = ""; }); store.del(KEY); dates();
    });
  }
  // ---------- Feedback conversation builder ----------
  var fb = document.getElementById("fb");
  if (fb) {
    var LABELS = AR ? ["كسول", "وقح", "مهمل", "سلبي", "غير مهني", "متكبر", "دائماً", "دائما", "أبداً", "ابدا", "مستهتر", "دائمًا", "أبدًا", "أبدا", "دوماً", "غير ملتزم", "لا مبالي", "فوضوي", "متعجرف", "تصرفاتك"]
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
      if (!AR) ask = ask.replace(/^(i'?d like (you )?to|please|to)\s+/i, "");
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
      var plain = steps.map(function (s) { return s[1].replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"'); }).join("\n\n");
      var lab = '<span class="label">' + L("Your conversation", "محادثتك") + "</span>";
      var li = function (st) { return "<li><b>" + st[0] + "</b><p>" + st[1] + "</p></li>"; };
      var full = lab + '<ol class="fb-script">' + steps.map(li).join("") + "</ol>" +
        "<h3>" + L("Before you go in", "قبل أن تبدأ") + "</h3><ul>" +
        (pos ? [L("Say it soon after it happened. Specific praise lands better than general thanks.", "قلها بعد الموقف بوقت قصير. الثناء المحدد أعمق أثراً من الشكر العام."), L("In public or in private both work for praise, but know the person. Some prefer it quietly.", "يصلح الثناء أمام الآخرين أو على انفراد، لكن راعِ طبيعة الشخص، فبعض الناس يفضّلونه بعيداً عن الأضواء.")]
             : [L("Have it in private, and leave the person a way to keep their dignity.", "اجعل المحادثة على انفراد، واترك للشخص طريقاً يحفظ به كرامته."), L("Use your own words. This is a structure, not a script to read out.", "استخدم كلماتك. هذا هيكل للمحادثة، لا نصّ تقرؤه حرفياً."), L("Be ready to hear something you didn't know.", "كن مستعداً لسماع أمر لم تكن تعرفه.")]).map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>" +
        '<div class="pk-acts"><button type="button" class="btn x-dark" id="fb-copy">' + L("Copy", "انسخ") + '</button><button type="button" class="btn line-d" onclick="window.print()">' + L("Save as PDF", "احفظ كملف PDF") + "</button></div>";
      gated(out, lab + '<ol class="fb-script">' + steps.slice(0, 2).map(li).join("") + "</ol>", full, { tool: "Feedback conversation builder", toolName: "", title: L("See your full conversation", "اعرض المحادثة كاملة"),
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
      var areas = {}, order = [], total = 0, miss = null;
      tc.querySelectorAll("fieldset").forEach(function (fs) {
        var a = fs.getAttribute("data-area"), c = fs.querySelector("input:checked");
        if (!(a in areas)) { areas[a] = 0; order.push(a); }
        fs.classList.toggle("miss", !c);
        if (!c && !miss) miss = fs;
        if (c) { areas[a] += +c.value; total += +c.value; }
      });
      var out = document.getElementById("tc-result");
      out.hidden = false;
      if (miss) {
        out.innerHTML = '<p class="pk-warn" role="alert">' + L("Please answer every question to see your result.", "يرجى الإجابة عن جميع الأسئلة لرؤية النتيجة.") + "</p>";
        miss.scrollIntoView({ behavior: "smooth", block: "center" }); miss.querySelector("input").focus({ preventScroll: true });
        return;
      }
      var D = JSON.parse(document.getElementById("tc-data").textContent);
      var vals = order.map(function (a) { return areas[a]; }), even = Math.max.apply(null, vals) === Math.min.apply(null, vals);
      var low = even ? [] : order.slice().sort(function (a, b) { return areas[a] - areas[b]; }).filter(function (a) { return areas[a] < 7; }).slice(0, 2);
      var band = total >= 34 ? L("You're in good shape", "أنت في وضع جيد") : total >= 22 ? L("A solid start, with gaps to close", "بداية جيدة، مع فجوات تحتاج إلى سدّها") : L("Worth focusing on now", "هناك ما يستحق تركيزك الآن");
      var bars = order.map(function (a) {
        return '<div class="pk-bar"><span>' + a + '</span><i style="--w:' + Math.round(areas[a] / 8 * 100) + '%"></i><b>' + num(areas[a]) + "/" + num(8) + "</b></div>";
      }).join("");
      var head = '<span class="label">' + L("Your result", "النتيجة") + "</span><h2>" + band + "</h2><p>" +
        L("Your score is " + total + " out of 40.", "مجموعك " + num(total) + " من " + num(40) + ".") + "</p>";
      var focus = low.length ? "<h3>" + L("Where to focus next", "أين تركّز بعد ذلك") + "</h3>" + low.map(function (a) { return "<p><b>" + a + ".</b> " + D.adv[a] + "</p>"; }).join("")
                    : even && total < 34 ? "<p>" + L("All five areas scored the same, so no single one stands out. Start with relationships: they make everything else easier.", "حصلت المجالات الخمسة على الدرجة نفسها، فلا يبرز أحدها. ابدأ بالعلاقات، فهي تسهّل كل ما عداها.") + "</p>"
                    : "<p>" + L("No area stands out as a risk. Keep reviewing these every month: things shift quickly in a new role.", "لا يبدو أي مجال مصدر خطر. واصل مراجعة هذه الجوانب شهرياً، فالأمور تتغير بسرعة في الدور الجديد.") + "</p>";
      var full = head + "<p>" + L("Here's how it breaks down.", "وهذا توزيعه.") + "</p>" + bars + focus +
        '<div class="pk-acts">' + D.links + '<button type="button" class="btn line-d" onclick="window.print()">' + L("Save as PDF", "احفظ كملف PDF") + "</button></div>" +
        '<p class="pk-small">' + L("This is a guide to help you think, not an assessment.", "هذه أداة تساعدك على التفكير، وليست تقييماً.") + "</p>";
      gated(out, head, full, { tool: "Leadership transition check", toolName: L("leadership transition check", "مراجعة الانتقال إلى دور قيادي"),
        what: L("Enter your name and email to see your score in each area and where to focus next. I'll email you a copy too.", "اكتب اسمك وبريدك الإلكتروني لترى درجتك في كل مجال وأين تركّز بعد ذلك. وسأرسل لك نسخة بالبريد أيضاً."),
        fade: bars,
        summary: function () { return plainOf("<p>" + band + " (" + num(total) + "/" + num(40) + ")</p>" + order.map(function (a) { return "<p>" + a + ": " + num(areas[a]) + "/" + num(8) + "</p>"; }).join("") + focus); } });
    });
  }
})();
