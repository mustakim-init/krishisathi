import { Button } from "material/react";
import Card from "../components/Card";
import { ICONS } from "../icons";
import { PhoneHeader } from "../components/PhoneHeader";
import { toBangla } from "../format";
import type { Screen } from "../nav";

const TOPICS = [
  {
    icon: ICONS.mic,
    title: "কথা বলে প্রশ্ন করুন",
    steps: [
      "‘কথা বলুন’ ট্যাবে গিয়ে বড় মাইক বাটনে চাপ দিন।",
      "‘শুনছি’ লেখা এলে সমস্যা বলুন, অথবা নিচের ঘরে লিখুন।",
      "উত্তর আবার শুনতে চাইলে ‘শুনুন’ বাটনে চাপ দিন।",
    ],
    screen: "talk",
    action: "কথা বলার স্ক্রিনে যান",
  },
  {
    icon: ICONS.camera,
    title: "ধানের পাতার ছবি দেখান",
    steps: [
      "‘কথা বলুন’ স্ক্রিনে লেখার ঘরের ক্যামেরা আইকনে চাপুন।",
      "ডেমোতে একটি নমুনা ছবি বেছে নিন।",
      "দুটি ছোট প্রশ্নের উত্তর দিয়ে ‘পুরো সমাধান দেখুন’ চাপুন।",
    ],
    screen: "talk",
    action: "কথা বলার স্ক্রিনে যান",
  },
  {
    icon: ICONS.sprout,
    title: "জমির কাজ মনে রাখুন",
    steps: [
      "‘আমার জমি’ ট্যাবে আজকের কাজ দেখুন।",
      "কাজ শেষ হলে পাশের ঘরে টিক দিন।",
      "‘খরচ যোগ করুন’ চেপে নিজের খরচ লিখুন।",
    ],
    screen: "farm",
    action: "আমার জমিতে যান",
  },
  {
    icon: ICONS.book,
    title: "সঠিক নিয়ম পড়ুন, সাহায্য নিন",
    steps: [
      "‘সঠিক চাষের নিয়ম’ থেকে ধানের যেকোনো ধাপ বেছে নিন।",
      "প্রতিটি ধাপে তিনটি সহজ কাজ ও অডিও আছে।",
      "নিশ্চিত না হলে ‘সাহায্য’ ট্যাবে জরুরি নম্বর পাবেন।",
    ],
    screen: "guides",
    action: "নিয়মগুলো দেখুন",
  },
] as const satisfies ReadonlyArray<{
  icon: string;
  title: string;
  steps: readonly string[];
  screen: Screen;
  action: string;
}>;

export default function Guide({
  onGo,
  onTour,
  onBack,
}: {
  onGo: (screen: Screen) => void;
  onTour: () => void;
  onBack: () => void;
}) {
  return (
    <section className="view">
      <PhoneHeader title="কীভাবে চালাবেন" onBack={onBack} />

      <p className="lede">
        চারটি সহজ ধাপেই পুরো অ্যাপ চলে। কোথাও বুঝতে অসুবিধা হলে এখান থেকে দেখে নিতে পারেন।
      </p>

      <Card variant="filled" className="panel">
        <h2 className="panel__title">হোম স্ক্রিন ঘুরে দেখুন</h2>
        <p>কোন বাটন কী কাজ করে, সেটি হোম স্ক্রিনে চিহ্নিত করে দেখানো হবে।</p>
        <Button variant="outlined" size="m" icon={ICONS.sparkle} onClick={onTour}>
          হোম স্ক্রিন দেখান
        </Button>
      </Card>

      <div className="guide-list">
        {TOPICS.map((topic, index) => (
          <Card key={topic.title} variant="outlined" className="guide-card">
            <div className="guide-card__head">
              <span
                className="guide-card__icon"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: topic.icon }}
              />
              <div>
                <p className="guide-card__count">কাজ {toBangla(index + 1)}</p>
                <h2 className="guide-card__title">{topic.title}</h2>
              </div>
            </div>

            <ol className="steps steps--compact">
              {topic.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>

            <Button variant="text" size="m" onClick={() => onGo(topic.screen)}>
              {topic.action}
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
}
