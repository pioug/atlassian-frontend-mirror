import { focusableElementSelectors } from './focusable-element-selectors';

const focusableAreaSelector = focusableElementSelectors.join(',');

function isVisible({ element }: { element: HTMLElement }): boolean {
	// Visibility filtering must not break focus navigation when the API is unsupported.
	if (typeof element.checkVisibility !== 'function') {
		return true;
	}

	try {
		// Exclude elements hidden by display, content-visibility or visibility because
		// they cannot receive focus. Offscreen, occluded and opacity-zero elements can
		// receive focus, so they intentionally remain included.
		return element.checkVisibility({ checkVisibilityCSS: true });
	} catch {
		return true;
	}
}

/**
 * Whether `element` can take focus: the browser can focus it (a focusable area), and it is not
 * disabled, not in an `[inert]` subtree and not hidden. Tab does not need to reach it, so
 * `tabindex="-1"`, `aria-disabled` and `aria-hidden` do not matter. This is the check of the
 * browser's autofocus delegate. `getFocusables` adds the Tab order rules on top.
 */
export function canTakeFocus({ element }: { element: Element }): boolean {
	if (!(element instanceof HTMLElement)) {
		return false;
	}
	if (!element.matches(focusableAreaSelector) || element.matches(':disabled')) {
		return false;
	}
	if (element.closest('[inert]')) {
		return false;
	}
	return isVisible({ element });
}
