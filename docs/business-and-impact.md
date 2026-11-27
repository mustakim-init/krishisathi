# Business and impact

## Who pays (B2B2C model)

Smallholder farmers in Bangladesh are rarely willing or able to pay out of pocket for a digital advisory app. Charging farmers directly would exclude the very people who need it most.

**Farmers use KrishiSathi for free.** Revenue comes from organisations that already invest in reaching, supporting, and retaining farmers:

- **NGOs and agricultural development programmes** that want to scale verified extension advice across thousands of farmers.
- **Cooperatives and agro-input companies** that want farmers to use inputs accurately and achieve healthier harvests.
- **Mobile network operators**, who have a proven history of sponsoring farmer services in Bangladesh—for example, Grameenphone's *Krishi Sheba*, documented in a [GSMA case study](https://www.gsma.com/mobilefordevelopment/wp-content/uploads/2017/07/gp-krishi-sheba-mobile-agriculture-service-grameenphone-bangladesh.pdf) as a way to deliver agricultural information while building customer loyalty.

```
[Sponsoring Organisation: NGO / Cooperative / Agro-Company / Operator]
        │  (Pays annual/monthly per-farmer or program license)
        ▼
  [KrishiSathi Platform] ──► (Aggregated, anonymous regional problem insights)
        │
        │  (100% Free Bangla voice-first app + offline guides)
        ▼
[Smallholder Farmers] ──► (Better diagnosis, timely stage care, lower chemical waste)
```

---

## Revenue streams

1. **Sponsored access (Primary):** Partner organisations pay a per-active-farmer or program-tier fee so farmers in their network get full access to KrishiSathi.
2. **Aggregated insight dashboards (Secondary):** Anonymised, region- and season-level trend views (e.g., which rice symptoms or stages are spiking in which districts) to help NGOs, researchers, and input suppliers plan interventions and stock.
3. **Dealer referrals (Future, post-pilot):** Once verified local dealer partnerships exist, the app can surface nearby registered dealers when a farmer needs recommended inputs, earning a referral commission. This is intentionally excluded from the initial version until real partners are onboarded.

---

## Cost drivers and unit economics framework

Our primary operating costs are:
- **Multimodal AI & speech synthesis:** Cost per voice + photo conversation turn.
- **Lightweight backend / key proxy:** Minimal hosting for API routing and optional phone-number backup.
- **Knowledge-base curation:** Periodic human review of BRRI/DAE updates.

Because offline guides, farm profile, stage calendar, and the expense diary run **100% on-device**, they incur **zero server or AI cost** per use.

### Unit economics model (to be calibrated during Phase 2)

| Variable | Definition | How we determine it |
|---|---|---|
| $N$ | Active farmers per sponsor program | Set per partner contract (e.g., NGO pilot vs. regional cooperative) |
| $C_{\text{farmer}}$ | Monthly AI + TTS cost per active farmer | Measured in Phase 2 using real request sizes and conversation counts |
| $P_{\text{sponsor}}$ | Monthly sponsor fee per active farmer | Priced above $C_{\text{farmer}}$ based on measured usage (assumption until pilot pricing is agreed) |
| **Margin** | $N \times (P_{\text{sponsor}} - C_{\text{farmer}}) - \text{Fixed Hosting}$ | Validated after Phase 2 cost telemetry |

We will measure actual per-request AI and speech costs during the 10-day build window rather than guessing pricing numbers before running the system.

---

## Path to scale

1. **Phase 1 & 2 (Competition MVP):** Rice-first Android app with verified BRRI/DAE/BARC knowledge base, offline season companion, and Bangla voice-first UX.
2. **Post-competition Pilot:** Partner with one local NGO or agricultural cooperative to test with smallholder rice farmers, measure real diagnosis follow-through, and validate sponsor pricing.
3. **Crop & Regional Expansion:** Add maize, potato, jute, and vegetables by curating and reviewing new knowledge-base entries—without rebuilding the core app architecture.

---

## UN SDG alignment and measurable indicators

KrishiSathi directly supports **UN Sustainable Development Goal 2 (Zero Hunger)**:

| SDG Target | How KrishiSathi Contributes | Target Indicators (to measure in a pilot) |
|---|---|---|
| **Target 2.4** *(Primary)* — Sustainable food production and resilient agricultural practices | Accurate, grounded diagnosis and ask-back triage reduce guesswork and unnecessary chemical/pesticide spraying, protecting soil, water, and farmer health. | • Share of advised sessions where farmers followed the guidance<br>• Self-reported unnecessary chemical/pesticide applications avoided |
| **Target 2.3** *(Secondary)* — Double agricultural productivity and incomes of small-scale food producers | Earlier, stage-appropriate action reduces crop loss; the built-in offline expense diary (*খরচের খাতা*) helps farmers track seasonal input costs. | • Seasonal production cost per decimal/shotangsho (from the in-app diary)<br>• Self-reported yield and loss reduction compared to prior season |

*Note: These are target indicators designed for our post-competition pilot; we do not claim measured field impact before running a pilot.*
