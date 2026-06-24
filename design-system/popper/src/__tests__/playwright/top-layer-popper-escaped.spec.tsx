import { expect, test } from '@af/integration-testing';

/**
 * Popper: `hasPopperEscaped` flows through the render-prop under the
 * platform-dst-top-layer flag.
 *
 * Fixture: anchor sits at the right edge of a 240x120 clipping
 * ancestor; a 240px-wide popover is placed to the right of the anchor,
 * so the popover's bounding rect lies entirely outside the clipper.
 * The hook should report `hasPopperEscaped=true`.
 */

test('hasPopperEscaped is true when popper renders outside its clipping ancestor', async ({
	page,
}) => {
	await page.visitExample<typeof import('../../../examples/08-flag-popper-escaped.tsx')>(
		'design-system',
		'popper',
		'flag-popper-escaped',
		{ featureFlag: 'platform-dst-top-layer=true' },
	);
	const popper = page.getByTestId('popper');
	await expect(popper).toBeVisible();
	await expect(popper).toHaveAttribute('data-has-popper-escaped', 'true');
});
