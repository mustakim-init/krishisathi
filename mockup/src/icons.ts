/* Icon set: 24px line icons drawn for this project, passed to Material
   components as the `icon` HTML string. Stroke uses currentColor. */

const wrap = (inner: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" style="fill:none" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;

export const ICONS = {
  mic: wrap(
    `<rect x="9" y="2.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3.5"/>`,
  ),
  home: wrap(
    `<path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1Z"/>`,
  ),
  chevronDown: wrap(`<path d="M5 9l7 7 7-7"/>`),
  camera: wrap(
    `<rect x="2.5" y="6" width="19" height="14" rx="3"/><path d="M8.2 6l1.6-2.5h4.4L15.8 6"/><circle cx="12" cy="13" r="3.5"/>`,
  ),
  sprout: wrap(
    `<path d="M12 21V9"/><path d="M12 12c0-4 3-7 7-7 0 4-3 7-7 7Z"/><path d="M12 16c0-3-2.5-5.5-5.5-5.5 0 3 2.5 5.5 5.5 5.5Z"/>`,
  ),
  book: wrap(
    `<path d="M4 4.5h6a3 3 0 0 1 3 3V20a2.5 2.5 0 0 0-2.5-2.5H4Z"/><path d="M20 4.5h-6a3 3 0 0 0-3 3V20a2.5 2.5 0 0 1 2.5-2.5H20Z"/>`,
  ),
  help: wrap(
    `<circle cx="12" cy="12" r="9"/><path d="M9.4 9.2a2.7 2.7 0 1 1 3.6 2.5c-.7.3-1 .9-1 1.6v.4"/><circle cx="12" cy="17" r=".9" fill="currentColor" stroke="none"/>`,
  ),

  back: wrap(`<path d="M15 5l-7 7 7 7"/>`),
  chevron: wrap(`<path d="M9 5l7 7-7 7"/>`),
  volume: wrap(
    `<path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>`,
  ),
  send: wrap(`<path d="M4 12 20 4l-7 16-2.2-6.8L4 12Z"/>`),
  check: wrap(`<path d="M4.5 12.5l5 5 10-11"/>`),
  close: wrap(`<path d="M6 6l12 12M18 6 6 18"/>`),
  phone: wrap(
    `<path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z"/>`,
  ),
  calendar: wrap(
    `<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>`,
  ),
  diary: wrap(`<path d="M6 3.5h12v17l-3-2-3 2-3-2-3 2v-17Z"/><path d="M9 8h6M9 12h6"/>`),
  person: wrap(`<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>`),
  menu: wrap(`<path d="M4 7h16M4 12h16M4 17h16"/>`),
  play: wrap(`<path d="M8 5.5v13l11-6.5Z"/>`),
  pause: wrap(`<path d="M9 5.5v13M15 5.5v13"/>`),
  logout: wrap(`<path d="M14 4.5h4a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-4"/><path d="M9 8l-4 4 4 4M5 12h10"/>`),
  mail: wrap(`<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>`),
  trash: wrap(`<path d="M4.5 7h15M9 7V4.5h6V7M6.5 7l1 13h9l1-13M10 11v5M14 11v5"/>`),
  offline: wrap(
    `<path d="M3 3l18 18"/><path d="M8.5 8.5a10 10 0 0 0-2 1.5M12 5c3 0 5.8 1.1 8 3"/><path d="M12 12a5 5 0 0 1 2 .4"/><circle cx="12" cy="18" r="1.2" fill="currentColor" stroke="none"/>`,
  ),
  plus: wrap(`<path d="M12 5v14M5 12h14"/>`),
  sparkle: wrap(
    `<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/>`,
  ),
  image: wrap(
    `<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="M4.5 17l5-5 4 4 3-2.5 3 3"/>`,
  ),
  sun: wrap(
    `<circle cx="12" cy="12" r="4"/><path d="M12 2.5V5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8"/>`,
  ),
  gear: wrap(
    `<circle cx="12" cy="12" r="3.2"/><path d="M19.1 14.6a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5v.2a2 2 0 1 1-4 0v-.2a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1h.2a2 2 0 1 1 0 4h-.2a1.6 1.6 0 0 0-1.5 1Z"/>`,
  ),
} as const;

export type IconName = keyof typeof ICONS;
