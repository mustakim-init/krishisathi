import { Button } from "material/react";
import { ICONS } from "../icons";

export function PhoneHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <header className="view__header">
      {onBack && (
        <Button variant="text" size="m" icon={ICONS.back} onClick={onBack} aria-label="ফিরে যান">
          ফিরে যান
        </Button>
      )}
      <h1 className="view__title">{title}</h1>
    </header>
  );
}

export function DemoNote() {
  return <p className="demo-note">এটি একটি ডেমো প্রোটোটাইপ। প্রকৃত রোগ নির্ণয় নয়।</p>;
}
