import { useState } from "react";
import { BottomSheet, Button, Card } from "material/react";
import { ICONS } from "../icons";
import { DemoNote, PhoneHeader } from "../components/PhoneHeader";
import Overlay from "../components/Overlay";

const FAQ = [
  {
    q: "কীভাবে কথা বলব?",
    a: "হোম পাতায় বড় মাইক বোতামে চাপ দিন। তারপর আপনার সমস্যা বলুন। ডেমোতে কথোপকথনটি আগে থেকে লেখা।",
  },
  {
    q: "কীভাবে ছবি দেব?",
    a: "‘ছবি তুলে দেখান’ পাতায় গিয়ে নমুনা ছবি বেছে নিন। ডেমোতে ক্যামেরা বা গ্যালারি খোলে না, তাই তিনটি আঁকা নমুনা ছবি দেওয়া আছে।",
  },
  {
    q: "ইন্টারনেট না থাকলে?",
    a: "চাষের গাইড আর আমার জমি — এই দুটি অংশ অফলাইনেও দেখা যাবে। কথা বলার জন্য ইন্টারনেট লাগবে।",
  },
  {
    q: "উত্তর কি সবসময় ঠিক?",
    a: "না। এটি একটি ডেমো প্রোটোটাইপ। নিশ্চিত হতে স্থানীয় কৃষি অফিসে যোগাযোগ করুন।",
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

      <p className="lede">অ্যাপটি কীভাবে চলে, কার সঙ্গে কথা বলবেন আর সাধারণ প্রশ্নের উত্তর — সব এখানে।</p>

      <Card variant="filled" className="panel">
        <h2 className="panel__title">অ্যাপটি কীভাবে ব্যবহার করবেন</h2>
        <p>চারটি কাজের ধাপ, কোন বোতাম কী করে আর কোথায় চাপ দিতে হবে — ছবিসহ সহজ ভাষায় দেখে নিন।</p>
        <div className="contact__actions">
          <Button variant="filled" size="m" icon={ICONS.book} onClick={onGuide}>
            ধাপে ধাপে দেখুন
          </Button>
          <Button variant="outlined" size="m" icon={ICONS.sparkle} onClick={onTour}>
            হোম পাতায় দেখান
          </Button>
        </div>
      </Card>

      <Card variant="outlined" className="panel">
        <div className="contact__head">
          <div>
            <p className="contact__name">সেটিংস</p>
            <p className="contact__line">লেখার আকার, শোনার গতি আর মাইকের কম্পন</p>
          </div>
          <span
            className="settings-icon"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: ICONS.gear }}
          />
        </div>
        <div className="contact__actions">
          <Button variant="outlined" size="m" icon={ICONS.gear} onClick={onSettings}>
            সেটিংস খুলুন
          </Button>
        </div>
      </Card>

      <Card variant="filled" className="panel contact">
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
          headline={sheet === "call" ? "ফোন করা যাবে না" : "কলব্যাক অনুরোধ"}
          onClose={() => setSheet(null)}
        >
          <div className="sheet-body">
            <p>
              {sheet === "call"
                ? "এটি ডেমো প্রোটোটাইপ। ডেমোতে সত্যিকারের ফোন কল হয় না।"
                : "ডেমোতে আপনার অনুরোধ জমা হয়েছে বলে দেখানো হচ্ছে। প্রকৃত অনুরোধ কোথাও পাঠানো হয়নি।"}
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
