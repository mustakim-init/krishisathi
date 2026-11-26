/* The Material components render their internals in an open shadow root, so a
   page stylesheet cannot reach their labels. The navigation bar label is 12px
   by spec, which is too small for Bangla on a farmer's phone. This appends one
   small override to each bar's shadow root. */

const NAV_BAR_OVERRIDES = `
  .mtrl-navigation-bar__label {
    font-family: "Hind Siliguri", system-ui, sans-serif !important;
    font-size: 14px !important;
    line-height: 18px !important;
    font-weight: 600 !important;
    letter-spacing: 0 !important;
  }
`;

function patchOne(host: Element) {
  const root = (host as HTMLElement).shadowRoot;
  if (!root || root.querySelector("style[data-ks-nav]")) return;

  const style = document.createElement("style");
  style.setAttribute("data-ks-nav", "");
  style.textContent = NAV_BAR_OVERRIDES;
  root.append(style);
}

export function patchComponentStyles() {
  if (typeof document === "undefined") return;

  const apply = () => {
    document.querySelectorAll("m-navigation-bar, mtrl-navigation-bar").forEach(patchOne);
  };

  apply();

  const observer = new MutationObserver(apply);
  observer.observe(document.body, { childList: true, subtree: true });
}
