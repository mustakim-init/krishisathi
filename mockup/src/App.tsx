import { useEffect, useState } from "react";
import { NavigationBar, NavigationBarItem } from "material/react";
import { ICONS } from "./icons";
import { isTab, SCREENS, type Screen } from "./nav";
import { readTextSize, writeTextSize, type TextSize } from "./settings";
import { DEFAULT_ANSWERS, type CaseAnswers } from "./data/demo";
import { readProfile, writeProfile, type FarmProfile } from "./farm";
import CoachMarks from "./components/CoachMarks";
import Home from "./screens/Home";
import Onboarding from "./screens/Onboarding";
import Guide from "./screens/Guide";
import Talk from "./screens/Talk";
import Doctor from "./screens/Doctor";
import Result from "./screens/Result";
import Farm from "./screens/Farm";
import Guides from "./screens/Guides";
import Help from "./screens/Help";
import Settings from "./screens/Settings";
import FarmSetup from "./screens/FarmSetup";

const ONBOARDED_KEY = "krishisathi.onboarded";
const TOUR_KEY = "krishisathi.tour.done";

function readFlag(key: string): boolean {
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function writeFlag(key: string): void {
  try {
    window.localStorage.setItem(key, "1");
  } catch {
    /* Private mode can block storage; the demo still works without it. */
  }
}

function initialScreen(): Screen {
  const hash = window.location.hash.slice(1) as Screen;
  if (SCREENS.includes(hash)) return hash;
  return readFlag(ONBOARDED_KEY) ? "home" : "onboarding";
}

export default function App() {
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [tour, setTour] = useState(false);
  const [textSize, setTextSize] = useState<TextSize>(readTextSize);
  const [answers, setAnswers] = useState<CaseAnswers>(DEFAULT_ANSWERS);
  const [profile, setProfile] = useState<FarmProfile>(readProfile);
  const [setupReturn, setSetupReturn] = useState<"home" | "farm" | "settings">("home");

  const go = (next: Screen) => {
    setScreen(next);
    history.replaceState(null, "", `#${next}`);
  };

  const startTour = () => {
    go("home");
    setTour(true);
  };

  const openSetup = (from: typeof setupReturn) => {
    setSetupReturn(from);
    go("setup");
  };

  const finishOnboarding = () => {
    writeFlag(ONBOARDED_KEY);
    go("home");
  };

  const finishSetup = (next: FarmProfile) => {
    writeProfile(next);
    setProfile(next);
    go(setupReturn);
  };

  const endTour = () => {
    writeFlag(TOUR_KEY);
    setTour(false);
  };

  const changeTextSize = (value: TextSize) => {
    writeTextSize(value);
    setTextSize(value);
  };

  const activeTab = isTab(screen) ? screen : "home";

  useEffect(() => {
    if (screen !== "home") setTour(false);
  }, [screen]);

  return (
    <div className="device" data-text={textSize}>
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
          {screen === "onboarding" && (
            <Onboarding onFinish={finishOnboarding} onGuide={() => go("guide")} />
          )}
          {screen === "setup" && <FarmSetup initial={profile} onDone={finishSetup} />}
          {screen === "home" && (
            <Home profile={profile} onGo={go} onSetup={() => openSetup("home")} />
          )}
          {screen === "talk" && <Talk onResult={() => go("result")} onPhoto={() => go("doctor")} />}
          {screen === "doctor" && (
            <Doctor
              onBack={() => go("home")}
              onResult={(next) => {
                setAnswers(next);
                go("result");
              }}
            />
          )}
          {screen === "result" && (
            <Result
              answers={answers}
              onBack={() => go("home")}
              onAsk={() => go("talk")}
              onHelp={() => go("help")}
              onRetake={() => go("doctor")}
            />
          )}
          {screen === "farm" && (
            <Farm profile={profile} onBack={() => go("home")} onSetup={() => openSetup("farm")} />
          )}
          {screen === "guides" && <Guides onBack={() => go("home")} onDoctor={() => go("doctor")} />}
          {screen === "guide" && <Guide onBack={() => go("home")} onGo={go} onTour={startTour} />}
          {screen === "help" && (
            <Help onGuide={() => go("guide")} onTour={startTour} onSettings={() => go("settings")} />
          )}
          {screen === "settings" && (
            <Settings
              profile={profile}
              textSize={textSize}
              onChangeTextSize={changeTextSize}
              onSetup={() => openSetup("settings")}
              onBack={() => go("help")}
            />
          )}
        </main>

        {screen !== "onboarding" && screen !== "setup" && (
          <div className="tabbar" data-coach="tabs">
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

        {tour && screen === "home" && <CoachMarks onDone={endTour} />}
      </div>
    </div>
  );
}
