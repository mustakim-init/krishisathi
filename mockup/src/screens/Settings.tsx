import { useState } from "react";
import { Card } from "material/react";
import { ICONS } from "../icons";
import { DemoNote, PhoneHeader } from "../components/PhoneHeader";
import {
  readVibrate,
  readVoiceSpeed,
  writeVibrate,
  writeVoiceSpeed,
  type TextSize,
  type VoiceSpeed,
} from "../settings";

const TEXT_OPTIONS: { value: TextSize; label: string }[] = [
  { value: "normal", label: "চলতি" },
  { value: "large", label: "বড়" },
  { value: "larger", label: "আরও বড়" },
];

const SPEED_OPTIONS: { value: VoiceSpeed; label: string; sub: string }[] = [
  { value: "normal", label: "স্বাভাবিক", sub: "যেমন সাধারণত বলেন" },
  { value: "slow", label: "ধীরে", sub: "আরও সময় নিয়ে শোনায়" },
];

export default function Settings({
  textSize,
  onChangeTextSize,
  onBack,
}: {
  textSize: TextSize;
  onChangeTextSize: (value: TextSize) => void;
  onBack: () => void;
}) {
  const [speed, setSpeed] = useState<VoiceSpeed>(readVoiceSpeed);
  const [buzzOn, setBuzzOn] = useState(readVibrate);

  const pickSpeed = (value: VoiceSpeed) => {
    writeVoiceSpeed(value);
    setSpeed(value);
  };

  const pickBuzz = (on: boolean) => {
    writeVibrate(on);
    setBuzzOn(on);
  };

  const currentText = TEXT_OPTIONS.find((option) => option.value === textSize)?.label ?? "চলতি";

  return (
    <section className="view">
      <PhoneHeader title="সেটিংস" onBack={onBack} />

      <p className="lede">পড়তে বা শুনতে কষ্ট হলে এখান থেকে নিজের মতো করে নিন।</p>

      <Card variant="filled" className="panel">
        <h2 className="panel__title">লেখার আকার</h2>
        <p>বড় করলে পুরো অ্যাপের লেখা বড় হবে।</p>
        <div className="options" role="group" aria-label="লেখার আকার">
          {TEXT_OPTIONS.map((option) => {
            const selected = textSize === option.value;
            return (
              <button
                key={option.value}
                type="button"
                className={`option ${selected ? "is-selected" : ""}`}
                aria-pressed={selected}
                onClick={() => onChangeTextSize(option.value)}
              >
                <span
                  className={`option__sample option__sample--${option.value}`}
                  aria-hidden="true"
                >
                  ক
                </span>
                <span className="option__label">{option.label}</span>
                {selected && (
                  <span
                    className="option__check"
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{ __html: ICONS.check }}
                  />
                )}
              </button>
            );
          })}
        </div>
        <p className="fineprint">এখন লেখা {currentText} আকারে আছে।</p>
      </Card>

      <Card variant="filled" className="panel">
        <h2 className="panel__title">শোনার গতি</h2>
        <p>উত্তর শোনানোর সময় কত ধীরে বলবে।</p>
        <div className="options" role="group" aria-label="শোনার গতি">
          {SPEED_OPTIONS.map((option) => {
            const selected = speed === option.value;
            return (
              <button
                key={option.value}
                type="button"
                className={`option ${selected ? "is-selected" : ""}`}
                aria-pressed={selected}
                onClick={() => pickSpeed(option.value)}
              >
                <span className="option__label">
                  {option.label}
                  <span className="option__sub">{option.sub}</span>
                </span>
                {selected && (
                  <span
                    className="option__check"
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{ __html: ICONS.check }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </Card>

      <Card variant="filled" className="panel">
        <h2 className="panel__title">মাইকের কম্পন</h2>
        <p>কথা বলা শুরু ও বন্ধ হলে ফোন হালকা কাঁপবে, যাতে হাতে না তাকিয়েও বোঝা যায়।</p>
        <div className="options options--row" role="group" aria-label="মাইকের কম্পন">
          <button
            type="button"
            className={`option option--compact ${buzzOn ? "is-selected" : ""}`}
            aria-pressed={buzzOn}
            onClick={() => pickBuzz(true)}
          >
            <span className="option__label">চালু</span>
          </button>
          <button
            type="button"
            className={`option option--compact ${!buzzOn ? "is-selected" : ""}`}
            aria-pressed={!buzzOn}
            onClick={() => pickBuzz(false)}
          >
            <span className="option__label">বন্ধ</span>
          </button>
        </div>
        <p className="fineprint">সব ফোনে কম্পন কাজ করে না।</p>
      </Card>

      <Card variant="outlined" className="panel">
        <h2 className="panel__title">ভাষা</h2>
        <p>বাংলা। অ্যাপ এখন শুধু বাংলায় উত্তর দেয়। ইংরেজি পরে যোগ হতে পারে।</p>
      </Card>

      <DemoNote />
    </section>
  );
}
