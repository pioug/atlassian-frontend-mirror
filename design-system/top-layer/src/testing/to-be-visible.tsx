/* eslint-disable compat/compat */
/* global expect */
/**
 * Patches `toBeVisible()` to understand popover and dialog visibility.
 *
 * jest-dom's `toBeVisible()` does not know about the Popover API. In real
 * browsers the UA stylesheet hides `[popover]` with `display: none`, but
 * jsdom has no such stylesheet — so closed popovers incorrectly appear visible.
 *
 * Raw jest-dom results in jsdom:
 *
 *   closed popover / child  → true  (WRONG — should be false)
 *   open popover / child    → true  (correct)
 *   closed dialog / child   → false (correct — jsdom natively hides <dialog>)
 *   open dialog / child     → true  (correct)
 *
 * We correct both false positives and false negatives:
 *   1. Delegate to the original first.
 *   2. If it says "visible" → check for closed top-layer hosts (false positive).
 *   3. If it says "not visible" → check for open top-layer hosts (false negative).
 *
 * Must load via `setupFilesAfterEnv` (after jest-dom registers its matchers).
 * Polyfills live in `./polyfill` (loaded via `setupFiles`).
 */

// Delegating to jest-dom's matcher; types come from @testing-library/jest-dom.
// eslint-disable-next-line import/no-extraneous-dependencies
import { toBeVisible as originalToBeVisible } from '@testing-library/jest-dom/matchers';

type TTopLayerState = 'open' | 'closed' | null;

/**
 * Finds the nearest popover or dialog ancestor (including the element itself)
 * and returns its state: 'open', 'closed', or null if no top-layer ancestor exists.
 *
 * Checking the *nearest* ancestor handles nesting correctly:
 * a closed popover inside an open popover → nearest is closed → not visible.
 */
function nearestTopLayerState(element: Element | null): TTopLayerState {
	if (!element) {
		return null;
	}

	if (element.hasAttribute('popover')) {
		return element.hasAttribute('data-popover-open') ? 'open' : 'closed';
	}

	if (element.nodeName === 'DIALOG') {
		return element.hasAttribute('open') ? 'open' : 'closed';
	}

	return nearestTopLayerState(element.parentElement);
}

function getNearestTopLayerType(element: Element): string {
	if (!element.closest) {
		return 'top-layer element';
	}

	if (element.closest('[popover]')) {
		return 'popover';
	}

	return 'dialog';
}

// `expect` is registered globally by jest before this file runs.
declare const expect: {
	extend(matchers: Record<string, unknown>): void;
};

expect.extend({
	toBeVisible(this: unknown, element: Element) {
		const originalResult = (
			originalToBeVisible as unknown as (this: unknown, element: Element) => {
				pass: boolean;
				message: () => string;
			}
		).call(this, element);
		const topLayerState = nearestTopLayerState(element);

		if (originalResult.pass) {
			// Original says visible — override if nearest top-layer host is closed.
			if (topLayerState === 'closed') {
				return {
					pass: false,
					message: () =>
						`expected element to be visible, but it is inside a closed ${getNearestTopLayerType(element)}`,
				};
			}
			return originalResult;
		}

		// Original says not visible — override if nearest top-layer host is open.
		// jsdom may hide [popover] elements even when they are logically open.
		if (topLayerState === 'open') {
			return {
				pass: true,
				message: () =>
					`expected element not to be visible, but it is inside an open ${getNearestTopLayerType(element)}`,
			};
		}

		return originalResult;
	},
});
