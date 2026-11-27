# Market and competition

## Who we are building for

Our primary users are smallholder rice farmers in Bangladesh who own a basic or mid-range Android phone, speak Bangla comfortably, and are discouraged by text-heavy apps, search bars, and complex menus.

From our team's direct observations in rural Bangladesh, farmers already use smartphone apps such as **imo** every day—they recognize familiar icons, faces, and buttons once shown how, and repeat those steps confidently. However, they often get stuck when an app expects them to type in a search bar, read nested menus, or create an account with an email address and password (many rural phones have no active Google account that the owner remembers).

Around the farmer are the people and organisations that already support them: **NGO field workers, government agriculture extension staff, cooperatives, and agro-input dealers**. These organisations are also our primary paying customers (B2B2C).

| Segment | Role | Core Need |
|---|---|---|
| **Smallholder farmers** (Primary users) | Grow rice (Aus, Aman, Boro) on small/marginal plots | Fast, spoken Bangla guidance without typing, login walls, or jargon |
| **NGOs & cooperatives** (Paying sponsors) | Run farmer support & sustainability programs | Scalable, accurate advisory and aggregated field-problem visibility |
| **Agro-input companies & dealers** | Supply seeds, fertilizers, and crop protection | Responsible product usage, farmer trust, and demand insights |
| **Extension officers** | Advise farmers at the upazila/union level | Fewer unnecessary visits for routine issues; clear triage before escalation |

---

## What farmers can use today

Farmers in Bangladesh are not starting from zero. We studied existing digital agriculture tools to understand what works and where gaps remain:

| Tool | What it offers | Strengths | Key Gap KrishiSathi Addresses |
|---|---|---|---|
| **Dr. Chashi** | AI crop disease detection; [TBS](https://www.tbsnews.net/node/630290) reports an interactive voice assistant and call centre | Combines AI detection with call-centre support | Photo-first flow; lacks a structured multi-turn ask-back dialogue + offline season companion |
| **BRRI "ধান সুরক্ষা"** ([Google Play](https://play.google.com/store/apps/details?id=com.brriapps)) | Official rice problem-solution app from the Bangladesh Rice Research Institute | Authoritative BRRI content | Menu-driven reading experience; not built around spoken Bangla conversation |
| **Crops Doctor** ([BSS](https://www.bssnews.net/news/411029/print)) | AI assistant for farmers built by a student at HSTU | Accessible crop-help concept | Single-turn Q&A without stage-aware season tracking or offline audio guides |
| **GP Krishi Sheba** ([GSMA](https://www.gsma.com/mobilefordevelopment/wp-content/uploads/2017/07/gp-krishi-sheba-mobile-agriculture-service-grameenphone-bangladesh.pdf)) | Operator-funded voice agriculture information service | Proven willingness of mobile operators to fund farmer services | Legacy voice-call model; cannot inspect leaf photos or keep a visual farm diary |
| **Krishi Desk** ([Google Play](https://play.google.com/store/apps/details?id=ss.krishidesk)) | Market prices and bookings | Useful for market linkage | Focuses on commerce/prices rather than crop-health diagnosis and season care |
| **Digital Khamari** ([UNB](https://unb.com.bd/news/tag/143843)) | Offline-capable livestock management app | Proves offline-first mobile apps work well for Bangladeshi farmers | Built for livestock, not rice/crop advisory |
| **KrishokBondhu** ([arXiv](https://arxiv.org/abs/2510.18355)) | Research project on a voice-based RAG advisory call centre for Bengali farmers | Strong Bengali voice-RAG validation | Call-centre research prototype; not a smartphone season companion with photo + offline tools |

---

## What this tells us

Photo-based disease detection and basic voice features already exist, so we do not claim novelty for either one on its own.

What we noticed is that most tools give a one-shot answer from a photo or a menu choice and stop. In reality, a knowledgeable human adviser **asks questions first**—because a yellowing rice leaf can come from nitrogen shortage, standing water, a pest, or a fungal disease. Most existing tools also assume reliable internet, comfortable reading skills, and account logins.

## Where KrishiSathi fits

1. **Ask-back conversation:** Holds a short spoken Bangla dialogue (up to 3 targeted follow-up questions) before concluding.
2. **Grounded, safe advice:** Answers strictly from verified Bangladeshi sources (BRRI, DAE, BARC, BAMIS) and says plainly when it is not sure, pointing to the local agriculture office instead of guessing.
3. **Zero-friction, no mandatory sign-in:** Works immediately on install with local-first storage—no email or password wall.
4. **Whole-season offline companion:** Farm profile, growth-stage reminders, illustrated guides with audio, and an expense diary all work without internet.
5. **Rice first, expandable by content:** Rice is our starting crop because it is Bangladesh's staple and has strong public documentation. Adding new crops only requires adding verified knowledge-base entries, not rebuilding the app.

## Why now

Modern multimodal models can now process spoken Bangla and crop photos together in a single request, while smartphone adoption in rural Bangladesh has reached a point where voice-first, icon-driven interfaces are practical. We are building our test sets to measure real-world Bangla speech and photo performance before making any accuracy claims.
