"""Builds hishamelsaied.com from src/ into the repository root.

Run:  python3 build.py
Edit page content in src/<page>.html, shared styles in src/site.css,
shared script in src/site.js, and page titles/descriptions below.
"""
import json
import os
import re
import shutil

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "src")
SITE = "https://hishamelsaied.com"
import hashlib as _h
UPDATED = "2" + _h.md5(b"".join(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "src", f), "rb").read() for f in ("site.css", "rtl.css", "site.js", "selfcheck.js", "resources.js"))).hexdigest()[:9]

PERSON_ID = SITE + "/#person"
BUSINESS_ID = SITE + "/#business"
GCC = ["United Arab Emirates", "Saudi Arabia", "Oman", "Kuwait", "Qatar", "Bahrain"]

ART_DATES = {"art-first-90-days": "2026-11-16", "art-coaching-mentoring": "2026-11-16", "art-future-of-work": "2026-11-16", "art-ai-coaching": "2026-11-16", "art-ceo-ai": "2026-11-16", "art-first-gm": "2026-11-16"}

PAGES = [
    {
        "key": "home", "path": "/", "nav": None,
        "title": "Hisham Elsaied | Executive Coach in Dubai for HR Leaders",
        "desc": "Executive coach in Dubai for HR managers and directors, and senior leaders in a new or bigger role. ICF PCC, FCIPD. Arabic and English.",
    },
    {
        "key": "coaching", "path": "/coaching/", "nav": "Coaching",
        "title": "Executive Coaching for HR Managers and Directors | Dubai, UAE",
        "desc": "Coaching for HR managers and directors stepping into a bigger role or feeling stuck. ICF PCC coach in Dubai, across the GCC, in Arabic and English.",
    },
    {
        "key": "organisations", "path": "/coaching-for-organisations/", "nav": "For organisations",
        "title": "Executive Coaching for Organisations in the UAE | Hisham Elsaied",
        "desc": "How Hisham Elsaied, ICF PCC executive coach in Dubai, coaches leaders for organisations: three-way goals, clear confidentiality, and measured change.",
    },
    {
        "key": "speaking", "path": "/speaking/", "nav": "Speaking and workshops",
        "title": "Leadership and HR Speaker in the UAE, GCC and Europe",
        "desc": "Keynotes, masterclasses and workshops on leading people, HR capability and talent. Bilingual speaker based in Dubai, speaking across the GCC and Europe.",
    },
    {
        "key": "media", "path": "/media/", "nav": "Media",
        "title": "Media: Articles, Podcasts and Interviews | Hisham Elsaied",
        "desc": "Articles, podcasts and talks by Hisham Elsaied on leadership, HR and working across cultures: Campaign Middle East, HBR Arabia, The HR Observer, greytFM.",
    },
    {
        "key": "about", "path": "/about/", "nav": "About",
        "title": "About Hisham Elsaied, FCIPD, ICF PCC | Executive Coach, Dubai",
        "desc": "Former regional HR director, 20+ years across the GCC, Europe and North America. ICF PCC, FCIPD, Hogan Certified. Adjunct Faculty at PwC Academy and EY.",
    },
    {
        "key": "arabic-coach", "path": "/arabic-speaking-executive-coach-uae/", "nav": "Arabic-speaking coach",
        "title": "Arabic-Speaking Executive Coach in Dubai, UAE | Hisham Elsaied",
        "desc": "ICF PCC executive coach in Dubai who coaches in Arabic and English. For HR leaders and senior leaders across the UAE, Saudi Arabia and the Gulf.",
    },
    {
        "key": "loc-abu-dhabi", "path": "/executive-coach-abu-dhabi/", "nav": "Executive coach in Abu Dhabi",
        "title": "Executive Coach in Abu Dhabi | Hisham Elsaied, ICF PCC",
        "desc": "Executive coaching for HR leaders and senior leaders in Abu Dhabi, in person and online, in Arabic and English. ICF PCC coach with 20 years in HR.",
    },
    {
        "key": "loc-saudi", "path": "/executive-coach-saudi-arabia/", "nav": "Executive coach in Saudi Arabia",
        "title": "Executive Coach in Riyadh and Saudi Arabia | Hisham Elsaied",
        "desc": "Executive coaching for HR leaders and senior leaders in Riyadh, Jeddah and across Saudi Arabia, online and in person, in Arabic and English. ICF PCC.",
    },
    {
        "key": "self-check", "path": "/hr-self-check/", "nav": "HR self-check",
        "title": "How Does Your CEO See HR? Free Self-Check | Hisham Elsaied",
        "desc": "A free 3-minute self-check for HR managers and directors in the Gulf. 15 questions, with a results dashboard and heat map sent to you by email.",
    },
    {
        "key": "books", "path": "/books/", "nav": "Books",
        "title": "Books by Hisham Elsaied | The Moving Line, The Hidden Board",
        "desc": "Books by Hisham Elsaied, executive coach in Dubai: The Moving Line, on the race to build a thinking machine, The Hidden Board, and a book on leadership and AI.",
    },
    {
        "key": "insights", "path": "/insights/", "nav": "Insights",
        "title": "Coaching, Leadership and HR Insights | Hisham Elsaied",
        "desc": "Articles by Hisham Elsaied, ICF PCC executive coach in Dubai, on choosing a coach, coaching in Arabic, and what AI changes for leaders in the Gulf.",
    },
    {
        "key": "art-choose-coach", "path": "/insights/how-to-choose-an-executive-coach-uae/", "nav": "How to choose an executive coach in the UAE",
        "title": "How to Choose an Executive Coach in the UAE: 6 Checks",
        "desc": "Six checks before hiring an executive coach in Dubai or the UAE: credential, coaching hours, business experience, culture, language and fit.",
    },
    {
        "key": "art-coaching-in-arabic", "path": "/insights/coaching-in-arabic/", "nav": "Coaching in Arabic",
        "title": "Coaching in Arabic: Why the Language of the Session Matters",
        "desc": "Why coaching in Arabic and English helps leaders in the Gulf, what research says about language and decisions, and how a bilingual coach uses both.",
    },
    {
        "key": "art-ai-leaders", "path": "/insights/ai-and-leadership-gulf/", "nav": "What AI changes for leaders in the Gulf, and what it doesn't",
        "title": "What AI Changes for Leaders in the Gulf, and What It Doesn't",
        "desc": "AI is changing work fastest in the Gulf. What leaders bring to coaching now, and the parts of leadership a machine can't carry.",
    },
    {
        "key": "art-first-90-days", "path": "/insights/first-90-days-hr-director-gulf/", "nav": "Your first 90 days as an HR director in the Gulf",
        "title": "Your First 90 Days as an HR Director in the Gulf",
        "desc": "What to do and what to avoid in your first three months as an HR director in the UAE or GCC, from a former regional HR director turned executive coach.",
    },
    {
        "key": "art-coaching-mentoring", "path": "/insights/coaching-mentoring-or-training/", "nav": "Coaching, mentoring or training: which do you need?",
        "title": "Executive Coaching, Mentoring or Training: Which One Do You Need?",
        "desc": "The difference between executive coaching, mentoring and training, when each one works, and how to choose for yourself or a leader in your team.",
    },
    {
        "key": "art-future-of-work", "path": "/insights/future-of-work-gcc-hr-leaders/", "nav": "The future of work in the GCC: what changes for HR leaders",
        "title": "Future of Work in the GCC: What Changes for HR Leaders by 2030",
        "desc": "What the research says about jobs, skills and AI in the Gulf to 2030, and what it means for HR leaders in the UAE and the GCC in practice.",
    },
    {
        "key": "art-ai-coaching", "path": "/insights/will-ai-replace-human-coaches/", "nav": "Will AI coaching replace human coaches?",
        "title": "Will AI Coaching Replace Human Coaches? A Coach's Answer",
        "desc": "What the research says about AI coaching versus human coaching, where AI helps, where it falls short, and what that means if you are choosing a coach.",
    },
    {
        "key": "art-ceo-ai", "path": "/insights/leading-when-the-ceo-wants-ai-results/", "nav": "Leading people when the CEO wants AI results yesterday",
        "title": "Leading People When the CEO Wants AI Results Yesterday",
        "desc": "How leaders and HR can handle pressure for fast AI results without losing their people: what research says about AI returns, and a practical way through.",
    },
    {
        "key": "art-first-gm", "path": "/insights/first-time-general-manager-mistakes/", "nav": "First-time general manager: the mistakes I see most",
        "title": "First-Time General Manager: The Mistakes I See Most",
        "desc": "The common mistakes leaders make in their first general manager or enterprise role, why they happen, and what helps, from an executive coach in Dubai.",
    },
    {
        "key": "resources", "path": "/resources/", "nav": "Resources",
        "title": "Free Tools and Templates for Leaders and HR | Hisham Elsaied",
        "desc": "Free tools, templates and guides for HR leaders and senior leaders in the Gulf, in English and Arabic: planners, checklists, coaching questions and more.",
    },
    {
        "key": "res-picker", "path": "/resources/which-support/", "nav": "Coaching, mentoring or training?",
        "title": "Coaching, Mentoring or Training? A Free 2-Minute Tool",
        "desc": "Six questions to work out whether you, or a leader in your team, needs coaching, mentoring or training, with clear next steps.",
    },
    {
        "key": "res-planner", "path": "/resources/90-day-planner/", "nav": "First 90 days planner",
        "title": "First 90 Days Planner for New Leaders (Free Tool)",
        "desc": "A free planner for your first three months in a new leadership role: who to meet, early wins and what success looks like. Save it as a PDF.",
    },
    {
        "key": "res-feedback", "path": "/resources/feedback-builder/", "nav": "Feedback conversation builder",
        "title": "Feedback Conversation Builder for Managers (Free Tool)",
        "desc": "A free tool that turns your notes into a clear, respectful feedback conversation, for praise or for something you'd like to change. In English and Arabic.",
    },
    {
        "key": "res-transition", "path": "/resources/leadership-transition-check/", "nav": "Leadership transition check",
        "title": "Leadership Transition Check: 10 Questions for New Leaders",
        "desc": "Ten questions for anyone in their first months as a director, head of function or GM. See where you're on track and where to focus next. Free.",
    },
    {
        "key": "contact", "path": "/contact/", "nav": "Contact",
        "title": "Contact Hisham Elsaied | Executive Coaching and Speaking, Dubai",
        "desc": "Enquire about executive coaching, keynotes or workshops. Based in Dubai, working across the UAE and the GCC in Arabic and English.",
    },
]

PAGES_AR = [
    {
        "key": "home", "path": "/ar/", "nav": None,
        "title": "هشام السعيد | كوتش ومدرب تنفيذي في دبي لقادة الموارد البشرية",
        "desc": "كوتش تنفيذي (مدرب تنفيذي) في دبي لمديري الموارد البشرية ولكبار القادة في أدوار جديدة أو أكبر. معتمد ICF PCC وFCIPD. بالعربية والإنجليزية.",
    },
    {
        "key": "coaching", "path": "/ar/coaching/", "nav": "الكوتشينج",
        "title": "الكوتشينج التنفيذي لمديري الموارد البشرية | دبي، الإمارات",
        "desc": "كوتشينج فردي لمديري ومديرات الموارد البشرية في دور جديد أو تحت ضغط. مدرب تنفيذي معتمد ICF PCC في دبي، يعمل في دول الخليج بالعربية والإنجليزية.",
    },
    {
        "key": "organisations", "path": "/ar/coaching-for-organisations/", "nav": "للمؤسسات",
        "title": "كوتشينج تنفيذي للمؤسسات في الإمارات | هشام السعيد",
        "desc": "كيف يعمل هشام السعيد، الكوتش التنفيذي المعتمد في دبي، مع المؤسسات: أهداف في لقاء ثلاثي، وسرية واضحة، وقياس لما تغيّر.",
    },
    {
        "key": "speaking", "path": "/ar/speaking/", "nav": "المحاضرات وورش العمل",
        "title": "متحدث في القيادة والموارد البشرية | الإمارات والخليج وأوروبا",
        "desc": "كلمات رئيسية ومحاضرات وورش عمل حول قيادة الأفراد وقدرات الموارد البشرية والمواهب والتقييم. متحدث ثنائي اللغة مقيم في دبي، يتحدث في الخليج وأوروبا.",
    },
    {
        "key": "media", "path": "/ar/media/", "nav": "الإعلام",
        "title": "الإعلام: مقالات وبودكاست ومقابلات | هشام السعيد",
        "desc": "مقالات وبودكاست وكلمات ومقابلات لهشام السعيد حول القيادة والموارد البشرية والعمل بين الثقافات: هارفارد بزنس ريفيو العربية وCampaign Middle East وغيرها.",
    },
    {
        "key": "about", "path": "/ar/about/", "nav": "نبذة عني",
        "title": "هشام السعيد، FCIPD وICF PCC | كوتش ومدرب تنفيذي في دبي",
        "desc": "مدير إقليمي سابق للموارد البشرية بخبرة تزيد على ٢٠ عاماً في الخليج وأوروبا وأمريكا الشمالية. معتمد ICF PCC وFCIPD وHogan. عضو هيئة تدريس في أكاديمية PwC وEY.",
    },
    {
        "key": "arabic-coach", "path": "/ar/arabic-speaking-executive-coach-uae/", "nav": "كوتش تنفيذي عربي",
        "title": "كوتش ومدرب تنفيذي عربي في دبي والإمارات | هشام السعيد",
        "desc": "كوتش تنفيذي ومدرب قيادات معتمد ICF PCC في دبي يعمل بالعربية والإنجليزية مع قادة الموارد البشرية والقيادات العليا في الإمارات والسعودية ودول الخليج.",
    },
    {
        "key": "loc-abu-dhabi", "path": "/ar/executive-coach-abu-dhabi/", "nav": "كوتش تنفيذي في أبوظبي",
        "title": "كوتش ومدرب تنفيذي في أبوظبي | هشام السعيد",
        "desc": "كوتشينج تنفيذي لقادة الموارد البشرية وكبار القادة في أبوظبي، حضورياً وعبر الإنترنت، بالعربية والإنجليزية. كوتش معتمد ICF PCC بخبرة ٢٠ عاماً في الموارد البشرية.",
    },
    {
        "key": "loc-saudi", "path": "/ar/executive-coach-saudi-arabia/", "nav": "كوتش تنفيذي في السعودية",
        "title": "كوتش ومدرب تنفيذي في الرياض والسعودية | هشام السعيد",
        "desc": "كوتشينج تنفيذي لقادة الموارد البشرية وكبار القادة في الرياض وجدة وأنحاء السعودية، عبر الإنترنت وحضورياً، بالعربية والإنجليزية. معتمد ICF PCC.",
    },
    {
        "key": "self-check", "path": "/ar/hr-self-check/", "nav": "تقييم ذاتي لقادة الموارد البشرية",
        "title": "كيف يرى رئيسك التنفيذي الموارد البشرية؟ تقييم ذاتي مجاني",
        "desc": "تقييم ذاتي مجاني في ٣ دقائق لمديري الموارد البشرية في الخليج. ١٥ سؤالاً، وتصلك لوحة النتائج والخريطة الحرارية على بريدك الإلكتروني.",
    },
    {
        "key": "books", "path": "/ar/books/", "nav": "الكتب",
        "title": "كتب هشام السعيد | The Moving Line و The Hidden Board",
        "desc": "كتب هشام السعيد، الكوتش التنفيذي في دبي، عن الذكاء الاصطناعي والعقل البشري والقيادة في الشرق الأوسط.",
    },
    {
        "key": "insights", "path": "/ar/insights/", "nav": "مقالات",
        "title": "مقالات عن الكوتشينج والقيادة والموارد البشرية في الخليج",
        "desc": "مقالات لهشام السعيد، الكوتش التنفيذي المعتمد في دبي، عن اختيار الكوتش، والكوتشينج بالعربية، وأثر الذكاء الاصطناعي على القادة.",
    },
    {
        "key": "art-choose-coach", "path": "/ar/insights/how-to-choose-an-executive-coach-uae/", "nav": "كيف تختار كوتش تنفيذي في الإمارات",
        "title": "كيف تختار كوتش تنفيذي في الإمارات: ٦ أمور تتحقق منها",
        "desc": "ستة أمور تتحقق منها قبل التعاقد مع كوتش تنفيذي في دبي أو الإمارات: الاعتماد والساعات والخبرة والثقافة واللغة والملاءمة.",
    },
    {
        "key": "art-coaching-in-arabic", "path": "/ar/insights/coaching-in-arabic/", "nav": "الكوتشينج بالعربية",
        "title": "الكوتشينج بالعربية: لماذا تهم لغة الجلسة",
        "desc": "لماذا يفيد الكوتشينج بالعربية والإنجليزية القادة في الخليج، وماذا تقول الأبحاث عن اللغة والقرار، وكيف يستخدم الكوتش اللغتين.",
    },
    {
        "key": "art-ai-leaders", "path": "/ar/insights/ai-and-leadership-gulf/", "nav": "ما الذي يغيّره الذكاء الاصطناعي للقادة في الخليج",
        "title": "ما الذي يغيّره الذكاء الاصطناعي للقادة في الخليج",
        "desc": "الذكاء الاصطناعي يغيّر العمل في الخليج بسرعة. ما الذي يحمله القادة إلى الكوتشينج اليوم، وما الذي لا تستطيع الآلة حمله.",
    },
    {
        "key": "art-first-90-days", "path": "/ar/insights/first-90-days-hr-director-gulf/", "nav": "أول ٩٠ يوماً لك كمدير موارد بشرية في الخليج",
        "title": "أول ٩٠ يوماً لك كمدير موارد بشرية في الخليج",
        "desc": "ما الذي تفعله وما الذي تتجنبه في أشهرك الثلاثة الأولى كمدير موارد بشرية في الإمارات أو الخليج، من مدير موارد بشرية إقليمي سابق أصبح كوتشاً تنفيذياً.",
    },
    {
        "key": "art-coaching-mentoring", "path": "/ar/insights/coaching-mentoring-or-training/", "nav": "الكوتشينج أم الإرشاد أم التدريب؟",
        "title": "الكوتشينج التنفيذي أم الإرشاد أم التدريب: أيها تحتاج فعلاً؟",
        "desc": "الفرق بين الكوتشينج التنفيذي والإرشاد (المنتورينج) والتدريب، ومتى ينفع كل منها، وكيف تختار لنفسك أو لقائد في مؤسستك في الخليج.",
    },
    {
        "key": "art-future-of-work", "path": "/ar/insights/future-of-work-gcc-hr-leaders/", "nav": "مستقبل العمل في الخليج: ما الذي يتغير لقادة الموارد البشرية",
        "title": "مستقبل العمل في الخليج: ما الذي يتغير لقادة الموارد البشرية",
        "desc": "ماذا تقول الأبحاث عن الوظائف والمهارات والذكاء الاصطناعي في الخليج حتى ٢٠٣٠، وماذا يعني ذلك عملياً لقادة الموارد البشرية في الإمارات ودول الخليج.",
    },
    {
        "key": "art-ai-coaching", "path": "/ar/insights/will-ai-replace-human-coaches/", "nav": "هل يحل الكوتش الآلي محل الكوتش البشري؟",
        "title": "هل سيحل الكوتشينج بالذكاء الاصطناعي محل الكوتش البشري؟",
        "desc": "ماذا تقول الأبحاث عن الكوتشينج بالذكاء الاصطناعي مقارنة بالكوتش البشري، وأين يفيد وأين يقصر، وماذا يعني ذلك إذا كنت تختار كوتشاً.",
    },
    {
        "key": "art-ceo-ai", "path": "/ar/insights/leading-when-the-ceo-wants-ai-results/", "nav": "قيادة الناس حين يريد الرئيس التنفيذي نتائج الذكاء الاصطناعي فوراً",
        "title": "قيادة الناس حين يريد الرئيس التنفيذي نتائج الذكاء الاصطناعي فوراً",
        "desc": "كيف يتعامل القادة والموارد البشرية مع الضغط لتحقيق نتائج سريعة من الذكاء الاصطناعي دون خسارة فرقهم: ماذا تقول الأبحاث عن العائد، وطريقة عملية للتعامل معه.",
    },
    {
        "key": "art-first-gm", "path": "/ar/insights/first-time-general-manager-mistakes/", "nav": "مدير عام لأول مرة: الأخطاء الأكثر شيوعاً",
        "title": "مدير عام لأول مرة: الأخطاء التي أراها أكثر من غيرها",
        "desc": "الأخطاء الشائعة التي يقع فيها القادة في أول منصب مدير عام أو منصب تنفيذي يدير الشركة كلها، ولماذا تحدث، وما الذي يساعد، من كوتش تنفيذي في دبي.",
    },
    {
        "key": "resources", "path": "/ar/resources/", "nav": "المصادر",
        "title": "أدوات ونماذج وأدلة مجانية للقادة والموارد البشرية | هشام السعيد",
        "desc": "أدوات ونماذج وأدلة مجانية لقادة الموارد البشرية وكبار القادة في الخليج بالعربية والإنجليزية: مخططات وقوائم تحقق وأسئلة كوتشينج وغيرها.",
    },
    {
        "key": "res-picker", "path": "/ar/resources/which-support/", "nav": "كوتشينج أم إرشاد أم تدريب؟",
        "title": "كوتشينج أم إرشاد أم تدريب؟ أداة مجانية في دقيقتين",
        "desc": "ستة أسئلة لتعرف هل تحتاج أنت أو أحد القادة في فريقك إلى الكوتشينج أم الإرشاد أم التدريب، مع خطوات واضحة.",
    },
    {
        "key": "res-planner", "path": "/ar/resources/90-day-planner/", "nav": "مخطط أول ٩٠ يوماً",
        "title": "مخطط أول ٩٠ يوماً للقادة الجدد (أداة مجانية)",
        "desc": "مخطط مجاني لأشهرك الثلاثة الأولى في دور قيادي جديد: من تقابل، والنجاحات المبكرة، وكيف يبدو النجاح. احفظه كملف PDF.",
    },
    {
        "key": "res-feedback", "path": "/ar/resources/feedback-builder/", "nav": "أداة صياغة محادثة الملاحظات",
        "title": "أداة صياغة محادثة الملاحظات للمديرين (مجانية)",
        "desc": "أداة مجانية تحوّل ملاحظاتك إلى محادثة واضحة ومحترمة، سواء للثناء أو لأمر تريد أن يتغيّر. بالعربية والإنجليزية.",
    },
    {
        "key": "res-transition", "path": "/ar/resources/leadership-transition-check/", "nav": "مراجعة الانتقال إلى دور قيادي",
        "title": "مراجعة الانتقال إلى دور قيادي: ١٠ أسئلة للقادة الجدد",
        "desc": "عشرة أسئلة لكل من في أشهره الأولى كمدير أو رئيس إدارة أو مدير عام. اعرف أين تسير على المسار الصحيح وأين تركّز. والأداة مجانية.",
    },
    {
        "key": "contact", "path": "/ar/contact/", "nav": "تواصل معي",
        "title": "تواصل مع هشام السعيد | الكوتشينج التنفيذي والمحاضرات، دبي",
        "desc": "استفسر عن الكوتشينج التنفيذي أو الكلمات الرئيسية أو ورش العمل. مقيم في دبي ويعمل في الإمارات ودول الخليج بالعربية والإنجليزية.",
    },
]

ARQA_EN = [('Is there an executive coach in the UAE who coaches in Arabic?', 'Yes. Hisham Elsaied is an ICF Professional Certified Coach (PCC) based in Dubai who coaches in Arabic and English. He works with leaders across the UAE, Saudi Arabia, Oman, Kuwait, Qatar and Bahrain.'), ('Can a session move between Arabic and English?', 'Yes. Many clients run their working day in English and think through difficult decisions in Arabic. Sessions can be in either language, or move between the two.'), ('Who does he coach?', 'HR managers and directors are the people he works with most. He also coaches senior leaders in government, semi-government and corporate roles across the Gulf.'), ('What are his credentials?', 'ICF Professional Certified Coach (PCC) with more than 600 coaching hours, Chartered Fellow of the CIPD (FCIPD), Hogan certified assessor and Cultural Intelligence (CQ) certified trainer, and 20 years in HR.'), ('Do I need to be in Dubai?', 'No. Sessions run online or in person in Dubai. Clients are based across the UAE and the wider Gulf.'), ('How do I start?', 'Send a short enquiry through the contact page. The first conversation carries no obligation.')]
ARQA_AR = [('هل يوجد كوتش تنفيذي في الإمارات يعمل باللغة العربية؟', 'نعم. هشام السعيد كوتش محترف معتمد من الاتحاد الدولي للكوتشينج (ICF PCC)، مقيم في دبي ويعمل بالعربية والإنجليزية مع قادة في الإمارات والسعودية وعُمان والكويت وقطر والبحرين.'), ('هل يمكن أن تنتقل الجلسة بين العربية والإنجليزية؟', 'نعم. كثير من العملاء يديرون يوم عملهم بالإنجليزية ويفكرون في القرارات الصعبة بالعربية. يمكن أن تكون الجلسة بأي من اللغتين أو بكلتيهما.'), ('مع من يعمل؟', 'أكثر من يعمل معهم هم مديرو ومديرات الموارد البشرية. ويعمل أيضاً مع قيادات عليا في الجهات الحكومية وشبه الحكومية والشركات في دول الخليج.'), ('ما مؤهلاته؟', 'كوتش محترف معتمد ICF PCC بأكثر من ٦٠٠ ساعة كوتشينج، وزميل معتمد في CIPD، ومقيّم معتمد في Hogan، ومدرب معتمد في الذكاء الثقافي (CQ)، مع عشرين عاماً في الموارد البشرية.'), ('هل يجب أن أكون في دبي؟', 'لا. تُعقد الجلسات عبر الإنترنت أو حضورياً في دبي، والعملاء موزعون في الإمارات ودول الخليج.'), ('كيف أبدأ؟', 'أرسل استفساراً قصيراً من صفحة التواصل. المحادثة الأولى بلا أي التزام.')]

FAQ_AR = [
    ("هل يمكن أن نعمل باللغة العربية؟", "نعم. أعمل بالعربية والإنجليزية، وكثير من عملائي ينتقلون بين اللغتين في الجلسة نفسها."),
    ("هل الكوتشينج سري؟", "نعم. ألتزم بميثاق أخلاقيات الاتحاد الدولي للكوتشينج (ICF). ما نناقشه يبقى بيننا، حتى حين تكون جهة عملك هي من تدفع."),
    ("هل يمكن لمؤسستي أن تتحمل التكلفة؟", "نعم. كثير من عملائي ترعاهم جهات عملهم، وآخرون يدفعون بأنفسهم."),
    ("كم تستغرق مدة الكوتشينج؟", "يعتمد ذلك على ما تريد تغييره. نتفق على المدة بعد المحادثة الأولى."),
    ("كم تبلغ التكلفة؟", "لأن كل برنامج مصمم حسب الحاجة، أشارك الرسوم بعد المحادثة الأولى."),
    ("هل تعمل مع العاملين في الموارد البشرية فقط؟", "مديرو ومديرات الموارد البشرية هم من أعمل معهم أكثر، كما أعمل مع قيادات عليا في الجهات الحكومية والشركات في دول الخليج."),
]

FAQ = [
    ("Can we work in Arabic?", "Yes. I coach in Arabic and English, and many clients move between the two in the same session."),
    ("Is coaching confidential?", "Yes. I work to the ICF Code of Ethics. What we discuss stays between us, including when your employer is paying, and we agree at the start what, if anything, is reported back."),
    ("Can my organisation pay for coaching?", "Yes. Many clients are sponsored by their employer and others pay themselves."),
    ("How long does a coaching engagement last?", "It depends on what you want to change. We agree the length after the first conversation."),
    ("What does executive coaching cost?", "Each engagement is tailored, so fees are shared after the first conversation."),
    ("Do you only coach HR people?", "HR managers and directors are who I work with most. I also coach senior leaders in government and corporate roles across the GCC."),
]


LOC_FAQ = {
    "loc-abu-dhabi": {
        "en": [("Is there an executive coach who works with leaders in Abu Dhabi?", "Yes. Hisham Elsaied is an ICF Professional Certified Coach (PCC) based in Dubai who coaches HR leaders and senior leaders in Abu Dhabi, in person and online, in Arabic and English."),
               ("Do you coach in person in Abu Dhabi?", "Yes. Sessions can be in person in Abu Dhabi or Dubai, or online. Many clients mix the two."),
               ("Can my organisation pay for the coaching?", "Yes. Many clients are sponsored by their employer. Goals are agreed in a three-way meeting at the start, and the content of sessions stays confidential under the ICF Code of Ethics."),
               ("Which sectors do your Abu Dhabi clients work in?", "Mostly government and semi-government entities, energy and utilities, and finance, plus multinational companies with offices in Abu Dhabi."),
               ("How do I start?", "Book a free 30-minute call or send a short enquiry through the contact page. There is no obligation.")],
        "ar": [("هل يوجد كوتش تنفيذي يعمل مع القادة في أبوظبي؟", "نعم. هشام السعيد كوتش محترف معتمد من الاتحاد الدولي للكوتشينج (ICF PCC)، مقيم في دبي، ويعمل مع قادة الموارد البشرية وكبار القادة في أبوظبي حضورياً وعبر الإنترنت، بالعربية والإنجليزية."),
               ("هل تُعقد الجلسات حضورياً في أبوظبي؟", "نعم. يمكن أن تكون الجلسات حضورياً في أبوظبي أو دبي، أو عبر الإنترنت، وكثير من العملاء يجمعون بين الاثنين."),
               ("هل يمكن لجهة عملي أن تتحمل التكلفة؟", "نعم. كثير من العملاء ترعاهم جهات عملهم. يُتفق على الأهداف في لقاء ثلاثي في البداية، ويبقى محتوى الجلسات سرياً وفق ميثاق أخلاقيات ICF."),
               ("في أي قطاعات يعمل عملاؤك في أبوظبي؟", "أغلبهم في الجهات الحكومية وشبه الحكومية، وقطاعات الطاقة والمرافق والمال، إضافة إلى شركات متعددة الجنسيات لها مكاتب في أبوظبي."),
               ("كيف أبدأ؟", "يمكنك حجز مكالمة مجانية لمدة ٣٠ دقيقة أو إرسال استفسار قصير من صفحة التواصل، بلا أي التزام.")],
    },
    "loc-saudi": {
        "en": [("Is there an Arabic-speaking executive coach for leaders in Saudi Arabia?", "Yes. Hisham Elsaied, an ICF Professional Certified Coach (PCC) based in Dubai, coaches leaders in Riyadh, Jeddah and across Saudi Arabia in Arabic and English, mostly online and in person when he is in the Kingdom."),
               ("Do I need to travel to Dubai?", "No. Most sessions run online, and sessions can be in person in Riyadh or Jeddah when Hisham is in the Kingdom."),
               ("Can my organisation pay for the coaching?", "Yes. Many clients are sponsored by their employer. Goals are agreed in a three-way meeting at the start, and the content of sessions stays confidential under the ICF Code of Ethics."),
               ("Which organisations in Saudi Arabia has he worked with?", "Organisations he has worked with in the Kingdom include ZATCA and Tabuk Pharmaceuticals, and his work takes him regularly to Riyadh, Jeddah and Tabuk."),
               ("How do I start?", "Book a free 30-minute call or send a short enquiry through the contact page. There is no obligation.")],
        "ar": [("هل يوجد كوتش تنفيذي يتحدث العربية للقادة في السعودية؟", "نعم. هشام السعيد كوتش محترف معتمد ICF PCC، مقيم في دبي، ويعمل مع القادة في الرياض وجدة وأنحاء السعودية بالعربية والإنجليزية، عبر الإنترنت غالباً، وحضورياً حين يكون في المملكة."),
               ("هل أحتاج إلى السفر إلى دبي؟", "لا. أغلب الجلسات عبر الإنترنت، ويمكن أن تكون حضورياً في الرياض أو جدة حين يكون هشام في المملكة."),
               ("هل يمكن لجهة عملي أن تتحمل التكلفة؟", "نعم. كثير من العملاء ترعاهم جهات عملهم. يُتفق على الأهداف في لقاء ثلاثي في البداية، ويبقى محتوى الجلسات سرياً وفق ميثاق أخلاقيات ICF."),
               ("مع أي جهات في السعودية عمل؟", "من الجهات التي عمل معها في المملكة هيئة الزكاة والضريبة والجمارك وتبوك للأدوية، ويأخذه عمله بانتظام إلى الرياض وجدة وتبوك."),
               ("كيف أبدأ؟", "يمكنك حجز مكالمة مجانية لمدة ٣٠ دقيقة أو إرسال استفسار قصير من صفحة التواصل، بلا أي التزام.")],
    },
}
LOC_AREA = {"loc-abu-dhabi": [{"@type": "City", "name": "Abu Dhabi"}, {"@type": "Country", "name": "United Arab Emirates"}],
            "loc-saudi": [{"@type": "City", "name": "Riyadh"}, {"@type": "City", "name": "Jeddah"}, {"@type": "Country", "name": "Saudi Arabia"}]}


def faq_html(key, ar):
    import html as _html
    rows = LOC_FAQ[key]["ar" if ar else "en"]
    return "\n".join(f'        <details{" open" if i == 0 else ""}><summary>{_html.escape(q)}</summary><p>{_html.escape(a)}</p></details>' for i, (q, a) in enumerate(rows))

BOOKS = [
    ("The Moving Line", "The 300-year race to build a thinking machine", "/img/book-the-moving-line.jpg", "History of artificial intelligence"),
    ("The Hidden Board", "How Your Brain Plays the Game of Being Human", "/img/book-the-hidden-board.jpg", "Psychology and popular science"),
    ("You Can't Fire the Machine", "Experience, blame and the future of leadership in the Middle East", "/img/book-you-cant-fire-the-machine-box.jpg", "Leadership and artificial intelligence in the Middle East"),
]
AMAZON = {"The Moving Line": "https://www.amazon.com/dp/B0HRS7CQFY", "The Hidden Board": "https://www.amazon.com/dp/B0HR2QLZD5"}
MEDIA = [
    ("Article", "Why the Middle East needs a new kind of creative leadership", "https://campaignme.com/why-the-middle-east-needs-a-new-kind-of-creative-leadership/", "2025-07-31", "Campaign Middle East"),
    ("Article", "From Ancient History to the Digital Age: The Evolving Models of the HR Function", "https://www.thehrobserver.com/indepth/from-ancient-history-to-the-digital-age-the-evolving-models-of-the-hr-function/", "2024-09-16", "The HR Observer"),
    ("Article", "Situational Leadership: Do leaders have to be consistent?", "https://www.linkedin.com/pulse/situational-leadership-do-leaders-have-consistent-hisham-elsaied", "2022-07-19", "LinkedIn"),
    ("PodcastEpisode", "Redefining Employee Experience in a Multicultural Workforce", "https://audioboom.com/posts/8797374", "2025-10-29", "greytFM"),
    ("PodcastEpisode", "What Makes Cross-Cultural Collaboration Work?", "https://www.vantagecircle.com/en/blog/podcasts/vantage-influencers/what-makes-cross-cultural-collaboration-work/", "2024-11-28", "Vantage Circle"),
    ("VideoObject", 'Eclectic Leadership Movement Podcast', "https://www.youtube.com/watch?v=vZPfe2Lh18I", None, 'Eclectic Leadership'),
    ("VideoObject", "5 O'Clock Tea Talks, episode 31, with host Seda Tekeci", "https://www.youtube.com/watch?v=3u2RgcnxhOU", None, 'Coach Magazine Global'),
    ("VideoObject", 'Cross-cultural awareness', "https://www.youtube.com/watch?v=S2xIsEFlZDY", None, 'cultureA Podcast'),
    ("VideoObject", 'Interview like a pro: inside the mind of your HR interviewer', "https://www.youtube.com/watch?v=ojHBFPRFzeU", None, 'Alchemy Search'),
    ("VideoObject", 'Beyond benefits: how AI is redefining employee happiness', "https://www.youtube.com/watch?v=z_S9lsvSaCY", None, 'Employee Happiness Awards'),
]


def gitdate(key, ar=False):
    """Last real change to a page's source, from git history (falls back to today for uncommitted edits)."""
    import subprocess, datetime
    rel = os.path.join("src", "ar" if ar else "", key + ".html")
    try:
        dirty = subprocess.run(["git", "status", "--porcelain", "--", rel], cwd=ROOT, capture_output=True, text=True).stdout.strip()
        if dirty:
            return datetime.date.today().isoformat()
        d = subprocess.run(["git", "log", "-1", "--format=%cs", "--", rel], cwd=ROOT, capture_output=True, text=True).stdout.strip()
        return d or "2026-11-16"
    except Exception:
        return "2026-11-16"


def person(ar=False):
    creds = [
        ("ICF Professional Certified Coach (PCC)", "International Coaching Federation"),
        ("Chartered Fellow (FCIPD)", "Chartered Institute of Personnel and Development"),
        ("Fellow Certified Practitioner (FCPHR)", "Australian HR Institute"),
        ("Hogan Certified Assessor", "Hogan Assessments"),
        ("Cultural Intelligence (CQ) Certified Trainer", "Cultural Intelligence Center"),
        ("MBTI Certified Practitioner", "The Myers-Briggs Company"),
    ]
    return {
        "@type": "Person",
        "@id": PERSON_ID,
        "name": "هشام السعيد" if ar else "Hisham Elsaied",
        "alternateName": ["Hisham Elsaied" if ar else "هشام السعيد", "Hisham El Saied", "Hisham El-Saied", "Hesham Elsaied", "Hesham El Saied"],
        "givenName": "Hisham", "familyName": "Elsaied",
        "url": SITE + ("/ar/" if ar else "/"),
        "mainEntityOfPage": SITE + ("/ar/about/" if ar else "/about/"),
        "hasOccupation": [
            {"@type": "Occupation", "name": "Executive coach", "occupationLocation": [{"@type": "City", "name": "Dubai"}, {"@type": "Country", "name": "United Arab Emirates"}],
             "skills": "Executive coaching, leadership coaching, HR leadership, coaching in Arabic and English"},
            {"@type": "Occupation", "name": "Keynote speaker", "occupationLocation": {"@type": "Country", "name": "United Arab Emirates"}},
            {"@type": "Occupation", "name": "Author"}],
        "memberOf": [{"@type": "Organization", "name": "International Coaching Federation", "url": "https://coachingfederation.org/"},
                     {"@type": "Organization", "name": "Chartered Institute of Personnel and Development", "url": "https://www.cipd.org/"}],
        "homeLocation": {"@type": "City", "name": "Dubai", "containedInPlace": {"@type": "Country", "name": "United Arab Emirates"}},
        "image": [SITE + "/img/hisham-closeup.jpg", SITE + "/img/ph-hrse-podium.jpg", SITE + "/img/ph-nice-qa.jpg", SITE + "/img/ph-speak-blue.jpg"],
        "jobTitle": "كوتش تنفيذي ومستشار في تطوير القيادات" if ar else "Executive Coach and Leadership Development Consultant",
        "description": ("كوتش تنفيذي مقيم في دبي ومدير إقليمي سابق للموارد البشرية. يعمل مع مديري ومديرات الموارد البشرية في دول الخليج، ويتحدث في القيادة وقدرات الموارد البشرية والمواهب والتقييم، بالعربية والإنجليزية."
                        if ar else "Dubai-based executive coach and former regional HR director. Coaches HR managers and directors across the GCC and speaks on leadership, HR capability, and talent and assessment, in Arabic and English."),
        "email": "mailto:hisham@hishamelsaied.com",
        "address": {"@type": "PostalAddress", "addressLocality": "Dubai", "addressCountry": "AE"},
        "knowsLanguage": ["en", "ar"],
        "knowsAbout": [
            "Executive coaching", "Leadership development", "Manager to leader transition",
            "Executive presence", "Strategic HR", "HR business partnering", "Workforce planning",
            "Succession planning", "Assessment centres", "Hogan assessments",
            "Cultural intelligence", "AI in HR", "Executive coaching in the Middle East", "History of artificial intelligence",
        ],
        "hasCredential": [
            {"@type": "EducationalOccupationalCredential", "name": n,
             "recognizedBy": {"@type": "Organization", "name": o}} for n, o in creds
        ],
        "award": ["Top 100 Global Power Leaders in HR, White Page International (2023)", "CIPD award winner", "Top 20 HR Influencers in the UAE 2025 (Favikon)"],
        "sameAs": ["https://www.linkedin.com/in/hishamelsaied/", "https://x.com/hishamelsaied",
                   "https://informaconnect.com/hr-summit-expo/speakers/hisham-elsaied-fcipd/",
                   "https://www.gleac.com/mentors/hisham-elsaied",
                   "https://bookboon.com/en/hisham-elsaied-author"],
    }


def business(ar=False):
    return {
        "@type": "ProfessionalService",
        "@id": BUSINESS_ID,
        "name": "هشام السعيد، كوتشينج تنفيذي" if ar else "Hisham Elsaied, Executive Coaching",
        "alternateName": "Hisham Elsaied, Executive Coaching" if ar else "هشام السعيد، كوتشينج تنفيذي",
        "url": SITE + ("/ar/" if ar else "/"),
        "image": SITE + "/img/og-image.jpg",
        "description": ("كوتشينج تنفيذي لمديري ومديرات الموارد البشرية، إلى جانب كلمات رئيسية ومحاضرات وورش عمل للقادة وفرق الموارد البشرية. دبي والإمارات ودول الخليج. بالعربية والإنجليزية."
                        if ar else "Executive coaching for HR managers and directors, plus keynotes, masterclasses and workshops for leaders and HR teams. Dubai, UAE and the wider GCC. Arabic and English."),
        "founder": {"@id": PERSON_ID},
        "email": "hisham@hishamelsaied.com",
        "address": {"@type": "PostalAddress", "addressLocality": "Dubai", "addressCountry": "AE"},
        "areaServed": [{"@type": "Country", "name": c} for c in GCC],
        "availableLanguage": ["English", "Arabic"],
        "knowsAbout": ["Executive coaching", "Leadership training", "HR capability", "Talent assessment", "الكوتشينج التنفيذي", "تدريب القيادات", "الموارد البشرية"],
    }


def service(name, desc, path, stype):
    return {
        "@type": "Service",
        "name": name,
        "serviceType": stype,
        "description": desc,
        "url": SITE + path,
        "provider": {"@id": PERSON_ID},
        "areaServed": [{"@type": "Country", "name": c} for c in GCC],
        "availableLanguage": ["English", "Arabic"],
    }


def breadcrumb(page, ar=False):
    return {
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "الرئيسية" if ar else "Home", "item": SITE + ("/ar/" if ar else "/")},
            {"@type": "ListItem", "position": 2, "name": page["nav"], "item": SITE + page["path"]},
        ],
    }


def graph(page, ar=False):
    g = [person(ar), business(ar),
         {"@type": "WebSite", "@id": SITE + ("/ar/#website" if ar else "/#website"), "url": SITE + ("/ar/" if ar else "/"),
          "name": "هشام السعيد" if ar else "Hisham Elsaied", "inLanguage": "ar" if ar else "en", "publisher": {"@id": PERSON_ID}}]
    k = page["key"]
    if k == "coaching":
        if ar:
            g.append(service("الكوتشينج التنفيذي لمديري ومديرات الموارد البشرية",
                             "كوتشينج فردي لمديري ومديرات الموارد البشرية في دور جديد أو تحت ضغط: الحضور أمام القيادات العليا، والتفكير الاستراتيجي، والتأثير، والظهور، وقرارات المسار المهني.",
                             page["path"], "كوتشينج تنفيذي"))
            faq = FAQ_AR
        else:
            g.append(service("Executive coaching for HR managers and directors",
                             "One-to-one executive coaching for HR managers and directors stepping into a bigger role or feeling stuck: presence with senior leaders, strategic thinking, influence, visibility and career decisions.",
                             page["path"], "Executive coaching"))
            faq = FAQ
        g.append({"@type": "FAQPage", "inLanguage": "ar" if ar else "en", "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq]})
    if k == "organisations":
        g.append(service("الكوتشينج التنفيذي للمؤسسات" if ar else "Executive coaching for organisations",
                         page["desc"], page["path"], "كوتشينج تنفيذي" if ar else "Executive coaching"))
        g.append({"@type": "FAQPage", "inLanguage": "ar" if ar else "en", "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in ([('كم يستغرق برنامج الكوتشينج التنفيذي مع هشام السعيد؟', 'ثلاثة أشهر تقريباً في العادة، مع لقاء ثلاثي لتحديد الأهداف في البداية، ومراجعتين ثلاثيتين في المنتصف والنهاية.'), ('ما الذي تعرفه المؤسسة من الكوتشينج التنفيذي؟', 'الأهداف المتفق عليها، وما إذا كانت الجلسات تُعقد، والتقدم الذي يُناقش في المراجعات. أما محتوى الجلسات فيبقى سرياً وفق ميثاق أخلاقيات ICF.'), ('كيف يُقاس التغيير الناتج عن الكوتشينج؟', 'يقيّم المدير وعدد من الزملاء القائد على الأهداف المتفق عليها في البداية والنهاية، فترى المؤسسة إن كان الآخرون قد لاحظوا التغيير. ويمكن إضافة تقييم Hogan أو ٣٦٠.'), ('هل يمكن تقديم الكوتشينج التنفيذي بالعربية في الإمارات؟', 'نعم. يعمل هشام السعيد بالعربية والإنجليزية، حضورياً في الإمارات، وعبر الإنترنت أو حضورياً في دول الخليج.')] if ar else [('How long does an executive coaching engagement with Hisham Elsaied last?', 'Usually about three months, with a three-way goal-setting meeting at the start and three-way reviews at the midpoint and the end.'), ('What does the organisation hear from executive coaching?', 'The goals agreed in the three-way meeting, whether sessions are taking place, and progress discussed openly at the reviews. The content of sessions stays confidential under the ICF Code of Ethics.'), ('How is the change from coaching measured?', 'The manager and a few colleagues rate the leader on the agreed goals at the start and the end, so the organisation sees whether others noticed the change. A Hogan assessment or 360 can be added.'), ('Can executive coaching be delivered in Arabic in the UAE?', 'Yes. Hisham Elsaied coaches in Arabic and English, in person in the UAE and online or in person across the GCC.')])]})
    if k == "arabic-coach":
        g.append(service("كوتشينج تنفيذي باللغة العربية" if ar else "Executive coaching in Arabic and English",
                         "كوتشينج تنفيذي فردي بالعربية والإنجليزية لقادة في الإمارات ودول الخليج." if ar else "One-to-one executive coaching in Arabic and English for leaders in the UAE and the Gulf.",
                         page["path"], "كوتشينج تنفيذي" if ar else "Executive coaching"))
        g.append({"@type": "FAQPage", "inLanguage": "ar" if ar else "en", "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in (ARQA_AR if ar else ARQA_EN)]})
    if k in LOC_FAQ:
        sv = service(("الكوتشينج التنفيذي في " + ("أبوظبي" if k == "loc-abu-dhabi" else "السعودية")) if ar else ("Executive coaching in " + ("Abu Dhabi" if k == "loc-abu-dhabi" else "Saudi Arabia")), page["desc"], page["path"], "كوتشينج تنفيذي" if ar else "Executive coaching")
        sv["areaServed"] = LOC_AREA[k]
        g.append(sv)
        g.append({"@type": "FAQPage", "inLanguage": "ar" if ar else "en", "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in LOC_FAQ[k]["ar" if ar else "en"]]})
    if k == "speaking":
        if ar:
            g.append(service("كلمات رئيسية ومحاضرات وورش عمل",
                             "كلمات رئيسية ومحاضرات متخصصة وورش عمل لنصف يوم أو يوم كامل حول قيادة الأفراد وقدرات الموارد البشرية والمواهب والتقييم، بالعربية أو الإنجليزية.",
                             page["path"], "محاضرات وورش عمل في القيادة والموارد البشرية"))
        else:
            g.append(service("Keynotes, masterclasses and workshops",
                             "Keynotes, conference masterclasses and half-day or one-day workshops on leading people, HR capability, and talent and assessment, in Arabic or English.",
                             page["path"], "Leadership and HR speaking and workshops"))
        g[-1]["areaServed"] = g[-1]["areaServed"] + [{"@type": "Country", "name": "France"}]
    if k in ("res-picker", "res-planner", "res-feedback", "res-transition"):
        g.append({"@type": "WebApplication", "name": page["nav"], "description": page["desc"], "url": SITE + page["path"],
                  "applicationCategory": "BusinessApplication", "operatingSystem": "Any", "inLanguage": "ar" if ar else "en",
                  "isAccessibleForFree": True, "offers": {"@type": "Offer", "price": "0", "priceCurrency": "AED"},
                  "author": {"@id": PERSON_ID}, "publisher": {"@id": PERSON_ID}})
    if k == "resources":
        tools = [x for x in (PAGES_AR if ar else PAGES) if x["key"] in ("res-picker", "res-planner", "res-feedback", "res-transition", "self-check")]
        g.append({"@type": "CollectionPage", "name": ("أدوات ونماذج وأدلة للقادة والموارد البشرية" if ar else "Tools, templates and guides for leaders and HR"), "description": page["desc"], "url": SITE + page["path"],
                  "inLanguage": "ar" if ar else "en", "author": {"@id": PERSON_ID},
                  "mainEntity": {"@type": "ItemList", "itemListElement": [
                      {"@type": "ListItem", "position": i + 1, "name": t["nav"], "url": SITE + t["path"]} for i, t in enumerate(tools)]}})
    if k.startswith("art-"):
        g.append({"@type": "Article", "headline": page["title"], "description": page["desc"], "inLanguage": "ar" if ar else "en",
                  "author": {"@id": PERSON_ID}, "publisher": {"@id": PERSON_ID}, "datePublished": ART_DATES.get(k, "2026-11-15"),
                  "dateModified": gitdate(k, ar), "isPartOf": {"@id": SITE + ("/ar/#website" if ar else "/#website")},
                  "image": SITE + "/img/og-image.jpg", "mainEntityOfPage": SITE + page["path"]})
    if k in ("home", "books"):
        for name, sub_, img, about in BOOKS:
            g.append({"@type": "Book", "name": name, "alternativeHeadline": sub_, "author": {"@id": PERSON_ID},
                      "inLanguage": "en", "image": SITE + img, "about": about, "url": SITE + ("/ar/books/" if ar else "/books/"), **({"sameAs": AMAZON[name]} if name in AMAZON else {})})
    if k == "media":
        g.append({"@type": "ItemList", "name": "Articles and podcasts by Hisham Elsaied", "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "item": dict({"@type": t, "name": n, "url": u, ("author" if t == "Article" else "actor"): {"@id": PERSON_ID},
                   "publisher": {"@type": "Organization", "name": pub}},
                  **({"datePublished": d} if d else {}),
                  **({"embedUrl": u.replace("watch?v=", "embed/"), "thumbnailUrl": "https://i.ytimg.com/vi/" + u.split("=")[-1] + "/hqdefault.jpg",
                      "description": n + ", with Hisham Elsaied."} if t == "VideoObject" else {}))}
            for i, (t, n, u, d, pub) in enumerate(MEDIA)]})
    if k == "about":
        g.append({"@type": "ProfilePage", "url": SITE + page["path"], "inLanguage": "ar" if ar else "en", "mainEntity": {"@id": PERSON_ID}})
    if page["nav"]:
        g.append(breadcrumb(page, ar))
    return {"@context": "https://schema.org", "@graph": g}


def counterpart(page, ar):
    if page["key"] == "404":
        return "/" if ar else "/ar/"
    if page["key"] == "session-booked":
        return "/session-booked/" if ar else "/ar/session-booked/"
    other = PAGES if ar else PAGES_AR
    return next(p["path"] for p in other if p["key"] == page["key"])


def header(page, ar=False):
    pages = PAGES_AR if ar else PAGES
    base = "/ar" if ar else ""
    order = ["coaching", "organisations", "speaking", "media", "insights", "resources", "about", "contact"]
    links = []
    for key in order:
        p = next(x for x in pages if x["key"] == key)
        cur = ' aria-current="page"' if p["key"] == page["key"] else ""
        short = {"speaking": "المحاضرات" if ar else "Speaking", "organisations": "للمؤسسات" if ar else "Organisations"}.get(key, p["nav"])
        links.append(f'      <a href="{p["path"]}"{cur}>{short}</a>')
    ask = ('      <a class="nav-ai" href="/ar/#ask-hisham"><b>اسأل هشام</b><small>كوتش ذكي · قريباً</small></a>' if ar
           else '      <a class="nav-ai" href="/#ask-hisham"><b>Ask Hisham</b><small>AI coach · soon</small></a>')
    switch = (f'      <a class="lang" href="{counterpart(page, ar)}" hreflang="en" lang="en">English</a>' if ar
              else f'      <a class="lang" href="{counterpart(page, ar)}" hreflang="ar" lang="ar">العربية</a>')
    brand = ('<b>هشام السعيد</b><span>FCIPD &nbsp;·&nbsp; ICF PCC</span>' if ar
             else '<b>Hisham Elsaied</b><span>FCIPD &nbsp;·&nbsp; ICF PCC</span>')
    menu = "القائمة" if ar else "Menu"
    enquire = "احجز مكالمة مجانية" if ar else "Book a free call"
    enquire_m = "مكالمة مجانية" if ar else "Free call"
    return f"""<header class="site-header">
  <div class="wrap">
    <a class="brand" href="{base}/">{brand}</a>
    <a class="btn book-m" href="https://app.cronofy.com/add_to_calendar/scheduling/ZOT6eIZc" target="_blank" rel="noopener">{enquire_m}</a>
    <button class="menu-toggle" id="menu-toggle" type="button" aria-expanded="false" aria-controls="nav">{menu}</button>
    <nav class="nav" id="nav" aria-label="{'القائمة الرئيسية' if ar else 'Main'}">
{chr(10).join(links)}
{ask}
{switch}
      <a class="li" href="https://www.linkedin.com/in/hishamelsaied/" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9z"/></svg></a>
      <a class="btn" href="https://app.cronofy.com/add_to_calendar/scheduling/ZOT6eIZc" target="_blank" rel="noopener">{enquire}</a>
    </nav>
  </div>
</header>"""


FOOTER = """<footer class="site-footer">
  <div class="wrap">
    <div>
      <a class="brand" href="/"><b>Hisham Elsaied</b><span>Executive coach &nbsp;·&nbsp; Dubai, UAE</span></a>
      <p class="foot-note">Executive coaching, keynotes and workshops across the UAE, Saudi Arabia, Oman, Kuwait, Qatar and Bahrain. Arabic and English.</p>
    </div>
    <div class="foot-links">
      <a href="/about/">About</a>
      <a href="/coaching/">Coaching</a>
      <a href="/speaking/">Speaking and workshops</a>
      <a href="/media/">Media</a>
      <a href="/books/">Books</a>
      <a href="/coaching-for-organisations/">For organisations</a>
      <a href="/insights/">Insights</a>
      <a href="/resources/">Free resources</a>
      <a href="/arabic-speaking-executive-coach-uae/">Arabic-speaking coach</a>
      <a href="/executive-coach-abu-dhabi/">Coach in Abu Dhabi</a>
      <a href="/executive-coach-saudi-arabia/">Coach in Saudi Arabia</a>
      <a href="/hr-self-check/">HR self-check</a>
      <a href="/contact/">Contact</a>
      <a href="/ar/" hreflang="ar" lang="ar">العربية</a>
      <a class="li" href="https://www.linkedin.com/in/hishamelsaied/" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9z"/></svg></a>
    </div>
  </div>
</footer>"""


FOOTER_AR = """<footer class="site-footer">
  <div class="wrap">
    <div>
      <a class="brand" href="/ar/"><b>هشام السعيد</b><span>كوتش تنفيذي &nbsp;·&nbsp; دبي، الإمارات</span></a>
      <p class="foot-note">كوتشينج تنفيذي وكلمات رئيسية وورش عمل في الإمارات والسعودية وعُمان والكويت وقطر والبحرين. بالعربية والإنجليزية.</p>
    </div>
    <div class="foot-links">
      <a href="/ar/about/">نبذة عني</a>
      <a href="/ar/coaching/">الكوتشينج</a>
      <a href="/ar/speaking/">المحاضرات وورش العمل</a>
      <a href="/ar/media/">الإعلام</a>
      <a href="/ar/books/">الكتب</a>
      <a href="/ar/coaching-for-organisations/">للمؤسسات</a>
      <a href="/ar/insights/">مقالات</a>
      <a href="/ar/resources/">مصادر مجانية</a>
      <a href="/ar/arabic-speaking-executive-coach-uae/">كوتش تنفيذي عربي</a>
      <a href="/ar/executive-coach-abu-dhabi/">كوتش في أبوظبي</a>
      <a href="/ar/executive-coach-saudi-arabia/">كوتش في السعودية</a>
      <a href="/ar/hr-self-check/">تقييم ذاتي</a>
      <a href="/ar/contact/">تواصل معي</a>
      <a href="/" hreflang="en" lang="en">English</a>
      <a class="li" href="https://www.linkedin.com/in/hishamelsaied/" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9z"/></svg></a>
    </div>
  </div>
</footer>"""


OG = {"speaking": "og-speaking.jpg", "about": "og-about.jpg", "media": "og-media.jpg", "organisations": "og-organisations.jpg"}


FONT_CSS = """@font-face{font-family:"Fraunces";font-style:normal;font-weight:400 600;font-display:swap;src:url(/assets/fonts/fraunces.woff2) format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:"DM Sans";font-style:normal;font-weight:400 700;font-display:swap;src:url(/assets/fonts/dm-sans.woff2) format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:"Noto Kufi Arabic";font-style:normal;font-weight:100 900;font-display:swap;src:url(/assets/fonts/noto-kufi-arabic.woff2) format("woff2");unicode-range:U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0897-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC}
""" + "".join('@font-face{font-family:"IBM Plex Sans Arabic";font-style:normal;font-weight:%d;font-display:swap;src:url(/assets/fonts/plex-arabic-%d.woff2) format("woff2");unicode-range:U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0897-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC}\n' % (w, w) for w in (400, 500, 600, 700))


def minify_css(css):
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    css = re.sub(r"\s+", " ", css)
    css = re.sub(r"\s*([{};,>])\s*", r"\1", css)
    css = re.sub(r":\s+", ":", css)
    return css.replace(";}", "}").strip()


def head(page, ar=False):
    url = SITE + page["path"]
    ld = json.dumps(graph(page, ar), ensure_ascii=False, indent=1)
    if page["key"] == "404":
        alts = ""
    else:
        en_url = SITE + (counterpart(page, ar) if ar else page["path"])
        ar_url = SITE + (page["path"] if ar else counterpart(page, ar))
        alts = (f'<link rel="alternate" hreflang="en" href="{en_url}">\n'
                f'<link rel="alternate" hreflang="ar" href="{ar_url}">\n'
                f'<link rel="alternate" hreflang="x-default" href="{en_url}">\n')
    preload = ('<link rel="preload" href="/assets/fonts/plex-arabic-400.woff2" as="font" type="font/woff2" crossorigin>\n'
               '<link rel="preload" href="/assets/fonts/noto-kufi-arabic.woff2" as="font" type="font/woff2" crossorigin>\n') if ar else \
              ('<link rel="preload" href="/assets/fonts/dm-sans.woff2" as="font" type="font/woff2" crossorigin>\n'
               '<link rel="preload" href="/assets/fonts/fraunces.woff2" as="font" type="font/woff2" crossorigin>\n')
    return f"""<!DOCTYPE html>
<html lang="{'ar' if ar else 'en'}" dir="{'rtl' if ar else 'ltr'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{page["title"]}</title>
<meta name="description" content="{page["desc"]}">
<meta name="author" content="Hisham Elsaied">
<link rel="canonical" href="{url}">
{alts}
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="{'profile' if page['key'] == 'about' else 'website'}">
<meta property="og:site_name" content="{'هشام السعيد' if ar else 'Hisham Elsaied'}">
<meta property="og:title" content="{page["title"]}">
<meta property="og:description" content="{page["desc"]}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}/img/{OG.get(page["key"], "og-image.jpg")}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="{'هشام السعيد، كوتش تنفيذي ومتحدث في دبي' if ar else 'Hisham Elsaied, executive coach and speaker in Dubai'}">
<meta property="og:locale" content="{'ar_AE' if ar else 'en_AE'}">
<meta property="og:locale:alternate" content="{'en_AE' if ar else 'ar_AE'}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{page["title"]}">
<meta name="twitter:description" content="{page["desc"]}">
<meta name="twitter:image" content="{SITE}/img/{OG.get(page["key"], "og-image.jpg")}">
<meta name="geo.region" content="AE-DU">
<meta name="geo.placename" content="Dubai">
<meta name="theme-color" content="#0a1424">
<link rel="icon" href="/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<script>if(location.protocol==="http:"&&location.hostname==="hishamelsaied.com")location.replace("https://"+location.host+location.pathname+location.search+location.hash)</script>
{preload}<link rel="stylesheet" href="/assets/site.css?v={UPDATED}">
<script type="application/ld+json">
{ld}
</script>
</head>
<body>
"""


def build():
    os.makedirs(os.path.join(ROOT, "assets"), exist_ok=True)
    css = open(os.path.join(SRC, "site.css"), encoding="utf-8").read()
    css = re.sub(r"\.page \{[^}]*\}\n\.page\.active \{[^}]*\}\n", "", css)
    css += "\n.foot-note { margin-top: 10px; max-width: 46ch; font-size: 0.92rem; color: var(--mist); }\n"
    css += open(os.path.join(SRC, "rtl.css"), encoding="utf-8").read()
    open(os.path.join(ROOT, "assets", "site.css"), "w", encoding="utf-8").write(FONT_CSS + minify_css(css))
    shutil.copy(os.path.join(SRC, "site.js"), os.path.join(ROOT, "assets", "site.js"))
    shutil.copy(os.path.join(SRC, "selfcheck.js"), os.path.join(ROOT, "assets", "selfcheck.js"))
    shutil.copy(os.path.join(SRC, "resources.js"), os.path.join(ROOT, "assets", "resources.js"))
    for ar, pages in ((False, PAGES), (True, PAGES_AR)):
        for page in pages:
            src = os.path.join(SRC, "ar" if ar else "", page["key"] + ".html")
            body = open(src, encoding="utf-8").read().replace("__V__", UPDATED)
            if page["key"] in LOC_FAQ:
                body = body.replace("__FAQ__", faq_html(page["key"], ar))
            html = head(page, ar) + header(page, ar) + "\n\n<main>\n" + body.rstrip() + "\n</main>\n\n" + (FOOTER_AR if ar else FOOTER) + \
                f'\n\n<script src="/assets/site.js?v={UPDATED}" defer></script>\n</body>\n</html>\n'
            out = os.path.join(ROOT, page["path"].strip("/"), "index.html")
            os.makedirs(os.path.dirname(out), exist_ok=True)
            open(out, "w", encoding="utf-8").write(html)
    # 404
    nf = {"key": "404", "path": "/404.html", "nav": None, "title": "Page not found | Hisham Elsaied",
          "desc": "This page doesn't exist. Go to the home page of Hisham Elsaied, executive coach in Dubai."}
    body = """  <section class="dark hero" style="padding-bottom:120px">
    <div class="wrap stack-lg">
      <div class="stack">
        <span class="label">Page not found</span>
        <h1>That page doesn't exist.</h1>
        <p class="lead">It may have moved when the site was updated.</p>
      </div>
      <div class="hero-actions"><a class="btn" href="/">Go to the home page</a><a class="btn line" href="/contact/">Contact</a></div>
    </div>
  </section>"""
    html = head(nf).replace('<meta name="robots" content="index, follow, max-image-preview:large">', '<meta name="robots" content="noindex">') \
        + header(nf) + "\n\n<main>\n" + body + "\n</main>\n\n" + FOOTER + \
        f'\n\n<script src="/assets/site.js?v={UPDATED}" defer></script>\n</body>\n</html>\n'
    open(os.path.join(ROOT, "404.html"), "w", encoding="utf-8").write(html)
    # Thank-you pages after paying for a single session (noindex, not in the sitemap)
    ty = {
        False: {"key": "session-booked", "path": "/session-booked/", "nav": None, "title": "Payment received | Hisham Elsaied",
                "desc": "Thank you for booking a single coaching session with Hisham Elsaied.",
                "body": """  <section class="dark hero" style="padding-bottom:110px">
    <div class="wrap stack-lg" style="max-width:860px">
      <div class="stack">
        <span class="label">Payment received</span>
        <h1>Thank you. Your payment is received.</h1>
        <p class="lead">Now choose a time for your session.</p>
      </div>
      <ol class="ty-steps">
        <li><b>Pick your time.</b> Choose a start time that works for you. I'll keep the full hour for you.<div style="margin-top:16px"><a class="btn" href="CAL" target="_blank" rel="noopener">Choose your time</a></div></li>
        <li><b>Check your email.</b> Your receipt is on its way from Stripe. The calendar invite follows once you've picked a time.</li>
        <li><b>Before we meet.</b> Think about the one issue you most want to work on. If there's background I should read first, reply to the calendar invite and tell me.</li>
      </ol>
      <p style="color:var(--mist)">Can't find a time that works? Email <a href="mailto:hisham@hishamelsaied.com">hisham@hishamelsaied.com</a> and I'll sort it out. &nbsp;·&nbsp; <a href="/ar/session-booked/" lang="ar" style="color:var(--gold)">العربية</a></p>
    </div>
  </section>"""},
        True: {"key": "session-booked", "path": "/ar/session-booked/", "nav": None, "title": "تم استلام الدفع | هشام السعيد",
               "desc": "شكراً لحجز جلسة كوتشينج واحدة مع هشام السعيد.",
               "body": """  <section class="dark hero" style="padding-bottom:110px">
    <div class="wrap stack-lg" style="max-width:860px">
      <div class="stack">
        <span class="label">تم استلام الدفع</span>
        <h1>شكراً لك. تم استلام الدفع.</h1>
        <p class="lead">الآن اختر وقتاً لجلستك.</p>
      </div>
      <ol class="ty-steps">
        <li><b>اختر وقتك.</b> اختر وقت البدء الذي يناسبك، وسأحجز لك الساعة كاملة.<div style="margin-top:16px"><a class="btn" href="CAL" target="_blank" rel="noopener">اختر وقتك</a></div></li>
        <li><b>راجع بريدك الإلكتروني.</b> يصلك الإيصال من Stripe، ثم دعوة التقويم بعد أن تختار الوقت.</li>
        <li><b>قبل أن نلتقي.</b> فكّر في الموضوع الأهم الذي تريد العمل عليه. وإن كانت هناك خلفية يجب أن أطّلع عليها، ردّ على دعوة التقويم وأخبرني.</li>
      </ol>
      <p style="color:var(--mist)">لم تجد وقتاً مناسباً؟ راسلني على <a href="mailto:hisham@hishamelsaied.com">hisham@hishamelsaied.com</a> وسأرتّب الأمر. &nbsp;·&nbsp; <a href="/session-booked/" lang="en" style="color:var(--gold)">English</a></p>
    </div>
  </section>"""}}
    for ar, tp in ty.items():
        html = head(tp, ar).replace('<meta name="robots" content="index, follow, max-image-preview:large">', '<meta name="robots" content="noindex">') \
            + header(tp, ar) + "\n\n<main>\n" + tp["body"].replace("CAL", "https://app.cronofy.com/add_to_calendar/scheduling/ZOT6eIZc") + "\n</main>\n\n" + (FOOTER_AR if ar else FOOTER) + \
            f'\n\n<script src="/assets/site.js?v={UPDATED}" defer></script>\n</body>\n</html>\n'
        out = os.path.join(ROOT, tp["path"].strip("/"), "index.html")
        os.makedirs(os.path.dirname(out), exist_ok=True)
        open(out, "w", encoding="utf-8").write(html)
    # sitemap + robots
    import datetime
    def lastmod(key, ar):
        return gitdate(key, ar)
    def images(key, ar):
        f = os.path.join(SRC, "ar" if ar else "", key + ".html")
        if not os.path.exists(f): return ""
        srcs = []
        for m in re.findall(r'<img src="(/img/[^"]+\.jpg)"', open(f, encoding="utf-8").read()):
            if m not in srcs: srcs.append(m)
        return "".join(f"<image:image><image:loc>{SITE}{m}</image:loc></image:image>" for m in srcs[:12])
    rows = []
    for p in PAGES:
        par = next(x for x in PAGES_AR if x["key"] == p["key"])
        for loc, pri, isar in ((p["path"], "1.0" if p["key"] == "home" else "0.8", False), (par["path"], "0.9" if p["key"] == "home" else "0.7", True)):
            rows.append(
                f"  <url><loc>{SITE}{loc}</loc><lastmod>{lastmod(p['key'], isar)}</lastmod><priority>{pri}</priority>"
                f'<xhtml:link rel="alternate" hreflang="en" href="{SITE}{p["path"]}"/>'
                f'<xhtml:link rel="alternate" hreflang="ar" href="{SITE}{par["path"]}"/>'
                f'<xhtml:link rel="alternate" hreflang="x-default" href="{SITE}{p["path"]}"/>{images(p["key"], isar)}</url>')
    open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8").write(
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'
        + "\n".join(rows) + "\n</urlset>\n")
    open(os.path.join(ROOT, "robots.txt"), "w").write("".join(f"User-agent: {b}\nDisallow: /library/\nAllow: /\n\n" for b in ["*", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Bingbot", "Applebot-Extended", "CCBot"]) + f"Sitemap: {SITE}/sitemap.xml\n")
    print("built", [p["path"] for p in PAGES + PAGES_AR] + ["/404.html", "/sitemap.xml", "/robots.txt"])


if __name__ == "__main__":
    build()
