import { useState } from "react";
import { BottomSheet, Button, Checkbox, Progress } from "material/react";
import Card from "../components/Card";
import { ICONS } from "../icons";
import { PhoneHeader } from "../components/PhoneHeader";
import { fromBangla, toBangla } from "../format";
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
import {
  EXPENSE_CATEGORIES,
  newExpenseId,
  readExpenses,
  writeExpenses,
  type Expense,
} from "../expenses";

export default function Farm({
  profile,
  onSetup,
}: {
  profile: FarmProfile;
  onSetup: () => void;
}) {
  const [done, setDone] = useState<boolean[]>([false, false, false]);
  const [ledger, setLedger] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>(readExpenses);
  const [category, setCategory] = useState<(typeof EXPENSE_CATEGORIES)[number]>(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

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
  const nextTask = tasks.find((_, index) => !done[index]);
  const totalCost = expenses.reduce((sum, item) => sum + item.amount, 0);

  const toggle = (index: number, checked: boolean) => {
    setDone((current) => current.map((value, i) => (i === index ? checked : value)));
  };

  const addExpense = () => {
    const value = Number(fromBangla(amount).replace(/\D/g, ""));
    if (!value || value <= 0) {
      setError("টাকার পরিমাণ লিখুন।");
      return;
    }
    const next = [{ id: newExpenseId(), category, amount: value }, ...expenses];
    setExpenses(next);
    writeExpenses(next);
    setAmount("");
    setError("");
  };

  const removeExpense = (id: string) => {
    const next = expenses.filter((item) => item.id !== id);
    setExpenses(next);
    writeExpenses(next);
  };

  return (
    <section className="view">
      <PhoneHeader title="আমার জমি" />

      {!configured ? (
        <Card variant="filled" className="empty-farm">
          <div
            className="empty-farm__icon"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: ICONS.sprout }}
          />
          <h2 className="panel__title">আগে আপনার জমির তথ্য দিন</h2>
          <p className="lede">
            আপনি কি চাষ শুরু করেছেন নাকি জমি তৈরি করছেন, কী সার দিয়েছেন ও জমি কেমন—এই তথ্যগুলো দিলে
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
                <p className="field__meta">{meta || "তথ্য দেওয়া আছে"}</p>
              </div>
              <span className="pill">{stage?.label ?? "চলমান"}</span>
            </div>

            {profile.status !== "preparing" && (
              <div className="field__stage">
                <span>গাছের বয়স</span>
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
                <strong>দেওয়া সার:</strong> {profile.fertilizers.join(", ")}
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
            <h2 className="block__title">পরের কাজ</h2>
            {nextTask ? (
              <div className="reminder">
                <span className="reminder__title">{nextTask}</span>
                <span className="reminder__when">বাকি</span>
              </div>
            ) : (
              <p className="fineprint">আজকের সব কাজ শেষ। নতুন তথ্য দিলে পরের কাজ দেখাবে।</p>
            )}
          </section>

          <Card variant="outlined" className="panel">
            <h2 className="panel__title">খরচের খাতা</h2>
            <p className="fineprint">
              {expenses.length > 0
                ? `আপনার লেখা মোট খরচ: ${toBangla(totalCost)} টাকা`
                : "এখনো কোনো খরচ যোগ করা হয়নি"}
            </p>
            <Button variant="filled" size="m" icon={ICONS.plus} onClick={() => setLedger(true)}>
              খরচ যোগ করুন
            </Button>
          </Card>
        </>
      )}

      <Overlay>
        <BottomSheet open={ledger} headline="খরচের খাতা" onClose={() => setLedger(false)}>
          <div className="sheet-body">
            <form
              className="expense-form"
              onSubmit={(event) => {
                event.preventDefault();
                addExpense();
              }}
            >
              <p className="step-label">কী কিনেছেন?</p>
              <div className="choices" role="group" aria-label="খরচের খাত">
                {EXPENSE_CATEGORIES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`choice ${category === item ? "is-selected" : ""}`}
                    aria-pressed={category === item}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <label className="setup__field">
                <span className="setup__field-label">টাকার পরিমাণ</span>
                <input
                  className="setup__input"
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  placeholder="যেমন: ৫০০"
                  onChange={(event) => {
                    setAmount(event.target.value);
                    setError("");
                  }}
                />
              </label>

              {error && (
                <p className="login__error" role="alert">
                  {error}
                </p>
              )}

              <Button variant="filled" size="m" type="button" icon={ICONS.plus} onClick={addExpense}>
                এই খরচ যোগ করুন
              </Button>
            </form>

            <div className="ledger">
              {expenses.length === 0 ? (
                <p className="fineprint">যোগ করলে এখানে আপনার খরচের তালিকা দেখাবে।</p>
              ) : (
                <>
                  {expenses.map((item) => (
                    <div key={item.id} className="ledger__row">
                      <span>{item.category}</span>
                      <span className="ledger__amount">
                        {toBangla(item.amount)} টাকা
                        <button
                          type="button"
                          className="ledger__delete"
                          aria-label={`${item.category} খরচ মুছুন`}
                          onClick={() => removeExpense(item.id)}
                          dangerouslySetInnerHTML={{ __html: ICONS.trash }}
                        />
                      </span>
                    </div>
                  ))}
                  <div className="ledger__row ledger__row--total">
                    <strong>মোট</strong>
                    <strong>{toBangla(totalCost)} টাকা</strong>
                  </div>
                </>
              )}
            </div>

            <p className="fineprint">
              এই খরচগুলো শুধু আপনার ফোনে সেভ থাকে। কোনো ব্যাংক বা হিসাবের সঙ্গে যুক্ত হয় না।
            </p>
          </div>
        </BottomSheet>
      </Overlay>
    </section>
  );
}
