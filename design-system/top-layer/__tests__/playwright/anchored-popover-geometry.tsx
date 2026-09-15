import invariant from 'tiny-invariant';

import { expect, type Page } from '@af/integration-testing';

/**
 * Shared measuring for the two `useAnchoredPopover` sizing suites
 * (`fit-available-space.spec.tsx` and `anchored-popover-size.spec.tsx`).
 *
 * Per `notes/rules/testing.md`, size is asserted as observable GEOMETRY rather
 * than as CSS declarations. That rule was written for this recipe: the
 * `shouldFitViewport` bug shipped for months emitting real declarations that
 * capped nothing, while every test covering it asserted a declaration and passed.
 */

// Mirrored from `src/internal/anchored-popover-size.tsx` and `resolvePlacement`'s
// default gap. Duplicated deliberately: a test that imported these would still
// pass if both sides changed together.
export const VIEWPORT_PADDING = 5;
export const DEFAULT_GAP = 8;
export const FALLBACK_MINIMUM_MAIN_AXIS_SIZE = 150;

/**
 * Sub-pixel layout differences between Chromium, Firefox and WebKit.
 */
export const TOLERANCE = 1;

/**
 * The margin box a fitting popover of `size` occupies along the placement axis,
 * which under CSS Anchor Positioning is the flip threshold. The JavaScript
 * fallback does not share it, since `computeFallbackPosition` compares raw space
 * rather than overflowing a cell.
 *
 * Parameterised, because an anchor-relative placement axis is floored at the
 * ANCHOR's size instead.
 */
export function marginBoxAround({ size }: { size: number }): number {
	return size + DEFAULT_GAP + VIEWPORT_PADDING;
}

/**
 * The flip threshold at the DEFAULT floor, which is what a fitting popover with
 * no anchor-relative placement axis and no `placement.minSize` gets. Only valid
 * where the clamp in `defaultFloor` does not bind; the short-viewport case
 * computes its own.
 */
export const MINIMUM_MARGIN_BOX: number = marginBoxAround({
	size: FALLBACK_MINIMUM_MAIN_AXIS_SIZE,
});

/**
 * Mirrors `getDefaultPlacementAxisFloor`: the 150px constant, clamped so the
 * roomier of the two cells beside the anchor can always hold its margin box.
 */
export function defaultFloor({
	viewportExtent,
	anchorExtent,
}: {
	viewportExtent: number;
	anchorExtent: number;
}): number {
	return Math.min(
		FALLBACK_MINIMUM_MAIN_AXIS_SIZE,
		Math.max(0, (viewportExtent - anchorExtent) / 2 - DEFAULT_GAP - VIEWPORT_PADDING),
	);
}

/**
 * The size a fitting popover should end up at under CSS Anchor Positioning. The
 * cap is the cell less the gap and the reserved viewport padding; the floor wins
 * over the cap, which is what makes a too-small cell overflow. Pass `floor` to
 * model an explicit `placement.minSize`, including `0`.
 */
export function expectedFittedSize({
	cell,
	content,
	floor = FALLBACK_MINIMUM_MAIN_AXIS_SIZE,
}: {
	cell: number;
	content: number;
	floor?: number;
}): number {
	return Math.max(floor, Math.min(content, cell - VIEWPORT_PADDING - DEFAULT_GAP));
}

export type TRect = { x: number; y: number; width: number; height: number };

export type TGeometry = {
	trigger: TRect;
	host: TRect;
	viewport: { width: number; height: number };
	/**
	 * Probed at runtime rather than keyed off `browserName`, which would silently
	 * stop testing the fallback the day the Playwright pin moves to Firefox 147+.
	 * Not meaningful under `forceFallbackPositioning`, where the probe still
	 * reports support.
	 */
	isCssAnchorPositioning: boolean;
};

/**
 * Reads the trigger, the popover HOST (the element the caps and margins are
 * written to) and the viewport in a single frame. One `page.evaluate` rather than
 * `locator.boundingBox()`, which is unreliable here: on WebKit it reported the
 * trigger at `{x: 0, width: 44}` while the element's own rect was
 * `{x: 280, width: 80}`.
 *
 * `null` until the popover is POSITIONED, not merely present: the JavaScript
 * fallback keeps it at `opacity: 0` until its `ResizeObserver` delivers a first
 * measurement, and `toBeVisible()` ignores opacity.
 */
export async function readGeometry({ page }: { page: Page }): Promise<TGeometry | null> {
	return page.evaluate(() => {
		function toRect(element: Element | null | undefined) {
			const rect = element?.getBoundingClientRect();
			return rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null;
		}

		const content = document.querySelector('[data-testid="popover-content"]');
		const host = content?.closest('[popover]');
		if (!host || window.getComputedStyle(host).opacity !== '1') {
			return null;
		}

		const trigger = toRect(document.querySelector('[data-testid="popover-trigger"]'));
		const hostRect = toRect(host);
		if (!trigger || !hostRect) {
			return null;
		}

		return {
			trigger,
			host: hostRect,
			viewport: { width: window.innerWidth, height: window.innerHeight },
			isCssAnchorPositioning: CSS.supports('anchor-name', '--a'),
		};
	});
}

/**
 * Retries `assert` against a fresh measurement until it holds. Engines do not all
 * resolve `position-area` and `position-try-fallbacks` in the frame the styles are
 * written: WebKit lays the popover out on the requested side first and holds that
 * intermediate box stable for several frames, so a "wait for N identical frames"
 * settle reports a plausible but wrong measurement.
 */
export async function expectGeometry({
	page,
	assert,
}: {
	page: Page;
	assert: (geometry: TGeometry) => void;
}): Promise<void> {
	await expect(async () => {
		const geometry = await readGeometry({ page });
		invariant(geometry, 'popover should be positioned');
		assert(geometry);
	}).toPass({ timeout: 10_000, intervals: [50, 100, 200, 500] });
}

/**
 * True on both paths whatever the requested sizes, and the assertion the shipped
 * bug failed.
 */
export function expectOnScreen({ host, viewport }: TGeometry): void {
	expect(host.x).toBeGreaterThanOrEqual(-TOLERANCE);
	expect(host.x + host.width).toBeLessThanOrEqual(viewport.width + TOLERANCE);
	expect(host.y).toBeGreaterThanOrEqual(-TOLERANCE);
	expect(host.y + host.height).toBeLessThanOrEqual(viewport.height + TOLERANCE);
}
