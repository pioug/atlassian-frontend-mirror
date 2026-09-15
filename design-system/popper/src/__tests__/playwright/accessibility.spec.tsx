import { expect, test } from '@af/integration-testing';

const TOP_LAYER_FLAG = 'platform-dst-top-layer';

// A BARE key is the only spelling that turns a flag ON; both `'…=true'` and
// `'…=false'` leave it OFF.
const FLAG_STATES = [
	{ label: 'FF-off (legacy popper.js)', featureFlag: undefined },
	{ label: 'FF-on (top-layer adapter)', featureFlag: TOP_LAYER_FLAG },
] as const;

for (const { label, featureFlag } of FLAG_STATES) {
	const params: { [key: string]: string | boolean } = featureFlag ? { featureFlag } : {};

	test(`Popper should pass basic aXe audit [${label}]`, async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/01-scroll-container.tsx')>(
			'design-system',
			'popper',
			'scroll-container',
			params,
		);
		const verticalScrollIdentifier = page.getByTestId('vertical-scroll-identifier');
		const horizontalScrollIdentifier = page.getByTestId('horizontal-scroll-identifier');
		const expandedPopup = page.getByTestId('expanded-popup');

		await verticalScrollIdentifier.scrollIntoViewIfNeeded();
		await expect(verticalScrollIdentifier).toBeVisible();

		await horizontalScrollIdentifier.scrollIntoViewIfNeeded();
		await expect(expandedPopup).toBeVisible();

		// The two FLAG_STATES have to actually BE two states, and an axe audit
		// passes either way. The one difference visible from here is that the
		// adapter wraps the consumer's element in a `[popover]` host.
		await expect
			.poll(() => expandedPopup.evaluate((element) => element.closest('[popover]') !== null))
			.toBe(featureFlag !== undefined);
	});
}
