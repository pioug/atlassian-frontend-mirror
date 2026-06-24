import { expect, test } from '@af/integration-testing';

/**
 * Popper: FF-on `isReferenceHidden` / `hasPopperEscaped` synthesis.
 *
 * The flag-on adapter measures the anchor against the visual viewport
 * plus every scrollable ancestor and flows the booleans through the
 * render-prop. These specs exercise the cases that unit tests cannot
 * (real layout, real scroll, real ResizeObserver).
 */

const featureFlag = 'platform-dst-top-layer';

test('isReferenceHidden is true when anchor is scrolled out of a clipping ancestor', async ({
	page,
}) => {
	await page.visitExample<typeof import('../../../examples/04-flag-reference-hidden.tsx')>(
		'design-system',
		'popper',
		'flag-reference-hidden',
		{ featureFlag },
	);

	const popper = page.getByTestId('popper');
	await expect(popper).toHaveAttribute('data-is-reference-hidden', 'true');
	await expect(popper).toHaveCSS('opacity', '0');
});

test('isReferenceHidden is false when anchor is visible inside a clipping ancestor', async ({
	page,
}) => {
	await page.visitExample<typeof import('../../../examples/05-flag-reference-visible.tsx')>(
		'design-system',
		'popper',
		'flag-reference-visible',
		{ featureFlag },
	);

	const popper = page.getByTestId('popper');
	await expect(popper).toHaveAttribute('data-is-reference-hidden', 'false');
	await expect(popper).toHaveCSS('opacity', '1');
});

test('isReferenceHidden flips back to false when the anchor is scrolled into view', async ({
	page,
}) => {
	await page.visitExample<typeof import('../../../examples/04-flag-reference-hidden.tsx')>(
		'design-system',
		'popper',
		'flag-reference-hidden',
		{ featureFlag },
	);

	const popper = page.getByTestId('popper');
	await expect(popper).toHaveAttribute('data-is-reference-hidden', 'true');

	// Scroll the clipping ancestor back to the top; the anchor enters
	// the visible viewport and the visibility hook must re-measure to
	// `false`.
	await page.getByTestId('scroller').evaluate((node) => {
		node.scrollTop = 0;
	});

	await expect(popper).toHaveAttribute('data-is-reference-hidden', 'false');
});
