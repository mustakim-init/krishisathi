import { useState } from "react";
import { Button, Card, Checkbox, Progress } from "material/react";
import { ICONS } from "../icons";
import { DemoNote, PhoneHeader } from "../components/PhoneHeader";

const TASKS = [
  "জমিতে পানি জমে আছে কি না দেখুন",
  "পাতার রঙ বদলাচ্ছে কি না খেয়াল করুন",
  "আগাছা পরিষ্কার করুন",
];

const REMINDERS = [
  { title: "জমি দেখে আসুন", when: "২ দিন পর" },
  { title: "কৃষি অফিসে যাবেন", when: "শুক্রবার" },
];

const EXPENSES = [
  { title: "বীজ", amount: "১,২০০" },
  { title: "সেচ", amount: "৮০০" },
];

export default function Farm({ onBack }: { onBack: () => void }) {
  const [done, setDone] = useState<boolean[]>([false, false, false]);

  const toggle = (index: number, checked: boolean) => {
    setDone((current) => current.map((value, i) => (i === index ? checked : value)));
  };

  return (
    <section className="view">
      <PhoneHeader title="আমার জমি" onBack={onBack} />

      <Card variant="filled" className="field">
        <div className="field__top">
          <div>
            <p className="field__name">উত্তর জমি</p>
            <p className="field__meta">আমন মৌসুম · ৩৩ শতাংশ</p>
          </div>
          <span className="pill">বৃদ্ধি</span>
        </div>

        <div className="field__stage">
          <span>গাছের বয়স</span>
          <strong>৪৫ দিন</strong>
        </div>

        <Progress value={55} max={100} aria-label="ফসলের বৃদ্ধি ৫৫ শতাংশ" />

        <div className="field__scale" aria-hidden="true">
          <span>রোপণ</span>
          <span>বৃদ্ধি</span>
          <span>পাকা</span>
        </div>
      </Card>

      <section className="block">
        <h2 className="block__title">এখন কী করবেন</h2>
        <Card variant="filled" className="panel panel--tight">
          {TASKS.map((task, index) => (
            <Checkbox
              key={task}
              label={task}
              checked={done[index]}
              onChange={(event: Event) => {
                const detail = (event as CustomEvent<{ checked: boolean }>).detail;
                toggle(index, Boolean(detail?.checked));
              }}
            />
          ))}
        </Card>
      </section>

      <section className="block">
        <h2 className="block__title">আসন্ন কাজ</h2>
        <div className="reminders">
          {REMINDERS.map((item) => (
            <div key={item.title} className="reminder">
              <span className="reminder__icon" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS.calendar }} />
              <div>
                <p className="reminder__title">{item.title}</p>
                <p className="reminder__when">{item.when}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="block">
        <div className="block__head">
          <h2 className="block__title">খরচের খাতা</h2>
          <Button variant="text" size="s" onClick={() => undefined}>
            সব দেখুন
          </Button>
        </div>
        <Card variant="filled" className="panel panel--tight">
          {EXPENSES.map((item) => (
            <div key={item.title} className="expense">
              <span>{item.title}</span>
              <span>{item.amount} টাকা</span>
            </div>
          ))}
          <div className="expense expense--total">
            <span>মোট</span>
            <span>২,০০০ টাকা</span>
          </div>
        </Card>
        <p className="fineprint">খরচের হিসাব ডেমো।</p>
      </section>

      <DemoNote />
    </section>
  );
}
