import { expect, test } from '@af/integration-testing';

test.describe('Popup focus behavior', () => {
	test('Focus trap is always active, FF off', async ({ page }) => {
		await page.visitExample('design-system', 'popup', 'popup-should-render-to-parent');

		const trigger = page.getByTestId('popup-trigger');

		await trigger.focus();
		await trigger.press('Enter');

		await expect(trigger).not.toBeFocused();

		await page.keyboard.press('Shift+Tab');
		// The last popup button should be in focus
		await expect(page.getByTestId('popup-button-1')).toBeFocused();

		await page.keyboard.press('Tab');
		// The first popup button should be in focus
		await expect(page.getByTestId('popup-button-0')).toBeFocused();

		await page.keyboard.press('Escape');
		await expect(trigger).toBeFocused();
	});

	test('No focus trap by default, FF on', async ({ page }) => {
		await page.visitExample('design-system', 'popup', 'popup-should-render-to-parent', {
			featureFlag: 'platform_dst_popup-disable-focuslock',
		});

		const trigger = page.getByTestId('popup-trigger');
		const popupContainer = page.getByTestId('popup');

		await trigger.focus();
		await trigger.press('Enter');
		await expect(trigger).not.toBeFocused();

		let triggerTabindex = await trigger.getAttribute('tabindex');
		// Ensuring the trigger is not in focus order,
		// so that when we Shift+Tab, the focus moves to the element before trigger
		await expect(triggerTabindex).toBe('-1');

		await page.keyboard.press('Shift+Tab');
		await expect(popupContainer).toBeHidden();
		// The button before trigger should be in focus
		await expect(page.getByTestId('button-0')).toBeFocused();

		triggerTabindex = await trigger.getAttribute('tabindex');
		// The tabindex value on trigger should be restored
		await expect(triggerTabindex).toBe('0');

		await trigger.focus();
		await trigger.press('Enter');

		await page.keyboard.press('Tab');
		// The first popup button should be in focus
		await expect(page.getByTestId('popup-button-0')).toBeFocused();

		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		// The button after trigger should be in focus
		await expect(page.getByTestId('button-1')).toBeFocused();

		await trigger.focus();
		await trigger.press('Enter');

		await page.keyboard.press('Escape');
		await expect(trigger).toBeFocused();
	});

	test('Focus trap active in dialog popup, FF on', async ({ page }) => {
		await page.visitExample('design-system', 'popup', 'popup-role-dialog', {
			featureFlag: 'platform_dst_popup-disable-focuslock',
		});

		const trigger = page.getByTestId('popup-trigger');

		await trigger.focus();
		await trigger.press('Enter');

		await expect(trigger).not.toBeFocused();

		await page.keyboard.press('Shift+Tab');
		// The last popup button should be in focus
		await expect(page.getByTestId('popup-button-1')).toBeFocused();

		await page.keyboard.press('Tab');
		// The first popup button should be in focus
		await expect(page.getByTestId('popup-button-0')).toBeFocused();

		await page.keyboard.press('Escape');
		await expect(trigger).toBeFocused();
	});

	test('Tab should close popup when shouldDisableFocusLock and shouldRenderToParent are true, FF off', async ({
		page,
	}) => {
		await page.visitExample('design-system', 'popup', 'popup-should-close-on-tab');

		const trigger = page.getByTestId('popup-trigger');

		await trigger.focus();
		await trigger.press('Enter');

		await expect(trigger).toBeFocused();

		await page.keyboard.press('Shift+Tab');
		// The button before trigger should be in focus
		await expect(page.getByTestId('button-0')).toBeFocused();

		await trigger.focus();
		await trigger.press('Enter');

		await page.keyboard.press('Tab');
		// The button after trigger should be in focus
		await expect(page.getByTestId('button-1')).toBeFocused();
	});

	test('Tab should close popup when shouldDisableFocusLock and shouldRenderToParent are true, FF on', async ({
		page,
	}) => {
		await page.visitExample('design-system', 'popup', 'popup-should-close-on-tab', {
			featureFlag: 'platform_dst_popup-disable-focuslock',
		});

		const trigger = page.getByTestId('popup-trigger');

		await trigger.focus();
		await trigger.press('Enter');

		await expect(trigger).toBeFocused();

		await page.keyboard.press('Shift+Tab');
		// The button before trigger should be in focus
		await expect(page.getByTestId('button-0')).toBeFocused();

		await trigger.focus();
		await trigger.press('Enter');

		await page.keyboard.press('Tab');
		// The button after trigger should be in focus
		await expect(page.getByTestId('button-1')).toBeFocused();
	});

	test('Focus should remain on the previous element when autoFocus is false, FF off', async ({
		page,
	}) => {
		await page.visitExample('design-system', 'popup', 'popup-disable-autofocus');

		const trigger = page.getByTestId('popup-trigger');
		const focusedInput = page.getByTestId('focused-input');
		const popupContentContainer = page.getByTestId('popup');

		await trigger.focus();
		await trigger.press('Enter');
		await popupContentContainer.waitFor();

		await expect(popupContentContainer).toBeVisible();
		await expect(focusedInput).toBeFocused();

		await page.keyboard.press('Shift+Tab');
		await expect(popupContentContainer).toBeVisible();
		await expect(focusedInput).toBeFocused();

		await page.keyboard.press('Escape');
		await trigger.focus();
		await trigger.press('Enter');
		await popupContentContainer.waitFor();

		await page.keyboard.press('Tab');
		await popupContentContainer.waitFor();
		await expect(popupContentContainer).toBeVisible();
		await expect(focusedInput).toBeFocused();

		await page.keyboard.press('Escape');
		await expect(popupContentContainer).toBeHidden();
		await expect(focusedInput).toBeFocused();
	});

	test('Focus should remain on the previous element when autoFocus is false, FF on', async ({
		page,
	}) => {
		await page.visitExample('design-system', 'popup', 'popup-disable-autofocus', {
			featureFlag: 'platform_dst_popup-disable-focuslock',
		});

		const trigger = page.getByTestId('popup-trigger');
		const focusedInput = page.getByTestId('focused-input');
		const popupContentContainer = page.getByTestId('popup');

		await trigger.focus();
		await trigger.press('Enter');
		await popupContentContainer.waitFor();

		await expect(popupContentContainer).toBeVisible();
		await expect(focusedInput).toBeFocused();

		await page.keyboard.press('Shift+Tab');
		await expect(popupContentContainer).toBeHidden();
		await expect(focusedInput).toBeFocused();

		await trigger.focus();
		await trigger.press('Enter');
		await popupContentContainer.waitFor();

		await page.keyboard.press('Escape');
		await expect(popupContentContainer).toBeHidden();
		await expect(focusedInput).toBeFocused();
	});

	test('Focus should be trapped in nested popups, FF off', async ({ page }) => {
		await page.visitExample('design-system', 'popup', 'nested');

		const trigger = page.getByTestId('popup-trigger');
		const nestedTrigger = page.getByTestId('nested-popup-trigger');
		const popupContentContainer = page.getByTestId('popup');
		const nestedPopupContentContainer = page.getByTestId('nested-popup');

		await trigger.focus();
		await trigger.press('Enter');
		await popupContentContainer.waitFor();

		await expect(popupContentContainer).toBeVisible();
		await expect(popupContentContainer).toBeFocused();

		await page.keyboard.press('Tab');
		await expect(page.getByTestId('create-project')).toBeFocused();

		await page.keyboard.press('Shift+Tab');
		// Last element is focused, focus trap is active
		await expect(nestedTrigger).toBeFocused();

		await page.keyboard.press('Enter');

		await page.keyboard.press('Tab');
		await expect(nestedPopupContentContainer.getByTestId('create-project')).toBeFocused();

		await page.keyboard.press('Shift+Tab');
		// Last nested element is focused, focus trap is active
		await expect(nestedPopupContentContainer.getByTestId('nested-popup-trigger')).toBeFocused();

		await page.keyboard.press('Escape');
		await expect(nestedTrigger).toBeFocused();

		await page.keyboard.press('Escape');
		await expect(trigger).toBeFocused();
	});

	test('Focus should not be trapped in nested popups, FF on', async ({ page }) => {
		await page.visitExample('design-system', 'popup', 'nested', {
			featureFlag: 'platform_dst_popup-disable-focuslock',
		});

		const trigger = page.getByTestId('popup-trigger');
		const nestedTrigger = page.getByTestId('nested-popup-trigger');
		const popupContentContainer = page.getByTestId('popup');
		const nestedPopupContentContainer = page.getByTestId('nested-popup');

		const button0 = page.getByTestId('button-0');
		const button1 = page.getByTestId('button-1');

		await trigger.focus();
		await trigger.press('Enter');
		await popupContentContainer.waitFor();

		await expect(popupContentContainer).toBeVisible();
		await expect(popupContentContainer).toBeFocused();

		await page.keyboard.press('Tab');
		await expect(page.getByTestId('create-project')).toBeFocused();

		await page.keyboard.press('Shift+Tab');
		// Element before trigger is focused, focus trap is disabled
		await expect(button0).toBeFocused();

		await trigger.focus();
		await trigger.press('Enter');
		await popupContentContainer.waitFor();

		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		// Element after trigger is focused, focus trap is disabled
		await expect(button1).toBeFocused();

		await trigger.focus();
		await trigger.press('Enter');
		await expect(popupContentContainer).toBeVisible();
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await nestedTrigger.press('Enter');
		await expect(nestedPopupContentContainer).toBeVisible();

		await page.keyboard.press('Shift+Tab');
		// Nested popup is closed, element before trigger is focused
		await expect(nestedPopupContentContainer).toBeHidden();
		await expect(popupContentContainer.getByTestId('view-projects')).toBeFocused();

		await page.keyboard.press('Tab');
		await nestedTrigger.press('Enter');
		await page.keyboard.press('Escape');

		await expect(nestedTrigger).toBeFocused();

		await nestedTrigger.press('Enter');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');

		await page.keyboard.press('Tab');
		await expect(popupContentContainer).toBeHidden();
		await expect(nestedPopupContentContainer).toBeHidden();
		// Both popups are closed, element after trigger is focused
		await expect(button1).toBeFocused();
	});

	test('Should not return focus to trigger with should not return focus', async ({ page }) => {
		await page.visitExample('design-system', 'popup', 'should-not-return-focus');

		const trigger = page.getByText('Trigger');

		await trigger.focus();
		await trigger.press('Enter');
		await expect(page.getByText('Content')).toBeFocused();

		await page.keyboard.press('Escape');
		await expect(trigger).not.toBeFocused();

		await trigger.focus();
		await trigger.press('Enter');
		await expect(page.getByText('Content')).toBeFocused();

		await page.keyboard.press('Enter');
		await expect(trigger).not.toBeFocused();
		await expect(page.getByPlaceholder('Input')).toBeFocused();

		await page.keyboard.press('Escape');
		await expect(trigger).toBeFocused();
	});
});
