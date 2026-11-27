export function PhoneHeader({ title }: { title: string }) {
  return (
    <header className="view__header">
      <h1 className="view__title">{title}</h1>
    </header>
  );
}
