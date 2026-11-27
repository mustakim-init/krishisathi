import { useState } from "react";
import { Button } from "material/react";
import Card from "../components/Card";
import { PhoneHeader } from "../components/PhoneHeader";
import { hasFarm, landLabel, seasonLabel, type FarmProfile } from "../farm";
import { toBangla } from "../format";
import {
  readVibrate,
  readVoiceSpeed,
  writeVibrate,
  writeVoiceSpeed,
  type TextSize,
  type VoiceSpeed,
} from "../settings";

const TEXT_OPTIONS: { value: TextSize; label: string }[] = [
  { value: "normal", label: "সাধারণ" },
  { value: "large", label: "বড়" },
  { value: "larger", label: "আরও বড়" },
];

const SPEED_OPTIONS: { value: VoiceSpeed; label: string; sub: string }[] = [
  { value: "normal", label: "স্বাভাবিক", sub: "যেমন সাধারণত বলেন" },
  { value: "slow", label: "ধীরে", sub: "আস্তে আস্তে শোনাবে" },
];

export default function Settings({
  profile,
  onBack,
  textSize,
  onChangeTextSize,
  onSetup,
}: {
  profile: FarmProfile;
  onBack: () => void;
  textSize: TextSize;
  onChangeTextSize: (value: TextSize) => void;
  onSetup: () => void;
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

  const currentText = TEXT_OPTIONS.find((option) => option.value === textSize)?.label ?? "সাধারণ";

  return (
    <section className="view">
      <PhoneHeader title="সেটিংস" onBack={onBack} />

      <p className="lede">পড়তে বা শুনতে সুবিধা অনুযায়ী এখান থেকে ঠিক করে নিন।</p>

      <Card variant="filled" className="panel">
        <h2 className="panel__title">আমার খামার</h2>
        <p>এই তথ্যগুলো আপনার ফোনেই সেভ থাকে।</p>
        <dl className="reasons">
          <div className="reasons__row">
            <dt>নাম</dt>
            <dd>{profile.name.trim() || "দেওয়া হয়নি"}</dd>
          </div>
          <div className="reasons__row">
            <dt>জেলা</dt>
            <dd>{profile.district || "দেওয়া হয়নি"}</dd>
          </div>
          <div className="reasons__row">
            <dt>অবস্থা</dt>
            <dd>
              {profile.status === "preparing"
                ? "জমি তৈরি করছি"
                : profile.status === "planted"
                  ? "রোপণ করেছি"
                  : "দেওয়া হয়নি"}
            </dd>
          </div>
          <div className="reasons__row">
            <dt>মৌসুম</dt>
            <dd>{seasonLabel(profile.season) ?? "দেওয়া হয়নি"}</dd>
          </div>
          <div className="reasons__row">
            <dt>জমির ধরন</dt>
            <dd>{landLabel(profile.landType) ?? "দেওয়া হয়নি"}</dd>
          </div>
          <div className="reasons__row">
            <dt>জমির পরিমাণ</dt>
            <dd>
              {profile.areaShotangsho !== null
                ? `${toBangla(profile.areaShotangsho)} শতাংশ`
                : "দেওয়া হয়নি"}
            </dd>
          </div>
        </dl>
        <Button variant="filled" size="m" onClick={onSetup}>
          {hasFarm(profile) ? "তথ্য বদলান" : "তথ্য দিন"}
        </Button>
      </Card>

      <Card variant="filled" className="panel">
        <h2 className="panel__title">লেখার সাইজ</h2>
        <p>বড় করলে পুরো অ্যাপের লেখা বড় দেখাবে।</p>
        <div className="options" role="group" aria-label="লেখার সাইজ">
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
              </button>
            );
          })}
        </div>
        <p className="fineprint">এখন লেখা {currentText} সাইজে আছে।</p>
      </Card>

      <Card variant="filled" className="panel">
        <h2 className="panel__title">শোনার গতি</h2>
        <p>উত্তর শোনানোর সময় কত ধীরে বলবে।</p>
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
              </button>
            );
          })}
        </div>
      </Card>

      <Card variant="filled" className="panel">
        <h2 className="panel__title">মাইক ভাইব্রেশন</h2>
        <p>কথা বলা শুরু বা শেষ হলে ফোন হালকা কাঁপবে।</p>
        <div className="options" role="group" aria-label="ভাইব্রেশন">
          <button
            type="button"
            className={`option ${buzzOn ? "is-selected" : ""}`}
            aria-pressed={buzzOn}
            onClick={() => pickBuzz(true)}
          >
            <span className="option__label">চালু</span>
          </button>
          <button
            type="button"
            className={`option ${!buzzOn ? "is-selected" : ""}`}
            aria-pressed={!buzzOn}
            onClick={() => pickBuzz(false)}
          >
            <span className="option__label">বন্ধ</span>
          </button>
        </div>
      </Card>

    </section>
  );
}
