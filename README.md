# KrishiSathi (কৃষিসাথী)

A talking assistant for rice farmers in Bangladesh. You say what's wrong with your crop, it asks a few simple questions, and it answers out loud in Bangla.

## Why we built it

Farming is still how close to half of Bangladesh's people earn a living, and most of those farmers work small plots. The UNDP puts the share of farmers on small and marginal land at over 76% ([source](https://www.undp.org/node/148791)). When rice gets sick, there is often no expert nearby. A wrong guess can cost a season's work, and the usual fallback is to spray more, which costs money and hurts the soil and water.

Most farming apps ask the farmer to type, read and click through menus. That is a lot to ask in the middle of a working day. We wanted something closer to asking a knowledgeable neighbour.

We spoke with farmers and with people who know agriculture well while shaping this idea.

## What it does

A farmer taps one big button and talks, or sends a photo of the leaf. A photo alone can mislead, so the assistant asks a few short questions first: how old is the crop, since when has it looked like this, is there standing water in the field. Then it answers in spoken Bangla, with simple steps.

The advice is meant to come from published guidance such as BRRI and the Department of Agricultural Extension, not from the AI's guess. If the assistant isn't sure, it says so and points the farmer to the local agriculture office instead of making something up.

The app also helps through the season. A farmer can save their field, see what stage the crop is in, get reminders for what to do next, read illustrated guides with audio, and keep a simple record of costs. The guides, reminders and records work without internet. Only the conversation needs a connection.

## Who it is for and how it pays for itself

Farmers use it for free. The organisations that already work with farmers (NGOs, cooperatives, agro-input companies, mobile operators) are the ones who would fund it. More in [business and impact](docs/business-and-impact.md).

## What already exists

Several good tools already serve farmers, including Dr. Chashi, BRRI's own rice app and a few more. We looked at each one carefully and explain where KrishiSathi fits in [market and competition](docs/market-and-competition.md).

## The goal behind it

KrishiSathi supports UN Sustainable Development Goal 2, mainly Target 2.4 (farming that is sustainable and resilient, including less unnecessary chemical use) and Target 2.3 (higher productivity and income for small farmers).

## How AI is used

In the app, an AI model listens to the farmer and looks at the photo. On top of that we are building our own parts: choosing likely problems from the symptoms and the growth stage, deciding when to ask another question or hand over to a person, and blocking any advice that isn't backed by a source.

Tools we used while working on this project:

| Tool | What we used it for |
|---|---|
| Claude (Anthropic) | Research help, planning and drafting documents |
| ChatGPT (OpenAI) | Brainstorming and drafting documents |
| Coding assistant(s) | Add the exact tool names here as you use them |

We will keep this table up to date, including any speech or text-to-speech models, libraries and datasets we add later.

## Where we are

The competition's first round is a clickable prototype of the app. The working app will be built during the 10-day build window and shown on Demo Day.

## License

MIT. See [LICENSE](LICENSE).
