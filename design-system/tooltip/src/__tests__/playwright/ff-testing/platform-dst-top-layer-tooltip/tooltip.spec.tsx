/* eslint-disable testing-library/prefer-screen-queries -- Playwright `page` locators, not RTL `render` */
import invariant from 'tiny-invariant';

import { expect, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer-tooltip';

/**
 * Chromium supports `focusVisible`; `lib.dom` `FocusOptions` may lag behind.
 */
type FocusOptionsWithVisible = NonNullable<Parameters<HTMLElement['focus']>[0]> & {
	focusVisible?: boolean;
};

/**
 * Trigger gets `data-testid="${testId}--container"` from Tooltip; visible surface uses plain `testId`.
 */
const triggerTestId = 'default-tooltip--container';
const popoverTestId = 'default-tooltip--popover';
const hiddenTestId = 'default-tooltip-hidden';

test.describe('Tooltip top-layer — WCAG 1.3.2 Meaningful Sequence', () => {
	test('tooltip is rendered near trigger in DOM (no portal)', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/default-tooltip.tsx')>(
			'design-system',
			'tooltip',
			'default-tooltip',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);

		await trigger.hover();

		const tooltip = page.getByTestId(popoverTestId);
		await expect(tooltip).toBeVisible();

		const isNearTrigger = await page.evaluate((popoverId: string) => {
			const tooltipEl = document.querySelector(`[data-testid="${popoverId}"]`);
			const body = document.body;

			return tooltipEl !== null && body.lastElementChild !== tooltipEl;
		}, popoverTestId);

		expect(isNearTrigger).toBe(true);
	});
});

test.describe('Tooltip top-layer — WCAG 2.1.1 Keyboard', () => {
	test('tooltip appears on keyboard focus of trigger', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/default-tooltip.tsx')>(
			'design-system',
			'tooltip',
			'default-tooltip',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const tooltip = page.getByTestId(popoverTestId);

		await expect(tooltip).toBeHidden();

		await trigger.focus();

		await expect(tooltip).toBeVisible();
	});

	test('tooltip disappears on blur of trigger', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/default-tooltip.tsx')>(
			'design-system',
			'tooltip',
			'default-tooltip',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const tooltip = page.getByTestId(popoverTestId);

		await trigger.focus();
		await expect(tooltip).toBeVisible();

		await page.keyboard.press('Tab');

		await expect(tooltip).toBeHidden();
	});

	test('Escape key dismisses tooltip while keeping trigger focused', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/default-tooltip.tsx')>(
			'design-system',
			'tooltip',
			'default-tooltip',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const tooltip = page.getByTestId(popoverTestId);

		await trigger.focus();
		await expect(tooltip).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(tooltip).toBeHidden();
		await expect(trigger).toBeFocused();
	});
});

test.describe('Tooltip top-layer — WCAG 2.1.2 No Keyboard Trap', () => {
	test('Tab exits tooltip without trapping focus', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/default-tooltip.tsx')>(
			'design-system',
			'tooltip',
			'default-tooltip',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const tooltip = page.getByTestId(popoverTestId);

		await trigger.focus();
		await expect(tooltip).toBeVisible();

		await page.keyboard.press('Tab');

		await expect(tooltip).toBeHidden();
	});
});

test.describe('Tooltip top-layer — WCAG 2.4.3 Focus Order', () => {
	test('focus remains on trigger after tooltip closes', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/default-tooltip.tsx')>(
			'design-system',
			'tooltip',
			'default-tooltip',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const tooltip = page.getByTestId(popoverTestId);

		await trigger.focus();
		await expect(tooltip).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(trigger).toBeFocused();
		await expect(tooltip).toBeHidden();
	});
});

test.describe('Tooltip top-layer — WCAG 2.4.7 Focus Visible', () => {
	test('trigger shows focus-visible ring when keyboard-focused', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/default-tooltip.tsx')>(
			'design-system',
			'tooltip',
			'default-tooltip',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);

		// `focus()` without options does not match `:focus-visible` in Chromium; `focusVisible: true`
		// opts into keyboard-style focus rings (HTML — see `HTMLElement.focus` options).
		await trigger.evaluate((el) => {
			const options: FocusOptionsWithVisible = { focusVisible: true };
			(el as HTMLElement).focus(options);
		});

		await expect(trigger).toBeFocused();

		const hasFocusVisible = await trigger.evaluate((el) => {
			return el.matches(':focus-visible');
		});

		expect(hasFocusVisible).toBe(true);

		// Dismiss the tooltip before teardown so post-test a11y does not scan the floating surface.
		await page.keyboard.press('Escape');
		await expect(page.getByTestId(popoverTestId)).toBeHidden();
	});
});

test.describe('Tooltip top-layer — WCAG 2.4.11 Focus Not Obscured', () => {
	test('tooltip is visible and not obscured when displayed', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/default-tooltip.tsx')>(
			'design-system',
			'tooltip',
			'default-tooltip',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const tooltip = page.getByTestId(popoverTestId);

		await trigger.hover();

		await expect(tooltip).toBeVisible();
	});
});

test.describe('Tooltip top-layer — WCAG 4.1.2 Name, Role, Value', () => {
	test('tooltip has role="tooltip" (sanity check)', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/default-tooltip.tsx')>(
			'design-system',
			'tooltip',
			'default-tooltip',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const tooltip = page.getByTestId(popoverTestId);

		await trigger.hover();
		await expect(tooltip).toBeVisible();

		await expect(tooltip).toHaveAttribute('role', 'tooltip');
	});

	test('trigger has aria-describedby referencing tooltip', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/default-tooltip.tsx')>(
			'design-system',
			'tooltip',
			'default-tooltip',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const tooltip = page.getByTestId(popoverTestId);
		const hidden = page.getByTestId(hiddenTestId);

		await trigger.hover();
		await expect(tooltip).toBeVisible();

		const hiddenId = await hidden.getAttribute('id');
		expect(hiddenId).not.toBeNull();
		invariant(hiddenId != null, 'expected hidden description id');

		const ariaDescribedBy = await trigger.getAttribute('aria-describedby');
		expect(ariaDescribedBy).toContain(hiddenId);
	});
});

test.describe('Tooltip top-layer — Mouse Interactions', () => {
	test('tooltip appears on mouse hover and hides on mouse leave', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/default-tooltip.tsx')>(
			'design-system',
			'tooltip',
			'default-tooltip',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const tooltip = page.getByTestId(popoverTestId);

		await expect(tooltip).toBeHidden();

		await trigger.hover();

		await expect(tooltip).toBeVisible();

		// Moving to (0,0) often crosses the tooltip layer, which calls `keep()` and prevents hide.
		// Move straight upward from the trigger (default placement is bottom) to leave without hovering the popover.
		const box = await trigger.boundingBox();
		expect(box).not.toBeNull();
		invariant(box != null, 'expected trigger bounding box');
		await page.mouse.move(box.x + box.width / 2, box.y - 48);

		await expect(tooltip).toBeHidden();
	});
});

test.describe('Tooltip top-layer — Interaction Patterns', () => {
	test('multiple rapid hover/unhover cycles do not leave ghost tooltips', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/default-tooltip.tsx')>(
			'design-system',
			'tooltip',
			'default-tooltip',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const tooltip = page.getByTestId(popoverTestId);

		const box = await trigger.boundingBox();
		expect(box).not.toBeNull();
		invariant(box != null, 'expected trigger bounding box');
		const leaveX = box.x + box.width / 2;
		const leaveY = box.y - 48;

		for (let i = 0; i < 5; i++) {
			await trigger.hover();
			await page.mouse.move(leaveX, leaveY);
		}

		await expect(tooltip).toBeHidden();
	});

	test('tooltip content text is accessible', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/default-tooltip.tsx')>(
			'design-system',
			'tooltip',
			'default-tooltip',
			{
				featureFlag,
			},
		);

		const trigger = page.getByTestId(triggerTestId);
		const tooltip = page.getByRole('tooltip');

		await trigger.hover();

		await expect(tooltip).toContainText('This is a tooltip');
	});
});
