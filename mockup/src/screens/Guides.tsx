import { useState } from "react";
import { Button, Card } from "material/react";
import { ICONS } from "../icons";
import { DemoNote, PhoneHeader } from "../components/PhoneHeader";
import { toBangla } from "../format";

type Stage = {
  id: string;
  title: string;
  summary: string;
  steps: string[];
};

const STAGES: Stage[] = [
  {
    id: "seedbed",
    title: "বীজতলা",
    summary: "সমান জমি বেছে নিন আর পরিচ্ছন্ন পানি ব্যবহার করুন।",
    steps: ["সমান উচ্চতার জমি বেছে নিন।", "পরিষ্কার পানি দিয়ে জমি ভিজিয়ে রাখুন।", "চারাগুলো সমানভাবে ছড়িয়ে দিন।"],
  },
  {
    id: "planting",
    title: "রোপণ",
    summary: "ঠিক বয়সের চারা সমান দূরত্বে লাগান।",
    steps: ["চারা ঠিক বয়সে তুলুন।", "সারি মিলিয়ে সমান দূরত্বে লাগান।", "লাগানোর পর হালকা পানি দিন।"],
  },
  {
    id: "growth",
    title: "বৃদ্ধি",
    summary: "নিয়মিত জমি দেখে আসুন, বদল খেয়াল করুন।",
    steps: ["নিয়মিত জমি দেখে আসুন।", "পাতার রঙ বদলাচ্ছে কি না খেয়াল করুন।", "জমিতে বাড়তি পানি জমতে দেবেন না।"],
  },
  {
    id: "flowering",
    title: "ফুল আসা",
    summary: "এই সময়ে জমি শুকিয়ে যেতে দেবেন না।",
    steps: ["জমি শুকিয়ে যেতে দেবেন না।", "পোকা দেখলে পাতা পরীক্ষা করুন।", "সমস্যা দেখলে কৃষি অফিসে জানান।"],
  },
  {
    id: "ripening",
    title: "পাকা",
    summary: "ধান পাকলে দানা শক্ত হয়, রঙ হলদে হয়।",
    steps: ["দানা শক্ত হয়েছে কি না দেখুন।", "কাটার আগে আবহাওয়া দেখুন।", "পাকা ধান বেশি দিন খেতে ফেলে রাখবেন না।"],
  },
  {
    id: "harvest",
    title: "কাটা",
    summary: "শুকনো দিনে কাটুন, তারপর ভালোভাবে শুকান।",
    steps: ["শুকনো দিনে ধান কাটুন।", "কাটা ধান ভালোভাবে শুকান।", "শুকনো জায়গায় ধান রাখুন।"],
  },
];

export default function Guides({ onBack, onDoctor }: { onBack: () => void; onDoctor: () => void }) {
  const [open, setOpen] = useState<string | null>("growth");
  const [playing, setPlaying] = useState<string | null>(null);

  const listen = (id: string) => {
    setPlaying(id);
    window.setTimeout(() => setPlaying((current) => (current === id ? null : current)), 1800);
  };

  return (
    <section className="view">
      <PhoneHeader title="চাষের গাইড" onBack={onBack} />

      <div className="offline">
        <span className="offline__icon" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS.offline }} />
        <div>
          <p className="offline__title">অফলাইনেও দেখা যাবে</p>
          <p className="offline__sub">ইন্টারনেট না থাকলেও এই গাইডগুলো পড়া যাবে।</p>
        </div>
      </div>

      <p className="lede">
        ধানের জীবন শুরু থেকে শেষ পর্যন্ত ছয়টি ধাপে ভাগ করা। যেকোনো ধাপে চাপ দিলে তিনটি ছোট কাজ দেখতে
        পাবেন।
      </p>

      <div className="stages">
        {STAGES.map((stage, index) => {
          const isOpen = open === stage.id;
          return (
            <Card key={stage.id} variant="filled" className="stage">
              <button
                type="button"
                className="stage__toggle"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : stage.id)}
              >
                <span className="stage__num" aria-hidden="true">
                  {toBangla(index + 1)}
                </span>
                <span className="stage__text">
                  <span className="stage__title">{stage.title}</span>
                  <span className="stage__summary">{stage.summary}</span>
                </span>
                <span className={`stage__chevron ${isOpen ? "is-open" : ""}`} aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS.chevronDown }} />
              </button>

              {isOpen && (
                <div className="stage__body">
                  <ol className="steps steps--compact">
                    {stage.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                  <Button variant="text" size="s" icon={ICONS.volume} onClick={() => listen(stage.id)}>
                    {playing === stage.id ? "বাজছে..." : "শুনুন"}
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <Card variant="outlined" className="panel panel--cta">
        <h2 className="panel__title">পাতায় সমস্যা দেখছেন?</h2>
        <p>ছবি তুলে দেখান, আমরা সম্ভাব্য কারণ বলব।</p>
        <Button variant="filled" size="m" icon={ICONS.camera} onClick={onDoctor}>
          ছবি তুলে দেখান
        </Button>
      </Card>

      <DemoNote />
    </section>
  );
}
