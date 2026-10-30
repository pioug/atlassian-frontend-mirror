import { warnFallbackFailure } from './warn-fallback-failure';

/**
 * Measures `value` as the computed `margin-left` of a hidden probe inside
 * `container`. Returns `null` when the environment cannot measure, and `0` when
 * the computed value is not a number.
 */
function measureWithProbe({
	value,
	container,
}: {
	value: string;
	container: HTMLElement;
}): number | null {
	// Reached through the container rather than the global, so a popover in
	// another document still measures and one with no view degrades gracefully.
	const view = container.ownerDocument.defaultView;
	if (!view) {
		return null;
	}

	const probe = container.ownerDocument.createElement('div');
	probe.style.position = 'absolute';
	probe.style.visibility = 'hidden';
	probe.style.pointerEvents = 'none';
	probe.style.height = '0';
	probe.style.padding = '0';
	probe.style.border = '0';
	// `margin-left`, not `width`, because `width` clamps a negative value to `0`.
	// `getComputedStyle` returns the resolved pixel value of a margin, even when
	// the source is a token, `calc()` or `var()`.
	probe.style.marginLeft = value;
	// Hidden from assistive technology and from events. This also protects
	// consumer code that walks the DOM (for example `getElementsByTagName('div')`).
	probe.setAttribute('aria-hidden', 'true');
	probe.setAttribute('inert', '');

	try {
		container.appendChild(probe);
		const pixels = parseFloat(view.getComputedStyle(probe).marginLeft);
		return Number.isFinite(pixels) ? pixels : 0;
	} catch (error) {
		warnFallbackFailure({ error });
		return null;
	} finally {
		// `remove()` rather than `removeChild()`: consumer code may already have
		// detached the probe, which must not throw out of a layout effect.
		probe.remove();
	}
}

/**
 * Resolves a CSS length value to a pixel number using a hidden DOM probe.
 *
 * Used by the JavaScript positioning fallback, where a consumer offset can be a
 * number, a `${n}px` string, a token, a `calc()` expression, a viewport unit,
 * and so on. Parsing arbitrary CSS in JavaScript is fragile, and impossible for
 * `calc(var(...))` without a layout context, so the browser does the math
 * instead. The probe is appended to `container` so it inherits the popover's
 * containing block, font size and custom-property scope. Anything unmeasurable
 * resolves to `0`.
 *
 * Costs one synchronous style and layout flush per call that reaches the probe.
 * Deliberately NOT memoised: a token can be retargeted by an override on the
 * consumer's wrapper, a viewport unit changes on resize and an `em` on a font
 * change, so no (container, value) cache can be proven fresh. The caller decides
 * when to re-resolve; see `applyJavaScriptFallbackPositioning`.
 */
export function resolveCssLengthToPixels({
	value,
	container,
}: {
	value: number | string;
	container: HTMLElement;
}): number {
	if (typeof value === 'number') {
		return value;
	}

	// Fast path: consumers occasionally pass `'0'` instead of the number `0`.
	if (value === '0' || value === '-0') {
		return 0;
	}

	// Fast path: bare `${n}px` strings come from `resolvePlacement`, so this avoids
	// a reflow for the common case.
	const pixelMatch = value.match(/^(-?\d+(?:\.\d+)?)px$/);
	if (pixelMatch) {
		return Number(pixelMatch[1]);
	}

	return measureWithProbe({ value, container }) ?? 0;
}
