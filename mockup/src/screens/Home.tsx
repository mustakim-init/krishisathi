import { Button, Card, Fab } from "material/react";
import { ICONS } from "../icons";
import { DemoNote } from "../components/PhoneHeader";
import type { Screen } from "../nav";

const ACTIONS = [
  {
    screen: "doctor",
    icon: ICONS.camera,
    title: "ছবি তুলে দেখান",
    sub: "পাতার ছবি দিয়ে সম্ভাব্য সমস্যা জানুন",
    coach: "camera",
  },
  {
    screen: "farm",
    icon: ICONS.sprout,
    title: "আমার জমি",
    sub: "কাজ, সেচ আর খরচের হিসাব",
    coach: undefined,
  },
  {
    screen: "guides",
    icon: ICONS.book,
    title: "চাষের গাইড",
    sub: "ধাপে ধাপে সহজ পরামর্শ",
    coach: undefined,
  },
  {
    screen: "result",
    icon: ICONS.diary,
    title: "সেভ করা উত্তর",
    sub: "আগের ফলাফল আবার পড়ুন বা শুনুন",
    coach: undefined,
  },
] as const satisfies ReadonlyArray<{
  screen: Screen;
  icon: string;
  title: string;
  sub: string;
  coach: string | undefined;
}>;

export default function Home({ onGo }: { onGo: (screen: Screen) => void }) {
  return (
    <section className="view">
      <header className="home__header">
        <div>
          <p className="home__eyebrow">আপনার খামার</p>
          <h1 className="home__greeting">রহিম মিয়া</h1>
        </div>
        <div className="home__weather">
          <span
            className="home__weather-icon"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: ICONS.sun }}
          />
          <span className="home__weather-text">
            <strong className="home__weather-temp">৩২°</strong>
            <span className="home__weather-label">রোদ</span>
          </span>
        </div>
      </header>

      <Card variant="filled" className="ask">
        <div className="ask__mic" data-coach="mic">
          <Fab
            variant="primary"
            size="large"
            icon={ICONS.mic}
            ariaLabel="কথা বলা শুরু করুন"
            onClick={() => onGo("talk")}
          />
        </div>
        <h2 className="ask__title">সমস্যা আছে? কথা বলুন</h2>
        <p className="ask__hint">নিজের ভাষায় বলুন। অ্যাপ প্রশ্ন করে বুঝে নেবে।</p>
        <p className="ask__example">“আমার ধানের পাতায় বাদামি দাগ দেখা যাচ্ছে।”</p>
        <Button variant="filled" size="m" onClick={() => onGo("talk")}>
          কথা বলা শুরু করুন
        </Button>
      </Card>

      <div className="actions-list">
        {ACTIONS.map((action) => (
          <button
            key={action.screen}
            type="button"
            className="action-row"
            data-coach={action.coach}
            onClick={() => onGo(action.screen)}
          >
            <span
              className="action-row__icon"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: action.icon }}
            />
            <span className="action-row__text">
              <span className="action-row__title">{action.title}</span>
              <span className="action-row__sub">{action.sub}</span>
            </span>
            <span
              className="action-row__chevron"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: ICONS.chevron }}
            />
          </button>
        ))}
      </div>

      <Card variant="filled" className="today">
        <div className="today__head">
          <span
            className="today__icon"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: ICONS.check }}
          />
          <div>
            <p className="today__title">আজকের কাজ</p>
            <p className="today__sub">ধান এখন বৃদ্ধি ধাপে · ৪৫ দিন</p>
          </div>
        </div>
        <ul className="tick-list">
          <li>
            <span className="tick-list__dot" aria-hidden="true" />
            জমিতে পানি জমে আছে কি না দেখুন
          </li>
          <li>
            <span className="tick-list__dot" aria-hidden="true" />
            পাতার রঙ বদলাচ্ছে কি না খেয়াল করুন
          </li>
        </ul>
        <Button variant="text" size="m" onClick={() => onGo("farm")}>
          সব কাজ দেখুন
        </Button>
      </Card>

      <DemoNote />
    </section>
  );
}
