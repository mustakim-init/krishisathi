import { useState } from "react";
import { Button } from "material/react";
import Card from "../components/Card";
import { ICONS } from "../icons";
import { PhoneHeader } from "../components/PhoneHeader";
import { toBangla } from "../format";
import { playbackMs } from "../settings";

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
    summary: "সমান জমি বেছে নিন আর পরিষ্কার পানি ব্যবহার করুন।",
    steps: [
      "সমান উচ্চতার জমি বেছে নিন।",
      "পরিষ্কার পানি দিয়ে জমি ভিজিয়ে রাখুন।",
      "চারাগুলো সমানভাবে ছড়িয়ে দিন।",
    ],
  },
  {
    id: "planting",
    title: "রোপণ",
    summary: "ঠিক বয়সের চারা সমান দূরত্বে লাগান।",
    steps: [
      "চারা ঠিক বয়সে তুলুন।",
      "সারি মিলিয়ে সমান দূরত্বে লাগান।",
      "লাগানোর পর হালকা পানি দিন।",
    ],
  },
  {
    id: "growth",
    title: "বৃদ্ধি",
    summary: "নিয়মিত জমি দেখে আসুন, কোনো বদল হলে খেয়াল করুন।",
    steps: [
      "সপ্তাহে অন্তত একবার জমি ঘুরে দেখুন।",
      "পাতার রঙ বদলাচ্ছে কি না খেয়াল করুন।",
      "জমিতে বাড়তি পানি জমতে দেবেন না।",
    ],
  },
  {
    id: "flowering",
    title: "ফুল আসা",
    summary: "এই সময়ে জমি শুকিয়ে যেতে দেবেন না।",
    steps: [
      "জমি শুকিয়ে যেতে দেবেন না।",
      "পোকা দেখলে পাতা পরীক্ষা করুন।",
      "সমস্যা দেখলে কৃষি অফিসে জানান।",
    ],
  },
  {
    id: "ripening",
    title: "পাকা",
    summary: "ধান পাকলে দানা শক্ত হয়, রঙ হলদে হয়।",
    steps: [
      "দানা শক্ত হয়েছে কি না দেখুন।",
      "কাটার আগে আবহাওয়া দেখে নিন।",
      "পাকা ধান বেশি দিন খেতে ফেলে রাখবেন না।",
    ],
  },
  {
    id: "harvest",
    title: "কাটা",
    summary: "শুকনো দিনে কাটুন, তারপর ভালোভাবে শুকান।",
    steps: [
      "শুকনো দিনে ধান কাটুন।",
      "কাটা ধান ভালোভাবে শুকান।",
      "শুকনো জায়গায় ধান সংরক্ষণ করুন।",
    ],
  },
];

export default function Guides({ onTalk }: { onTalk: () => void }) {
  const [open, setOpen] = useState<string | null>("growth");
  const [playing, setPlaying] = useState<string | null>(null);

  const listen = (id: string) => {
    setPlaying(id);
    window.setTimeout(
      () => setPlaying((current) => (current === id ? null : current)),
      playbackMs(1800),
    );
  };

  return (
    <section className="view">
      <PhoneHeader title="সঠিক চাষের নিয়ম" />

      <div className="offline">
        <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS.offline }} />
        <div>
          <p className="offline__title">অফলাইনেও দেখা যাবে</p>
          <p className="offline__sub">ইন্টারনেট না থাকলেও এই নিয়মগুলো পড়া ও শোনা যাবে।</p>
        </div>
      </div>

      <p className="lede">
        ধান চাষের ছয়টি ধাপ নিচে দেওয়া আছে। যেকোনো ধাপে চাপ দিলে তিনটি সহজ কাজ দেখতে পাবেন।
      </p>

      <div className="stages">
        {STAGES.map((stage, index) => {
          const isOpen = open === stage.id;
          return (
            <Card key={stage.id} variant="filled">
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
                <span
                  className={`stage__chevron ${isOpen ? "is-open" : ""}`}
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: ICONS.chevronDown }}
                />
              </button>

              {isOpen && (
                <div className="stage__body">
                  <ol className="steps steps--compact">
                    {stage.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                  <Button variant="text" size="s" icon={ICONS.volume} onClick={() => listen(stage.id)}>
                    {playing === stage.id ? "শোনানো হচ্ছে..." : "শুনুন"}
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <Card variant="outlined" className="panel panel--cta">
        <h2 className="panel__title">পাতায় সমস্যা দেখছেন?</h2>
        <p>ছবি বা কথা দিয়ে জানান, অ্যাপ সম্ভাব্য কারণ বলে দেবে।</p>
        <Button variant="filled" size="m" icon={ICONS.mic} onClick={onTalk}>
          কথা বলুন
        </Button>
      </Card>
    </section>
  );
}
