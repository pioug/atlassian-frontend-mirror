import { expect, test } from '@af/integration-testing';

// Run the same a11y scenario against both states of the
// platform-dst-top-layer feature gate so the FF-on top-layer adapter
// is held to the same axe contract as the FF-off legacy path.
const FLAG_STATES = [
	{ label: 'FF-off (legacy popper.js)', featureFlag: 'platform-dst-top-layer=false' },
	{ label: 'FF-on (top-layer adapter)', featureFlag: 'platform-dst-top-layer=true' },
] as const;

for (const { label, featureFlag } of FLAG_STATES) {
	test(`Popper should pass basic aXe audit [${label}]`, async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/01-scroll-container.tsx')>(
			'design-system',
			'popper',
			'scroll-container',
			{ featureFlag },
		);
		const verticalScrollIdentifier = page.getByTestId('vertical-scroll-identifier');
		const horizontalScrollIdentifier = page.getByTestId('horizontal-scroll-identifier');
		const expandedPopup = page.getByTestId('expanded-popup');

		await verticalScrollIdentifier.scrollIntoViewIfNeeded();
		await expect(verticalScrollIdentifier).toBeVisible();

		await horizontalScrollIdentifier.scrollIntoViewIfNeeded();
		await expect(expandedPopup).toBeVisible();
	});
}
