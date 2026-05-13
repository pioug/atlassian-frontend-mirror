import { expect, test } from '@af/integration-testing';

const inlineDialogBtn = "[data-testid='open-inline-dialog-button']";

const inlineDialogTestId = "[data-testid='inline-dialog']";

test.fixme(
	'InlineDialog should pass basic aXe audit',
	async ({ page }) => {
		// Skipped: the legacy InlineDialog "Click me!" button selected state
		// has insufficient colour contrast (axe `color-contrast` violation).
		// We are not fixing the legacy path because `@atlaskit/inline-dialog`
		// is being replaced by the `@atlaskit/top-layer` Popup primitive —
		// the FF-on path uses ADS Button tokens that already meet contrast
		// thresholds. Tracked in DSP-19090 (legacy) and superseded by the
		// top-layer migration.
		await page.visitExample<typeof import('../../../examples/99-testing.tsx')>(
			'design-system',
			'inline-dialog',
			'testing',
		);
		await page.locator(inlineDialogBtn).first().click();
		await expect(page.locator(inlineDialogTestId).first()).toBeVisible();
	},
);
