import { Button } from "material/react";
import Card from "../components/Card";
import { PhoneHeader } from "../components/PhoneHeader";
import { ICONS } from "../icons";
import { toBangla, formatDay } from "../format";
import { readConversations } from "../conversations";
import type { FarmProfile } from "../farm";

export default function Saved({
  profile,
  onOpen,
  onTalk,
  onProfile,
}: {
  profile: FarmProfile;
  onOpen: (id: string) => void;
  onTalk: () => void;
  onProfile: () => void;
}) {
  const conversations = readConversations();

  const farmLine = profile.district
    ? [
        profile.district,
        profile.areaShotangsho !== null ? `${toBangla(profile.areaShotangsho)} শতাংশ` : null,
      ]
        .filter(Boolean)
        .join(" · ")
    : "জমির তথ্য এখনো দেওয়া হয়নি";

  return (
    <section className="view">
      <PhoneHeader title="সংরক্ষিত তথ্যসমূহ" />

      <p className="lede">আপনার কথোপকথন আর পরামর্শ এই ফোনেই সংরক্ষিত থাকে।</p>

      <Card variant="filled" className="panel">
        <div className="today__head">
          <div>
            <h2 className="panel__title">আমার জমি</h2>
            <p className="fineprint">{farmLine}</p>
          </div>
          <Button variant="outlined" size="s" onClick={onProfile}>
            প্রোফাইল
          </Button>
        </div>
      </Card>

      <div className="saved-head">
        <h2 className="block__title">সংরক্ষিত কথা</h2>
        <span className="fineprint">{toBangla(conversations.length)}টি</span>
      </div>

      {conversations.length === 0 ? (
        <Card variant="outlined" className="empty-farm">
          <p className="lede">এখনো কোনো কথা সংরক্ষিত হয়নি।</p>
          <Button variant="filled" size="m" icon={ICONS.mic} onClick={onTalk}>
            কথা বলুন
          </Button>
        </Card>
      ) : (
        <div className="saved-list">
          {conversations.map((item) => {
            const last = [...item.messages].reverse().find((message) => message.role === "ai");
            return (
              <button
                key={item.id}
                type="button"
                className="saved-item"
                onClick={() => onOpen(item.id)}
              >
                <span className="saved-item__top">
                  <span className="saved-item__title">{item.title}</span>
                  <span className="saved-item__date">{formatDay(item.updatedAt)}</span>
                </span>
                <span className="saved-item__snippet">{last?.text ?? "কোনো উত্তর নেই"}</span>
                <span className="saved-item__meta">
                  {item.demo ? "ডেমো" : "আপনার কথা"} · {toBangla(item.messages.length)}টি বার্তা
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
