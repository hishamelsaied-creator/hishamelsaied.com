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
UPDATED = "2026-11-14"

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

FAQ = [
    ("Can we work in Arabic?", "Yes. I coach in Arabic and English, and many clients move between the two in the same session."),
    ("Is coaching confidential?", "Yes. I work to the ICF Code of Ethics. What we discuss stays between us, including when your employer is paying, and we agree at the start what, if anything, is reported back."),
    ("Can my organisation pay for coaching?", "Yes. Many clients are sponsored by their employer and others pay themselves."),
    ("How long does a coaching engagement last?", "It depends on what you want to change. We agree the length after the first conversation."),
    ("What does executive coaching cost?", "Each engagement is tailored, so fees are shared after the first conversation."),
    ("Do you only coach HR people?", "HR managers and directors are who I work with most. I also coach senior leaders in government and corporate roles across the GCC."),
]


def person():
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
        "name": "Hisham Elsaied",
        "url": SITE + "/",
        "image": SITE + "/img/hisham-closeup.jpg",
        "jobTitle": "Executive Coach and Leadership Development Consultant",
        "description": "Dubai-based executive coach and former regional HR director. Coaches HR managers and directors across the GCC and speaks on leadership, HR capability, and talent and assessment, in Arabic and English.",
        "email": "mailto:hisham@hishamelsaied.com",
        "telephone": "+971563294418",
        "address": {"@type": "PostalAddress", "addressLocality": "Dubai", "addressCountry": "AE"},
        "knowsLanguage": ["en", "ar"],
        "knowsAbout": [
            "Executive coaching", "Leadership development", "Manager to leader transition",
            "Executive presence", "Strategic HR", "HR business partnering", "Workforce planning",
            "Succession planning", "Assessment centres", "Hogan assessments",
            "Cultural intelligence", "AI in HR",
        ],
        "hasCredential": [
            {"@type": "EducationalOccupationalCredential", "name": n,
             "recognizedBy": {"@type": "Organization", "name": o}} for n, o in creds
        ],
        "award": ["Recognised among the Top 200 HR Leaders globally", "CIPD award winner"],
        "sameAs": ["https://www.linkedin.com/in/hishamelsaied/"],
    }


def business():
    return {
        "@type": "ProfessionalService",
        "@id": BUSINESS_ID,
        "name": "Hisham Elsaied, Executive Coaching",
        "url": SITE + "/",
        "image": SITE + "/img/og-image.jpg",
        "description": "Executive coaching for HR managers and directors, plus keynotes, masterclasses and workshops for leaders and HR teams. Dubai, UAE and the wider GCC. Arabic and English.",
        "founder": {"@id": PERSON_ID},
        "email": "hisham@hishamelsaied.com",
        "telephone": "+971563294418",
        "address": {"@type": "PostalAddress", "addressLocality": "Dubai", "addressCountry": "AE"},
        "areaServed": [{"@type": "Country", "name": c} for c in GCC],
        "availableLanguage": ["English", "Arabic"],
        "knowsAbout": ["Executive coaching", "Leadership training", "HR capability", "Talent assessment"],
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


def breadcrumb(page):
    return {
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": page["nav"], "item": SITE + page["path"]},
        ],
    }


def graph(page):
    g = [person(), business(),
         {"@type": "WebSite", "@id": SITE + "/#website", "url": SITE + "/", "name": "Hisham Elsaied",
          "inLanguage": "en", "publisher": {"@id": PERSON_ID}}]
    k = page["key"]
    if k == "coaching":
        g.append(service("Executive coaching for HR managers and directors",
                         "One-to-one executive coaching for HR managers and directors stepping into a bigger role or feeling stuck: presence with senior leaders, strategic thinking, influence, visibility and career decisions.",
                         page["path"], "Executive coaching"))
        g.append({"@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in FAQ]})
    if k == "speaking":
        g.append(service("Keynotes, masterclasses and workshops",
                         "Keynotes, conference masterclasses and half-day or one-day workshops on leading people, HR capability, and talent and assessment, in Arabic or English.",
                         page["path"], "Leadership and HR speaking and workshops"))
    if k == "about":
        g.append({"@type": "ProfilePage", "url": SITE + page["path"], "mainEntity": {"@id": PERSON_ID}})
    if page["nav"]:
        g.append(breadcrumb(page))
    return {"@context": "https://schema.org", "@graph": g}


def header(page):
    links = []
    for p in PAGES:
        if not p["nav"]:
            continue
        cur = ' aria-current="page"' if p["key"] == page["key"] else ""
        links.append(f'      <a href="{p["path"]}"{cur}>{p["nav"]}</a>')
    order = ["/about/", "/coaching/", "/speaking/", "/contact/"]
    links.sort(key=lambda l: next(i for i, o in enumerate(order) if f'href="{o}"' in l))
    return f"""<header class="site-header">
  <div class="wrap">
    <a class="brand" href="/"><b>Hisham Elsaied</b><span>FCIPD &nbsp;·&nbsp; ICF PCC</span></a>
    <button class="menu-toggle" id="menu-toggle" type="button" aria-expanded="false" aria-controls="nav">Menu</button>
    <nav class="nav" id="nav" aria-label="Main">
{chr(10).join(links)}
      <a class="btn" href="/contact/">Enquire</a>
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
      <a href="/contact/">Contact</a>
      <a href="https://www.linkedin.com/in/hishamelsaied/" target="_blank" rel="noopener">LinkedIn</a>
    </div>
  </div>
</footer>"""


def head(page):
    url = SITE + page["path"]
    ld = json.dumps(graph(page), ensure_ascii=False, indent=1)
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{page["title"]}</title>
<meta name="description" content="{page["desc"]}">
<meta name="author" content="Hisham Elsaied">
<link rel="canonical" href="{url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="{'profile' if page['key'] == 'about' else 'website'}">
<meta property="og:site_name" content="Hisham Elsaied">
<meta property="og:title" content="{page["title"]}">
<meta property="og:description" content="{page["desc"]}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}/img/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="en_AE">
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
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Montserrat:wght@500;600;700&display=swap" rel="stylesheet">
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
    open(os.path.join(ROOT, "assets", "site.css"), "w", encoding="utf-8").write(css)
    shutil.copy(os.path.join(SRC, "site.js"), os.path.join(ROOT, "assets", "site.js"))
    for page in PAGES:
        body = open(os.path.join(SRC, page["key"] + ".html"), encoding="utf-8").read()
        html = head(page) + header(page) + "\n\n<main>\n" + body.rstrip() + "\n</main>\n\n" + FOOTER + \
            f'\n\n<script src="/assets/site.js?v={UPDATED}" defer></script>\n</body>\n</html>\n'
        out = os.path.join(ROOT, page["path"].strip("/"), "index.html") if page["path"] != "/" else os.path.join(ROOT, "index.html")
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
    urls = "\n".join(
        f"  <url><loc>{SITE}{p['path']}</loc><lastmod>{UPDATED}</lastmod><priority>{'1.0' if p['key'] == 'home' else '0.8'}</priority></url>"
        for p in PAGES)
    open(os.path.join(ROOT, "sitemap.xml"), "w").write(
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + "\n</urlset>\n")
    open(os.path.join(ROOT, "robots.txt"), "w").write(f"User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n")
    print("built", [p["path"] for p in PAGES] + ["/404.html", "/sitemap.xml", "/robots.txt"])


if __name__ == "__main__":
    build()
