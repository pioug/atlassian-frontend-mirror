import { expect, test } from '@af/integration-testing';

/**
 * Popper: FF-on virtual-element anchor branch.
 *
 * The flag-on adapter bridges `VirtualElement` references through
 * `useAnchoredPopoverAtPoint`, which latches `getPoint` once per activation. This
 * spec asserts the surface mounts at all for a virtual anchor; reposition on
 * anchor change is covered by `top-layer-anchor-toggle`.
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
