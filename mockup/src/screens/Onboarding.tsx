import { Button } from "material/react";
import { ICONS } from "../icons";

export default function Onboarding({
  onFinish,
  onGuide,
}: {
  onFinish: () => void;
  onGuide: () => void;
}) {
  return (
    <section className="view view--welcome">
      <div className="welcome__body">
        <div className="welcome__hero">
          <div
            className="welcome__logo"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: ICONS.sprout }}
          />
          <h1 className="welcome__brand">কৃষিসাথী</h1>
          <p className="welcome__tagline">ধানের সমস্যা? কথা বলুন, সমাধান শুনুন।</p>
          <p className="welcome__sub">
            কোনো অ্যাকাউন্ট বা পাসওয়ার্ড লাগবে না। অ্যাপ খুলে সরাসরি নিজের ভাষায় কথা বলুন।
          </p>
        </div>

        <div className="welcome__pillars">
          <div className="pillar">
            <span
              className="pillar__icon"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: ICONS.mic }}
            />
            <span className="pillar__label">কথা বলে সমাধান</span>
          </div>
          <div className="pillar">
            <span
              className="pillar__icon"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: ICONS.camera }}
            />
            <span className="pillar__label">পাতার ছবি দেখান</span>
          </div>
          <div className="pillar">
            <span
              className="pillar__icon"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: ICONS.offline }}
            />
            <span className="pillar__label">অফলাইনেও গাইড</span>
          </div>
        </div>

        <div className="welcome__actions">
          <Button variant="filled" size="l" onClick={onFinish}>
            শুরু করুন
          </Button>
          <Button variant="text" size="m" onClick={onGuide}>
            কীভাবে চালাবেন দেখুন
          </Button>
        </div>
      </div>

      <p className="demo-note">এটি একটি ডেমো প্রোটোটাইপ। প্রকৃত রোগ নির্ণয় নয়।</p>
    </section>
  );
}
