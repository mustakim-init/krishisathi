import { useState } from "react";
import { Button, Card, Dialog } from "material/react";
import { ICONS } from "../icons";
import { DemoNote, PhoneHeader } from "../components/PhoneHeader";

const FAQ = [
  {
    q: "কীভাবে কথা বলব?",
    a: "হোম স্ক্রিনে বড় মাইক বোতামে চাপ দিন। তারপর আপনার সমস্যা বলুন। ডেমোতে কথোপকথনটি আগে থেকে লেখা।",
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

export default function Help() {
  const [sheet, setSheet] = useState<Sheet>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="view">
      <PhoneHeader title="সাহায্য" />

      <p className="lede">কথা বলতে না পারলে বা নিশ্চিত হতে চাইলে সরাসরি যোগাযোগ করুন।</p>

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
                  <span className={`stage__chevron ${isOpen ? "is-open" : ""}`} aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS.chevronDown }} />
                </button>
                {isOpen && <p className="faq__a">{item.a}</p>}
              </div>
            );
          })}
        </div>
      </section>

      <DemoNote />

      <Dialog
        open={sheet !== null}
        headline={sheet === "call" ? "ফোন করা যাবে না" : "কলব্যাক অনুরোধ"}
        closeButton
        onClose={() => setSheet(null)}
      >
        <p>
          {sheet === "call"
            ? "এটি ডেমো প্রোটোটাইপ। ডেমোতে সত্যিকারের ফোন কল হয় না।"
            : "ডেমোতে আপনার অনুরোধ জমা হয়েছে বলে দেখানো হচ্ছে। প্রকৃত অনুরোধ কোথাও পাঠানো হয়নি।"}
        </p>
        <Button slot="actions" variant="text" size="m" onClick={() => setSheet(null)}>
          বুঝেছি
        </Button>
      </Dialog>
    </section>
  );
}
