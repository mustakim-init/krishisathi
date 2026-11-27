import { Button, Fab } from "material/react";
import Card from "../components/Card";
import { ICONS } from "../icons";
import type { Screen } from "../nav";
import { hasFarm, stageFor, tasksForProfile, type FarmProfile } from "../farm";
import { toBangla } from "../format";

const TILES = [
  {
    screen: "farm",
    icon: ICONS.sprout,
    title: "আমার জমি",
    sub: "অবস্থা, কাজ ও খরচ",
    tone: "tile--tint",
    coach: undefined,
  },
  {
    screen: "guides",
    icon: ICONS.book,
    title: "সঠিক চাষের নিয়ম",
    sub: "অফলাইনেও ব্যবহার করুন",
    tone: "tile--surface",
    coach: undefined,
  },
  {
    screen: "saved",
    icon: ICONS.diary,
    title: "সংরক্ষিত তথ্যসমূহ",
    sub: "ফোনেই সংরক্ষিত থাকে",
    tone: "tile--surface",
    coach: undefined,
  },
  {
    screen: "profile",
    icon: ICONS.person,
    title: "আমার প্রোফাইল",
    sub: "নাম, জেলা ও অ্যাকাউন্ট",
    tone: "tile--tint",
    coach: "profile",
  },
] as const satisfies ReadonlyArray<{
  screen: Screen;
  icon: string;
  title: string;
  sub: string;
  tone: string;
  coach: string | undefined;
}>;

export default function Home({
  profile,
  onGo,
  onSetup,
}: {
  profile: FarmProfile;
  onGo: (screen: Screen) => void;
  onSetup: () => void;
}) {
  const configured = hasFarm(profile);
  const days = profile.plantedDays;
  const stage =
    profile.status === "preparing"
      ? { label: "জমি তৈরি", percent: 5 }
      : days !== null
        ? stageFor(days)
        : null;
  const previewTasks = configured ? tasksForProfile(profile).slice(0, 2) : [];

  const profileMeta = profile.district
    ? [profile.district, profile.areaShotangsho !== null && `${toBangla(profile.areaShotangsho)} শতাংশ`]
        .filter(Boolean)
        .join(" · ")
    : "জমির তথ্য দিন";

  return (
    <section className="view">
      <header className="home__topbar">
        <button
          type="button"
          className="home__profile"
          data-coach="profile"
          onClick={() => onGo("profile")}
        >
          <span className="home__avatar" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS.person }} />
          <span className="home__who">
            <span className="home__name">{profile.name.trim() || "আমার প্রোফাইল"}</span>
            <span className="home__meta">{profileMeta}</span>
          </span>
        </button>
        <div className="home__top-actions">
          <div className="home__weather" aria-label="আজকের আবহাওয়া ৩২ ডিগ্রি রোদ">
            <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS.sun }} />
            <span>৩২°</span>
          </div>
          <button
            type="button"
            className="home__icon-btn"
            aria-label="সেটিংস"
            onClick={() => onGo("settings")}
            dangerouslySetInnerHTML={{ __html: ICONS.gear }}
          />
        </div>
      </header>

      <Card variant="filled" className="hero-ask">
        <div className="hero-ask__mic" data-coach="mic">
          <span className="hero-ask__ring" aria-hidden="true" />
          <Fab
            variant="primary"
            size="large"
            icon={ICONS.mic}
            ariaLabel="কথা বলুন"
            onClick={() => onGo("talk")}
          />
        </div>
        <h2 className="hero-ask__title">কথা বলুন, সমাধান করুন</h2>
        <p className="hero-ask__hint">মুখে বলুন, লিখুন বা পাতার ছবি দিন</p>
        <Button variant="filled" size="m" onClick={() => onGo("talk")}>
          আপনার সমস্যা বলুন
        </Button>
      </Card>

      <div className="tile-grid">
        {TILES.map((tile) => (
          <button
            key={tile.screen}
            type="button"
            className={`tile ${tile.tone}`}
            data-coach={tile.coach}
            onClick={() => onGo(tile.screen)}
          >
            <span
              className="tile__icon"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: tile.icon }}
            />
            <span className="tile__title">{tile.title}</span>
            <span className="tile__sub">{tile.sub}</span>
          </button>
        ))}
      </div>

      <Card variant="filled" className="today">
        <div className="today__head">
          <div>
            <p className="today__title">আজকের কাজ</p>
            <p className="today__sub">
              {configured && stage
                ? profile.status === "preparing"
                  ? "জমি তৈরির ধাপে আছেন"
                  : days !== null
                    ? `ধান এখন ${stage.label} ধাপে · ${toBangla(days)} দিন`
                    : `ধান এখন ${stage.label} ধাপে`
                : "জমির তথ্য দিলে আজকের কাজ দেখাবে"}
            </p>
          </div>
          {stage && <span className="pill">{stage.label}</span>}
        </div>

        {configured ? (
          <ul className="tick-list">
            {previewTasks.map((task) => (
              <li key={task}>
                <span className="tick-list__dot" aria-hidden="true" />
                {task}
              </li>
            ))}
          </ul>
        ) : (
          <Button variant="outlined" size="m" onClick={onSetup}>
            জমির তথ্য দিন
          </Button>
        )}
      </Card>
    </section>
  );
}
