import { useState } from "react";
import { BottomSheet, Button, Checkbox, Progress } from "material/react";
import Card from "../components/Card";
import { ICONS } from "../icons";
import { DemoNote, PhoneHeader } from "../components/PhoneHeader";
import { toBangla } from "../format";
import {
  hasFarm,
  landLabel,
  seasonLabel,
  stageFor,
  suggestionForProfile,
  tasksForProfile,
  type FarmProfile,
} from "../farm";
import Overlay from "../components/Overlay";

const REMINDERS = [
  { title: "জমি পরিদর্শন", when: "২ দিন পর" },
  { title: "কৃষি অফিসে যোগাযোগ", when: "শুক্রবার" },
];

const INITIAL_EXPENSES = [
  { title: "বীজ", amount: 1200 },
  { title: "সেচ", amount: 800 },
  { title: "সার", amount: 1500 },
  { title: "শ্রমিক", amount: 2500 },
];

export default function Farm({
  profile,
  onBack,
  onSetup,
}: {
  profile: FarmProfile;
  onBack: () => void;
  onSetup: () => void;
}) {
  const [done, setDone] = useState<boolean[]>([false, false, false]);
  const [ledger, setLedger] = useState(false);

  const configured = hasFarm(profile);
  const days = profile.plantedDays;
  const stage =
    profile.status === "preparing"
      ? { label: "জমি তৈরি", percent: 5 }
      : days !== null
        ? stageFor(days)
        : null;

  const meta = [
    seasonLabel(profile.season),
    landLabel(profile.landType),
    profile.areaShotangsho !== null ? `${toBangla(profile.areaShotangsho)} শতাংশ` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const tasks = configured ? tasksForProfile(profile) : [];
  const suggestion = configured ? suggestionForProfile(profile) : "";
  const finished = done.slice(0, tasks.length).filter(Boolean).length;
  const totalCost = INITIAL_EXPENSES.reduce((sum, item) => sum + item.amount, 0);

  const toggle = (index: number, checked: boolean) => {
    setDone((current) => current.map((value, i) => (i === index ? checked : value)));
  };

  return (
    <section className="view">
      <PhoneHeader title="আমার জমি" onBack={onBack} />

      {!configured ? (
        <Card variant="filled" className="empty-farm">
          <div
            className="empty-farm__icon"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: ICONS.sprout }}
          />
          <h2 className="panel__title">আগে আপনার জমির তথ্য দিন</h2>
          <p className="lede">
            আপনি কি চাষ শুরু করেছেন নাকি জমি তৈরি করছেন, কী সার দিয়েছেন ও জমি কেমন—এই তথ্যগুলো দিলে
            এখানে সঠিক পরামর্শ ও আজকের কাজ দেখাবে।
          </p>
          <Button variant="filled" size="l" onClick={onSetup}>
            জমির তথ্য দিন
          </Button>
        </Card>
      ) : (
        <>
          <Card variant="filled" className="field">
            <div className="field__top">
              <div>
                <p className="field__name">
                  {profile.district ? `${profile.district} জমি` : "আমার ধান জমি"}
                </p>
                <p className="field__meta">{meta || "তথ্য দেওয়া আছে"}</p>
              </div>
              <span className="pill">{stage?.label ?? "চলমান"}</span>
            </div>

            {profile.status !== "preparing" && (
              <div className="field__stage">
                <span>গাছের বয়স</span>
                <strong>{days !== null ? `${toBangla(days)} দিন` : "উল্লেখ নেই"}</strong>
              </div>
            )}

            <Progress
              value={stage?.percent ?? 10}
              max={100}
              aria-label={`ফসলের অগ্রগতি ${toBangla(stage?.percent ?? 10)} শতাংশ`}
            />

            <div className="field__scale" aria-hidden="true">
              <span>জমি তৈরি</span>
              <span>বৃদ্ধি</span>
              <span>পাকা</span>
            </div>

            <Button variant="outlined" size="s" onClick={onSetup}>
              জমির তথ্য বদলান
            </Button>
          </Card>

          <Card variant="outlined" className="panel">
            <h2 className="panel__title">আপনার জমির জন্য পরামর্শ</h2>
            <p className="fineprint">{suggestion}</p>
            {profile.fertilizers.length > 0 && (
              <p className="fineprint">
                <strong>দেওয়া সার:</strong> {profile.fertilizers.join(", ")}
              </p>
            )}
          </Card>

          <section className="block">
            <div className="today__head">
              <h2 className="block__title">এখন কী করবেন</h2>
              <span className="fineprint">
                {toBangla(finished)} / {toBangla(tasks.length)} শেষ
              </span>
            </div>

            <div className="task-list">
              {tasks.map((task, index) => (
                <label key={task} className={`task ${done[index] ? "is-done" : ""}`}>
                  <Checkbox
                    checked={Boolean(done[index])}
                    onChange={(event: Event) => {
                      const target = event.target as HTMLInputElement;
                      toggle(index, Boolean(target.checked));
                    }}
                  />
                  <span>{task}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="block">
            <h2 className="block__title">সামনের রিমাইন্ডার</h2>
            {REMINDERS.map((item) => (
              <div key={item.title} className="reminder">
                <span className="reminder__title">{item.title}</span>
                <span className="reminder__when">{item.when}</span>
              </div>
            ))}
          </section>

          <Card variant="outlined" className="panel">
            <div className="today__head">
              <div>
                <h2 className="panel__title">খরচের খাতা</h2>
                <p className="fineprint">মোট খরচ: {toBangla(totalCost)} টাকা (ডেমো)</p>
              </div>
              <Button variant="filled" size="s" icon={ICONS.diary} onClick={() => setLedger(true)}>
                সব দেখুন
              </Button>
            </div>
          </Card>
        </>
      )}

      <DemoNote />

      <Overlay>
        <BottomSheet open={ledger} headline="খরচের খাতা (ডেমো)" onClose={() => setLedger(false)}>
          <div className="sheet-body">
            <div>
              {INITIAL_EXPENSES.map((item) => (
                <div key={item.title} className="ledger__row">
                  <span>{item.title}</span>
                  <strong>{toBangla(item.amount)} টাকা</strong>
                </div>
              ))}
              <div className="ledger__row">
                <strong>মোট</strong>
                <strong>{toBangla(totalCost)} টাকা</strong>
              </div>
            </div>
            <p className="fineprint">
              এটি ডেমো হিসাব। আসল অ্যাপে আপনার প্রতি মৌসুমের খরচ ফোনে অফলাইনে সেভ থাকবে।
            </p>
            <Button variant="text" size="m" onClick={() => setLedger(false)}>
              বন্ধ করুন
            </Button>
          </div>
        </BottomSheet>
      </Overlay>
    </section>
  );
}
