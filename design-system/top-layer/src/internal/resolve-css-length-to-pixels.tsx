const elementCaches = new WeakMap<HTMLElement, Map<string, number>>();

function canCacheResolvedLength(value: string): boolean {
	// Custom-property values can be retargeted by inline overrides on the
	// consumer's wrapper, so we cannot prove a cached pixel value is still valid.
	return !value.includes('var(');
}

function getCachedResolvedLength({
	element,
	value,
}: {
	element: HTMLElement;
	value: string;
}): number | null {
	if (!canCacheResolvedLength(value)) {
		return null;
	}

	const cacheForElement = elementCaches.get(element);
	return cacheForElement?.get(value) ?? null;
}

function cacheResolvedLength({
	element,
	value,
	result,
}: {
	element: HTMLElement;
	value: string;
	result: number;
}) {
	if (!canCacheResolvedLength(value)) {
		return;
	}

	const cacheForElement = elementCaches.get(element) ?? new Map<string, number>();
	cacheForElement.set(value, result);
	elementCaches.set(element, cacheForElement);
}

/**
 * Resolves a CSS length value to a pixel number using a hidden DOM probe.
 *
 * Used by the JS positioning fallback: consumer offsets can be numbers,
 * `${n}px` strings, tokenised `var(--ds-space-100, 8px)` strings, `calc()`
 * expressions, viewport units, etc. Parsing arbitrary CSS in JS is fragile
 * (and impossible for `calc(var(...))` without a layout context), so we let
 * the browser do the math.
 *
 * The probe is appended to `container` so it inherits the same containing
 * block, font size, and custom-property scope as the popover.
 *
 * Cost: one synchronous reflow on first cacheable resolution per
 * (container, value) pair, then a `WeakMap` lookup. Resolutions involving
 * `var(` are intentionally not cached.
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

	// Fast path: unitless zero is universally zero pixels - accept `'0'` and
	// `'-0'` without a probe. (Consumers occasionally pass `'0'` instead of
	// the number `0`.)
	if (value === '0' || value === '-0') {
		return 0;
	}

	// Fast path: bare `${n}px` strings come from the consumer normalisation
	// in `getPlacement`. Avoid a reflow when we can.
	const pxMatch = value.match(/^(-?\d+(?:\.\d+)?)px$/);
	if (pxMatch) {
		return Number(pxMatch[1]);
	}

	const cached = getCachedResolvedLength({ element: container, value });
	if (cached !== null) {
		return cached;
	}

	const probe = container.ownerDocument.createElement('div');
	probe.style.position = 'absolute';
	probe.style.visibility = 'hidden';
	probe.style.pointerEvents = 'none';
	probe.style.height = '0';
	probe.style.padding = '0';
	probe.style.border = '0';
	// `width` clamps negatives to 0; use `margin-left` instead so signs are
	// preserved. `getComputedStyle` returns the resolved pixel value for
	// margin-* properties even when the source was a token / calc / var.
	probe.style.marginLeft = value;
	// Hide the probe from assistive tech and event targeting; defensive
	// against `getElementsByTagName('div')` walks in consumer code.
	probe.setAttribute('aria-hidden', 'true');
	probe.setAttribute('inert', '');
	container.appendChild(probe);
	const resolved = parseFloat(getComputedStyle(probe).marginLeft);
	container.removeChild(probe);
	const result = Number.isFinite(resolved) ? resolved : 0;

	cacheResolvedLength({ element: container, value, result });

	return result;
}
