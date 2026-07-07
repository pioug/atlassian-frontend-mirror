import { expect, test } from '@af/integration-testing';

/**
 * Inline message: focus contract on the top-layer code path.
 *
 * `InlineMessage` renders a trigger button that opens a `role="dialog"`
 * popover (via the `@atlaskit/popup` it composes). Per WCAG 2.4.3 (Focus
 * Order) and the top-layer focus rules:
 *
 * 1. Initial focus moves to the first focusable element inside the popover on
 *    open.
 * 2. Escape closes the popover and restores focus to the trigger.
 * 3. Tab moves focus between focusable elements within the popover.
 *
 * `InlineMessage` has no local `@atlaskit/top-layer` import; the top-layer
 * rendering path is provided by the `@atlaskit/popup` it composes, gated on
 * the `platform-dst-top-layer` flag.
 *
 * See: `platform/packages/design-system/top-layer/notes/architecture/focus.md`.
 */

const featureFlag = 'platform-dst-top-layer';

// InlineMessage examples may carry pre-existing accessibility violations
// unrelated to the top-layer focus contract under test here.
test.beforeEach(({ skipAxeCheck }) => {
	skipAxeCheck();
});

test.describe('Inline message: top-layer focus contract', () => {
	test('initial focus: focus moves to the first focusable on open', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'inline-message',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		const trigger = page.getByTestId('inline-message--button');
		await trigger.click();

		const popup = page.getByTestId('inline-message--popup--content');
		await expect(popup).toBeVisible();

		await expect(page.getByTestId('inline-message-first-button')).toBeFocused();
	});

	test('focus restoration: Escape restores focus to the trigger', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'inline-message',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		const trigger = page.getByTestId('inline-message--button');
		await trigger.click();

		const popup = page.getByTestId('inline-message--popup--content');
		await expect(popup).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(popup).toBeHidden();
		await expect(trigger).toBeFocused();
	});

	test('focus movement: Tab moves focus between focusable elements within the popover', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'inline-message',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		const trigger = page.getByTestId('inline-message--button');
		await trigger.click();

		const popup = page.getByTestId('inline-message--popup--content');
		await expect(popup).toBeVisible();

		const first = page.getByTestId('inline-message-first-button');
		const second = page.getByTestId('inline-message-second-button');

		await expect(first).toBeFocused();
		await page.keyboard.press('Tab');
		await expect(second).toBeFocused();
	});
});
