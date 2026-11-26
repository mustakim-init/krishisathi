import { useState } from "react";
import { Button, Card } from "material/react";
import { ICONS } from "../icons";
import { DemoNote, PhoneHeader } from "../components/PhoneHeader";

const SYMPTOMS = [
  "পাতায় গোলাকার বাদামি দাগ",
  "দাগের চারপাশে হালকা হলদে রঙ",
  "জমিতে পানি জমে আছে",
];

const STEPS = [
  "জমি থেকে বাড়তি পানি সরিয়ে দিন।",
  "আক্রান্ত পাতাগুলো তুলে জমির পাশে ফেলে দিন।",
  "জমিতে আলো-বাতাস ঢোকার ব্যবস্থা রাখুন।",
  "পাতা দেখিয়ে কৃষি অফিসে নিশ্চিত করুন।",
];

export default function Result({
  onBack,
  onAsk,
  onHelp,
}: {
  onBack: () => void;
  onAsk: () => void;
  onHelp: () => void;
}) {
  const [playing, setPlaying] = useState(false);

  const play = () => {
    setPlaying(true);
    window.setTimeout(() => setPlaying(false), 2200);
  };

  return (
    <section className="view">
      <PhoneHeader title="ফলাফল" onBack={onBack} />

      <div className="verdict">
        <p className="verdict__label">ডেমো ফলাফল</p>
        <h2 className="verdict__title">সম্ভাব্য সমস্যা: বাদামি দাগ রোগ</h2>
        <span className="pill">সম্ভাবনা মাঝারি</span>
        <p className="verdict__body">
          পাতায় বাদামি দাগ আর জমিতে পানি জমা থাকার কথা মিলে যাচ্ছে। নিচের ধাপগুলো দেখুন, তারপর
          নিশ্চিত হতে কৃষি অফিসের সঙ্গে কথা বলুন।
        </p>
      </div>

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
        <p>এটি ডেমো ফলাফল, নিশ্চিত রোগ নির্ণয় নয়।</p>
        <p>কোনো ওষুধ ব্যবহারের আগে স্থানীয় কৃষি অফিসের পরামর্শ নিন।</p>
        <p className="panel__strong">নিশ্চিত না হলে স্থানীয় কৃষি অফিসে যোগাযোগ করুন।</p>
      </Card>

      <div className="actions">
        <Button variant="filled" size="m" icon={ICONS.volume} onClick={play}>
          {playing ? "বাজছে..." : "উত্তরটি শুনুন"}
        </Button>
        <Button variant="outlined" size="m" icon={ICONS.phone} onClick={onHelp}>
          বিশেষজ্ঞের সাহায্য নিন
        </Button>
        <Button variant="text" size="m" icon={ICONS.mic} onClick={onAsk}>
          আরও প্রশ্ন করুন
        </Button>
      </div>

      <DemoNote />
    </section>
  );
}
