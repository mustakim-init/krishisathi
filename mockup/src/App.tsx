import { useState } from "react";
import { Button, Card, Fab, NavigationBar, NavigationBarItem } from "material/react";
import { ICONS } from "./icons";
import Talk from "./screens/Talk";
import Doctor from "./screens/Doctor";
import Result from "./screens/Result";
import Farm from "./screens/Farm";
import Guides from "./screens/Guides";
import Help from "./screens/Help";

type Screen = "welcome" | "home" | "talk" | "doctor" | "result" | "farm" | "guides" | "help";
type Tab = "home" | "talk" | "farm" | "help";

const TAB_SCREENS: Tab[] = ["home", "talk", "farm", "help"];
const SCREENS: Screen[] = ["welcome", "home", "talk", "doctor", "result", "farm", "guides", "help"];

/** Deep link support: #home opens the home screen, useful for review and QA. */
function initialScreen(): Screen {
  const hash = window.location.hash.slice(1) as Screen;
  return SCREENS.includes(hash) ? hash : "welcome";
}

export default function App() {
  const [screen, setScreen] = useState<Screen>(initialScreen);

  const isTab = (s: Screen): s is Tab => (TAB_SCREENS as Screen[]).includes(s);
  const activeTab: Tab = isTab(screen) ? screen : "home";

  const go = (next: Screen) => {
    setScreen(next);
    history.replaceState(null, "", `#${next}`);
  };

  return (
    <div className="device">
      <div className="screen">
        <div className="statusbar">
          <span aria-hidden="true">৯:৪১</span>
          <span className="demo-badge">ডেমো</span>
          <span className="statusbar__right" aria-hidden="true">
            <svg viewBox="0 0 24 16" width="18" height="12">
              <path d="M1 11h3v4H1zM6 8h3v7H6zM11 5h3v10h-3zM16 2h3v13h-3z" fill="currentColor" />
            </svg>
            <svg viewBox="0 0 26 12" width="24" height="11">
              <rect x="1" y="1" width="20" height="10" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <rect x="3" y="3" width="14" height="6" rx="1.6" fill="currentColor" />
              <rect x="23" y="4" width="2.5" height="4" rx="1" fill="currentColor" />
            </svg>
          </span>
        </div>

        <main className="views">
          {screen === "welcome" && <Welcome onStart={() => go("home")} />}
          {screen === "home" && <Home onGo={go} />}
          {screen === "talk" && <Talk onResult={() => go("result")} />}
          {screen === "doctor" && <Doctor onBack={() => go("home")} onResult={() => go("result")} />}
          {screen === "result" && (
            <Result onBack={() => go("home")} onAsk={() => go("talk")} onHelp={() => go("help")} />
          )}
          {screen === "farm" && <Farm onBack={() => go("home")} />}
          {screen === "guides" && <Guides onBack={() => go("home")} onDoctor={() => go("doctor")} />}
          {screen === "help" && <Help />}
        </main>

        {screen !== "welcome" && (
          <div className="tabbar">
            <NavigationBar
              value={activeTab}
              onChange={(event: Event) => {
                const detail = (event as CustomEvent<{ value: string }>).detail;
                if (detail?.value) go(detail.value as Screen);
              }}
            >
              <NavigationBarItem value="home" label="হোম" icon={ICONS.home} />
              <NavigationBarItem value="talk" label="কথা বলুন" icon={ICONS.mic} />
              <NavigationBarItem value="farm" label="আমার জমি" icon={ICONS.sprout} />
              <NavigationBarItem value="help" label="সাহায্য" icon={ICONS.help} />
            </NavigationBar>
          </div>
        )}
      </div>
    </div>
  );
}

function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <section className="view view--welcome">
      <div className="welcome__mark" aria-hidden="true">
        কৃ
      </div>
      <h1 className="welcome__title">কৃষিসাথী</h1>
      <p className="welcome__tagline">ধানের সমস্যা? কথা বলুন, সমাধান শুনুন।</p>
      <p className="welcome__body">
        আপনার ফসলের সমস্যা বলুন। আমরা কয়েকটি ছোট প্রশ্ন করব, তারপর সহজ বাংলায় উত্তর দেব।
      </p>
      <Button variant="filled" size="m" onClick={onStart}>
        শুরু করুন
      </Button>
      <p className="welcome__note">এটি একটি ডেমো প্রোটোটাইপ। প্রকৃত রোগ নির্ণয় নয়।</p>
    </section>
  );
}

function Home({ onGo }: { onGo: (s: Screen) => void }) {
  return (
    <section className="view">
      <header className="home__header">
        <div>
          <p className="home__eyebrow">শুভ সকাল</p>
          <h1 className="home__greeting">রহিম মিয়া</h1>
        </div>
        <span className="avatar" aria-hidden="true">
          র
        </span>
      </header>

      <div className="weather">
        <svg
          className="weather__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4" />
        </svg>
        <div>
          <p className="weather__temp">৩২°</p>
          <p className="weather__note">রোদ, দুপুরে গরম</p>
        </div>
      </div>

      <div className="mic-zone">
        <Fab
          variant="primary"
          size="large"
          icon={ICONS.mic}
          ariaLabel="কথা বলুন"
          onClick={() => onGo("talk")}
        />
        <p className="mic-zone__label">কথা বলুন</p>
        <p className="mic-zone__hint">চাপ দিলে ডেমো কথোপকথন শুরু হবে</p>
      </div>

      <div className="tiles">
        <Tile icon={ICONS.camera} label="ছবি তুলে দেখান" onClick={() => onGo("doctor")} />
        <Tile icon={ICONS.sprout} label="আমার জমি" onClick={() => onGo("farm")} />
        <Tile icon={ICONS.book} label="চাষের গাইড" onClick={() => onGo("guides")} />
        <Tile icon={ICONS.help} label="সাহায্য" onClick={() => onGo("help")} />
      </div>

      <Card variant="filled" className="today">
        <div className="today__head">
          <span className="today__icon" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS.check }} />
          <div>
            <p className="today__title">আজকের করণীয়</p>
            <p className="today__sub">আপনার জমির জন্য ২টি কাজ</p>
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
      </Card>

      <p className="demo-note">এটি একটি ডেমো প্রোটোটাইপ। প্রকৃত রোগ নির্ণয় নয়।</p>
    </section>
  );
}

function Tile({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button type="button" className="tile" onClick={onClick}>
      <span className="tile__icon" dangerouslySetInnerHTML={{ __html: icon }} />
      <span className="tile__label">{label}</span>
    </button>
  );
}
