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
UPDATED = _h.md5(b"".join(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "src", f), "rb").read() for f in ("site.css", "rtl.css", "site.js"))).hexdigest()[:10]

PERSON_ID = SITE + "/#person"
BUSINESS_ID = SITE + "/#business"
GCC = ["United Arab Emirates", "Saudi Arabia", "Oman", "Kuwait", "Qatar", "Bahrain"]

PAGES = [
    {
        "key": "home", "path": "/", "nav": None,
        "title": "Hisham Elsaied | Executive Coach in Dubai for HR Leaders",
        "desc": "Executive coaching for HR managers and directors in Dubai, the UAE and the GCC, from a former regional HR director. ICF PCC and FCIPD. Arabic and English.",
    },
    {
        "key": "coaching", "path": "/coaching/", "nav": "Coaching",
        "title": "Executive Coaching for HR Managers and Directors | Dubai, UAE",
        "desc": "Coaching for HR managers and directors stepping into a bigger role or feeling stuck. ICF PCC coach in Dubai, across the GCC, in Arabic and English.",
    },
    {
        "key": "speaking", "path": "/speaking/", "nav": "Speaking and workshops",
        "title": "Leadership and HR Speaker, Keynotes and Workshops | UAE and GCC",
        "desc": "Keynotes, masterclasses and workshops on leading people, HR capability, and talent and assessment. Bilingual speaker and facilitator based in Dubai.",
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
        "key": "contact", "path": "/contact/", "nav": "Contact",
        "title": "Contact Hisham Elsaied | Executive Coaching and Speaking, Dubai",
        "desc": "Enquire about executive coaching, keynotes or workshops. Based in Dubai, working across the UAE and the GCC in Arabic and English.",
    },
]

PAGES_AR = [
    {
        "key": "home", "path": "/ar/", "nav": None,
        "title": "هشام السعيد | كوتش تنفيذي في دبي لقادة الموارد البشرية",
        "desc": "كوتشينج تنفيذي لمديري ومديرات الموارد البشرية في دبي والإمارات ودول الخليج، من مدير إقليمي سابق للموارد البشرية. معتمد ICF PCC وFCIPD. بالعربية والإنجليزية.",
    },
    {
        "key": "coaching", "path": "/ar/coaching/", "nav": "الكوتشينج",
        "title": "الكوتشينج التنفيذي لمديري الموارد البشرية | دبي، الإمارات",
        "desc": "كوتشينج فردي لمديري ومديرات الموارد البشرية في دور جديد أو تحت ضغط. مدرب تنفيذي معتمد ICF PCC في دبي، يعمل في دول الخليج بالعربية والإنجليزية.",
    },
    {
        "key": "speaking", "path": "/ar/speaking/", "nav": "المحاضرات وورش العمل",
        "title": "متحدث ومدرب في القيادة والموارد البشرية | الإمارات والخليج",
        "desc": "كلمات رئيسية ومحاضرات وورش عمل حول قيادة الأفراد وقدرات الموارد البشرية والمواهب والتقييم. متحدث ومدرب ثنائي اللغة مقيم في دبي.",
    },
    {
        "key": "media", "path": "/ar/media/", "nav": "الإعلام",
        "title": "الإعلام: مقالات وبودكاست ومقابلات | هشام السعيد",
        "desc": "مقالات وبودكاست وكلمات ومقابلات لهشام السعيد حول القيادة والموارد البشرية والعمل بين الثقافات: هارفارد بزنس ريفيو العربية وCampaign Middle East وغيرها.",
    },
    {
        "key": "about", "path": "/ar/about/", "nav": "نبذة عني",
        "title": "هشام السعيد، FCIPD وICF PCC | كوتش تنفيذي في دبي",
        "desc": "مدير إقليمي سابق للموارد البشرية بخبرة تزيد على ٢٠ عاماً في الخليج وأوروبا وأمريكا الشمالية. معتمد ICF PCC وFCIPD وHogan. عضو هيئة تدريس في أكاديمية PwC وEY.",
    },
    {
        "key": "contact", "path": "/ar/contact/", "nav": "تواصل معي",
        "title": "تواصل مع هشام السعيد | الكوتشينج التنفيذي والمحاضرات، دبي",
        "desc": "استفسر عن الكوتشينج التنفيذي أو الكلمات الرئيسية أو ورش العمل. مقيم في دبي ويعمل في الإمارات ودول الخليج بالعربية والإنجليزية.",
    },
]

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


BOOKS = [
    ("The Moving Line", "The 300-year race to build a thinking machine", "/img/book-the-moving-line.jpg", "History of artificial intelligence"),
    ("Coaching in the Middle East", "What works with leaders in a region of many cultures", "/img/book-coaching-in-the-middle-east.jpg", "Executive coaching in the Middle East"),
]
MEDIA = [
    ("Article", "Why the Middle East needs a new kind of creative leadership", "https://campaignme.com/why-the-middle-east-needs-a-new-kind-of-creative-leadership/", "2025-07-31", "Campaign Middle East"),
    ("Article", "From Ancient History to the Digital Age: The Evolving Models of the HR Function", "https://www.thehrobserver.com/indepth/from-ancient-history-to-the-digital-age-the-evolving-models-of-the-hr-function/", "2024-09-16", "The HR Observer"),
    ("Article", "Situational Leadership: Do leaders have to be consistent?", "https://www.linkedin.com/pulse/situational-leadership-do-leaders-have-consistent-hisham-elsaied", "2022-07-19", "LinkedIn"),
    ("PodcastEpisode", "Redefining Employee Experience in a Multicultural Workforce", "https://audioboom.com/posts/8797374", "2025-10-29", "greytFM"),
    ("PodcastEpisode", "What Makes Cross-Cultural Collaboration Work?", "https://www.vantagecircle.com/en/blog/podcasts/vantage-influencers/what-makes-cross-cultural-collaboration-work/", "2024-11-28", "Vantage Circle"),
]


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
        "alternateName": "Hisham Elsaied" if ar else "هشام السعيد",
        "url": SITE + ("/ar/" if ar else "/"),
        "image": SITE + "/img/hisham-closeup.jpg",
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
            "Cultural intelligence", "AI in HR", "Coaching in the Middle East", "History of artificial intelligence",
        ],
        "hasCredential": [
            {"@type": "EducationalOccupationalCredential", "name": n,
             "recognizedBy": {"@type": "Organization", "name": o}} for n, o in creds
        ],
        "award": ["Recognised among the Top 200 HR Leaders globally", "CIPD award winner", "Top 20 HR Influencers in the UAE 2025 (Favikon)"],
        "sameAs": ["https://www.linkedin.com/in/hishamelsaied/", "https://x.com/hishamelsaied",
                   "https://informaconnect.com/hr-summit-expo/speakers/hisham-elsaied-fcipd/",
                   "https://www.gleac.com/mentors/hisham-elsaied"],
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
    if k == "speaking":
        if ar:
            g.append(service("كلمات رئيسية ومحاضرات وورش عمل",
                             "كلمات رئيسية ومحاضرات متخصصة وورش عمل لنصف يوم أو يوم كامل حول قيادة الأفراد وقدرات الموارد البشرية والمواهب والتقييم، بالعربية أو الإنجليزية.",
                             page["path"], "محاضرات وورش عمل في القيادة والموارد البشرية"))
        else:
            g.append(service("Keynotes, masterclasses and workshops",
                             "Keynotes, conference masterclasses and half-day or one-day workshops on leading people, HR capability, and talent and assessment, in Arabic or English.",
                             page["path"], "Leadership and HR speaking and workshops"))
    if k == "home":
        for name, sub_, img, about in BOOKS:
            g.append({"@type": "Book", "name": name, "alternativeHeadline": sub_, "author": {"@id": PERSON_ID},
                      "inLanguage": "en", "image": SITE + img, "about": about, "url": SITE + ("/ar/" if ar else "/") + "#books"})
    if k == "media":
        g.append({"@type": "ItemList", "name": "Articles and podcasts by Hisham Elsaied", "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "item": {"@type": t, "name": n, "url": u, "datePublished": d,
             ("author" if t == "Article" else "actor"): {"@id": PERSON_ID}, "publisher": {"@type": "Organization", "name": pub}}}
            for i, (t, n, u, d, pub) in enumerate(MEDIA)]})
    if k == "about":
        g.append({"@type": "ProfilePage", "url": SITE + page["path"], "inLanguage": "ar" if ar else "en", "mainEntity": {"@id": PERSON_ID}})
    if page["nav"]:
        g.append(breadcrumb(page, ar))
    return {"@context": "https://schema.org", "@graph": g}


def counterpart(page, ar):
    if page["key"] == "404":
        return "/" if ar else "/ar/"
    other = PAGES if ar else PAGES_AR
    return next(p["path"] for p in other if p["key"] == page["key"])


def header(page, ar=False):
    pages = PAGES_AR if ar else PAGES
    base = "/ar" if ar else ""
    order = ["about", "coaching", "speaking", "media", "contact"]
    links = []
    for key in order:
        p = next(x for x in pages if x["key"] == key)
        cur = ' aria-current="page"' if p["key"] == page["key"] else ""
        links.append(f'      <a href="{p["path"]}"{cur}>{p["nav"]}</a>')
    switch = (f'      <a class="lang" href="{counterpart(page, ar)}" hreflang="en" lang="en">English</a>' if ar
              else f'      <a class="lang" href="{counterpart(page, ar)}" hreflang="ar" lang="ar">العربية</a>')
    brand = ('<b>هشام السعيد</b><span>FCIPD &nbsp;·&nbsp; ICF PCC</span>' if ar
             else '<b>Hisham Elsaied</b><span>FCIPD &nbsp;·&nbsp; ICF PCC</span>')
    menu = "القائمة" if ar else "Menu"
    enquire = "تواصل" if ar else "Enquire"
    return f"""<header class="site-header">
  <div class="wrap">
    <a class="brand" href="{base}/">{brand}</a>
    <button class="menu-toggle" id="menu-toggle" type="button" aria-expanded="false" aria-controls="nav">{menu}</button>
    <nav class="nav" id="nav" aria-label="{'القائمة الرئيسية' if ar else 'Main'}">
{chr(10).join(links)}
{switch}
      <a class="li" href="https://www.linkedin.com/in/hishamelsaied/" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9z"/></svg></a>
      <a class="btn" href="{base}/contact/">{enquire}</a>
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
      <a href="/ar/contact/">تواصل معي</a>
      <a href="/" hreflang="en" lang="en">English</a>
      <a class="li" href="https://www.linkedin.com/in/hishamelsaied/" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9z"/></svg></a>
    </div>
  </div>
</footer>"""


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
    fonts = "family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Montserrat:wght@500;600;700"
    if ar:
        fonts = "family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Noto+Kufi+Arabic:wght@500;600;700&" + fonts
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
<meta property="og:image" content="{SITE}/img/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="{'ar_AE' if ar else 'en_AE'}">
<meta property="og:locale:alternate" content="{'en_AE' if ar else 'ar_AE'}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{page["title"]}">
<meta name="twitter:description" content="{page["desc"]}">
<meta name="twitter:image" content="{SITE}/img/og-image.jpg">
<meta name="geo.region" content="AE-DU">
<meta name="geo.placename" content="Dubai">
<meta name="theme-color" content="#0a1424">
<link rel="icon" href="/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?{fonts}&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css?v={UPDATED}">
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
    open(os.path.join(ROOT, "assets", "site.css"), "w", encoding="utf-8").write(css)
    shutil.copy(os.path.join(SRC, "site.js"), os.path.join(ROOT, "assets", "site.js"))
    for ar, pages in ((False, PAGES), (True, PAGES_AR)):
        for page in pages:
            src = os.path.join(SRC, "ar" if ar else "", page["key"] + ".html")
            body = open(src, encoding="utf-8").read()
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
    # sitemap + robots
    rows = []
    for p in PAGES:
        par = next(x for x in PAGES_AR if x["key"] == p["key"])
        for loc, pri in ((p["path"], "1.0" if p["key"] == "home" else "0.8"), (par["path"], "0.9" if p["key"] == "home" else "0.7")):
            rows.append(
                f"  <url><loc>{SITE}{loc}</loc><lastmod>2026-11-14</lastmod><priority>{pri}</priority>"
                f'<xhtml:link rel="alternate" hreflang="en" href="{SITE}{p["path"]}"/>'
                f'<xhtml:link rel="alternate" hreflang="ar" href="{SITE}{par["path"]}"/>'
                f'<xhtml:link rel="alternate" hreflang="x-default" href="{SITE}{p["path"]}"/></url>')
    open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8").write(
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
        + "\n".join(rows) + "\n</urlset>\n")
    open(os.path.join(ROOT, "robots.txt"), "w").write("".join(f"User-agent: {b}\nAllow: /\n\n" for b in ["*", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Bingbot", "Applebot-Extended", "CCBot"]) + f"Sitemap: {SITE}/sitemap.xml\n")
    print("built", [p["path"] for p in PAGES + PAGES_AR] + ["/404.html", "/sitemap.xml", "/robots.txt"])


if __name__ == "__main__":
    build()
