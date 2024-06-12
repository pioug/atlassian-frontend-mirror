import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { COLOR_MODE_ATTRIBUTE, THEME_DATA_ATTRIBUTE } from './constants';
import getGlobalTheme from './get-global-theme';
import { type ActiveThemeState } from './theme-config';

type ThemeCallback = (theme: Partial<ActiveThemeState>) => unknown;

/**
 * A MutationObserver which watches the `<html>` element for changes to the theme.
 *
 * In React, use the {@link useThemeObserver `useThemeObserver`} hook instead.
 *
 * @param {function} callback - A callback function which fires when the theme changes.
 *
 * @example
 * ```
 * const observer = new ThemeMutationObserver((theme) => {});
 * observer.observe();
 * ```
 */
export default class ThemeMutationObserver {
	legacyObserver: MutationObserver | null = null;
	static observer: MutationObserver | null = null;
	static callbacks: Set<ThemeCallback> = new Set();
	callback: ThemeCallback;

	constructor(callback: ThemeCallback) {
		this.callback = callback;
		if (
			getBooleanFF('platform.design-system-team.mutation-observer-performance-improvement_8usdg')
		) {
			ThemeMutationObserver.callbacks.add(callback);
		}
	}

	observe() {
		if (
			getBooleanFF('platform.design-system-team.mutation-observer-performance-improvement_8usdg')
		) {
			if (!ThemeMutationObserver.observer) {
				ThemeMutationObserver.observer = new MutationObserver(() => {
					const theme = getGlobalTheme();
					ThemeMutationObserver.callbacks.forEach((callback) => callback(theme));
				});
				// Observer only needs to be configured once
				ThemeMutationObserver.observer.observe(document.documentElement, {
					attributeFilter: [THEME_DATA_ATTRIBUTE, COLOR_MODE_ATTRIBUTE],
				});
			}
		} else {
			if (!this.legacyObserver) {
				this.legacyObserver = new MutationObserver(() => {
					this.callback(getGlobalTheme());
				});
			}

			this.legacyObserver.observe(document.documentElement, {
				attributeFilter: [THEME_DATA_ATTRIBUTE, COLOR_MODE_ATTRIBUTE],
			});
		}
	}

	disconnect() {
		if (
			getBooleanFF('platform.design-system-team.mutation-observer-performance-improvement_8usdg')
		) {
			if (this.callback) {
				ThemeMutationObserver.callbacks.delete(this.callback);
			}
			if (ThemeMutationObserver.callbacks.size === 0 && ThemeMutationObserver.observer) {
				ThemeMutationObserver.observer.disconnect();
				ThemeMutationObserver.observer = null;
			}
		} else {
			this.legacyObserver && this.legacyObserver.disconnect();
		}
	}
}
