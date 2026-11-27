import { useState } from "react";
import { Button } from "material/react";
import Card from "../components/Card";
import { ICONS } from "../icons";
import { fromBangla, toBangla } from "../format";
import type { Auth } from "../auth";

const DEMO_OTP = "1234";

export default function Login({
  onDone,
  onSkip,
}: {
  onDone: (auth: Auth) => void;
  onSkip: () => void;
}) {
  const [stage, setStage] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);

  const digits = fromBangla(phone).replace(/\D/g, "").slice(0, 11);
  const validPhone = digits.length === 11 && digits.startsWith("01");
  const code = fromBangla(otp).replace(/\D/g, "").slice(0, 4);

  const sendCode = () => {
    if (!validPhone) {
      setError("১১ সংখ্যার মোবাইল নম্বর লিখুন। যেমন: ০১৭xxxxxxxxx");
      return;
    }
    setError("");
    setResent(false);
    setStage("otp");
  };

  const verify = () => {
    if (code !== DEMO_OTP) {
      setError("কোড মিলছে না। ডেমো কোড ১২৩৪ লিখুন।");
      return;
    }
    setError("");
    onDone({ method: "phone", phone: digits });
  };

  return (
    <section className="view view--login">
      <div className="login__body">
        <div className="login__brand">
          <div
            className="login__logo"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: ICONS.sprout }}
          />
          <h1 className="login__title">কৃষিসাথী</h1>
          <p className="login__tagline">
            {stage === "phone" ? "আপনার হিসাব তৈরি করুন" : "শুধু একটি কোড, পাসওয়ার্ড নয়"}
          </p>
        </div>

        {stage === "phone" ? (
          <Card variant="filled" className="panel login__card">
            <h2 className="panel__title">মোবাইল নম্বর দিয়ে</h2>
            <p className="fineprint">নম্বর দিলে একটি ৪ সংখ্যার কোড পাঠানো হবে (ডেমো)।</p>

            <label className="setup__field">
              <span className="setup__field-label">মোবাইল নম্বর</span>
              <span className="login__phone">
                <span className="login__prefix">+৮৮</span>
                <input
                  className="setup__input login__phone-input"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  value={phone}
                  placeholder="০১৭০০০০০০০০"
                  onChange={(event) => {
                    setPhone(event.target.value);
                    setError("");
                  }}
                />
              </span>
            </label>

            {error && (
              <p className="login__error" role="alert">
                {error}
              </p>
            )}

            <Button variant="filled" size="l" onClick={sendCode}>
              কোড পাঠান
            </Button>

            <div className="login__or" aria-hidden="true">
              <span>অথবা</span>
            </div>

            <Button
              variant="outlined"
              size="l"
              icon={ICONS.mail}
              onClick={() => onDone({ method: "google", email: "demo.farmer@gmail.com" })}
            >
              জিমেইল লগইন
            </Button>

            <p className="login__demo">
              ডেমো লগইন: কোনো আসল এসএমএস বা জিমেইল সংযোগ নেই। কোডটি পর্দায় দেখানো হবে।
            </p>
          </Card>
        ) : (
          <Card variant="filled" className="panel login__card">
            <h2 className="panel__title">কোড যাচাই করুন</h2>
            <p className="fineprint">
              +৮৮ {toBangla(digits.replace(/^0/, ""))} নম্বরে কোড পাঠানো হয়েছে।
            </p>

            <div className="login__demo-code">
              ডেমো কোড: <strong>১২৩৪</strong>
            </div>

            <label className="setup__field">
              <span className="setup__field-label">৪ সংখ্যার কোড</span>
              <input
                className="setup__input login__otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={4}
                value={otp}
                placeholder="১২৩৪"
                onChange={(event) => {
                  setOtp(event.target.value);
                  setError("");
                }}
              />
            </label>

            {resent && <p className="fineprint">কোড আবার পাঠানো হয়েছে (ডেমো)।</p>}

            {error && (
              <p className="login__error" role="alert">
                {error}
              </p>
            )}

            <Button variant="filled" size="l" onClick={verify}>
              যাচাই করুন
            </Button>

            <div className="login__row">
              <button
                type="button"
                className="login__link"
                onClick={() => {
                  setOtp("");
                  setError("");
                  setResent(true);
                }}
              >
                কোড আবার পাঠান
              </button>
              <button
                type="button"
                className="login__link"
                onClick={() => {
                  setStage("phone");
                  setOtp("");
                  setError("");
                }}
              >
                নম্বর বদলান
              </button>
            </div>
          </Card>
        )}

        <button type="button" className="login__skip" onClick={onSkip}>
          লগইন ছাড়া চালিয়ে যান
        </button>
      </div>
    </section>
  );
}
