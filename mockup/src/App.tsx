import { useEffect, useState } from "react";
import { NavigationBar, NavigationBarItem } from "material/react";
import { ICONS } from "./icons";
import { isTab, SCREENS, type Screen } from "./nav";
import { readTextSize, writeTextSize, type TextSize } from "./settings";
import { DEFAULT_ANSWERS, type CaseAnswers } from "./data/demo";
import { readProfile, writeProfile, type FarmProfile } from "./farm";
import { readAuth, writeAuth, clearAuth, type Auth } from "./auth";
import CoachMarks from "./components/CoachMarks";
import Home from "./screens/Home";
import Onboarding from "./screens/Onboarding";
import Login from "./screens/Login";
import Guide from "./screens/Guide";
import Talk from "./screens/Talk";
import Result from "./screens/Result";
import Farm from "./screens/Farm";
import Guides from "./screens/Guides";
import Help from "./screens/Help";
import Settings from "./screens/Settings";
import FarmSetup from "./screens/FarmSetup";
import Profile from "./screens/Profile";
import Saved from "./screens/Saved";

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

type SetupReturn = "home" | "farm" | "settings" | "profile";

export default function App() {
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [tour, setTour] = useState(false);
  const [textSize, setTextSize] = useState<TextSize>(readTextSize);
  const [answers, setAnswers] = useState<CaseAnswers>(DEFAULT_ANSWERS);
  const [profile, setProfile] = useState<FarmProfile>(readProfile);
  const [auth, setAuth] = useState<Auth | null>(readAuth);
  const [setupReturn, setSetupReturn] = useState<SetupReturn>("home");
  const [openConversationId, setOpenConversationId] = useState<string | null>(null);
  const [startWithPhoto, setStartWithPhoto] = useState(false);
  const [navStack, setNavStack] = useState<Screen[]>([]);

  const replace = (next: Screen) => {
    setScreen(next);
    window.history.replaceState(null, "", `#${next}`);
  };

  const go = (next: Screen) => {
    if (next === screen) return;
    // Root tabs are not back targets; every nested screen returns to its opener.
    if (!(isTab(screen) && isTab(next))) {
      setNavStack((stack) => [...stack, screen]);
    }
    replace(next);
  };

  const goBack = (fallback: Screen) => {
    const previous = navStack[navStack.length - 1] ?? fallback;
    setNavStack((stack) => stack.slice(0, -1));
    replace(previous);
  };

  const resetTo = (next: Screen) => {
    setNavStack([]);
    replace(next);
  };

  const startTour = () => {
    go("home");
    setTour(true);
  };

  const openSetup = (from: SetupReturn) => {
    setSetupReturn(from);
    replace("setup");
  };

  const finishOnboarding = () => {
    writeFlag(ONBOARDED_KEY);
    resetTo(auth ? "home" : "login");
  };

  const finishLogin = (next: Auth) => {
    writeAuth(next);
    setAuth(next);
    writeFlag(ONBOARDED_KEY);
    resetTo("home");
  };

  const skipLogin = () => {
    writeFlag(ONBOARDED_KEY);
    resetTo("home");
  };

  const logout = () => {
    clearAuth();
    setAuth(null);
  };

  const finishSetup = (next: FarmProfile) => {
    writeProfile(next);
    setProfile(next);
    replace(setupReturn);
  };

  const openSavedConversation = (id: string) => {
    setStartWithPhoto(false);
    setOpenConversationId(id);
    go("talk");
  };

  const openPhotoChat = () => {
    setOpenConversationId(null);
    setStartWithPhoto(true);
    go("talk");
  };

  const clearTalkIntent = () => {
    setOpenConversationId(null);
    setStartWithPhoto(false);
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
  const chrome = isTab(screen);

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
          {screen === "login" && <Login onDone={finishLogin} onSkip={skipLogin} />}
          {screen === "setup" && (
            <FarmSetup
              initial={profile}
              onDone={finishSetup}
              onCancel={() => replace(setupReturn)}
            />
          )}
          {screen === "home" && (
            <Home profile={profile} onGo={go} onSetup={() => openSetup("home")} />
          )}
          {screen === "talk" && (
            <Talk
              onResult={(next) => {
                setAnswers(next);
                go("result");
              }}
              onSaved={() => go("saved")}
              openConversationId={openConversationId}
              startWithPhoto={startWithPhoto}
              onIntentUsed={clearTalkIntent}
            />
          )}
          {screen === "result" && (
            <Result
              answers={answers}
              onAsk={() => go("talk")}
              onHelp={() => go("help")}
              onRetake={openPhotoChat}
              onBack={() => goBack("talk")}
            />
          )}
          {screen === "farm" && (
            <Farm profile={profile} onSetup={() => openSetup("farm")} />
          )}
          {screen === "guides" && <Guides onTalk={() => go("talk")} onBack={() => goBack("home")} />}
          {screen === "profile" && (
            <Profile
              profile={profile}
              auth={auth}
              onSetup={() => openSetup("profile")}
              onLogin={() => go("login")}
              onLogout={logout}
              onSaved={() => go("saved")}
              onSettings={() => go("settings")}
              onHelp={() => go("help")}
              onBack={() => goBack("home")}
            />
          )}
          {screen === "saved" && (
            <Saved
              profile={profile}
              onBack={() => goBack("home")}
              onOpen={openSavedConversation}
              onTalk={() => go("talk")}
              onProfile={() => go("profile")}
            />
          )}
          {screen === "guide" && <Guide onGo={go} onTour={startTour} onBack={() => goBack("home")} />}
          {screen === "help" && (
            <Help
              profile={profile}
              onGuide={() => go("guide")}
              onTour={startTour}
              onSettings={() => go("settings")}
            />
          )}
          {screen === "settings" && (
            <Settings
              profile={profile}
              textSize={textSize}
              onChangeTextSize={changeTextSize}
              onSetup={() => openSetup("settings")}
              onBack={() => goBack("profile")}
            />
          )}
        </main>

        {chrome && (
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
