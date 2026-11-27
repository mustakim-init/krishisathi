import { useState } from "react";
import { Button } from "material/react";
import Card from "../components/Card";
import { ICONS } from "../icons";
import { PhoneHeader } from "../components/PhoneHeader";
import type { CaseAnswers } from "../data/demo";
import { playbackMs } from "../settings";

const SYMPTOMS = [
  "পাতায় গোলাকার বাদামি দাগ",
  "দাগের চারপাশে হালকা হলদে রঙ",
  "জমিতে পানি জমে আছে",
];

const STEPS = [
  "জমি থেকে বাড়তি পানি সরিয়ে দিন।",
  "বেশি আক্রান্ত পাতাগুলো তুলে ফেলুন।",
  "জমিতে আলো-বাতাস ঢোকার ব্যবস্থা রাখুন।",
  "নিশ্চিত হতে পাতা নিয়ে কৃষি অফিসে দেখান।",
];

export default function Result({
  answers,
  onAsk,
  onHelp,
  onRetake,
  onBack,
}: {
  answers: CaseAnswers;
  onAsk: () => void;
  onHelp: () => void;
  onRetake: () => void;
  onBack: () => void;
}) {
  const [playing, setPlaying] = useState(false);

  const play = () => {
    setPlaying(true);
    window.setTimeout(() => setPlaying(false), playbackMs(2200));
  };

  const water = answers.standingWater === "না" ? "পানি জমে নেই" : "পানি জমে আছে";

  return (
    <section className="view">
      <PhoneHeader title="ফলাফল" onBack={onBack} />

      <div className="verdict">
        <p className="verdict__label">ডেমো ফলাফল</p>
        <h2 className="verdict__title">সম্ভাব্য সমস্যা: বাদামি দাগ রোগ</h2>
        <span className="pill">সম্ভাবনা: মাঝারি</span>
        <p className="verdict__body">
          {answers.standingWater === "না"
            ? "পাতায় বাদামি দাগ আর গাছের বয়স মিলে যাচ্ছে। জমিতে পানি জমে না থাকলেও একই কারণে এমন হতে পারে।"
            : "পাতায় বাদামি দাগ আর জমিতে পানি জমা — দুটোই মিলে যাচ্ছে। নিচের কাজগুলো করুন, আর নিশ্চিত হতে কৃষি অফিসে কথা বলুন।"}
        </p>
        <Button variant="filled" size="m" icon={ICONS.volume} onClick={play}>
          {playing ? "শোনানো হচ্ছে..." : "পুরো উত্তর শুনুন"}
        </Button>
      </div>

      <Card variant="filled" className="panel">
        <h2 className="panel__title">কীভাবে বুঝলাম</h2>
        <dl className="reasons">
          <div className="reasons__row">
            <dt>পাতার ছবি</dt>
            <dd>বাদামি গোল দাগ</dd>
          </div>
          <div className="reasons__row">
            <dt>গাছের বয়স</dt>
            <dd>{answers.age}</dd>
          </div>
          <div className="reasons__row">
            <dt>জমির পানি</dt>
            <dd>{water}</dd>
          </div>
        </dl>
      </Card>

      <Card variant="filled" className="panel">
        <h2 className="panel__title">যা দেখা যাচ্ছে</h2>
        <ul className="tick-list">
          {SYMPTOMS.map((item) => (
            <li key={item}>
              <span className="tick-list__dot" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </Card>

      <Card variant="filled" className="panel">
        <h2 className="panel__title">এখন কী করবেন</h2>
        <ol className="steps">
          {STEPS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </Card>

      <Card variant="outlined" className="panel panel--caution">
        <h2 className="panel__title">সতর্কতা</h2>
        <p>এটি ডেমো ফলাফল, চূড়ান্ত রোগ নির্ণয় নয়।</p>
        <p className="panel__strong">কোনো ওষুধ দেওয়ার আগে স্থানীয় কৃষি অফিসের পরামর্শ নিন।</p>
      </Card>

      <div className="actions">
        <Button variant="filled" size="m" icon={ICONS.phone} onClick={onHelp}>
          কৃষি অফিসে যোগাযোগ করুন
        </Button>
        <Button variant="outlined" size="m" icon={ICONS.mic} onClick={onAsk}>
          আরও প্রশ্ন করুন
        </Button>
        <Button variant="outlined" size="m" icon={ICONS.camera} onClick={onRetake}>
          আরেকটি ছবি দেখান
        </Button>
      </div>

      <p className="fineprint saved-note">এই উত্তর আপনার ফোনে সেভ করা আছে, অফলাইনেও দেখা যাবে।</p>

    </section>
  );
}
