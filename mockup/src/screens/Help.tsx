import { useState } from "react";
import { BottomSheet, Button } from "material/react";
import Card from "../components/Card";
import { ICONS } from "../icons";
import { DemoNote, PhoneHeader } from "../components/PhoneHeader";
import Overlay from "../components/Overlay";

const FAQ = [
  {
    q: "কীভাবে কথা বলব?",
    a: "হোমে থাকা বড় মাইক বাটনে চাপ দিন। তারপর নিজের ভাষায় সমস্যা বলুন। ডেমোতে কথোপকথনটি আগে থেকে সেট করা।",
  },
  {
    q: "কীভাবে ছবি দেব?",
    a: "‘ছবি দেখান’ কার্ডে ট্যাপ করে একটি নমুনা ছবি বেছে নিন। ডেমোতে আসল ক্যামেরা খোলে না, তাই তিনটি নমুনা ছবি দেওয়া আছে।",
  },
  {
    q: "ইন্টারনেট না থাকলে কী চলবে?",
    a: "চাষের গাইড আর আমার জমি — এই দুটি অংশ অফলাইনেও চলবে। কথা বলার জন্য ইন্টারনেট লাগবে।",
  },
  {
    q: "কোনো অ্যাকাউন্ট বা লগইন কি লাগবে?",
    a: "না। আপনার জমির তথ্য ও আগের উত্তর সরাসরি ফোনেই সেভ থাকবে। কোনো পাসওয়ার্ড বা জিমেইল লাগবে না।",
  },
];

type Sheet = "call" | "callback" | null;

export default function Help({
  onGuide,
  onTour,
  onSettings,
}: {
  onGuide: () => void;
  onTour: () => void;
  onSettings: () => void;
}) {
  const [sheet, setSheet] = useState<Sheet>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="view">
      <PhoneHeader title="সাহায্য" />

      <p className="lede">অ্যাপটি কীভাবে চালাবেন, কৃষি অফিসের নম্বর আর সাধারণ প্রশ্ন — সব এখানে।</p>

      <Card variant="filled" className="panel">
        <h2 className="panel__title">কীভাবে ব্যবহার করবেন</h2>
        <p>কোন বাটনে কী কাজ হয়, সহজ ভাষায় ধাপে ধাপে দেখে নিন।</p>
        <div className="contact__actions">
          <Button variant="filled" size="m" icon={ICONS.book} onClick={onGuide}>
            ধাপে ধাপে দেখুন
          </Button>
          <Button variant="outlined" size="m" icon={ICONS.sparkle} onClick={onTour}>
            হোমে দেখান
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

      <Card variant="filled" className="panel">
        <div className="contact__head">
          <div>
            <p className="contact__name">উপজেলা কৃষি অফিস</p>
            <p className="contact__line">ডেমো ঠিকানা, সদর</p>
            <p className="contact__line">০১৭০০-০০০০০০</p>
          </div>
          <span className="pill">ডেমো</span>
        </div>
        <div className="contact__actions">
          <Button variant="filled" size="m" icon={ICONS.phone} onClick={() => setSheet("call")}>
            ফোন করুন
          </Button>
          <Button variant="outlined" size="m" onClick={() => setSheet("callback")}>
            কলব্যাক চাই
          </Button>
        </div>
      </Card>

      <Card variant="outlined" className="panel">
        <div className="contact__head">
          <div>
            <p className="contact__name">বীজ ও সার বিক্রেতা</p>
            <p className="contact__line">বাজার রোড, সদর</p>
            <p className="contact__line">সকাল ৯টা – সন্ধ্যা ৬টা</p>
          </div>
          <span className="pill">ডেমো</span>
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

      <DemoNote />

      <Overlay>
        <BottomSheet
          open={sheet !== null}
          headline={sheet === "call" ? "ডেমো কল" : "কলব্যাক চাই"}
          onClose={() => setSheet(null)}
        >
          <div className="sheet-body">
            <p>
              {sheet === "call"
                ? "এটি একটি ডেমো প্রোটোটাইপ। এখান থেকে সত্যিকারের ফোন কল করা যায় না।"
                : "ডেমোতে আপনার অনুরোধ দেখানো হয়েছে। আসল অ্যাপে স্থানীয় কৃষি অফিসের সাথে যোগাযোগ যুক্ত হবে।"}
            </p>
            <Button variant="text" size="m" onClick={() => setSheet(null)}>
              বুঝেছি
            </Button>
          </div>
        </BottomSheet>
      </Overlay>
    </section>
  );
}
