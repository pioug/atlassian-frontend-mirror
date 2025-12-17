import { bind, type UnbindFn } from 'bind-event-listener';

import { CONTRAST_MODE_ATTRIBUTE } from '../constants';

import { moreContrastMediaQuery } from './theme-loading';

const isMatchMediaAvailable = typeof window !== 'undefined' && 'matchMedia' in window;

/**
 * Updates the current theme when the system contrast preference changes. Should be bound
 * to an event listener listening on the '(prefers-contrast: more)' query
 * @param e The event representing a change in system theme.
 */
function checkNativeListener(e: MediaQueryListEvent) {
	const element = document.documentElement;

	element.setAttribute(CONTRAST_MODE_ATTRIBUTE, e.matches ? 'more' : 'no-preference');
}

const contrastModeMql = isMatchMediaAvailable && window.matchMedia(moreContrastMediaQuery);

class ContrastModeObserver {
	unbindContrastChangeListener: UnbindFn | null = null;

	getContrastMode() {
		if (!contrastModeMql) {
			return 'no-preference';
		}

		return contrastModeMql?.matches ? 'more' : 'no-preference';
	}

	bind(): void {
		if (contrastModeMql && this.unbindContrastChangeListener === null) {
			this.unbindContrastChangeListener = bind(contrastModeMql, {
				type: 'change',
				listener: checkNativeListener,
			});
		}
	}

	unbind(): void {
		if (this.unbindContrastChangeListener) {
			this.unbindContrastChangeListener();
			this.unbindContrastChangeListener = null;
		}
	}
}

/**
 * A singleton contrast mode observer - binds "auto" switching logic to a single `mediaQueryList` listener
 * that can be unbound by any consumer when no longer needed.
 */
const SingletonContrastModeObserver = new ContrastModeObserver();

export default SingletonContrastModeObserver;
