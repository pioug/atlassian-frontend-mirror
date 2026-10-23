/* eslint-disable compat/compat */
/* global expect */
/**
 * Patches `toBeVisible()` to understand popover and dialog visibility.
 *
 * jest-dom's `toBeVisible()` does not know about the Popover API. In real
 * browsers the UA stylesheet hides `[popover]` with `display: none`, but
 * jsdom has no such stylesheet - so closed popovers incorrectly appear visible.
 *
 * Raw jest-dom results in jsdom:
 *
 *   closed popover / child  → true  (WRONG - should be false)
 *   open popover / child    → true  (correct)
 *   closed dialog / child   → false (correct - jsdom natively hides <dialog>)
 *   open dialog / child     → true  (correct)
 *
 * The patch walks the element and its ancestors with jest-dom's own rules (`display`,
 * `visibility`, `opacity`, `hidden`, `<details>`), and adds the browser's UA rules for top-layer
 * hosts:
 *   1. A closed popover or dialog hides its subtree.
 *   2. An open popover or dialog is not hidden by its own style. In jsdom that style can come from
 *      author CSS that a `:popover-open` rule (not supported in jsdom) would override, or from
 *      the JavaScript positioning fallback's inline `opacity: 0`, which a browser removes once
 *      the popover has a layout.
 *
 *   3. Above an open popover or modal dialog, an ancestor's `opacity` does not apply: a top-layer element is painted
 *      outside its ancestors' stacking contexts.
 *
 * Everything else still applies, as in a browser: an element hidden by its own style, or by an
 * ancestor below the host, is not visible. Above the host, `display: none`, `visibility` and
 * `hidden` still hide it (measured in Chromium, Firefox and WebKit).
 *
 * Must load via `setupFilesAfterEnv` (after jest-dom registers its matchers).
 * Polyfills live in `./polyfill` (loaded via `setupFiles`).
 */

// Delegating to jest-dom's matcher; types come from @testing-library/jest-dom.
// eslint-disable-next-line import/no-extraneous-dependencies
import { toBeVisible as originalToBeVisible } from '@testing-library/jest-dom/matchers';

type TTopLayerState = 'open' | 'closed' | null;

/**
 * The state of the element as a popover or dialog host: 'open', 'closed', or null if it is
 * neither.
 */
function getTopLayerState(element: Element): TTopLayerState {
	if (element.hasAttribute('popover')) {
		return element.hasAttribute('data-popover-open') ? 'open' : 'closed';
	}
	if (element.nodeName === 'DIALOG') {
		return element.hasAttribute('open') ? 'open' : 'closed';
	}
	return null;
}

/**
 * Whether an open host is in the top layer: an open popover, or a modal dialog. A dialog opened
 * with `show()` stays in its ancestors' stacking contexts.
 */
function isInTopLayer(element: Element): boolean {
	if (element.hasAttribute('popover')) {
		return true;
	}
	try {
		return element.matches(':modal');
	} catch {
		// `:modal` is answered by the testing polyfill; without it, assume a modal dialog.
		return true;
	}
}

function getTopLayerType(element: Element): string {
	return element.hasAttribute('popover') ? 'popover' : 'dialog';
}

// jest-dom's style rule. `opacity` is skipped above a top-layer host (rule 3 above).
function isStyleVisible({
	element,
	isAboveOpenHost,
}: {
	element: Element;
	isAboveOpenHost: boolean;
}): boolean {
	const view = element.ownerDocument.defaultView;
	if (!view) {
		return true;
	}
	const { display, visibility, opacity } = view.getComputedStyle(element);
	return (
		display !== 'none' &&
		visibility !== 'hidden' &&
		visibility !== 'collapse' &&
		(isAboveOpenHost || opacity !== '0')
	);
}

// jest-dom's attribute rule: `hidden`, and a closed `<details>` hides all but its `<summary>`.
function isAttributeVisible({
	element,
	previousElement,
}: {
	element: Element;
	previousElement: Element | null;
}): boolean {
	if (element.hasAttribute('hidden')) {
		return false;
	}
	if (element.nodeName !== 'DETAILS' || previousElement?.nodeName === 'SUMMARY') {
		return true;
	}
	return element.hasAttribute('open');
}

type TVisibility = { isVisible: true } | { isVisible: false; closedHost: Element | null };

/**
 * Visibility as a browser would report it. `closedHost` is the closed popover or dialog that
 * hides the element, if that is the reason.
 */
function getVisibility(element: Element): TVisibility {
	if (element.ownerDocument !== element.getRootNode({ composed: true })) {
		return { isVisible: false, closedHost: null };
	}
	let previousElement: Element | null = null;
	let isAboveOpenHost = false;
	for (
		let current: Element | null = element;
		current;
		previousElement = current, current = current.parentElement
	) {
		const topLayerState = getTopLayerState(current);
		if (topLayerState === 'closed') {
			return { isVisible: false, closedHost: current };
		}
		if (!isAttributeVisible({ element: current, previousElement })) {
			return { isVisible: false, closedHost: null };
		}
		// An open host's own style is not checked (rule 2 above).
		if (topLayerState === 'open') {
			isAboveOpenHost = isAboveOpenHost || isInTopLayer(current);
		} else if (!isStyleVisible({ element: current, isAboveOpenHost })) {
			return { isVisible: false, closedHost: null };
		}
	}
	return { isVisible: true };
}

/**
 * The nearest open popover or dialog that contains the element, for the message.
 */
function getNearestOpenHost(element: Element): Element | null {
	for (let current: Element | null = element; current; current = current.parentElement) {
		if (getTopLayerState(current) === 'open') {
			return current;
		}
	}
	return null;
}

// `expect` is registered globally by jest before this file runs.
declare const expect: {
	extend(matchers: Record<string, unknown>): void;
};

expect.extend({
	toBeVisible(this: unknown, element: Element) {
		const originalResult = (
			originalToBeVisible as unknown as (
				this: unknown,
				element: Element,
			) => {
				pass: boolean;
				message: () => string;
			}
		).call(this, element);
		const visibility = getVisibility(element);
		if (visibility.isVisible === originalResult.pass) {
			return originalResult;
		}

		if (!visibility.isVisible) {
			// Only a closed top-layer host makes jsdom say "visible" when a browser would not.
			const { closedHost } = visibility;
			const type = closedHost ? getTopLayerType(closedHost) : 'top-layer element';
			return {
				pass: false,
				message: () => `expected element to be visible, but it is inside a closed ${type}`,
			};
		}

		// jsdom hides an open top-layer host with a style that a browser would not apply.
		const openHost = getNearestOpenHost(element);
		const type = openHost ? getTopLayerType(openHost) : 'top-layer element';
		return {
			pass: true,
			message: () => `expected element not to be visible, but it is inside an open ${type}`,
		};
	},
});
