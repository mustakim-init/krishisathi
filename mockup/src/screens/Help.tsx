import { useEffect, useState } from "react";
import { BottomSheet, Button } from "material/react";
import Card from "../components/Card";
import { ICONS } from "../icons";
import { PhoneHeader } from "../components/PhoneHeader";
import Overlay from "../components/Overlay";
import { toBangla } from "../format";
import type { FarmProfile } from "../farm";

const FAQ = [
  {
    q: "কীভাবে কথা বলব?",
    a: "‘কথা বলুন’ ট্যাবে যান। নিচের মাইকে চাপ দিন অথবা লেখার ঘরে নিজের সমস্যা লিখুন। ডেমোতে কথোপকথনটি আগে থেকে সেট করা।",
  },
  {
    q: "কীভাবে ছবি দেব?",
    a: "‘কথা বলুন’ স্ক্রিনে লেখার ঘরের ভেতরের ক্যামেরা আইকনে চাপুন। ডেমোতে আসল ক্যামেরা খোলে না, তাই তিনটি নমুনা ছবি দেওয়া আছে।",
  },
  {
    q: "ইন্টারনেট না থাকলে কী চলবে?",
    a: "সঠিক চাষের নিয়ম, জমির তথ্য আর খরচের খাতা এই ফোনেই থাকে। কথা বলার জন্য ইন্টারনেট লাগবে।",
  },
  {
    q: "লগইন করতে কী লাগবে?",
    a: "শুধু মোবাইল নম্বর, অথবা জিমেইল। মোবাইল নম্বরে ৪ সংখ্যার কোড যাবে—কোনো পাসওয়ার্ড লাগবে না। ডেমোতে কোডটি পর্দায় দেখানো হয়।",
  },
];

const TUTORIALS = [
  {
    id: "talk",
    title: "কথা বলে সমস্যা বলবেন যেভাবে",
    duration: "৪৫ সেকেন্ড",
    icon: ICONS.mic,
    steps: [
      "‘কথা বলুন’ ট্যাবে যান।",
      "নিচের মাইক বাটনে চাপ দিন, ‘শুনছি’ লেখা আসবে।",
      "সমস্যা বললে অ্যাপ ধাপে ধাপে প্রশ্ন করবে।",
      "উত্তর শুনতে ‘শুনুন’ বাটনে চাপ দিন।",
    ],
  },
  {
    id: "photo",
    title: "পাতার ছবি দিয়ে সমাধান",
    duration: "৪০ সেকেন্ড",
    icon: ICONS.camera,
    steps: [
      "কথা বলার স্ক্রিনে ক্যামেরা আইকনে চাপ দিন।",
      "ডেমোতে নমুনা ছবি থেকে একটি বেছে নিন।",
      "ধানের বয়স ও জমির পানি—দুটি প্রশ্নের উত্তর দিন।",
      "‘পুরো সমাধান দেখুন’ চাপুন।",
    ],
  },
  {
    id: "farm",
    title: "জমির কাজ ও খরচ লিখবেন যেভাবে",
    duration: "৫০ সেকেন্ড",
    icon: ICONS.sprout,
    steps: [
      "‘আমার জমি’ ট্যাবে যান।",
      "কাজ শেষ হলে পাশের ঘরে টিক দিন।",
      "‘খরচ যোগ করুন’ চেপে খাত ও টাকা লিখুন।",
      "মোট খরচ আপনার লেখা থেকেই হিসাব হবে।",
    ],
  },
];

/* The government helplines below are verified national short codes. District
   agriculture offices do not publish one reliable list here, so the app sends
   the farmer to 16123 or 333 instead of inventing a local number. */
const EMERGENCY = [
  { digits: "999", label: "জাতীয় জরুরি সেবা", sub: "পুলিশ, ফায়ার সার্ভিস ও অ্যাম্বুলেন্স" },
  { digits: "102", label: "ফায়ার সার্ভিস", sub: "আগুন ও দুর্ঘটনা" },
  { digits: "16263", label: "স্বাস্থ্য বাতায়ন", sub: "ডাক্তারের পরামর্শ" },
  { digits: "16123", label: "কৃষি কল সেন্টার", sub: "ফসল, পোকা ও সারের পরামর্শ" },
  { digits: "333", label: "সরকারি তথ্য ও সেবা", sub: "জেলা প্রশাসন ও কৃষি অফিসের তথ্য" },
  { digits: "109", label: "নারী ও শিশু সহায়তা", sub: "নির্যাতন ও সহায়তা" },
];

type Tutorial = (typeof TUTORIALS)[number];

export default function Help({
  profile,
  onGuide,
  onTour,
  onSettings,
}: {
  profile: FarmProfile;
  onGuide: () => void;
  onTour: () => void;
  onSettings: () => void;
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [call, setCall] = useState<{ digits: string; label: string } | null>(null);

  useEffect(() => {
    if (!tutorial || !playing) return;
    const timer = window.setInterval(() => {
      setFrame((current) => (current + 1) % tutorial.steps.length);
    }, 2600);
    return () => window.clearInterval(timer);
  }, [tutorial, playing]);

  const openTutorial = (item: Tutorial) => {
    setTutorial(item);
    setFrame(0);
    setPlaying(true);
  };

  const closeTutorial = () => {
    setTutorial(null);
    setFrame(0);
    setPlaying(true);
  };

  const nextFrame = () => {
    if (!tutorial) return;
    setFrame((current) => (current + 1) % tutorial.steps.length);
  };

  return (
    <section className="view">
      <PhoneHeader title="সাহায্য" />

      <p className="lede">অ্যাপটি কীভাবে চালাবেন, জরুরি নম্বর আর সাধারণ প্রশ্ন — সব এখানে।</p>

      <Card variant="filled" className="panel">
        <h2 className="panel__title">কীভাবে ব্যবহার করবেন</h2>
        <p>কোন বাটনে কী কাজ হয়, সহজ ভাষায় ধাপে ধাপে দেখে নিন।</p>
        <div className="contact__actions">
          <Button variant="filled" size="m" icon={ICONS.book} onClick={onGuide}>
            ধাপে ধাপে দেখুন
          </Button>
          <Button variant="outlined" size="m" icon={ICONS.sparkle} onClick={onTour}>
            হোমে দেখান
          </Button>
        </div>
      </Card>

      <section className="block">
        <h2 className="block__title">টিউটোরিয়াল ভিডিও</h2>
        <div className="tutorial-list">
          {TUTORIALS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="tutorial-card"
              onClick={() => openTutorial(item)}
            >
              <span className="tutorial-card__thumb">
                <span
                  className="tutorial-card__icon"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: item.icon }}
                />
                <span
                  className="tutorial-card__play"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: ICONS.play }}
                />
              </span>
              <span className="tutorial-card__text">
                <span className="tutorial-card__title">{item.title}</span>
                <span className="tutorial-card__meta">{item.duration} · ডেমো</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="block">
        <div className="today__head">
          <h2 className="block__title">জরুরি নম্বর</h2>
          <span className="pill">সরকারি</span>
        </div>
        <div className="emergency">
          {EMERGENCY.map((item) => (
            <button
              key={item.digits}
              type="button"
              className="emergency__row"
              onClick={() => setCall({ digits: item.digits, label: item.label })}
            >
              <span
                className="emergency__icon"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: ICONS.phone }}
              />
              <span className="emergency__text">
                <span className="emergency__label">{item.label}</span>
                <span className="emergency__sub">{item.sub}</span>
              </span>
              <span className="emergency__num">{toBangla(item.digits)}</span>
            </button>
          ))}
        </div>
      </section>

      <Card variant="filled" className="panel">
        <div className="contact__head">
          <div>
            <p className="contact__name">জেলার কৃষি অফিস</p>
            <p className="contact__line">
              {profile.district ? `${profile.district} জেলা` : "জেলা এখনো দেওয়া হয়নি"}
            </p>
            <p className="contact__line">জেলার নম্বর জানতে ১৬১২৩ অথবা ৩৩৩-এ কল করুন</p>
          </div>
          <span className="pill">জেলা</span>
        </div>
        <div className="contact__actions">
          <Button
            variant="filled"
            size="m"
            icon={ICONS.phone}
            onClick={() => setCall({ digits: "16123", label: "কৃষি কল সেন্টার" })}
          >
            কৃষি কল সেন্টার
          </Button>
          <Button
            variant="outlined"
            size="m"
            onClick={() => setCall({ digits: "333", label: "সরকারি তথ্য ও সেবা" })}
          >
            ৩৩৩
          </Button>
        </div>
      </Card>

      <Card variant="outlined" className="panel">
        <div className="contact__head">
          <div>
            <p className="contact__name">সেটিংস</p>
            <p className="contact__line">লেখার সাইজ, বলার গতি আর ভাইব্রেশন</p>
          </div>
          <Button variant="outlined" size="s" icon={ICONS.gear} onClick={onSettings}>
            খুলুন
          </Button>
        </div>
      </Card>

      <section className="block">
        <h2 className="block__title">সাধারণ প্রশ্ন</h2>
        <div className="faq">
          {FAQ.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={item.q} className="faq__item">
                <button
                  type="button"
                  className="faq__q"
                  aria-expanded={isOpen}
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                >
                  <span>{item.q}</span>
                  <span
                    className={`stage__chevron ${isOpen ? "is-open" : ""}`}
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{ __html: ICONS.chevronDown }}
                  />
                </button>
                {isOpen && <p className="faq__a">{item.a}</p>}
              </div>
            );
          })}
        </div>
      </section>

      <Overlay>
        <BottomSheet
          open={call !== null}
          headline={call?.label ?? "কল করুন"}
          onClose={() => setCall(null)}
        >
          <div className="sheet-body">
            <p className="call__number">{call ? toBangla(call.digits) : ""}</p>
            <p className="fineprint">
              চাপলে ফোনের ডায়ালার খুলবে। অ্যাপ নিজে থেকে কল করবে না।
            </p>
            <a className="call__dial" href={`tel:${call?.digits ?? ""}`}>
              <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS.phone }} />
              ডায়ালার খুলুন
            </a>
            <Button variant="text" size="m" onClick={() => setCall(null)}>
              বন্ধ করুন
            </Button>
          </div>
        </BottomSheet>

        <BottomSheet
          open={tutorial !== null}
          headline={tutorial?.title ?? "টিউটোরিয়াল"}
          onClose={closeTutorial}
        >
          {tutorial && (
            <div className="sheet-body">
              <div className="player">
                <div className="player__stage">
                  <span className="player__badge">ডেমো টিউটোরিয়াল</span>
                  <span
                    className="player__icon"
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{ __html: tutorial.icon }}
                  />
                  <p className="player__caption">{tutorial.steps[frame]}</p>
                  <span className="player__count">
                    ধাপ {toBangla(frame + 1)} / {toBangla(tutorial.steps.length)}
                  </span>
                </div>

                <div className="player__progress" aria-hidden="true">
                  {tutorial.steps.map((step, index) => (
                    <span key={step} className={index <= frame ? "is-on" : ""} />
                  ))}
                </div>

                <div className="player__controls">
                  <button
                    type="button"
                    className="player__btn"
                    onClick={() => setPlaying(!playing)}
                  >
                    <span
                      aria-hidden="true"
                      dangerouslySetInnerHTML={{ __html: playing ? ICONS.pause : ICONS.play }}
                    />
                    {playing ? "বিরতি" : "চালান"}
                  </button>
                  <Button variant="text" size="s" onClick={nextFrame}>
                    পরের ধাপ
                  </Button>
                </div>
              </div>
              <p className="fineprint">
                ডেমোতে ভিডিও ফাইলের বদলে ধাপে ধাপে দেখানো হচ্ছে। আসল ভিডিও পরে যুক্ত হবে।
              </p>
            </div>
          )}
        </BottomSheet>
      </Overlay>
    </section>
  );
}
