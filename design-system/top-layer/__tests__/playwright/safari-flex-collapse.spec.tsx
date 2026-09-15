/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@af/integration-testing';

/**
 * Deterministic pass/fail gate for the Safari top-layer flex-collapse bug on
 * `Popover`: open the surface and assert the scroll body has a non-zero height.
 * The primary guard is the WebKit VR test (`safari-flex-collapse.vr.tsx`); this
 * spec adds a blocking assertion. The surface is left open to avoid the known
 * Playwright-WebKit close-hang for this package.
 *
 * Only `Popover` is covered — the fix is intentionally not applied to `Dialog`.
 * See `notes/decisions/safari-popover-flex-collapse.md`.
 */
test.describe('Safari top-layer flex collapse', () => {
	test('popover scroll body does not collapse', async ({ page, skipAxeCheck }) => {
		// The unconditional viewport cap means this fixture's `<ol>` genuinely scrolls,
		// so axe's `scrollable-region-focusable` fires on its filler rows. A focusable
		// control is not free here: this is a `role="dialog"` popover, so it would take
		// initial focus and draw a ring into the WebKit VR baselines this fixture
		// exists to produce.
		skipAxeCheck();

		await page.visitExample<
			typeof import('../../examples/154-testing-safari-flex-collapse-max-height.vr.ap.tsx')
		>('design-system', 'top-layer', 'testing-safari-flex-collapse-max-height');

		await page.getByTestId('popover-trigger').click();

		const scrollBody = page.getByTestId('popover-scroll-body');
		await expect(scrollBody).toBeVisible();

		const clientHeight = await scrollBody.evaluate((element) => element.clientHeight);
		expect(clientHeight).toBeGreaterThan(0);
	});
});
