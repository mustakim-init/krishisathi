/* The Material components render their internals in an open shadow root, so a
   page stylesheet cannot reach their labels. The navigation bar label is 12px
   by spec, which is too small for Bangla on a farmer's phone, and a bottom
   sheet's body text is 14px. These append one small override to each such
   shadow root. */

const NAV_BAR_OVERRIDES = `
  .mtrl-navigation-bar__label {
    font-family: "Hind Siliguri", system-ui, sans-serif !important;
    font-size: 14px !important;
    line-height: 18px !important;
    font-weight: 600 !important;
    letter-spacing: 0 !important;
  }
`;

const BOTTOM_SHEET_OVERRIDES = `
  .mtrl-bottom-sheet__title {
    font-weight: 700 !important;
  }

  /* A standard sheet draws no scrim, so it looked like a panel floating over a
     live page. Dim the app behind it and take the taps outside the sheet. */
  .mtrl-bottom-sheet--partial {
    pointer-events: auto !important;
  }

  .mtrl-bottom-sheet--partial::before {
    content: "";
    position: absolute;
    inset: 0;
    background: color-mix(in srgb, var(--mtrl-sys-color-scrim) 32%, transparent);
    animation: ks-sheet-scrim 180ms linear;
  }

  @keyframes ks-sheet-scrim {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .mtrl-bottom-sheet__content {
    font-family: "Hind Siliguri", system-ui, sans-serif !important;
    font-size: 17px !important;
    line-height: 1.55 !important;
    color: var(--mtrl-sys-color-on-surface) !important;
    /* A visible scroll track reads as a web page, not a phone sheet. */
    scrollbar-width: none !important;
  }

  .mtrl-bottom-sheet__content::-webkit-scrollbar {
    display: none !important;
  }
`;

const PATCHES: { selector: string; marker: string; css: string }[] = [
  { selector: "m-navigation-bar, mtrl-navigation-bar", marker: "data-ks-nav", css: NAV_BAR_OVERRIDES },
  { selector: "m-bottom-sheet, mtrl-bottom-sheet", marker: "data-ks-sheet", css: BOTTOM_SHEET_OVERRIDES },
];

/* The scrim is drawn by the style above, so a tap on it has to close the sheet
   here: the component only wires its own scrim, which the standard sheet hides.
   A click from a Material button inside the sheet is retargeted out of its own
   shadow root, so testing event.target against the container wrongly treated
   "add" and "next" taps as scrim taps. Test the pointer position instead. */
function closeOnScrimClick(host: Element, root: ShadowRoot) {
  const sheet = root.querySelector<HTMLElement>(".mtrl-bottom-sheet");
  const container = root.querySelector<HTMLElement>(".mtrl-bottom-sheet__container");
  if (!sheet || !container || sheet.dataset.ksClose === "1") return;

  sheet.dataset.ksClose = "1";
  sheet.addEventListener("click", (event) => {
    // Keyboard activation reports 0,0 and must never close the sheet.
    if (event.clientX === 0 && event.clientY === 0) return;
    const rect = container.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;
    if (inside) return;
    (host as Element & { close?: () => void }).close?.();
  });
}

function patchOne(host: Element, marker: string, css: string) {
  const root = (host as HTMLElement).shadowRoot;
  if (!root) return;

  if (!root.querySelector(`style[${marker}]`)) {
    const style = document.createElement("style");
    style.setAttribute(marker, "");
    style.textContent = css;
    root.append(style);
  }

  if (marker === "data-ks-sheet") closeOnScrimClick(host, root);
}

export function patchComponentStyles() {
  if (typeof document === "undefined") return;

  const apply = () => {
    for (const patch of PATCHES) {
      document.querySelectorAll(patch.selector).forEach((host) => patchOne(host, patch.marker, patch.css));
    }
  };

  apply();

  const observer = new MutationObserver(apply);
  observer.observe(document.body, { childList: true, subtree: true });
}
