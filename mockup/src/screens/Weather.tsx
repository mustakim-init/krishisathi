import Card from "../components/Card";
import { PhoneHeader } from "../components/PhoneHeader";
import type { FarmProfile } from "../farm";
import { toBangla } from "../format";
import { ICONS } from "../icons";
import { DEMO_WEATHER, nextSevenDays, type WeatherKind } from "../weather";

const WEATHER_ICONS: Record<WeatherKind, string> = {
  sun: ICONS.sun,
  cloudSun: ICONS.cloudSun,
  cloud: ICONS.cloud,
  rain: ICONS.rain,
  storm: ICONS.storm,
};

export default function Weather({
  profile,
  onBack,
}: {
  profile: FarmProfile;
  onBack: () => void;
}) {
  const labels = nextSevenDays();
  const { current, days } = DEMO_WEATHER;
  const place = profile.district || "আপনার জেলা";
  const weekHigh = Math.max(...days.map((day) => day.high));
  const weekLow = Math.min(...days.map((day) => day.low));
  const span = Math.max(weekHigh - weekLow, 1);
  const rainyDays = days.filter((day) => day.rain >= 40).length;
  const wettestIndex = days.reduce(
    (best, day, index) => (day.rain > days[best].rain ? index : best),
    0,
  );
  const wettest = labels[wettestIndex];

  return (
    <section className="view weather">
      <PhoneHeader title="আবহাওয়া" onBack={onBack} />
      <p className="lede">আজ থেকে সামনের সাত দিনের ডেমো পূর্বাভাস।</p>

      <section className="weather-hero" aria-label={`${place}-এর আজকের ডেমো আবহাওয়া`}>
        <div className="weather-hero__top">
          <span className="weather-place">
            <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS.pin }} />
            {place}
          </span>
          <span className="weather-demo">ডেমো পূর্বাভাস</span>
        </div>

        <div className="weather-now">
          <span
            className="weather-now__icon"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: WEATHER_ICONS[current.icon] }}
          />
          <div className="weather-now__text">
            <p className="weather-now__temp">{toBangla(current.temp)}°</p>
            <p className="weather-now__cond">{current.condition}</p>
            <p className="weather-now__range">
              সর্বোচ্চ {toBangla(current.high)}° · সর্বনিম্ন {toBangla(current.low)}°
            </p>
          </div>
          <span className="weather-now__date">{labels[0].date}</span>
        </div>

        <div className="weather-stats">
          <div className="weather-stat">
            <span className="weather-stat__label">
              <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS.drop }} />
              বৃষ্টি
            </span>
            <strong>{toBangla(current.rain)}%</strong>
          </div>
          <div className="weather-stat">
            <span className="weather-stat__label">
              <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS.wind }} />
              বাতাস
            </span>
            <strong>{toBangla(current.wind)} কিমি/ঘণ্টা</strong>
          </div>
          <div className="weather-stat">
            <span className="weather-stat__label">
              <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS.drop }} />
              আর্দ্রতা
            </span>
            <strong>{toBangla(current.humidity)}%</strong>
          </div>
        </div>
      </section>

      <Card variant="filled" className="panel weather-summary">
        <div className="weather-summary__head">
          <h2 className="panel__title">এই সপ্তাহে</h2>
          <span className="weather-mini-pill">ডেমো</span>
        </div>
        <p className="weather-summary__text">
          আজসহ সাত দিনের মধ্যে {toBangla(rainyDays)} দিন বৃষ্টির সম্ভাবনা; সবচেয়ে বেশি{" "}
          {wettest.fullLabel} ({toBangla(days[wettestIndex].rain)}%)।
        </p>
        <div className="weather-summary__stats">
          <div>
            <span>সর্বোচ্চ</span>
            <strong>{toBangla(weekHigh)}°</strong>
          </div>
          <div>
            <span>সর্বনিম্ন</span>
            <strong>{toBangla(weekLow)}°</strong>
          </div>
          <div>
            <span>বৃষ্টির দিন</span>
            <strong>{toBangla(rainyDays)} দিন</strong>
          </div>
        </div>
      </Card>

      <Card variant="filled" className="panel weather-week">
        <div className="weather-week__head">
          <h2 className="panel__title">৭ দিনের পূর্বাভাস</h2>
          <span className="weather-week__hint">সর্বোচ্চ / সর্বনিম্ন</span>
        </div>
        <ul className="weather-days">
          {days.map((day, index) => {
            const label = labels[index];
            const rawLeft = ((day.low - weekLow) / span) * 100;
            const width = Math.max(((day.high - day.low) / span) * 100, 14);
            const left = Math.min(rawLeft, 100 - width);

            return (
              <li className="weather-day" key={label.date}>
                <div className="weather-day__when">
                  <strong>{label.label}</strong>
                  <span>{label.date}</span>
                </div>
                <span
                  className="weather-day__icon"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: WEATHER_ICONS[day.icon] }}
                />
                <div className="weather-day__main">
                  <div className="weather-day__line">
                    <span>{day.condition}</span>
                    <span className="weather-day__rain">
                      <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS.drop }} />
                      {toBangla(day.rain)}%
                    </span>
                  </div>
                  <div className="weather-day__bar" aria-hidden="true">
                    <span style={{ left: `${left}%`, width: `${width}%` }} />
                  </div>
                </div>
                <div className="weather-day__temps">
                  <strong>{toBangla(day.high)}°</strong>
                  <span>{toBangla(day.low)}°</span>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card variant="outlined" className="panel weather-note">
        <p className="panel__strong">এটি ডেমো পূর্বাভাস।</p>
        <p className="fineprint">
          ফেজ ১-এ আসল আবহাওয়া সেবা যুক্ত হয়নি। জরুরি সিদ্ধান্তের আগে স্থানীয় পূর্বাভাস ও কৃষি
          অফিসের পরামর্শ নিন।
        </p>
      </Card>
    </section>
  );
}
