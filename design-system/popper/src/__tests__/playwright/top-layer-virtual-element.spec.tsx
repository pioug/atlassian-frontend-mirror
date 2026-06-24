import { expect, test } from '@af/integration-testing';

/**
 * Popper: FF-on virtual-element anchor branch.
 *
 * The flag-on adapter bridges `VirtualElement` references through
 * `useAnchorPositionAtPoint`, which owns a synthetic anchor and
 * latches `getPoint` per `isEnabled` activation. This spec asserts
 * the surface mounts at all for a virtual anchor (the FF-off path
 * is covered separately by `unit/index.tsx`).
 *
 * Note: the FF-on adapter does NOT re-read the virtual rect while the
 * popper stays open; the latch only re-fires when `isEnabled` toggles
 * (the anchor becomes null and then non-null again). Reposition on
 * rect change is therefore covered by `top-layer-anchor-toggle`, not
 * here.
 */
const featureFlag = 'platform-dst-top-layer';

test('VirtualElement anchor renders the popover surface', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/09-flag-virtual-element.tsx')>(
		'design-system',
		'popper',
		'flag-virtual-element',
		{ featureFlag },
	);

	await expect(page.getByTestId('popper')).toBeVisible();
});
