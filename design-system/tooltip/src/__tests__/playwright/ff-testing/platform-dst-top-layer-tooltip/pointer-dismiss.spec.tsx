/* eslint-disable testing-library/prefer-screen-queries -- Playwright `page` locators, not RTL `render` */
import invariant from 'tiny-invariant';

import { expect, type Page, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer-tooltip';

const triggerTestId = 'tooltip--container';
const popoverTestId = 'tooltip--popover';

// Tooltip's show delay. An incorrect re-show lands after this, so assertions
// that nothing came back must outlast it.
const showDelay = 300;

async function visitFixture(page: Page) {
	await page.visitExample<
		typeof import('../../../../../examples/testing-top-layer-pointer-dismiss.tsx')
	>('design-system', 'tooltip', 'testing-top-layer-pointer-dismiss', { featureFlag });
}

/**
 * Proving a tooltip does *not* appear means giving it the window in which it
 * would have. The wait is the subject of the assertion, not a synchronisation
 * hack: there is no event to await, because the point is that nothing happens.
 */
async function expectStaysHidden(page: Page) {
	// eslint-disable-next-line playwright/no-wait-for-timeout -- the elapsed time is what is under test
	await page.waitForTimeout(showDelay * 2);
	await expect(page.getByTestId(popoverTestId)).toBeHidden();
}

// Moves the pointer within the trigger, crossing from the label onto the
// button's padding box. The browser fires a fresh `mouseover` for that crossing.
async function nudgeInsideTrigger(page: Page) {
	const trigger = page.getByTestId(triggerTestId);
	const box = await trigger.boundingBox();
	invariant(box != null, 'expected trigger bounding box');

	// 4px inside the left edge, which is padding rather than the label.
	await page.mouse.move(box.x + 4, box.y + box.height / 2);
}

test.describe('Tooltip top-layer — pointer dismissal', () => {
	test('press keeps the tooltip visible until pointerup, then dismisses it', async ({ page }) => {
		await visitFixture(page);

		const trigger = page.getByTestId(triggerTestId);
		const tooltip = page.getByTestId(popoverTestId);

		await trigger.hover();
		await expect(tooltip).toBeVisible();

		// Native light dismiss hides on pointerup, so a held press stays visible.
		await page.mouse.down();
		await expect(tooltip).toBeVisible();

		await page.mouse.up();
		await expect(tooltip).toBeHidden();
	});

	test('tooltip stays dismissed when the pointer moves inside the trigger', async ({ page }) => {
		await visitFixture(page);

		const trigger = page.getByTestId(triggerTestId);
		const tooltip = page.getByTestId(popoverTestId);

		await trigger.hover();
		await expect(tooltip).toBeVisible();

		await trigger.click();
		await expect(tooltip).toBeHidden();

		await nudgeInsideTrigger(page);
		await expectStaysHidden(page);
	});

	test('tooltip returns after the pointer leaves and re-enters the trigger', async ({ page }) => {
		await visitFixture(page);

		const trigger = page.getByTestId(triggerTestId);
		const tooltip = page.getByTestId(popoverTestId);

		await trigger.hover();
		await expect(tooltip).toBeVisible();

		await trigger.click();
		await expect(tooltip).toBeHidden();

		await nudgeInsideTrigger(page);
		await expectStaysHidden(page);

		// A genuine leave and return re-arms the tooltip.
		await page.getByTestId('away').hover();
		await trigger.hover();

		await expect(tooltip).toBeVisible();

		// Leave, so the floating surface is gone before teardown.
		await page.getByTestId('away').hover();
		await expect(tooltip).toBeHidden();
	});

	test('tooltip does not appear after a press that lands before the show delay', async ({
		page,
	}) => {
		await visitFixture(page);

		const trigger = page.getByTestId(triggerTestId);
		const tooltip = page.getByTestId(popoverTestId);

		// `click()` moves, presses and releases well inside the show delay, so the
		// scheduled show never reaches native light dismiss.
		await trigger.click();
		await expect(tooltip).toBeHidden();

		await expectStaysHidden(page);
	});

	test('keyboard focus still shows the tooltip after a press dismissal', async ({ page }) => {
		await visitFixture(page);

		const trigger = page.getByTestId(triggerTestId);
		const tooltip = page.getByTestId(popoverTestId);

		await trigger.hover();
		await expect(tooltip).toBeVisible();

		await trigger.click();
		await expect(tooltip).toBeHidden();
		await expect(trigger).toBeFocused();

		// Blur ends the dismissal, so focus coming back shows the tooltip even though
		// the pointer never moved. Real Tab presses, because programmatic `focus()` is
		// not `:focus-visible` once the page has seen a mouse click.
		await page.keyboard.press('Tab');
		await expect(page.getByTestId('away')).toBeFocused();

		await page.keyboard.press('Shift+Tab');
		await expect(trigger).toBeFocused();

		await expect(tooltip).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(tooltip).toBeHidden();
	});
});
