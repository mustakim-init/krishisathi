import { Button } from "material/react";
import Card from "../components/Card";
import { PhoneHeader } from "../components/PhoneHeader";
import { ICONS } from "../icons";
import { toBangla } from "../format";
import {
  hasFarm,
  landLabel,
  seasonLabel,
  stageFor,
  type FarmProfile,
} from "../farm";
import type { Auth } from "../auth";

export default function Profile({
  profile,
  auth,
  onSetup,
  onLogin,
  onLogout,
  onSaved,
  onSettings,
  onHelp,
}: {
  profile: FarmProfile;
  auth: Auth | null;
  onSetup: () => void;
  onLogin: () => void;
  onLogout: () => void;
  onSaved: () => void;
  onSettings: () => void;
  onHelp: () => void;
}) {
  const configured = hasFarm(profile);
  const stage =
    profile.status === "preparing"
      ? "জমি তৈরি"
      : profile.plantedDays !== null
        ? stageFor(profile.plantedDays).label
        : null;

  const accountLine = auth
    ? auth.method === "phone"
      ? `মোবাইল +৮৮ ${toBangla(auth.phone.replace(/^0/, ""))}`
      : auth.email
    : "লগইন করা নেই";

  const irrigation =
    profile.hasIrrigation === true
      ? "আছে"
      : profile.hasIrrigation === false
        ? "বৃষ্টির ওপর নির্ভর"
        : "দেওয়া হয়নি";

  return (
    <section className="view">
      <PhoneHeader title="প্রোফাইল" />

      <Card variant="filled" className="profile-hero">
        <span className="profile-hero__avatar" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS.person }} />
        <div className="profile-hero__text">
          <h2 className="profile-hero__name">{profile.name.trim() || "আপনার নাম"}</h2>
          <p className="profile-hero__meta">
            {profile.district || "জেলা দেওয়া হয়নি"}
            {profile.areaShotangsho !== null ? ` · ${toBangla(profile.areaShotangsho)} শতাংশ` : ""}
          </p>
          {stage && <span className="pill">{stage}</span>}
        </div>
        <Button variant="outlined" size="s" onClick={onSetup}>
          বদলান
        </Button>
      </Card>

      <Card variant="outlined" className="panel">
        <div className="contact__head">
          <div>
            <h2 className="panel__title">অ্যাকাউন্ট</h2>
            <p className="contact__line">{accountLine}</p>
            <p className="fineprint">
              {auth
                ? "এই লগইন দিয়েই ভবিষ্যতে বাজার ও ব্যক্তিগত সেবা যুক্ত হবে।"
                : "মোবাইল নম্বর বা জিমেইল দিয়ে ঢুকলে সেটিংস ও তথ্য একসাথে থাকে।"}
            </p>
          </div>
          <span className="profile-badge" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS.person }} />
        </div>
        {auth ? (
          <Button variant="outlined" size="m" icon={ICONS.logout} onClick={onLogout}>
            লগআউট
          </Button>
        ) : (
          <Button variant="filled" size="m" onClick={onLogin}>
            লগইন করুন
          </Button>
        )}
      </Card>

      <Card variant="filled" className="panel">
        <h2 className="panel__title">জমির তথ্য</h2>
        {configured ? (
          <dl className="reasons">
            <div className="reasons__row">
              <dt>জমির পরিমাণ</dt>
              <dd>
                {profile.areaShotangsho !== null
                  ? `${toBangla(profile.areaShotangsho)} শতাংশ`
                  : "দেওয়া হয়নি"}
              </dd>
            </div>
            <div className="reasons__row">
              <dt>মৌসুম</dt>
              <dd>{seasonLabel(profile.season) ?? "দেওয়া হয়নি"}</dd>
            </div>
            <div className="reasons__row">
              <dt>অবস্থা</dt>
              <dd>
                {profile.status === "preparing"
                  ? "জমি তৈরি করছি"
                  : profile.status === "planted"
                    ? "চারা রোপণ করেছি"
                    : "দেওয়া হয়নি"}
              </dd>
            </div>
            <div className="reasons__row">
              <dt>গাছের বয়স</dt>
              <dd>{profile.plantedDays !== null ? `${toBangla(profile.plantedDays)} দিন` : "দেওয়া হয়নি"}</dd>
            </div>
            <div className="reasons__row">
              <dt>জমির ধরন</dt>
              <dd>{landLabel(profile.landType) ?? "দেওয়া হয়নি"}</dd>
            </div>
            <div className="reasons__row">
              <dt>সেচ</dt>
              <dd>{irrigation}</dd>
            </div>
            <div className="reasons__row">
              <dt>দেওয়া সার</dt>
              <dd>{profile.fertilizers.length > 0 ? profile.fertilizers.join(", ") : "দেওয়া হয়নি"}</dd>
            </div>
          </dl>
        ) : (
          <p className="fineprint">জমির তথ্য দিলে এখানে মৌসুম, জমির মাপ ও সার দেখাবে।</p>
        )}
        <Button variant="filled" size="m" onClick={onSetup}>
          {configured ? "জমির তথ্য বদলান" : "জমির তথ্য দিন"}
        </Button>
      </Card>

      <Card variant="outlined" className="panel panel--links">
        <button type="button" className="link-row" onClick={onSaved}>
          <span className="link-row__icon" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS.diary }} />
          <span className="link-row__label">সংরক্ষিত তথ্যসমূহ</span>
          <span className="link-row__chevron" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS.chevron }} />
        </button>
        <button type="button" className="link-row" onClick={onSettings}>
          <span className="link-row__icon" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS.gear }} />
          <span className="link-row__label">সেটিংস</span>
          <span className="link-row__chevron" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS.chevron }} />
        </button>
        <button type="button" className="link-row" onClick={onHelp}>
          <span className="link-row__icon" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS.help }} />
          <span className="link-row__label">সাহায্য ও জরুরি নম্বর</span>
          <span className="link-row__chevron" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS.chevron }} />
        </button>
      </Card>
    </section>
  );
}
