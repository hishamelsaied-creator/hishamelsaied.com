(function () {
  var root = document.getElementById("sc");
  if (!root) return;
  var AR = document.documentElement.lang === "ar";
  var BOOK = "https://app.cronofy.com/add_to_calendar/scheduling/ZOT6eIZc";
  var BASE = location.hostname === "hishamelsaied.com" ? location.origin : "http://hishamelsaied.com";
  var num = function (x) { return AR ? String(x).replace(/\d/g, function (d) { return "٠١٢٣٤٥٦٧٨٩"[d]; }) : String(x); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var enc = function (s) { try { return btoa(unescape(encodeURIComponent(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); } catch (e) { return ""; } };
  var dec = function (s) { try { s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; return decodeURIComponent(escape(atob(s))); } catch (e) { return ""; } };

  var D = AR ? {
    path: "/ar/hr-self-check/", contact: "/ar/contact/",
    lv: ["لم يبدأ", "بداية", "راسخ", "متقدّم"],
    count: "السؤال {n} من ١٥", back: "رجوع", tap: "اختر الإجابة الأقرب إلى الواقع اليوم",
    dh: "إلى أين أرسل تقريرك؟", dl: "يصلك التقرير على بريدك الإلكتروني خلال ٣ دقائق، مع رابط لنسخة قصيرة ترسلها إلى رئيسك التنفيذي إن أردت.",
    name: "الاسم", email: "البريد الإلكتروني للعمل", role: "المسمى الوظيفي والجهة (اختياري)",
    consent: "بإرسالك هذا النموذج توافق على أن أرسل لك تقريرك وأن أتواصل معك بخصوصه. أستخدم بياناتك لهذا الغرض فقط ولا أعطيها لأي جهة أخرى.",
    send: "أرسل لي تقريري", err: "يرجى كتابة اسمك وبريد إلكتروني صحيح.", sending: "جارٍ الإرسال...",
    doneh: "تقريرك في الطريق إليك.",
    donel: "سيصل التقرير إلى {e} خلال ٣ دقائق. إن لم تجد الرسالة في بريدك الوارد، ابحث في البريد غير المرغوب فيه.",
    score: "درجتك الإجمالية:", of100: "من ١٠٠", see: "اعرض تقريري الآن",
    fail: "تعذّر إرسال البريد الإلكتروني، وهذا تقريرك على الشاشة.",
    rh: "تقرير تأثير الموارد البشرية", rl: "كيف يرى رئيسك التنفيذي الموارد البشرية على الأرجح اليوم، بناءً على إجاباتك الخمس عشرة.",
    quoteh: "ما يقوله رئيسك التنفيذي على الأرجح",
    areas: "مجالاتك الخمسة", of9: "{s} من ٩", heat: "إجاباتك الخمس عشرة",
    pri: "مجالا الأولوية", prl: "الأولوية", now: "أين أنت الآن", next: "كيف يبدو المستوى التالي", plan: "خطتك لـ ٩٠ يوماً",
    d: ["الأيام ١ إلى ٣٠", "الأيام ٣١ إلى ٦٠", "الأيام ٦١ إلى ٩٠"], wk: "هذا الأسبوع:",
    ceoq: "خمسة أسئلة تطرحها على رئيسك التنفيذي", ceoql: "هذا التقييم يعكس رؤيتك أنت. أما الإجابة الحقيقية فعند رئيسك التنفيذي. اطرح هذه الأسئلة في لقائكما القادم.",
    cmph: "اطلب رأي رئيسك التنفيذي", cmpl: "أرسل إلى رئيسك التنفيذي أو مديرك المباشر نسخة من دقيقتين بالأسئلة نفسها. حين ينتهي، يصلك على بريدك الإلكتروني تقرير يضع رؤيتيكما جنباً إلى جنب ويبيّن أين تختلفان.",
    cmpb: "انسخ الرابط", cmpw: "أرسل عبر واتساب", cmpm: "أرسل بالبريد الإلكتروني", copied: "تم نسخ الرابط",
    cmpmsg: "أقوم بتقييم لطريقة عمل الموارد البشرية مع فريق القيادة، وأقدّر رأيك الصريح. ١٥ سؤالاً قصيراً تستغرق نحو ٣ دقائق: ",
    cmpsub: "رأيك في طريقة عمل الموارد البشرية معك",
    pdf: "حمّل التقرير (PDF)", pdfn: "اختر «حفظ بصيغة PDF» في الشاشة التالية.",
    ctah: "هل تريد الحديث عن نتيجتك؟", ctal: "أرسل لي رسالة وأخبرني بالمجال الذي تريد العمل عليه.", ctab: "تواصل معي", bookb: "احجز مكالمة لمدة ٣٠ دقيقة",
    note: "هذا تقييم ذاتي مبني على إجاباتك، وليس اختباراً نفسياً.", again: "أعد التقييم",
    ceoh: "{n} يطلب رأيك", ceoh0: "طُلب رأيك",
    ceolead: "١٥ سؤالاً قصيراً عن طريقة عمل الموارد البشرية معك ومع فريق القيادة. يستغرق نحو ٣ دقائق. أجب بحسب الواقع اليوم، لا بحسب ما ينبغي أن يكون.",
    ceofacts: ["<b>لا توجد إجابات صحيحة أو خاطئة.</b> الرأي الصريح هو الأكثر فائدة.", "<b>تُرسل إجاباتك إلى {n}</b> ليتمكّن من مقارنتها برؤيته ومناقشتها معك."],
    ceogo: "ابدأ",
    ceodh: "أرسل إجاباتك إلى {n}", ceodl: "يصل إلى {n} تقرير يقارن رؤيتيكما. اسمك اختياري.",
    ceoname: "اسمك ومنصبك (اختياري)",
    ceoconsent: "تُرسل إجاباتك إلى {n} وإلى هشام السعيد، الذي يدير هذا التقييم، ولا تُشارك مع أي جهة أخرى.",
    ceosend: "أرسل إجاباتي", ceodoneh: "شكراً لك.", ceodonel: "سيصل إلى {n} تقرير يضع رؤيتيكما جنباً إلى جنب. هذه المقارنة أدناه.",
    you0: "زميلك في الموارد البشرية",
    cph: "رؤيتان للموارد البشرية", cpl: "كيف يرى {n} دور الموارد البشرية، مقارنةً برؤية الرئيس التنفيذي أو المدير المباشر.",
    vy: "رؤية {n}", vc: "رؤية الرئيس التنفيذي",
    gaps: "ابدآ بهذه الأسئلة", gapl: "الأسئلة التي تختلف فيها رؤيتاكما أكثر من غيرها.", nogap: "رؤيتاكما متطابقتان في كل الأسئلة. هذا نادر، وهو أساس قوي.",
    cmpcta: "إذا أردتما مناقشة الفجوات مع كوتش محايد، أرسل لي رسالة.",
    bands: [
      [80, "يُنظر إليها كقيادة في العمل", "«الموارد البشرية جزء من طريقة إدارتنا لهذه المؤسسة.»", "تشير إجاباتك إلى أن الموارد البشرية جزء من إدارة المؤسسة. الخطر في هذا المستوى هو الانشغال بكل شيء. استخدم أضعف مجالاتك لتقرر أين تتراجع خطوة، لا أين تتقدم فقط."],
      [60, "يُنظر إليها كمستشار موثوق", "«أراجع الجانب البشري مع الموارد البشرية قبل أن أقرر.»", "يقدّر القادة مشورة الموارد البشرية، خاصة في شؤون الموظفين. الخطوة التالية هي المشاركة قبل تحديد الخيارات، وفي قرارات لا تبدو متعلقة بالموظفين."],
      [35, "يُنظر إليها كخدمة يُعتمد عليها", "«الموارد البشرية تنفّذ ما نطلبه. أريد منها أن تأتيني بالمزيد.»", "الموارد البشرية محل ثقة في التنفيذ، وهذا مهم. لكنها تُشرك غالباً بعد اتخاذ القرارات. مجالا الأولوية أدناه يبيّنان من أين تبدأ في تغيير ذلك."],
      [0, "يُنظر إليها كفريق إداري", "«الموارد البشرية تُبقي الأمور تسير. لا أحتاج إليها في القرارات الكبيرة.»", "يُنظر إلى الموارد البشرية أساساً في الإجراءات وحل المشكلات. هكذا صُمم الدور في كثير من الأحيان، ويمكن تغييره. ركّز على مجالي الأولوية أدناه، لا على المجالات الخمسة دفعة واحدة."]
    ],
    cq: ["حين يكون أمامك قرار صعب، في أي مرحلة تريد أن تُشرك الموارد البشرية؟",
      "ما الشيء الذي فعلته الموارد البشرية هذا العام وأحدث فرقاً حقيقياً في العمل، وما الشيء الذي تريدني أن أتوقف عنه؟",
      "أين ترى أن الموارد البشرية تقضي وقتاً أكثر من اللازم، وأين تقضي وقتاً أقل؟",
      "حين أختلف معك، هل تفضّل أن أقول ذلك في الاجتماع أم بعده؟",
      "لو استطعت تغيير شيء واحد في طريقة عمل الموارد البشرية مع فريق القيادة، فماذا سيكون؟"],
    A: [
      { n: "الحضور المبكر في القرار", q: [
        ["قرار كبير (إعادة هيكلة، أو نشاط جديد، أو خفض كبير في التكاليف) قيد النقاش في الإدارة العليا. متى تُشرك الموارد البشرية عادةً؟", ["عند الإعلان عنه، لتنفيذه", "قبل القرار بقليل، لتخطيط أثره على الموظفين", "والخيارات ما زالت مفتوحة، لتقديم المشورة في الجانب البشري", "من البداية، للمساعدة في تحديد الخيار الذي يُعتمد"], "الإشراك في القرارات"],
        ["كيف تشارك الموارد البشرية في اجتماعات فريق القيادة؟", ["ليست عضواً دائماً، وتحضر حين تُدعى لبند معيّن", "تحضر، لكنها تتحدث غالباً في بنود الموارد البشرية", "تساهم في معظم المواضيع، لا في شؤون الموظفين فقط", "يتوقع القادة رأيها، ويسألون عنه إذا لم تتحدث"], "الدور في اجتماعات القيادة"],
        ["حين يريد الرئيس التنفيذي التفكير في مسألة صعبة، بمن يتصل؟", ["نادراً ما تعرف الموارد البشرية بها قبل اتخاذ القرار", "يتصل بالموارد البشرية حين تتعلق المسألة بوضوح بالموظفين", "الموارد البشرية من القلة الذين يستشيرهم في معظم المسائل الكبيرة", "الموارد البشرية عادةً من أول شخصين أو ثلاثة يتصل بهم"], "من يستشيره الرئيس التنفيذي"]],
        l: ["تعرف الموارد البشرية بالقرارات الكبيرة بعد اتخاذها، ودورها أن تنفّذها.", "تُشرك الموارد البشرية في بعض القرارات، عادةً حين يتضح الجانب البشري.", "يُشرك القادة الموارد البشرية والخيارات ما زالت مفتوحة."],
        nx: ["أن تعرف بالقرارات قبل إعلانها، فيُخطط أثرها على الموظفين بدل ترقيعه لاحقاً.", "أن يُطلب رأيك والخيارات ما زالت مفتوحة، وفي مواضيع تتجاوز شؤون الموظفين.", "أن تكون الشخص الذي يفكر معه الرئيس التنفيذي بصوت عالٍ، دون أن تنشغل بكل شيء."],
        p: ["اكتب أكبر خمسة قرارات قادمة خلال الأشهر الستة المقبلة. لكل قرار، اعرف من صاحبه ومتى سيُتخذ.", "قابل صاحب كل قرار قبل عرضه على فريق القيادة. احمل نقطة عن الخطر البشري ونقطة عمّا يجعل القرار ينجح.", "اطلب من الرئيس التنفيذي مباشرة أن يُشرك الموارد البشرية في النقاش المبكر للقرار الكبير التالي، مستشهداً بأحد هذه القرارات."],
        w: "اختر قراراً واحداً قادماً هذا الربع، واطلب من صاحبه ٢٠ دقيقة قبل وصوله إلى فريق القيادة." },
      { n: "المصداقية في فهم العمل", q: [
        ["كيف تعرض الموارد البشرية عملها على فريق القيادة؟", ["أنشطة: دورات نُفذت، ووظائف شُغلت، وسياسات صدرت", "أنشطة مع بعض مؤشرات الموارد البشرية مثل معدل الدوران ومدة التوظيف", "مؤشرات موارد بشرية مرتبطة بنتائج العمل مثل التكلفة أو الإنتاجية أو الخدمة", "نتائج العمل أولاً، ثم ما فعلته الموارد البشرية لتحقيقها"], "طريقة عرض العمل"],
        ["لو طلب الرئيس التنفيذي من الموارد البشرية شرح الوضع المالي للمؤسسة، أو وضع تنفيذ مهامها، في دقيقتين، ماذا سيحدث؟", ["ستحيل الموارد البشرية السؤال إلى الإدارة المالية", "تستطيع ذكر العناوين الرئيسية دون الأسباب", "تستطيع شرح العوامل والضغوط الرئيسية بثقة", "تشرحه كما يشرحه المدير المالي، وتربطه بخطة الموارد البشرية"], "فهم الأرقام"],
        ["إلى أي مدى تتبع خطة الموارد البشرية أولويات الرئيس التنفيذي لهذا العام؟", ["كُتبت الخطة بشكل منفصل، ومعظمها من احتياجات الموارد البشرية نفسها", "تذكر الأولويات، لكن معظم العمل هو العمل المعتاد", "معظم المبادرات تدعم بوضوح إحدى أولويات الرئيس التنفيذي", "كل مبادرة رئيسية مرتبطة بأولوية، وتوقفت المبادرات التي لا ترتبط بأي منها"], "ارتباط الخطة بالأولويات"]],
        l: ["تتحدث الموارد البشرية عن أنشطتها، ولا يرى فريق القيادة ما قدّمته للعمل.", "تعرف الموارد البشرية العمل جيداً، لكن تقاريرها ما زالت تبدأ بمؤشرات الموارد البشرية.", "تتحدث الموارد البشرية عن العمل بلغة الإدارة المالية والعمليات نفسها."],
        nx: ["تقارير تبدأ بنتيجة عمل يتابعها الرئيس التنفيذي أصلاً.", "خطة موارد بشرية ترتبط كل مبادرة كبيرة فيها بأولوية للرئيس التنفيذي، ويتوقف ما لا يرتبط.", "أن تكون من يربط خطة الموارد البشرية بالأرقام في كل نقاش للقيادة."],
        p: ["اجلس ساعة مع المدير المالي. اسأله ما الذي يحرّك التكلفة أو الإيرادات أو مستوى الخدمة هذا العام، وأي الأرقام يتابعها الرئيس التنفيذي.", "أعد كتابة تقريرك القادم لفريق القيادة. ابدأ بنتيجة عمل، ثم بيّن ما فعلته الموارد البشرية لتحقيقها.", "اربط كل مبادرة للموارد البشرية بأولوية واحدة للرئيس التنفيذي. أوقف أو أجّل مبادرة لا ترتبط بأي منها، وأخبره بذلك."],
        w: "خذ تقريرك القادم وغيّر سطره الأول ليكون نتيجة عمل، مثل التكلفة أو الوقت أو الإيرادات أو المخاطر أو الخدمة." },
      { n: "الاعتراض البنّاء", q: [
        ["حين تختلف الموارد البشرية مع قرار يميل إليه الرئيس التنفيذي، ماذا يحدث عادةً؟", ["تمضي معه، وتتعامل مع العواقب لاحقاً", "تطرح ملاحظاتها على انفراد بعد الاجتماع", "تطرحها في الاجتماع بحذر ومع سبب واضح", "تعترض بوضوح وتقدّم بديلاً، والرئيس التنفيذي يتوقع ذلك"], "الاختلاف مع الرئيس التنفيذي"],
        ["يطلب قائد كبير شيئاً يخالف السياسة أو العدالة، مثل راتب استثنائي أو تعيين شخص مقرّب. ماذا تفعل الموارد البشرية؟", ["توافق غالباً حفاظاً على العلاقة", "ترفض بالإشارة إلى السياسة", "تشرح الخطر على العمل وتقترح طريقة أخرى لتحقيق الهدف", "ترفض حين يلزم، ويعود إليها القائد للمشورة رغم ذلك"], "قول لا لقائد كبير"],
        ["متى غيّرت الموارد البشرية آخر مرة رأي الرئيس التنفيذي في أمر مهم؟", ["لا أتذكر مرة", "منذ أكثر من عام", "خلال العام الماضي", "خلال الأشهر الثلاثة الماضية"], "تغيير رأي الرئيس التنفيذي"]],
        l: ["تمضي الموارد البشرية مع قرارات لا توافق عليها، وتتحمل كلفتها لاحقاً.", "تطرح الموارد البشرية ملاحظاتها، لكن غالباً على انفراد، أو بالإشارة إلى السياسة فقط.", "تختلف الموارد البشرية علناً، وتقدّم بديلاً، والرئيس التنفيذي يتوقع ذلك."],
        nx: ["أن تطرح ملاحظة واحدة في الاجتماع، بسبب يتعلق بالعمل لا بالسياسة.", "أن تعترض في الاجتماع ومعك بديل جاهز، فيرى الرئيس التنفيذي خيارات لا اعتراضات.", "أن تغيّر رأي الرئيس التنفيذي في أمر مهم بطريقة تقوّي العلاقة."],
        p: ["اتفق مع الرئيس التنفيذي على الطريقة التي يفضّل أن يسمع بها الاختلاف: في الاجتماع، أو قبله، أو على انفراد. اسأله مباشرة.", "قبل كل اجتماع للقيادة، اكتب النقطة الواحدة التي يجب أن تقولها. قلها في أول عشر دقائق، مع سبب يتعلق بالعمل.", "حين ترفض طلباً لقائد كبير، قدّم خياراً ثانياً يحقق له معظم ما يريد. تابع كم مرة يُقبل."],
        w: "قبل اجتماع القيادة القادم، اكتب النقطة الواحدة التي يجب أن تقولها، وقلها في أول عشر دقائق." },
      { n: "أين يذهب وقت الموارد البشرية", q: [
        ["تقريباً، كم من أسبوع رئيس الموارد البشرية يذهب إلى العمل الاستراتيجي، مثل التخطيط وتقديم المشورة للقادة وبناء قدرات المستقبل؟", ["أقل من ١٠٪", "من ١٠ إلى ٢٥٪", "من ٢٥ إلى ٥٠٪", "أكثر من النصف"], "وقت العمل الاستراتيجي"],
        ["حين تظهر مشكلة روتينية، مثل خطأ في الرواتب أو تأخر تأشيرة أو شكوى، من يتعامل معها؟", ["يُسحب إليها رئيس الموارد البشرية بنفسه عادةً", "يتعامل معها الفريق، لكن رئيس الموارد البشرية يُبلَّغ ويتدخل كثيراً", "يتعامل معها الفريق، ولا يعرف بها رئيس الموارد البشرية إلا إذا تصاعدت", "يتعامل معها الفريق بالكامل، بإجراءات وأنظمة واضحة"], "المشكلات اليومية"],
        ["كم مرة تخصص الموارد البشرية وقتاً للسنتين أو الثلاث المقبلة: تخطيط القوى العاملة، والتعاقب الوظيفي، ومهارات المستقبل؟", ["فقط حين تفرض أزمة ذلك", "مرة في السنة، في موسم التخطيط", "كل ربع سنة، بمشاركة القادة", "بند ثابت على أجندة فريق القيادة"], "التفكير في المستقبل"]],
        l: ["تملأ المسائل اليومية الأسبوع، ولا يبقى وقت يُذكر للعمل الذي يقدّره الرئيس التنفيذي أكثر.", "يتعامل الفريق مع معظم العمليات، لكن رئيس الموارد البشرية يُسحب إليها كثيراً.", "يدير الفريق العمليات، ويقضي رئيس الموارد البشرية وقتاً حقيقياً في السنتين أو الثلاث المقبلة."],
        nx: ["فريق وإجراءات تتعامل مع المسائل الروتينية دون رئيس الموارد البشرية.", "وقت محمي كل أسبوع للتخطيط، وتقديم المشورة للقادة، وبناء قدرات المستقبل.", "أن يكون تخطيط القوى العاملة والتعاقب الوظيفي بنداً ثابتاً على أجندة القيادة."],
        p: ["سجّل الأسبوع الماضي ساعة بساعة. ضع علامة على كل ما كان يستطيع شخص في فريقك أن يقوم به.", "سلّم أكبر ثلاثة منها مع صلاحيات قرار واضحة. احجز أربع ساعات أسبوعياً للعمل الاستراتيجي واحمِها.", "اعرض على فريق القيادة تصوراً أولياً للقوى العاملة التي ستحتاجونها بعد سنتين أو ثلاث."],
        w: "اكتب ما فعلته الأسبوع الماضي، وضع علامة على ما كان يستطيع أحد في فريقك أن يقوم به، وسلّم واحداً منها هذا الأسبوع." },
      { n: "صياغة الأجندة", q: [
        ["من أين تأتي معظم مشاريع الموارد البشرية الكبيرة؟", ["طلبات من إدارات العمل أو من الجهات الرقابية", "طلبات في الغالب، مع بعض أفكار الموارد البشرية", "توازن بين الطلبات ومقترحات الموارد البشرية", "مقترحات الموارد البشرية، مبنية على ما سيحتاجه العمل"], "مصدر المشاريع"],
        ["خلال العام الماضي، كم مرة وضعت الموارد البشرية بنداً على أجندة فريق القيادة بمبادرة منها؟", ["ولا مرة", "مرة أو مرتين", "من ٣ إلى ٥ مرات", "أكثر من ٥ مرات"], "بنود بمبادرة منها"],
        ["كيف يصف فريق القيادة المساهمة الرئيسية للموارد البشرية اليوم؟", ["إجراءات: رواتب وتأشيرات وعقود وسياسات", "خدمة: توظيف وتدريب وحل مشكلات الموظفين", "مشورة: مساعدة القادة على اتخاذ قرارات أفضل بشأن الموظفين", "توجيه: تشكيل المؤسسة وقادتها وثقافتها"], "كيف يُرى دورها"]],
        l: ["تستجيب الموارد البشرية لطلبات إدارات العمل والجهات الرقابية، ونادراً ما تأتي بمقترحاتها.", "تأتي الموارد البشرية ببعض الأفكار، لكن معظم عملها يبدأ بطلب من غيرها.", "تصوغ الموارد البشرية الأجندة بمقترحات مبنية على ما سيحتاجه العمل."],
        nx: ["أن تضع بنداً واحداً على أجندة القيادة بمبادرة منك، مرتبطاً بمشكلة في العمل.", "عدد قليل من المقترحات كل عام يراها فريق القيادة أولوياته هو.", "أن يُنظر إليك كمن يشكّل المؤسسة وقادتها وثقافتها."],
        p: ["اسأل ثلاثة من رؤساء الإدارات عمّا سيقلقهم أكثر بشأن موظفيهم خلال العام المقبل. ابحث عن النمط المشترك.", "حوّل النمط إلى مقترح قصير: مشكلة العمل، وكلفة عدم التحرك، وما ستفعله.", "ضعه بنفسك على أجندة القيادة، واطلب قراراً لا ملاحظات."],
        w: "اسأل رئيس إدارة واحداً عمّا سيقلقه أكثر بشأن موظفيه العام المقبل." }
    ],
    mail: function (m) {
      return "مرحباً " + m.name + "،\n\nشكراً لإكمالك التقييم. هذه نتيجتك.\n\nالدرجة الإجمالية: " + m.p + " من ١٠٠. " + m.band + ".\n" + m.quote + "\n\n" + m.lines +
        "\n\nمجالا الأولوية: " + m.a1 + " و" + m.a2 + ".\nهذا الأسبوع: " + m.wk +
        "\n\nتقريرك الكامل، مع خطة ٩٠ يوماً وخمسة أسئلة تطرحها على رئيسك التنفيذي (يمكنك حفظه بصيغة PDF):\n" + m.link +
        "\n\nهل تريد رأي رئيسك التنفيذي؟ أرسل إليه هذه النسخة القصيرة. حين ينتهي، يصلك تقرير يضع رؤيتيكما جنباً إلى جنب:\n" + m.ceo +
        "\n\nإذا أردت الحديث عن نتيجتك، احجز مكالمة لمدة ٣٠ دقيقة:\n" + BOOK + "\nأو اكتب لي على hisham@hishamelsaied.com\n\nهشام السعيد\nhishamelsaied.com";
    },
    mail2: function (m) {
      return "مرحباً " + m.name + "،\n\n" + m.who + " أكمل التقييم الخاص بطريقة عمل الموارد البشرية معه.\n\nرؤيتك: " + m.p1 + " من ١٠٠. رؤيته: " + m.p2 + " من ١٠٠.\n\n" + m.lines +
        "\n\nأين تختلف رؤيتاكما أكثر:\n" + m.gaps + "\n\nالرؤيتان جنباً إلى جنب:\n" + m.link +
        "\n\nإذا أردت مناقشة الفجوات، احجز مكالمة لمدة ٣٠ دقيقة:\n" + BOOK + "\nأو اكتب لي على hisham@hishamelsaied.com\n\nهشام السعيد\nhishamelsaied.com";
    }
  } : {
    path: "/hr-self-check/", contact: "/contact/",
    lv: ["Not yet", "Starting", "Established", "Leading"],
    count: "Question {n} of 15", back: "Back", tap: "Pick the answer closest to how things are today",
    dh: "Where should I send your report?", dl: "Your report reaches you by email within 3 minutes, with a link to a short version you can send to your CEO if you want.",
    name: "Your name", email: "Work email", role: "Job title and organisation (optional)",
    consent: "By sending this you agree that I can email you your report and contact you about it. I use your details only for this and don't pass them on to anyone.",
    send: "Send me my report", err: "Please add your name and a valid email address.", sending: "Sending...",
    doneh: "Your report is on the way.",
    donel: "Your report will reach {e} within 3 minutes. If the email isn't in your inbox, look in your junk folder.",
    score: "Your overall score:", of100: "out of 100", see: "See my report now",
    fail: "The email could not be sent, so here is your report on screen.",
    rh: "Your HR influence report", rl: "How your CEO is likely to see HR today, based on your 15 answers.",
    quoteh: "What your CEO is probably saying",
    areas: "Your five areas", of9: "{s} of 9", heat: "Your 15 answers",
    pri: "Your two priority areas", prl: "Priority", now: "Where you are", next: "What the next level looks like", plan: "Your 90-day plan",
    d: ["Days 1 to 30", "Days 31 to 60", "Days 61 to 90"], wk: "This week:",
    ceoq: "Five questions to ask your CEO", ceoql: "This self-check shows how you see it. The real answer is your CEO's. Use these in your next one-to-one.",
    cmph: "Get your CEO's view", cmpl: "Send your CEO or line manager a 2-minute version with the same questions. When they finish, you'll get both views side by side by email, showing where you see things differently.",
    cmpb: "Copy the link", cmpw: "Send by WhatsApp", cmpm: "Send by email", copied: "Link copied",
    cmpmsg: "I'm reviewing how HR works with the leadership team and would value your honest view. It's 15 short questions and takes about 3 minutes: ",
    cmpsub: "Your view on how HR works with you",
    pdf: "Download the report (PDF)", pdfn: "Choose 'Save as PDF' on the next screen.",
    ctah: "Want to talk through your result?", ctal: "Send me a note and tell me which area you want to work on.", ctab: "Get in touch", bookb: "Book a 30-minute call",
    note: "This is a self-check based on your own answers. It is not a psychometric assessment.", again: "Take it again",
    ceoh: "{n} has asked for your view", ceoh0: "You've been asked for your view",
    ceolead: "15 short questions about how HR works with you and the leadership team. It takes about 3 minutes. Answer for how things are today, not how they should be.",
    ceofacts: ["<b>There are no right or wrong answers.</b> An honest view is the most useful one.", "<b>Your answers go to {n}</b> so they can compare them with their own view and talk them through with you."],
    ceogo: "Start",
    ceodh: "Send your answers to {n}", ceodl: "{n} will get a report comparing your two views. Your name is optional.",
    ceoname: "Your name and role (optional)",
    ceoconsent: "Your answers go to {n} and to Hisham Elsaied, who runs this self-check. They aren't shared with anyone else.",
    ceosend: "Send my answers", ceodoneh: "Thank you.", ceodonel: "{n} will get a report with your two views side by side. Here is the comparison.",
    you0: "your HR colleague",
    cph: "Two views of HR", cpl: "How {n} sees HR's role, compared with how their CEO or line manager sees it.",
    vy: "{n}'s view", vc: "CEO's view",
    gaps: "Talk about these first", gapl: "The questions where your two views differ most.", nogap: "Your views match on every question. That's rare, and a strong base.",
    cmpcta: "If you'd like to work through the gaps with a neutral coach, send me a note.",
    bands: [
      [80, "Seen as a business leader", "“HR is part of how we run this organisation.”", "Your answers suggest HR is part of how the organisation is run. The risk at this level is being pulled into everything. Use your weakest area to decide where to step back, not only where to step up."],
      [60, "Seen as a trusted adviser", "“I check the people side with HR before I decide.”", "Leaders value HR's advice, especially on people matters. The next step is being involved before the options are set, and in decisions that don't look like people decisions."],
      [35, "Seen as a reliable service", "“HR delivers what we ask. I'd like them to bring me more.”", "HR is trusted to deliver, and that matters. But it's mostly brought in once decisions are made. Your two priority areas below show where to start changing that."],
      [0, "Seen as the administration team", "“HR keeps things running. I don't need them for the big decisions.”", "HR is seen mainly for processing and problem solving. That's often how the role was set up, and it can change. Focus on the two priority areas below, not all five at once."]
    ],
    cq: ["When you have a difficult decision coming, at what point would you want HR involved?",
      "What's one thing HR did this year that made a real difference to the business, and one thing you'd like me to stop?",
      "Where do you think HR spends too much time, and where too little?",
      "When I disagree with you, would you rather I say it in the meeting or afterwards?",
      "If you could change one thing about how HR works with the leadership team, what would it be?"],
    A: [
      { n: "In the room early", q: [
        ["A major decision (a restructure, a new business line, a big cost cut) is being discussed at the top. When does HR usually get involved?", ["When it's announced, to implement it", "Just before the decision, to plan the people impact", "While options are still open, to advise on the people side", "From the start, helping shape which option goes ahead"], "Involved in decisions"],
        ["How does HR take part in leadership team meetings?", ["HR isn't a regular member and joins when invited for an item", "HR attends, but mostly speaks on HR items", "HR contributes on most topics, not just people ones", "Leaders expect HR's view and ask for it if HR is quiet"], "Role in leadership meetings"],
        ["When the CEO wants to think through a difficult issue, who do they call?", ["HR rarely hears about it until a decision is made", "HR gets a call when the issue is clearly about people", "HR is one of a few people the CEO calls on most big issues", "HR is usually among the first two or three people the CEO calls"], "Who the CEO calls"]],
        l: ["HR hears about big decisions after they're made, and its job is to carry them out.", "HR is brought into some decisions, usually once the people side is obvious.", "Leaders bring HR in while the options are still open."],
        nx: ["Hearing about decisions before they're announced, so the people impact is planned, not patched.", "Being asked for a view while the options are still open, on topics beyond people.", "Being the person the CEO thinks out loud with, without getting pulled into everything."],
        p: ["List the five biggest decisions coming in the next six months. For each one, find out who owns it and when it will be decided.", "Meet each owner before their decision goes to the leadership team. Bring one point on the people risk and one on what would make it work.", "Ask the CEO directly to involve HR early in the next major decision, using one of these as the example."],
        w: "Pick one decision coming this quarter. Ask its owner for 20 minutes before it reaches the leadership team." },
      { n: "Business credibility", q: [
        ["How does HR report its work to the leadership team?", ["Activity: courses run, roles filled, policies issued", "Activity, with some HR measures like turnover and time to hire", "HR measures linked to business results such as cost, productivity or service", "Business results first, then what HR did to move them"], "How HR reports"],
        ["If the CEO asked HR to explain the organisation's financial position, or how it is delivering its mandate, in two minutes, what would happen?", ["HR would pass the question to finance", "HR could give the headlines, but not the drivers", "HR could explain the main drivers and pressures with confidence", "HR could explain it as well as the CFO, and link it to the people plan"], "Knows the numbers"],
        ["How closely does the HR plan follow the CEO's priorities for this year?", ["The HR plan was written separately, mostly from HR's own needs", "It mentions the priorities, but most of the work is business as usual", "Most HR initiatives clearly support one of the CEO's priorities", "Every major initiative is tied to a priority, and work that wasn't got dropped"], "Plan tied to CEO priorities"]],
        l: ["HR talks about HR activity. The leadership team can't see what it did for the business.", "HR knows the business well, but its updates still start with HR measures.", "HR talks about the business in the same terms as finance and operations."],
        nx: ["Updates that start with a business result the CEO already tracks.", "An HR plan where every major initiative is tied to a CEO priority, and work that isn't gets dropped.", "Being the person who connects the people plan to the numbers in every leadership discussion."],
        p: ["Spend an hour with the finance head. Ask what drives cost, revenue or service delivery this year, and which numbers the CEO watches.", "Rewrite your next leadership update. Open with a business result, then show what HR did to move it.", "Map every HR initiative to one CEO priority. Stop or pause one that doesn't map, and tell the CEO you did."],
        w: "Take your next update and change the first line to a business result, such as cost, time, revenue, risk or service." },
      { n: "Constructive challenge", q: [
        ["When HR disagrees with a decision the CEO favours, what usually happens?", ["HR goes along with it and deals with the consequences later", "HR raises its concerns privately, after the meeting", "HR raises it in the meeting, carefully, with a reason", "HR challenges clearly, offers an alternative, and the CEO expects that"], "Disagreeing with the CEO"],
        ["A senior leader asks for something that breaks policy or fairness, such as a special pay deal or a favoured hire. What does HR do?", ["Usually agrees, to protect the relationship", "Pushes back by pointing to the policy", "Explains the business risk and offers another way to reach the goal", "Says no when needed, and the leader still comes back for advice"], "Saying no to a senior leader"],
        ["When did HR last change the CEO's mind on something important?", ["I can't think of a time", "More than a year ago", "In the last year", "In the last three months"], "Changing the CEO's mind"]],
        l: ["HR goes along with decisions it disagrees with, and pays for it later.", "HR raises concerns, but often privately, or only by pointing to policy.", "HR disagrees openly, offers another way, and the CEO expects it."],
        nx: ["Raising one concern in the meeting, with a business reason rather than a policy reason.", "Challenging in the room with an alternative ready, so the CEO sees options, not objections.", "Changing the CEO's mind on something important in a way that strengthens the relationship."],
        p: ["Agree with the CEO how they want to hear disagreement: in the meeting, before it, or one to one. Ask the question directly.", "Before each leadership meeting, write down the one point you have to make. Make it in the first ten minutes, with a business reason.", "When you say no to a senior leader, bring a second option that gets them most of what they want. Track how often it's accepted."],
        w: "Before your next leadership meeting, write down the one point you have to make, and make it in the first ten minutes." },
      { n: "Where HR's time goes", q: [
        ["Roughly how much of the HR head's week goes on strategic work, such as planning, advising leaders and building future capability?", ["Less than 10%", "10 to 25%", "25 to 50%", "More than half"], "Strategic time"],
        ["When a routine problem comes up, such as a payroll error, a visa delay or a complaint, who handles it?", ["The HR head usually gets pulled in personally", "The team handles it, but the HR head is copied and often steps in", "The team handles it, and the HR head hears only if it escalates", "The team handles it fully, with clear processes and systems"], "Daily issues"],
        ["How often does HR spend time on the next two to three years: workforce planning, succession and future skills?", ["Only when a crisis forces it", "Once a year, in the planning season", "Every quarter, with leaders involved", "It's a standing item on the leadership agenda"], "Time on the future"]],
        l: ["Day-to-day issues fill the week. There's little time left for the work the CEO would value most.", "The team handles most operations, but the HR head still gets pulled back in too often.", "The team runs operations, and the HR head spends real time on the next two to three years."],
        nx: ["A team and processes that handle routine issues without the HR head.", "Protected time every week for planning, advising leaders and building future capability.", "Workforce planning and succession as a standing item on the leadership agenda."],
        p: ["Log last week hour by hour. Mark everything someone in your team could have done.", "Hand over the three biggest of those, with clear decision rights. Block four hours a week for strategic work and protect it.", "Bring the leadership team a first view of the workforce you'll need in two to three years."],
        w: "Write down what you did last week. Mark what someone in your team could have done, and hand one of those over this week." },
      { n: "Setting the agenda", q: [
        ["Where do most of HR's major projects come from?", ["Requests from the business or from regulators", "Mostly requests, with a few of HR's own ideas", "A balance of requests and HR's own proposals", "HR's own proposals, built from what the business will need"], "Where projects come from"],
        ["In the last year, how many times did HR put an item on the leadership agenda on its own initiative?", ["None", "Once or twice", "Three to five times", "More than five"], "Items on the agenda"],
        ["How would the leadership team describe HR's main contribution today?", ["Processing: payroll, visas, contracts and policies", "Service: hiring, training and solving people problems", "Advice: helping leaders make better people decisions", "Direction: shaping the organisation, its leaders and its culture"], "How HR's role is seen"]],
        l: ["HR responds to requests from the business and regulators. It rarely brings its own proposals.", "HR brings some ideas, but most of its work still starts with someone else's request.", "HR shapes the agenda, with proposals built from what the business will need."],
        nx: ["Putting one item on the leadership agenda on HR's own initiative, linked to a business problem.", "A few HR proposals each year that the leadership team treats as its own priorities.", "Being seen as the person who shapes the organisation, its leaders and its culture."],
        p: ["Ask three business heads what will worry them most about their people over the next year. Listen for the pattern.", "Turn the pattern into one short proposal: the business problem, the cost of doing nothing, and what you'd do.", "Put it on the leadership agenda yourself. Ask for a decision, not feedback."],
        w: "Ask one business head what will worry them most about their people next year." }
    ],
    mail: function (m) {
      return "Hello " + m.name + ",\n\nThank you for taking the self-check. Here is your result.\n\nOverall: " + m.p + " out of 100. " + m.band + ".\n" + m.quote + "\n\n" + m.lines +
        "\n\nYour two priority areas: " + m.a1 + " and " + m.a2 + ".\nThis week: " + m.wk +
        "\n\nYour full report, with your 90-day plan and five questions to ask your CEO (you can save it as a PDF):\n" + m.link +
        "\n\nWant your CEO's view? Send them this 2-minute version. When they finish, you'll get both views side by side:\n" + m.ceo +
        "\n\nIf you'd like to talk through your result, book a 30-minute call:\n" + BOOK + "\nor write to me at hisham@hishamelsaied.com\n\nHisham Elsaied\nhishamelsaied.com";
    },
    mail2: function (m) {
      return "Hello " + m.name + ",\n\n" + m.who + " has completed the self-check about how HR works with them.\n\nYour view: " + m.p1 + " out of 100. Their view: " + m.p2 + " out of 100.\n\n" + m.lines +
        "\n\nWhere your views differ most:\n" + m.gaps + "\n\nSee both views side by side:\n" + m.link +
        "\n\nIf you'd like to work through the gaps, book a 30-minute call:\n" + BOOK + "\nor write to me at hisham@hishamelsaied.com\n\nHisham Elsaied\nhishamelsaied.com";
    }
  };

  var A = D.A, Q = [], ans = [], cur = 0;
  A.forEach(function (a, i) { a.q.forEach(function (q) { Q.push({ a: i, t: q[0], o: q[1], s: q[2] }); }); });
  var HC = ["#8f3b34", "#b9783c", "#c9ae82", "#4f8f72"], LC = ["#d98b80", "#e2c79a", "#8fcbb0"];
  var $ = function (id) { return document.getElementById(id); };
  var panes = ["sc-intro", "sc-quiz", "sc-details", "sc-done", "sc-dash"];
  function show(id) {
    panes.forEach(function (p) { $(p).hidden = p !== id; });
    var y = root.getBoundingClientRect().top + window.pageYOffset - 90;
    window.scrollTo(0, Math.max(0, y));
  }
  function calc(a) {
    var d = A.map(function () { return 0; });
    a.forEach(function (v, i) { d[Q[i].a] += v; });
    var tot = d.reduce(function (x, y) { return x + y; }, 0);
    var order = d.map(function (s, i) { return i; }).sort(function (x, y) { return d[x] - d[y] || x - y; });
    var p = Math.round(tot / 45 * 100);
    return { d: d, p: p, pri: order.slice(0, 2), band: D.bands.filter(function (b) { return p >= b[0]; })[0] };
  }
  function lvl(s) { return s <= 3 ? 0 : s <= 6 ? 1 : 2; }
  function code(a) { return a.join(""); }
  function parse(s) { return /^[0-3]{15}$/.test(s || "") ? s.split("").map(Number) : null; }
  var H = {};
  location.hash.replace(/^#/, "").split("&").forEach(function (kv) { var i = kv.indexOf("="); if (i > 0) H[kv.slice(0, i)] = kv.slice(i + 1); });
  var who = { n: dec(H.n || ""), e: dec(H.e || "") };
  var CEO = !!parse(H.ceo);
  function fill(s) { return s.replace(/\{n\}/g, esc(who.n || D.you0)); }
  function reportLink(a) { return BASE + D.path + "#r=" + code(a) + (who.n ? "&n=" + enc(who.n) : "") + (who.e ? "&e=" + enc(who.e) : ""); }
  function ceoLink(a) { return BASE + D.path + "#ceo=" + code(a) + "&n=" + enc(who.n) + "&e=" + enc(who.e); }
  function cmpLink(a, c) { return BASE + D.path + "#r=" + code(a) + "&c=" + code(c) + (who.n ? "&n=" + enc(who.n) : ""); }

  $("sc-quiz").innerHTML = '<div class="sc-small" id="sc-count"></div><div class="sc-bar"><i id="sc-prog"></i></div><div class="label" id="sc-area"></div>' +
    '<p class="sc-q" id="sc-qtext"></p><div class="sc-opts" id="sc-opts"></div><div class="sc-nav"><button type="button" class="sc-ghost" id="sc-back">' + D.back + '</button><span class="sc-small">' + D.tap + '</span></div>';
  $("sc-details").innerHTML = CEO
    ? '<h2>' + fill(D.ceodh) + '</h2><p class="lead">' + fill(D.ceodl) + '</p>' +
      '<div style="position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)" aria-hidden="true"><input id="sc-hp" type="text" tabindex="-1" autocomplete="off"></div>' +
      '<label for="sc-t">' + D.ceoname + '</label><input type="text" id="sc-t" autocomplete="name">' +
      '<p class="sc-small" style="margin-top:16px">' + fill(D.ceoconsent) + '</p><div class="sc-err" id="sc-err" role="status"></div><button type="button" class="btn" id="sc-send">' + D.ceosend + '</button>'
    : '<h2>' + D.dh + '</h2><p class="lead">' + D.dl + '</p>' +
      '<div style="position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)" aria-hidden="true"><input id="sc-hp" type="text" tabindex="-1" autocomplete="off"></div>' +
      '<label for="sc-n">' + D.name + '</label><input type="text" id="sc-n" autocomplete="name">' +
      '<label for="sc-e">' + D.email + '</label><input type="email" id="sc-e" autocomplete="email" dir="ltr">' +
      '<label for="sc-t">' + D.role + '</label><input type="text" id="sc-t" autocomplete="organization-title">' +
      '<p class="sc-small" style="margin-top:16px">' + D.consent + '</p><div class="sc-err" id="sc-err" role="status"></div><button type="button" class="btn" id="sc-send">' + D.send + '</button>';
  $("sc-done").innerHTML = '<h2>' + D.doneh + '</h2><p class="lead" id="sc-donel"></p><p class="sc-quick">' + D.score + ' <b id="sc-quick"></b></p><button type="button" class="btn" id="sc-see">' + D.see + '</button>';
  if (CEO) {
    $("sc-intro").innerHTML = '<div class="stack"><span class="label">' + (AR ? "تقييم سري قصير" : "A short, confidential view") + '</span><h1>' + (who.n ? fill(D.ceoh) : D.ceoh0) + '</h1><p class="lead">' + D.ceolead + '</p></div>' +
      '<div><button type="button" class="btn" id="sc-go">' + D.ceogo + '</button></div><ul class="sc-facts">' + D.ceofacts.map(function (f) { return "<li>" + fill(f) + "</li>"; }).join("") + '</ul>';
  }

  function draw() {
    var q = Q[cur];
    $("sc-count").textContent = D.count.replace("{n}", num(cur + 1));
    $("sc-prog").style.width = (cur / Q.length * 100) + "%";
    $("sc-area").textContent = A[q.a].n;
    $("sc-qtext").textContent = q.t;
    var o = $("sc-opts"); o.innerHTML = "";
    q.o.forEach(function (lb, v) {
      var b = document.createElement("button");
      b.type = "button"; b.textContent = lb;
      if (ans[cur] === v) b.className = "on";
      b.onclick = function () { ans[cur] = v; if (cur < Q.length - 1) { cur++; draw(); } else show("sc-details"); };
      o.appendChild(b);
    });
    $("sc-back").style.visibility = cur ? "visible" : "hidden";
  }

  function heat(a) {
    var n = 0, h = "";
    A.forEach(function (x) {
      h += '<div class="sc-hrow"><div class="sc-nm">' + x.n + '</div>';
      x.q.forEach(function (q) { h += '<div class="sc-cell" style="background:' + HC[a[n]] + (a[n] === 2 ? ";color:#1a1408" : "") + '">' + q[2] + '<em>' + D.lv[a[n]] + '</em></div>'; n++; });
      h += '</div>';
    });
    return '<div class="sc-heat">' + h + '</div><div class="sc-legend">' + D.lv.map(function (o, i) { return '<span><i style="background:' + HC[i] + '"></i>' + o + '</span>'; }).join("") + '</div>';
  }

  function dash(a, failed) {
    var r = calc(a);
    var rows = A.map(function (x, i) {
      var s = r.d[i], k = lvl(s);
      return '<div class="sc-row"><div class="sc-hd"><span>' + x.n + '</span><small>' + num(D.of9.replace("{s}", s)) + '</small></div><div class="sc-meter"><i style="width:' + (s / 9 * 100) + '%;background:' + LC[k] + '"></i></div><p>' + x.l[k] + '</p></div>';
    }).join("");
    var pri = r.pri.map(function (i, j) {
      var x = A[i], k = lvl(r.d[i]);
      return '<div class="sc-pri"><div class="label">' + D.prl + ' ' + num(j + 1) + ' &nbsp;·&nbsp; ' + num(D.of9.replace("{s}", r.d[i])) + '</div><h3>' + x.n + '</h3>' +
        '<p><b>' + D.now + ':</b> ' + x.l[k] + '</p><p><b>' + D.next + ':</b> ' + x.nx[k] + '</p>' +
        '<h4>' + D.plan + '</h4><ol class="sc-plan">' + x.p.map(function (t, d) { return '<li><span>' + D.d[d] + '</span>' + t + '</li>'; }).join("") + '</ol>' +
        '<p class="sc-wk"><b>' + D.wk + '</b> ' + x.w + '</p></div>';
    }).join("");
    var cmp = "";
    if (who.e) {
      var cl = ceoLink(a), msg = D.cmpmsg + cl;
      cmp = '<div class="sc-cmp sc-noprint"><h3>' + D.cmph + '</h3><p>' + D.cmpl + '</p><input type="text" readonly dir="ltr" id="sc-cl" value="' + esc(cl) + '">' +
        '<div class="sc-btns"><button type="button" class="btn" id="sc-copy">' + D.cmpb + '</button><a class="btn line" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(msg) + '">' + D.cmpw + '</a>' +
        '<a class="btn line" href="mailto:?subject=' + encodeURIComponent(D.cmpsub) + '&body=' + encodeURIComponent(msg) + '">' + D.cmpm + '</a></div><p class="sc-small" id="sc-copied" role="status"></p></div>';
    }
    $("sc-dash").innerHTML = (failed ? '<p class="sc-fail">' + D.fail + '</p>' : '') + '<h2 class="sc-h1">' + D.rh + '</h2><p class="lead">' + D.rl + (who.n ? ' <span class="sc-for">' + esc(who.n) + '</span>' : '') + '</p>' +
      '<div class="sc-top"><div class="sc-ring" style="--p:' + r.p + '"><div><span><b>' + num(r.p) + '</b>' + D.of100 + '</span></div></div><div><p class="sc-band">' + r.band[1] + '</p><p class="sc-quote"><span>' + D.quoteh + '</span>' + r.band[2] + '</p><p>' + r.band[3] + '</p></div></div>' +
      '<div class="sc-btns sc-noprint"><button type="button" class="btn" id="sc-pdf">' + D.pdf + '</button><span class="sc-small">' + D.pdfn + '</span></div>' +
      '<h3 class="sc-sub">' + D.pri + '</h3>' + pri +
      '<h3 class="sc-sub">' + D.areas + '</h3><div class="sc-rows">' + rows + '</div>' +
      '<h3 class="sc-sub">' + D.heat + '</h3>' + heat(a) +
      '<h3 class="sc-sub">' + D.ceoq + '</h3><p>' + D.ceoql + '</p><ol class="sc-cq">' + D.cq.map(function (q) { return "<li>" + q + "</li>"; }).join("") + '</ol>' +
      cmp +
      '<div class="sc-cta sc-noprint"><h3>' + D.ctah + '</h3><p class="lead">' + D.ctal + '</p><div class="sc-btns" style="justify-content:center"><a class="btn" href="' + BOOK + '" target="_blank" rel="noopener">' + D.bookb + '</a><a class="btn line" href="' + D.contact + '">' + D.ctab + '</a></div></div>' +
      '<p class="sc-small">' + D.note + ' <a class="sc-noprint" href="' + D.path + '">' + D.again + '</a></p>';
    $("sc-pdf").onclick = function () { window.print(); };
    if ($("sc-copy")) $("sc-copy").onclick = function () {
      var f = $("sc-cl"); f.select();
      var ok = function () { $("sc-copied").textContent = D.copied; };
      if (navigator.clipboard) navigator.clipboard.writeText(f.value).then(ok, function () { document.execCommand("copy"); ok(); });
      else { document.execCommand("copy"); ok(); }
    };
    show("sc-dash");
  }

  function gapsOf(a, c) {
    return Q.map(function (q, i) { return { i: i, g: Math.abs(a[i] - c[i]) }; }).filter(function (x) { return x.g >= 1; })
      .sort(function (x, y) { return y.g - x.g || x.i - y.i; }).slice(0, 5);
  }
  function compare(a, c, note) {
    var r = calc(a), s = calc(c), gp = gapsOf(a, c);
    var vy = fill(D.vy);
    var rows = A.map(function (x, i) {
      return '<div class="sc-row"><div class="sc-hd"><span>' + x.n + '</span></div>' +
        '<div class="sc-two"><span>' + vy + '</span><div class="sc-meter"><i style="width:' + (r.d[i] / 9 * 100) + '%;background:#c9ae82"></i></div><small>' + num(D.of9.replace("{s}", r.d[i])) + '</small></div>' +
        '<div class="sc-two"><span>' + D.vc + '</span><div class="sc-meter"><i style="width:' + (s.d[i] / 9 * 100) + '%;background:#8fcbb0"></i></div><small>' + num(D.of9.replace("{s}", s.d[i])) + '</small></div></div>';
    }).join("");
    var g = gp.length ? '<div class="sc-rows">' + gp.map(function (x) {
      var q = Q[x.i];
      return '<div class="sc-row"><div class="label">' + A[q.a].n + '</div><p class="sc-gq">' + q.t + '</p><p><b>' + vy + ':</b> ' + q.o[a[x.i]] + '</p><p><b>' + D.vc + ':</b> ' + q.o[c[x.i]] + '</p></div>';
    }).join("") + '</div>' : '<p>' + D.nogap + '</p>';
    $("sc-dash").innerHTML = (note ? '<div class="sc-start"><h3>' + D.ceodoneh + '</h3><p>' + fill(D.ceodonel) + '</p></div>' : '') +
      '<h2 class="sc-h1">' + D.cph + '</h2><p class="lead">' + fill(D.cpl) + '</p>' +
      '<div class="sc-vs"><div><b>' + num(r.p) + '</b><span>' + vy + '</span><em>' + r.band[1] + '</em></div><div><b>' + num(s.p) + '</b><span>' + D.vc + '</span><em>' + s.band[1] + '</em></div></div>' +
      '<div class="sc-btns sc-noprint"><button type="button" class="btn" id="sc-pdf">' + D.pdf + '</button><span class="sc-small">' + D.pdfn + '</span></div>' +
      '<h3 class="sc-sub">' + D.gaps + '</h3><p>' + D.gapl + '</p>' + g +
      '<h3 class="sc-sub">' + D.areas + '</h3><div class="sc-rows">' + rows + '</div>' +
      '<h3 class="sc-sub">' + D.ceoq + '</h3><ol class="sc-cq">' + D.cq.map(function (q) { return "<li>" + q + "</li>"; }).join("") + '</ol>' +
      '<div class="sc-cta sc-noprint"><p class="lead">' + D.cmpcta + '</p><div class="sc-btns" style="justify-content:center"><a class="btn" href="' + BOOK + '" target="_blank" rel="noopener">' + D.bookb + '</a><a class="btn line" href="' + D.contact + '">' + D.ctab + '</a></div></div>' +
      '<p class="sc-small">' + D.note + '</p>';
    $("sc-pdf").onclick = function () { window.print(); };
    show("sc-dash");
  }

  function post(body, cb) {
    fetch("https://formsubmit.co/ajax/hisham@hishamelsaied.com", {
      method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(body)
    }).then(function (res) { return res.json().catch(function () { return {}; }).then(function (d) { return res.ok && String(d.success) !== "false"; }); })
      .catch(function () { return false; }).then(cb);
  }

  $("sc-go").onclick = function () { show("sc-quiz"); draw(); };
  $("sc-back").onclick = function () { if (cur) { cur--; draw(); } };
  $("sc-see").onclick = function () { dash(ans, false); };
  $("sc-send").onclick = function () {
    var btn = $("sc-send"), role = $("sc-t").value.trim();
    if (CEO) {
      var hr = parse(H.ceo), r1 = calc(hr), r2 = calc(ans), gp = gapsOf(hr, ans), link = cmpLink(hr, ans);
      if ($("sc-hp").value) { compare(hr, ans, true); return; }
      var body2 = {
        _subject: "CEO view received for " + (who.n || "an HR leader") + ": " + r1.p + " vs " + r2.p,
        _template: "table", _captcha: "false",
        _autoresponse: D.mail2({ name: who.n, who: role || (AR ? "رئيسك التنفيذي أو مديرك المباشر" : "Your CEO or line manager"), p1: num(r1.p), p2: num(r2.p),
          lines: A.map(function (x, i) { return x.n + ": " + num(r1.d[i]) + " / " + num(r2.d[i]); }).join("\n"),
          gaps: gp.length ? gp.map(function (x) { return "- " + Q[x.i].s; }).join("\n") : D.nogap, link: link }),
        Name: who.n, email: who.e, "CEO or manager": role || "Not given",
        "HR view": r1.p + " out of 100", "CEO view": r2.p + " out of 100",
        "Biggest gaps": gp.map(function (x) { return Q[x.i].s; }).join(", ") || "None", Comparison: link, Language: AR ? "Arabic" : "English"
      };
      btn.disabled = true; $("sc-err").textContent = D.sending;
      post(body2, function () { btn.disabled = false; $("sc-err").textContent = ""; compare(hr, ans, true); });
      return;
    }
    var name = $("sc-n").value.trim(), email = $("sc-e").value.trim();
    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { $("sc-err").textContent = D.err; return; }
    who = { n: name, e: email };
    var r = calc(ans), link2 = reportLink(ans);
    var done = function () {
      $("sc-donel").textContent = D.donel.replace("{e}", email);
      $("sc-quick").textContent = num(r.p) + " " + D.of100;
      show("sc-done");
    };
    if ($("sc-hp").value) { done(); return; }
    var body = {
      _subject: "Self-check result: " + name + ", " + r.p + " out of 100",
      _template: "table", _captcha: "false",
      _autoresponse: D.mail({ name: name, p: num(r.p), band: r.band[1], quote: r.band[2], a1: A[r.pri[0]].n, a2: A[r.pri[1]].n, wk: A[r.pri[0]].w, link: link2, ceo: ceoLink(ans),
        lines: A.map(function (x, i) { return x.n + ": " + num(D.of9.replace("{s}", r.d[i])); }).join("\n") }),
      Name: name, email: email, "Job title and organisation": role,
      Score: r.p + " out of 100", Result: r.band[1], "Priority areas": A[r.pri[0]].n + ", " + A[r.pri[1]].n
    };
    A.forEach(function (x, i) { body[x.n] = r.d[i] + " of 9"; });
    body.Answers = Q.map(function (q, i) { return (i + 1) + ". " + q.s + ": " + D.lv[ans[i]]; }).join(" | ");
    body.Report = link2;
    body.Language = AR ? "Arabic" : "English";
    btn.disabled = true; $("sc-err").textContent = D.sending;
    post(body, function (ok) { btn.disabled = false; $("sc-err").textContent = ""; if (ok) done(); else dash(ans, true); });
  };

  var ra = parse(H.r), ca = parse(H.c);
  if (ra && ca) compare(ra, ca, false);
  else if (ra) dash(ra, false);
})();
