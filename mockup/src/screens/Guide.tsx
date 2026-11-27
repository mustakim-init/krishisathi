import { Button } from "material/react";
import Card from "../components/Card";
import { ICONS } from "../icons";
import { DemoNote, PhoneHeader } from "../components/PhoneHeader";
import { toBangla } from "../format";
import type { Screen } from "../nav";

const TOPICS = [
  {
    icon: ICONS.mic,
    title: "কথা বলে প্রশ্ন করুন",
    steps: [
      "হোমে গিয়ে বড় সবুজ মাইক বাটনে চাপ দিন।",
      "‘শুনছি’ লেখা এলে নিজের ভাষায় সমস্যা বলুন।",
      "উত্তর আবার শুনতে চাইলে ‘শুনুন’ বাটনে চাপ দিন।",
    ],
    screen: "talk",
    action: "কথা বলার স্ক্রিনে যান",
  },
  {
    icon: ICONS.camera,
    title: "ধানের পাতার ছবি দেখান",
    steps: [
      "হোম থেকে ‘ছবি দেখান’ কার্ডে ট্যাপ করুন।",
      "একটি নমুনা ছবি বেছে নিন।",
      "দুটি ছোট প্রশ্নের উত্তর দিয়ে ‘ছবি বিশ্লেষণ করুন’ চাপুন।",
    ],
    screen: "doctor",
    action: "ছবির স্ক্রিনে যান",
  },
  {
    icon: ICONS.sprout,
    title: "জমির কাজ মনে রাখুন",
    steps: [
      "‘আমার জমি’ ট্যাবে আজকের কাজ দেখুন।",
      "কাজ শেষ হলে পাশের ঘরে টিক দিন।",
      "‘খরচের খাতা’ থেকে মৌসুমের হিসাব দেখুন।",
    ],
    screen: "farm",
    action: "আমার জমিতে যান",
  },
  {
    icon: ICONS.book,
    title: "গাইড পড়ুন, সাহায্য নিন",
    steps: [
      "‘চাষের গাইড’ থেকে ধানের যেকোনো ধাপ বেছে নিন।",
      "প্রতিটি ধাপে তিনটি সহজ কাজ ও অডিও আছে।",
      "নিশ্চিত না হলে ‘সাহায্য’ ট্যাবে কৃষি অফিসের নম্বর পাবেন।",
    ],
    screen: "guides",
    action: "গাইড দেখুন",
  },
] as const satisfies ReadonlyArray<{
  icon: string;
  title: string;
  steps: readonly string[];
  screen: Screen;
  action: string;
}>;

export default function Guide({
  onBack,
  onGo,
  onTour,
}: {
  onBack: () => void;
  onGo: (screen: Screen) => void;
  onTour: () => void;
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

      <DemoNote />
    </section>
  );
}
