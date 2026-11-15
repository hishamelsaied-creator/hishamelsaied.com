(function () {
  var root = document.getElementById("sc");
  if (!root) return;
  var AR = document.documentElement.lang === "ar";
  var num = function (x) { return AR ? String(x).replace(/\d/g, function (d) { return "٠١٢٣٤٥٦٧٨٩"[d]; }) : String(x); };
  var D = AR ? {
    path: "/ar/hr-self-check/", contact: "/ar/contact/",
    opts: ["نادراً", "أحياناً", "غالباً", "دائماً تقريباً"],
    tags: ["يحتاج إلى عمل", "في تقدّم", "قوي"],
    count: "السؤال {n} من ١٥", back: "رجوع", tap: "اختر إجابة للانتقال",
    dh: "إلى أين أرسل نتائجك؟", dl: "ستصلك اللوحة والخريطة الحرارية على بريدك الإلكتروني خلال ٣ دقائق.",
    name: "الاسم", email: "البريد الإلكتروني للعمل", role: "المسمى الوظيفي والجهة (اختياري)",
    consent: "بإرسالك هذا النموذج توافق على أن أرسل لك نتائجك وأن أتواصل معك بخصوصها. لا أشارك بياناتك مع أي جهة.",
    send: "أرسل لي نتائجي", err: "يرجى كتابة اسمك وبريد إلكتروني صحيح.", sending: "جارٍ الإرسال...",
    doneh: "نتائجك في الطريق إليك.",
    donel: "ستصل اللوحة والخريطة الحرارية إلى {e} خلال ٣ دقائق. إن لم تجد الرسالة في بريدك الوارد، ابحث في البريد غير المرغوب فيه.",
    score: "درجتك الإجمالية:", of100: "من ١٠٠", see: "اعرض لوحتي الآن",
    fail: "تعذّر إرسال البريد الإلكتروني، لذلك نعرض نتائجك هنا.",
    rh: "نتائجك", rl: "كيف يرى رئيسك التنفيذي الموارد البشرية؟ بناءً على إجاباتك الخمس عشرة.",
    start: "من أين تبدأ", tryw: "جرّب هذا الأسبوع:", areas: "مجالاتك الخمسة", of9: "{s} من ٩",
    heat: "خريطة حرارية لإجاباتك الخمس عشرة",
    ctah: "هل تريد أن نناقش نتيجتك؟", ctal: "أرسل لي رسالة وأخبرني بالمجال الذي تريد العمل عليه.", ctab: "تواصل معي",
    note: "هذا تقييم ذاتي مبني على إجاباتك، وليس مقياساً نفسياً.", again: "أعد التقييم",
    bands: [
      [75, "يراك شريكاً في قيادة العمل", "من إجاباتك، يعاملك الرئيس التنفيذي كواحد من الفريق الذي يدير المؤسسة. الخطر في هذا المستوى أن تُسحب إلى كل شيء. أقل مجال في نتائجك يوضح أين تضع جهدك بعد ذلك."],
      [45, "يراك شخصاً يُعتمد عليه", "يثق الناس بأنك تنجز، ويأتون إليك عندما يحتاج أمر إلى حل. لكنهم لا يأتون إليك قبل القرار بعد. مجال أو مجالان في نتائجك يوضحان السبب."],
      [0, "يرى الموارد البشرية جهة دعم", "من إجاباتك، يُنظر إلى الموارد البشرية كفريق ينفذ الطلبات ويحل المشكلات. كثيراً ما يكون هذا هو الشكل الذي وُضع به الدور، ويمكن تغييره. ابدأ بمجال واحد وليس بالخمسة."]
    ],
    A: [
      { n: "مقعدك على طاولة القرار", q: [["أعرف بالقرارات الكبيرة في المؤسسة قبل اتخاذها.", "أعرف قبل القرار"], ["يسألني مديرو القطاعات عن رأيي في أمور لا علاقة لها بالموارد البشرية.", "يُطلب رأيي خارج تخصصي"], ["يتصل بي الرئيس التنفيذي ليفكر معي في أمر ما، وليس فقط عند وجود مشكلة تخص الموظفين.", "الرئيس يفكر معي"]],
        l: ["تعرف بالقرارات بعد اتخاذها، ودورك بعدها هو التنفيذ.", "تشارك في بعض النقاشات، وغالباً عندما يكون الموضوع عن الموظفين.", "يطلب القياديون رأيك مبكراً قبل أن يقرروا."],
        t: "اختر قراراً واحداً قادماً في هذا الربع. اطلب من صاحبه ٢٠ دقيقة قبل عرضه على فريق القيادة." },
      { n: "فهم أعمال المؤسسة", q: [["أستطيع أن أشرح كيف تحقق مؤسستنا إيراداتها أو تؤدي مهمتها بالوضوح نفسه الذي يشرح به المدير المالي.", "أفهم مصدر الإيرادات"], ["عندما أعرض على فريق القيادة، أقدّم أرقاماً تهم العمل.", "أعرض أرقاماً تهم العمل"], ["أعرف أهم ثلاث أولويات للرئيس التنفيذي هذا العام، وخطتي تدعم كل واحدة منها.", "خطتي تدعم أولوياته"]],
        l: ["تقاريرك تتحدث عن أنشطة الموارد البشرية، ولا يرى فريق القيادة أثرها على العمل.", "تعرف العمل جيداً، لكن تقاريرك ما زالت تبدأ بأنشطة الموارد البشرية.", "تتحدث عن العمل بالطريقة التي يتحدث بها مسؤولو المالية والعمليات."],
        t: "خذ تقريرك القادم وغيّر السطر الأول إلى نتيجة تخص العمل، مثل التكلفة أو الوقت أو الإيرادات أو المخاطر أو الخدمة." },
      { n: "إبداء الرأي", q: [["عندما أختلف مع الرئيس التنفيذي، أقول ذلك في الاجتماع.", "أختلف في الاجتماع"], ["أستطيع أن أقول لا لقيادي كبير وتبقى علاقتي به جيدة.", "أقول لا وتبقى العلاقة"], ["أخرج من اجتماعات القيادة وقد قلت ما أردت قوله.", "أقول ما أردت قوله"]],
        l: ["في الاجتماع تلتزم الصمت، ثم تقول رأيك بعده أو لا تقوله.", "تتكلم عندما تكون متأكداً. وعندما يكون الحضور كباراً أو الجو متوتراً تسكت.", "تقول للرئيس التنفيذي رأيك وتبقى العلاقة جيدة."],
        t: "قبل اجتماع القيادة القادم، اكتب النقطة الواحدة التي يجب أن تقولها. قلها في أول عشر دقائق." },
      { n: "أين يذهب وقتك", q: [["يذهب معظم أسبوعي في عمل لا يستطيع غيري القيام به.", "عمل لا يقوم به غيري"], ["يدير فريقي العمليات اليومية دون الرجوع إليّ.", "الفريق يدير اليوميات"], ["أخصص وقتاً في أسبوعي للتفكير ولا أتنازل عنه.", "وقت للتفكير"]],
        l: ["طلبات الآخرين تملأ أسبوعك، ولا يبقى وقت يُذكر للعمل الأهم.", "تتحكم في جزء من أسبوعك، لكن العمليات اليومية تسحبك إليها مرة بعد مرة.", "فريقك يدير العمل اليومي، وأنت تصرف وقتك على الأمور الكبيرة القليلة."],
        t: "اكتب ما فعلته الأسبوع الماضي. ضع علامة على ما كان يستطيع أحد أفراد فريقك القيام به. سلّم واحداً منها هذا الأسبوع." },
      { n: "مسارك المهني", q: [["أعرف ما المنصب الذي أريده بعد منصبي الحالي.", "أعرف منصبي القادم"], ["لديّ شخص من خارج مؤسستي أستطيع أن أتحدث معه بصراحة عما يشغلني.", "شخص أتحدث معه"], ["خلال العام الماضي، أخبرني شخص في موقع قيادي بصراحة كيف يراني الآخرون.", "رأي صريح عني"]],
        l: ["تهتم بتطوير الجميع ولا تهتم بتطوير نفسك.", "لديك تصور عام عما تريده بعد ذلك، لكن لا أحد تختبره معه.", "تعرف إلى أين تريد أن تصل، وحولك من يصارحك."],
        t: "اكتب جملة واحدة عن المنصب الذي تريده بعد ثلاث سنوات. اعرضها على شخص واحد تثق به." }
    ],
    mail: function (m) {
      return "مرحباً " + m.name + "،\n\nشكراً لإجرائك التقييم الذاتي. هذه نتيجتك اليوم.\n\nالإجمالي: " + num(m.p) + " من ١٠٠. " + m.band + ".\n\n" + m.lines + "\n\nمن أين تبدأ: " + m.low + ".\n" + m.tip +
        "\n\nلوحتك الكاملة والخريطة الحرارية:\n" + m.link + "\n\nإذا أردت أن نناقش نتيجتك، راسلني على hisham@hishamelsaied.com\n\nهشام السعيد\nhishamelsaied.com";
    }
  } : {
    path: "/hr-self-check/", contact: "/contact/",
    opts: ["Rarely", "Sometimes", "Often", "Almost always"],
    tags: ["Work on this", "Getting there", "Strong"],
    count: "Question {n} of 15", back: "Back", tap: "Tap an answer to move on",
    dh: "Where should I send your results?", dl: "Your dashboard and heat map will reach you by email within 3 minutes.",
    name: "Your name", email: "Work email", role: "Job title and organisation (optional)",
    consent: "By sending this you agree that I can email you your results and contact you about them. I don't share your details with anyone.",
    send: "Send me my results", err: "Please add your name and a valid email address.", sending: "Sending...",
    doneh: "Your results are on the way.",
    donel: "Your dashboard and heat map will reach {e} within 3 minutes. If the email isn't in your inbox, look in your junk folder.",
    score: "Your overall score:", of100: "out of 100", see: "See my dashboard now",
    fail: "The email could not be sent, so here are your results on screen.",
    rh: "Your results", rl: "How does your CEO see HR? From the 15 answers you gave.",
    start: "Where to start", tryw: "Try this week:", areas: "Your five areas", of9: "{s} of 9",
    heat: "Heat map of your 15 answers",
    ctah: "Want to talk through your result?", ctal: "Send me a note and tell me which area you want to work on.", ctab: "Get in touch",
    note: "This is a self-check based on your own answers. It is not a psychometric assessment.", again: "Take it again",
    bands: [
      [75, "Seen as a business leader", "From your answers, your CEO treats you as part of the team that runs the business. At this level the danger is getting pulled into everything. Your lowest area shows where to put your effort next."],
      [45, "Seen as a safe pair of hands", "People trust you to deliver, and they come to you when something needs fixing. They don't yet come to you before the decision. One or two of your areas explain why."],
      [0, "Seen as a support function", "From your answers, HR is seen as the team that handles requests and fixes problems. That is often how the role was set up, and it can change. Start with one area, not all five."]
    ],
    A: [
      { n: "Seat at the table", q: [["I hear about big business decisions before they are made.", "Hear before decisions"], ["Business heads ask what I think about things that have nothing to do with HR.", "Asked beyond HR"], ["My CEO calls me to think something through, not only when there is a people problem.", "CEO thinks with me"]],
        l: ["You find out about decisions after they are made. Your job then is to carry them out.", "You are in some of the discussions, usually when the topic is people.", "Leaders ask for your view early, before they decide."],
        t: "Pick one decision that is coming this quarter. Ask the person who owns it for 20 minutes before it goes to the leadership team." },
      { n: "Knowing the business", q: [["I can explain how we make money, or deliver our mandate, as well as our finance head can.", "Know how we earn"], ["When I present to the leadership team, I show numbers the business cares about.", "Show business numbers"], ["I know my CEO's top three priorities this year, and my plan supports each one.", "Plan supports CEO"]],
        l: ["Your updates are about HR activity. The leadership team can't see what it did for the business.", "You know the business well, but your updates still start with HR activity.", "You talk about the business the way finance and operations do."],
        t: "Take your next update and change the first line to a business result, such as cost, time, revenue, risk or service." },
      { n: "Speaking up", q: [["When I disagree with the CEO, I say it in the meeting.", "Disagree in the meeting"], ["I can say no to a senior leader and still have a good relationship with them.", "Say no, stay on terms"], ["I leave leadership meetings having said what I wanted to say.", "Say what I wanted"]],
        l: ["In the meeting you keep quiet. You say it afterwards, or you don't say it.", "You speak up when you are sure. When the room is senior or tense, you go quiet.", "You tell the CEO what you think, and the relationship is still good."],
        t: "Before your next leadership meeting, write down the one point you have to make. Make it in the first ten minutes." },
      { n: "Where your time goes", q: [["Most of my week goes on work that only I can do.", "Work only I can do"], ["My team runs the daily operations without coming back to me.", "Team runs operations"], ["I keep time in my week to think, and I don't give it away.", "Time to think"]],
        l: ["Other people's requests fill your week. There is little time left for the bigger work.", "You control part of your week, but daily operations keep pulling you back.", "Your team runs the day to day, and you spend your time on the few big things."],
        t: "Write down what you did last week. Mark what someone in your team could have done. Hand over one of those this week." },
      { n: "Your own career", q: [["I know what I want my next role to be.", "Know my next role"], ["I have someone outside my organisation I can talk things through with.", "Someone to talk to"], ["In the last year, someone senior told me honestly how I come across.", "Honest feedback"]],
        l: ["You look after everyone else's development and not your own.", "You have a rough idea of what comes next, but nobody to test it with.", "You know where you want to go, and you have people who tell you the truth."],
        t: "Write one sentence about the role you want in three years. Show it to one person you trust." }
    ],
    mail: function (m) {
      return "Hello " + m.name + ",\n\nThank you for taking the self-check. Here is where you stand today.\n\nOverall: " + m.p + " out of 100. " + m.band + ".\n\n" + m.lines + "\n\nWhere to start: " + m.low + ".\n" + m.tip +
        "\n\nYour full dashboard and heat map:\n" + m.link + "\n\nIf you would like to talk through your result, write to me at hisham@hishamelsaied.com\n\nHisham Elsaied\nhishamelsaied.com";
    }
  };

  var A = D.A, Q = [], ans = [], cur = 0;
  A.forEach(function (a, i) { a.q.forEach(function (q) { Q.push({ a: i, t: q[0], s: q[1] }); }); });
  var HC = ["#8f3b34", "#b9783c", "#c9ae82", "#4f8f72"], LC = ["#d98b80", "#e2c79a", "#8fcbb0"];
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var panes = ["sc-intro", "sc-quiz", "sc-details", "sc-done", "sc-dash"];
  function show(id) {
    panes.forEach(function (p) { $(p).hidden = p !== id; });
    var y = root.getBoundingClientRect().top + window.pageYOffset - 90;
    window.scrollTo(0, Math.max(0, y));
  }
  function calc(a) {
    var d = A.map(function () { return 0; });
    a.forEach(function (v, i) { d[Q[i].a] += v; });
    var tot = d.reduce(function (x, y) { return x + y; }, 0), low = 0;
    d.forEach(function (s, i) { if (s < d[low]) low = i; });
    var p = Math.round(tot / 45 * 100);
    return { d: d, p: p, low: low, band: D.bands.filter(function (b) { return p >= b[0]; })[0] };
  }
  function lvl(s) { return s <= 3 ? 0 : s <= 6 ? 1 : 2; }

  $("sc-quiz").innerHTML = '<div class="sc-small" id="sc-count"></div><div class="sc-bar"><i id="sc-prog"></i></div><div class="label" id="sc-area"></div>' +
    '<p class="sc-q" id="sc-qtext"></p><div class="sc-opts" id="sc-opts"></div><div class="sc-nav"><button type="button" class="sc-ghost" id="sc-back">' + D.back + '</button><span class="sc-small">' + D.tap + '</span></div>';
  $("sc-details").innerHTML = '<h2>' + D.dh + '</h2><p class="lead">' + D.dl + '</p>' +
    '<div style="position:absolute;left:-9999px" aria-hidden="true"><input id="sc-hp" type="text" tabindex="-1" autocomplete="off"></div>' +
    '<label for="sc-n">' + D.name + '</label><input type="text" id="sc-n" autocomplete="name">' +
    '<label for="sc-e">' + D.email + '</label><input type="email" id="sc-e" autocomplete="email" dir="ltr">' +
    '<label for="sc-t">' + D.role + '</label><input type="text" id="sc-t" autocomplete="organization-title">' +
    '<p class="sc-small" style="margin-top:16px">' + D.consent + '</p><div class="sc-err" id="sc-err" role="status"></div><button type="button" class="btn" id="sc-send">' + D.send + '</button>';
  $("sc-done").innerHTML = '<h2>' + D.doneh + '</h2><p class="lead" id="sc-donel"></p><p class="sc-quick">' + D.score + ' <b id="sc-quick"></b></p><button type="button" class="btn" id="sc-see">' + D.see + '</button>';

  function draw() {
    var q = Q[cur];
    $("sc-count").textContent = D.count.replace("{n}", num(cur + 1));
    $("sc-prog").style.width = (cur / Q.length * 100) + "%";
    $("sc-area").textContent = A[q.a].n;
    $("sc-qtext").textContent = q.t;
    var o = $("sc-opts"); o.innerHTML = "";
    D.opts.forEach(function (lb, v) {
      var b = document.createElement("button");
      b.type = "button"; b.textContent = lb;
      if (ans[cur] === v) b.className = "on";
      b.onclick = function () { ans[cur] = v; if (cur < Q.length - 1) { cur++; draw(); } else show("sc-details"); };
      o.appendChild(b);
    });
    $("sc-back").style.visibility = cur ? "visible" : "hidden";
  }

  function dash(a, failed) {
    var r = calc(a), low = r.low, n = 0, h = "";
    var rows = A.map(function (x, i) {
      var s = r.d[i], k = lvl(s);
      return '<div class="sc-row"><div class="sc-hd"><span>' + x.n + '</span><small>' + num(D.of9.replace("{s}", s)) + '</small></div><div class="sc-meter"><i style="width:' + (s / 9 * 100) + '%;background:' + LC[k] + '"></i></div><p><span class="sc-tag" style="background:' + LC[k] + '">' + D.tags[k] + '</span>' + x.l[k] + '</p></div>';
    }).join("");
    A.forEach(function (x) {
      h += '<div class="sc-hrow"><div class="sc-nm">' + x.n + '</div>';
      x.q.forEach(function (q) { h += '<div class="sc-cell" style="background:' + HC[a[n]] + (a[n] === 2 ? ";color:#1a1408" : "") + '">' + q[1] + '<em>' + D.opts[a[n]] + '</em></div>'; n++; });
      h += '</div>';
    });
    $("sc-dash").innerHTML = (failed ? '<p class="sc-fail">' + D.fail + '</p>' : '') + '<h2 class="sc-h1">' + D.rh + '</h2><p class="lead">' + D.rl + '</p>' +
      '<div class="sc-top"><div class="sc-ring" style="--p:' + r.p + '"><div><span><b>' + num(r.p) + '</b>' + D.of100 + '</span></div></div><div><p class="sc-band">' + r.band[1] + '</p><p>' + r.band[2] + '</p></div></div>' +
      '<div class="sc-start"><div class="label">' + D.start + '</div><h3>' + A[low].n + '</h3><p>' + A[low].l[lvl(r.d[low])] + '</p><p><b>' + D.tryw + '</b> ' + A[low].t + '</p></div>' +
      '<h3 class="sc-sub">' + D.areas + '</h3><div class="sc-rows">' + rows + '</div>' +
      '<h3 class="sc-sub">' + D.heat + '</h3><div class="sc-heat">' + h + '</div>' +
      '<div class="sc-legend">' + D.opts.map(function (o, i) { return '<span><i style="background:' + HC[i] + '"></i>' + o + '</span>'; }).join("") + '</div>' +
      '<div class="sc-cta"><h3>' + D.ctah + '</h3><p class="lead">' + D.ctal + '</p><a class="btn" href="' + D.contact + '">' + D.ctab + '</a></div>' +
      '<p class="sc-small">' + D.note + ' <a href="' + D.path + '">' + D.again + '</a></p>';
    show("sc-dash");
  }

  $("sc-go").onclick = function () { show("sc-quiz"); draw(); };
  $("sc-back").onclick = function () { if (cur) { cur--; draw(); } };
  $("sc-see").onclick = function () { dash(ans, false); };
  $("sc-send").onclick = function () {
    var name = $("sc-n").value.trim(), email = $("sc-e").value.trim(), role = $("sc-t").value.trim(), btn = $("sc-send");
    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { $("sc-err").textContent = D.err; return; }
    var r = calc(ans), link = "https://hishamelsaied.com" + D.path + "#r=" + ans.join("");
    var done = function () {
      $("sc-donel").textContent = D.donel.replace("{e}", email);
      $("sc-quick").textContent = num(r.p) + " " + D.of100;
      show("sc-done");
    };
    if ($("sc-hp").value) { done(); return; }
    var body = {
      _subject: "Self-check result: " + name + ", " + r.p + " out of 100",
      _template: "table", _captcha: "false",
      _autoresponse: D.mail({ name: name, p: r.p, band: r.band[1], low: A[r.low].n, tip: A[r.low].t, link: link,
        lines: A.map(function (x, i) { return x.n + ": " + num(D.of9.replace("{s}", r.d[i])); }).join("\n") }),
      Name: name, email: email, "Job title and organisation": role,
      Score: r.p + " out of 100", Result: r.band[1], "Start with": A[r.low].n
    };
    A.forEach(function (x, i) { body[x.n] = r.d[i] + " of 9"; });
    body.Answers = Q.map(function (q, i) { return (i + 1) + ". " + q.s + ": " + D.opts[ans[i]]; }).join(" | ");
    body.Dashboard = link;
    body.Language = AR ? "Arabic" : "English";
    btn.disabled = true; $("sc-err").textContent = D.sending;
    fetch("https://formsubmit.co/ajax/hisham@hishamelsaied.com", {
      method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(body)
    }).then(function (res) { return res.json().catch(function () { return {}; }).then(function (d) { return res.ok && String(d.success) !== "false"; }); })
      .catch(function () { return false; })
      .then(function (ok) { btn.disabled = false; $("sc-err").textContent = ""; if (ok) done(); else dash(ans, true); });
  };

  var m = /^#r=([0-3]{15})$/.exec(location.hash);
  if (m) dash(m[1].split("").map(Number), false);
})();
