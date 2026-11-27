import { useState } from "react";
import { Button } from "material/react";
import { toBangla } from "../format";
import {
  AREAS,
  CROP_STATUSES,
  DISTRICTS,
  FERTILIZER_OPTIONS,
  LAND_TYPES,
  PLANTED_DAYS,
  SEASONS,
  stageFor,
  type FarmProfile,
} from "../farm";

const STEPS = [
  {
    title: "জমিতে কি চাষ শুরু করেছেন?",
    hint: "আপনি এখন কোন অবস্থায় আছেন বললে সেই অনুযায়ী পরামর্শ দেওয়া হবে।",
  },
  {
    title: "কোন মৌসুম ও কত দিনের ধান?",
    hint: "মৌসুম আর গাছের বয়স জানলে সঠিক ধাপের কাজ বের করা যায়।",
  },
  {
    title: "জমির ধরন ও সেচের অবস্থা কী?",
    hint: "জমি উঁচু না নিচু এবং সেচের ব্যবস্থা আছে কি না জানলে পানি ব্যবস্থাপনা বলা যায়।",
  },
  {
    title: "জমিতে কী কী সার দিয়েছেন?",
    hint: "একাধিক অপশন বাছতে পারেন, বা এখনো না দিয়ে থাকলে তা জানান।",
  },
  {
    title: "আপনার নাম, জেলা ও জমির মাপ",
    hint: "এগুলো ঐচ্ছিক — হোম স্ক্রিন ও আবহাওয়া দেখাতে কাজে লাগবে।",
  },
] as const;

export default function FarmSetup({
  initial,
  onDone,
}: {
  initial: FarmProfile;
  onDone: (profile: FarmProfile) => void;
}) {
  const [index, setIndex] = useState(0);
  const [draft, setDraft] = useState<FarmProfile>(initial);

  const step = STEPS[index];
  const last = index === STEPS.length - 1;

  const update = (patch: Partial<FarmProfile>) => setDraft((current) => ({ ...current, ...patch }));
  const next = () => (last ? onDone(draft) : setIndex(index + 1));

  const toggleFertilizer = (item: string) => {
    if (item === "এখনো দিইনি") {
      update({ fertilizers: draft.fertilizers.includes(item) ? [] : [item] });
      return;
    }
    const withoutNone = draft.fertilizers.filter((f) => f !== "এখনো দিইনি");
    const nextList = withoutNone.includes(item)
      ? withoutNone.filter((f) => f !== item)
      : [...withoutNone, item];
    update({ fertilizers: nextList });
  };

  return (
    <section className="view view--setup">
      <header className="setup__top">
        <span className="setup__brand">আমার জমি সেটআপ</span>
        <span className="setup__count">
          ধাপ {toBangla(index + 1)} / {toBangla(STEPS.length)}
        </span>
      </header>

      <div className="setup__dots" aria-hidden="true">
        {STEPS.map((item, dot) => (
          <span key={item.title} className={`setup__dot ${dot <= index ? "is-active" : ""}`} />
        ))}
      </div>

      <div className="setup__body">
        <div>
          <h1 className="setup__title">{step.title}</h1>
          <p className="setup__hint">{step.hint}</p>
        </div>

        {index === 0 && (
          <div className="choices choices--stack" role="group" aria-label="জমির অবস্থা">
            {CROP_STATUSES.map((item) => (
              <button
                key={item.value}
                type="button"
                className={`choice ${draft.status === item.value ? "is-selected" : ""}`}
                aria-pressed={draft.status === item.value}
                onClick={() => update({ status: item.value })}
              >
                <span>{item.label}</span>
                <span className="fineprint">{item.sub}</span>
              </button>
            ))}
          </div>
        )}

        {index === 1 && (
          <>
            <p className="step-label">মৌসুম</p>
            <div className="choices" role="group" aria-label="মৌসুম">
              {SEASONS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`choice ${draft.season === item.value ? "is-selected" : ""}`}
                  aria-pressed={draft.season === item.value}
                  onClick={() => update({ season: item.value })}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {draft.status !== "preparing" && (
              <>
                <p className="step-label">রোপণের কত দিন হয়েছে?</p>
                <div className="choices setup__days" role="group" aria-label="রোপণের দিন">
                  {PLANTED_DAYS.map((days) => (
                    <button
                      key={days}
                      type="button"
                      className={`choice ${draft.plantedDays === days ? "is-selected" : ""}`}
                      aria-pressed={draft.plantedDays === days}
                      onClick={() => update({ plantedDays: days })}
                    >
                      <span>{toBangla(days)} দিন</span>
                      <span className="fineprint">{stageFor(days).label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {index === 2 && (
          <>
            <p className="step-label">জমির ধরন</p>
            <div className="choices choices--stack" role="group" aria-label="জমির ধরন">
              {LAND_TYPES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`choice ${draft.landType === item.value ? "is-selected" : ""}`}
                  aria-pressed={draft.landType === item.value}
                  onClick={() => update({ landType: item.value })}
                >
                  <span>{item.label}</span>
                  <span className="fineprint">{item.sub}</span>
                </button>
              ))}
            </div>

            <p className="step-label">সেচের ব্যবস্থা আছে?</p>
            <div className="choices" role="group" aria-label="সেচের ব্যবস্থা">
              <button
                type="button"
                className={`choice ${draft.hasIrrigation === true ? "is-selected" : ""}`}
                aria-pressed={draft.hasIrrigation === true}
                onClick={() => update({ hasIrrigation: true })}
              >
                হ্যাঁ, আছে
              </button>
              <button
                type="button"
                className={`choice ${draft.hasIrrigation === false ? "is-selected" : ""}`}
                aria-pressed={draft.hasIrrigation === false}
                onClick={() => update({ hasIrrigation: false })}
              >
                বৃষ্টির ওপর নির্ভর
              </button>
            </div>
          </>
        )}

        {index === 3 && (
          <div className="choices" role="group" aria-label="সার প্রয়োগ">
            {FERTILIZER_OPTIONS.map((item) => {
              const selected = draft.fertilizers.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  className={`choice ${selected ? "is-selected" : ""}`}
                  aria-pressed={selected}
                  onClick={() => toggleFertilizer(item)}
                >
                  {item}
                </button>
              );
            })}
          </div>
        )}

        {index === 4 && (
          <>
            <label className="setup__field">
              <span className="setup__field-label">আপনার নাম</span>
              <input
                className="setup__input"
                type="text"
                value={draft.name}
                placeholder="যেমন: রহিম মিয়া"
                autoComplete="off"
                onChange={(event) => update({ name: event.target.value })}
              />
            </label>

            <p className="step-label">জেলা</p>
            <div className="choices" role="group" aria-label="জেলা">
              {DISTRICTS.map((district) => (
                <button
                  key={district}
                  type="button"
                  className={`choice ${draft.district === district ? "is-selected" : ""}`}
                  aria-pressed={draft.district === district}
                  onClick={() => update({ district })}
                >
                  {district}
                </button>
              ))}
            </div>

            <p className="step-label">জমির পরিমাণ (শতাংশ)</p>
            <div className="choices" role="group" aria-label="জমির পরিমাণ">
              {AREAS.map((area) => (
                <button
                  key={area}
                  type="button"
                  className={`choice ${draft.areaShotangsho === area ? "is-selected" : ""}`}
                  aria-pressed={draft.areaShotangsho === area}
                  onClick={() => update({ areaShotangsho: area })}
                >
                  {toBangla(area)} শতাংশ
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="actions">
        <Button variant="filled" size="l" onClick={next}>
          {last ? "তথ্য সেভ করুন" : "পরবর্তী"}
        </Button>
        {index > 0 && (
          <Button variant="text" size="m" onClick={() => setIndex(index - 1)}>
            পেছনে যান
          </Button>
        )}
      </div>
    </section>
  );
}
