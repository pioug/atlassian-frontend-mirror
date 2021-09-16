import { MutableRefObject, useEffect, useRef } from 'react';

import {
  heading,
  link,
  linkActive,
  linkHover,
  linkOutline,
  subtleHeading,
  subtleText,
  text,
} from '../../colors';

export const SELECTOR = 'old-ds-theme-mode';

const baseResetStyles = [
  { theme: { mode: 'light' } },
  { theme: { mode: 'dark' } },
]
  .map(
    (theme) => `
  .${theme.theme.mode}-${SELECTOR} {
    color: ${text(theme)};
  }
  .${theme.theme.mode}-${SELECTOR} a {
    color: ${link(theme)};
  }
  .${theme.theme.mode}-${SELECTOR} a:hover {
    color: ${linkHover(theme)};
  }
  .${theme.theme.mode}-${SELECTOR} a:active {
    color: ${linkActive(theme)};
  }
  .${theme.theme.mode}-${SELECTOR} a:focus {
    outlineColor: ${linkOutline(theme)};
  }
  .${theme.theme.mode}-${SELECTOR} h1,
  .${theme.theme.mode}-${SELECTOR} h2,
  .${theme.theme.mode}-${SELECTOR} h3,
  .${theme.theme.mode}-${SELECTOR} h4,
  .${theme.theme.mode}-${SELECTOR} h5 {
    color: ${heading(theme)};
  }
  .${theme.theme.mode}-${SELECTOR} h6 {
    color: ${subtleHeading(theme)};
  }
  .${theme.theme.mode}-${SELECTOR} small {
    color: ${subtleText(theme)};
  }`,
  )
  .join('\n');

const getStylesheetResetCSS = (backgroundColor: string) =>
  `body { background: ${backgroundColor}; }`;

const UNIQUE_INTERNAL_ID = 'ds--theme--ak-theme-provider';

/**
 * This hooks conditionally sets body styles based on the theme mode applied.
 *
 * @param backgroundColor The background color to be applied at the root level of the application
 */
const useThemeResetStyles = (backgroundColor: string) => {
  const stylesheet: MutableRefObject<HTMLStyleElement | null> = useRef<
    HTMLStyleElement
  >(null);

  useEffect(() => {
    const hasNode = document.getElementById(UNIQUE_INTERNAL_ID);

    // Bail out if the AKThemeProvider has already set the body
    // Child nodes should not take precedence over a root node setting body bg
    if (hasNode) {
      return;
    }

    stylesheet.current = document.createElement('style');
    if (document && document.head) {
      stylesheet.current.id = UNIQUE_INTERNAL_ID;
      const firstStyleElement = document.head.querySelector(
        'style:not([data-styled-components],[data-emotion])',
      );

      // This is _likely_ to be the css reset, ideally this isn't required as we shouldn't
      // reset background color here, but it's still relied on by editor and mobile.
      if (firstStyleElement) {
        document.head.insertBefore(
          stylesheet.current,
          firstStyleElement.nextSibling!,
        );
      } else {
        document.head.prepend(stylesheet.current);
      }
    }

    return () => {
      if (stylesheet.current && document && document.head) {
        document.head.removeChild(stylesheet.current);
        stylesheet.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (stylesheet.current) {
      const css = getStylesheetResetCSS(backgroundColor);
      stylesheet.current.innerHTML = css + baseResetStyles;
    }
  }, [backgroundColor]);
};

export default useThemeResetStyles;
