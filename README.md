# KrishiSathi (কৃষিসাথী)

A talking assistant for farmers in Bangladesh. You say what's wrong with your crop, it asks a few simple questions, and it answers out loud in Bangla. We start with rice, the crop most farmers grow, but the product is built for farmers, not for one crop.

| | |
|---|---|
| **Track** | Agriculture — Aethermind 2026, BUCC, BRAC University |
| **Team** | Four undergraduate students from BRAC University |
| **SDG** | Target 2.4 (primary), Target 2.3 (secondary) |
| **First crop** | Rice (আউশ, আমন, বোরো) — the starting point, not the boundary |
| **Status** | Round 1: clickable prototype. The Android app is built in the competition's 10-day window, Dec 11–20, 2026. |
| **Live prototype** | Not published yet — the link goes here once the Round 1 mockup is deployed |
| **License** | MIT |

## Why we built it

Farming is still how close to half of Bangladesh's people earn a living, and most of those farmers work small plots. The UNDP puts the share of farmers on small and marginal land at over 76% ([source](https://www.undp.org/node/148791)). When rice gets sick, there is often no expert nearby. A wrong guess can cost a season's work, and the usual fallback is to spray more, which costs money and hurts the soil and water.

Most farming apps ask the farmer to type, read and click through menus. That is a lot to ask in the middle of a working day. We wanted something closer to asking a knowledgeable neighbour.

We spoke with farmers and with people who know agriculture well while shaping this idea.

## What it does

A farmer taps one big button and talks, or sends a photo of the leaf. A photo alone can mislead, so the assistant asks a few short questions first: how old is the crop, since when has it looked like this, is there standing water in the field. Then it answers in spoken Bangla, with simple steps.

The advice is meant to come from published guidance such as BRRI and the Department of Agricultural Extension, not from the AI's guess. If the assistant isn't sure, it says so and points the farmer to the local agriculture office instead of making something up.

The app also helps through the season. A farmer can save their field, see what stage the crop is in, get reminders for what to do next, read illustrated guides with audio, and keep a simple record of costs. The guides, reminders and records work without internet. Only the conversation needs a connection.

### Rice first, not rice only

Rice is where we start. It is the main crop, most farmers grow it, and the public guidance for it is good enough to build on.

Nothing in the app is built around rice as a limit. The assistant decides what it can answer from the guidance it has been given, and a crop it has no guidance for gets an honest "I don't have reliable information on this one" and a pointer to the local agriculture office. Adding a crop means adding guidance that a person has checked against its source, not rebuilding the app.

## How it works

The AI model handles language and image understanding. The rest is ours.

1. The farmer speaks or types, and may send a leaf photo.
2. **Understanding.** The model turns the speech into Bangla text and picks out symptoms. It can only choose from the problems in our own knowledge base, which is small, written from published sources and checked by a person.
3. **Retrieval (ours).** We score those candidates by how well the symptoms match, whether the crop's growth stage fits, and whether the season fits.
4. **Decision (ours).** Three outcomes: ask one more short question (at most three per issue), answer, or hand over to a person. The thresholds are set by testing, not by feel.
5. **Answering.** The model writes the reply from the selected knowledge-base entries only, and every step it gives has to name the entry it came from.
6. **Safety check (ours).** A reply is rejected if a step has no source, or if it contains a pesticide name or dose that isn't in the cited entry. If confidence isn't high, the agriculture-office note is always added.
7. The answer is spoken, shown on screen with a replay button, and saved.

## Who it is for and how it pays for itself

Farmers use it for free. The organisations that already work with farmers (NGOs, cooperatives, agro-input companies, mobile operators) are the ones who would fund it. More in [business and impact](docs/business-and-impact.md).

## What already exists

Several good tools already serve farmers, including Dr. Chashi, BRRI's own rice app and a few more. We looked at each one carefully and explain where KrishiSathi fits in [market and competition](docs/market-and-competition.md).

## The goal behind it

KrishiSathi supports UN Sustainable Development Goal 2, mainly Target 2.4 (farming that is sustainable and resilient, including less unnecessary chemical use) and Target 2.3 (higher productivity and income for small farmers).

## How to run it

The Round 1 prototype is in `mockup/`. It is a small React app written in TypeScript and built with Vite, using Material 3 web components and a self-hosted copy of the Bangla font Hind Siliguri. The build output is plain static files, so hosting it needs no server.

```
cd mockup
npm install
npm run dev       # opens the prototype at http://localhost:5173
```

To produce the files that get deployed:

```
cd mockup
npm run build     # type-checks the code, then writes static files to mockup/dist/
npm run preview   # serves the built files so they can be checked before deploying
```

Building needs Node 20.19 or newer, or 22.12 and newer. `mockup/dist/` and `mockup/node_modules/` are generated and are not in the repository. On a desktop the prototype is meant to be viewed inside a phone frame; it is designed for a 360–412 px wide screen.

The Android app does not exist yet. When it does, this section will say how to open it in Android Studio and where to put the API key, which lives in `local.properties` and is never committed.

## How AI is used

This is the full list of AI tools used on this project. Nothing is hidden from this table.

| Tool | What we used it for | Review |
|---|---|---|
| Claude (Anthropic) | Research, planning, drafting documents | Draft output is read and corrected by a team member before it is committed |
| ChatGPT (OpenAI) | Brainstorming, drafting documents | Draft output is read and corrected by a team member before it is committed |
| OpenCode with DeepSeek V4.1 Flash Free | Coding assistant: repository setup, writing and editing project documentation | Draft output is read and corrected by a team member before it is committed |
| Codebuff (Freebuff) | Coding assistant: building the Round 1 prototype, editing the README and preparing commits | Draft output is read and corrected by a team member before it is committed |

Speech recognition and text-to-speech models have not been chosen yet. The voice we pick will be listed here with its licence and cost, because some Bangla voices are free for non-commercial use only.

No images or video have been made with AI. If we use any, they will carry a visible label saying so.

## Open-source libraries

Everything the Round 1 prototype uses, with its licence. All of these are general-purpose tools and libraries; none of them is a farming or AI service.

| Library | Version | Licence | What it does here |
|---|---|---|---|
| [React](https://react.dev) and React DOM | 19.3 | MIT | Draws the screens and keeps their state |
| [Material 3 web components](https://md3.io) (`material`) | 3.16 | MIT | Buttons, cards, dialogs, navigation bar, progress bar and checkboxes |
| [Vite](https://vite.dev) | 7.3 | MIT | Development server and the production build |
| [TypeScript](https://www.typescriptlang.org) | 5.9 | Apache-2.0 | Type checking during the build; it is not shipped to the browser |
| [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) | 5.2 | MIT | Build-time support for React |
| [Hind Siliguri](https://fonts.google.com/specimen/Hind+Siliguri), Indian Type Foundry | 400, 600, 700 | SIL Open Font License 1.1 | The Bangla typeface, stored in `mockup/public/fonts/` together with its licence file |

Every library added to the Android app will be listed here in the same way.

## Datasets

None yet. The photo test set for the build window will be our own photographs plus openly licensed images, and each source will be listed here.

## Knowledge base sources

Advice in the app comes only from public Bangladeshi agriculture guidance: the Bangladesh Rice Research Institute (BRRI), the Department of Agricultural Extension (DAE), the Bangladesh Agricultural Research Council (BARC), and BAMIS agro-advisories. Each entry records its exact page, publisher and access date, and is checked against the source by a team member before it is used. There is no entry without a source, and no advice in the app that isn't in an entry.

Rice entries come from BRRI, the national rice institute. Other crops will draw on the institutes that cover them, such as the Bangladesh Agricultural Research Institute (BARI), under the same rule: a person checks each entry against its source before it ships.

## Known limitations

- The Round 1 submission is a scripted prototype. It does not diagnose anything and does not use a camera or microphone.
- The Android app is built during the competition's 10-day window and is not released. It is a demo, not a product people can download.
- It answers in Bangla only. The first version covers rice; for a crop we have no verified guidance on, it says so and refers the farmer to the local office instead of guessing.
- It is not a replacement for an agriculture officer. When it isn't sure, it says so and points to the local office.
- Bangla speech recognition and text-to-speech have not been tested widely. Regional dialects are untested.
- There are no accuracy numbers yet. Any figures we publish later will come from our own described test set, including the failures.
- The conversation needs internet. Only the guides, calendar, farm profile, diary and history work offline.

## License

MIT. See [LICENSE](LICENSE).
