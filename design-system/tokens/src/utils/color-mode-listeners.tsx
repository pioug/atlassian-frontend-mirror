import { bind, type UnbindFn } from 'bind-event-listener';

import { COLOR_MODE_ATTRIBUTE } from '../constants';

import { darkModeMediaQuery } from './theme-loading';

const isMatchMediaAvailable =
  typeof window !== 'undefined' && 'matchMedia' in window;

/**
 * Updates the current theme when the system theme changes. Should be bound
 * to an event listener listening on the '(prefers-color-scheme: dark)' query
 * @param e The event representing a change in system theme.
 */
function checkNativeListener(e: MediaQueryListEvent) {
  const element = document.documentElement;
  element.setAttribute(COLOR_MODE_ATTRIBUTE, e.matches ? 'dark' : 'light');
}

const darkModeMql =
  isMatchMediaAvailable && window.matchMedia(darkModeMediaQuery);

class ColorModeObserver {
  unbindThemeChangeListener: UnbindFn | null = null;

  getColorMode() {
    if (!darkModeMql) {
      return 'light';
    }
    return darkModeMql?.matches ? 'dark' : 'light';
  }

  bind() {
    if (darkModeMql && this.unbindThemeChangeListener === null) {
      this.unbindThemeChangeListener = bind(darkModeMql, {
        type: 'change',
        listener: checkNativeListener,
      });
    }
  }

  unbind() {
    if (this.unbindThemeChangeListener) {
      this.unbindThemeChangeListener();
      this.unbindThemeChangeListener = null;
    }
  }
}

/**
 * A singleton color mode observer - binds "auto" switching logic to a single `mediaQueryList` listener
 * that can be unbound by any consumer when no longer needed.
 */
const SingletonColorModeObserver = new ColorModeObserver();

export default SingletonColorModeObserver;
