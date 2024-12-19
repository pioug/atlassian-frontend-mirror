import { expect, test } from '@af/integration-testing';

const trigger = '[data-testid="lite-mode-ddm--trigger"]';
const dropdownMenu = '[data-testid="lite-mode-ddm--content"]';

test('Verify that Dropdown Menu is able to open', async ({ page }) => {
	await page.visitExample('design-system', 'dropdown-menu', 'testing-ddm-default');
	await page.locator(trigger).first().click();
	expect(await page.webdriverCompatUtils.isAttached(dropdownMenu)).toBe(true);
});

test('Verify that Dropdown Menu is able to open - stateless', async ({ page }) => {
	await page.visitExample('design-system', 'dropdown-menu', 'testing-ddm-stateless');
	await page.locator(trigger).first().click();

	await expect(page.locator(dropdownMenu).first()).toBeVisible();

	await expect(page.locator(`#cities button[aria-checked]`).nth(0)).toBeChecked();
	await expect(page.locator(`#cities button[aria-checked]`).nth(1)).not.toBeChecked();
});

test.describe('Keyboard navigation', () => {
	const triggerTestId = 'dropdown--trigger';
	const contentTestId = 'dropdown--content';

	test('Verify that Dropdown Menu is closing on Tab press and focus on the next interactive element', async ({
		page,
	}) => {
		await page.visitExample('design-system', 'dropdown-menu', 'testing-keyboard-navigation');

		await page.getByTestId(triggerTestId).press('Enter');
		await expect(page.getByTestId(contentTestId)).toBeVisible();

		await page.getByTestId(contentTestId).press('Tab');
		await expect(page.getByTestId(contentTestId)).toBeHidden();
		await expect(page.getByTestId(triggerTestId)).toBeFocused();
	});

	test('Verify that Dropdown Menu is closing on Shift+Tab press and focus on trigger', async ({
		page,
	}) => {
		await page.visitExample('design-system', 'dropdown-menu', 'testing-keyboard-navigation');

		await page.getByTestId(triggerTestId).press('Enter');
		await page.getByTestId(contentTestId).press('Shift+Tab');

		await expect(page.getByTestId(contentTestId)).toBeHidden();
		await expect(page.getByTestId(triggerTestId)).toBeFocused();
	});

	test('Verify that Dropdown Menu items navigation works on keyUp and keyDown', async ({
		page,
	}) => {
		await page.visitExample('design-system', 'dropdown-menu', 'testing-keyboard-navigation');

		await page.getByTestId(triggerTestId).press('Enter');
		// Should set focus on the first element
		await expect(page.getByRole('menuitem', { name: 'Move' })).toBeFocused();

		await page.getByRole('menuitem', { name: 'Move' }).press('ArrowDown');
		// Should move focus to the second element
		await expect(page.getByRole('menuitem', { name: 'Clone' })).toBeFocused();

		await page.getByRole('menuitem', { name: 'Clone' }).press('ArrowDown');
		// Should move focus to the first element
		await expect(page.getByRole('menuitem', { name: 'Move' })).toBeFocused();

		await page.getByRole('menuitem', { name: 'Move' }).press('ArrowUp');
		// Should move focus to the last element
		await expect(page.getByRole('menuitem', { name: 'Clone' })).toBeFocused();
	});
});

test.describe('Nested keyboard navigation', () => {
	const getTriggerTestId = (level: number) => `nested-${level}--trigger`;
	const getContentTestId = (level: number) => `nested-${level}--content`;
	const getItemTestId = (level: number, id: number) => `nested-item${id}-${level}`;

	test('Verify that navigation works correctly', async ({ page }) => {
		await page.visitExample('design-system', 'dropdown-menu', 'testing-nested-keyboard-navigation');

		// Should open a nested dropdown level 0
		await page.getByTestId(getTriggerTestId(0)).focus();
		await page.getByTestId(getTriggerTestId(0)).press('Enter');

		await expect(page.getByTestId(getContentTestId(0))).toBeVisible();
		await expect(page.getByTestId(getTriggerTestId(1))).toBeFocused();

		// Should open a nested dropdown level 1 and focus the first item
		await page.getByTestId(getTriggerTestId(1)).press('Enter');
		await expect(page.getByTestId(getContentTestId(1))).toBeVisible();
		await expect(page.getByTestId(getTriggerTestId(2))).toBeFocused();

		// Should open a nested dropdown level 2 and focus the first item
		await page.getByTestId(getTriggerTestId(2)).press('Enter');
		await expect(page.getByTestId(getContentTestId(2))).toBeVisible();
		await expect(page.getByTestId(getTriggerTestId(3))).toBeFocused();

		// Should move focus to the second item in dropdown content level 2
		await page.getByTestId(getTriggerTestId(3)).press('ArrowDown');
		await expect(page.getByTestId(getItemTestId(3, 1))).toBeFocused();

		// Should move focus to the third (last) item in dropdown content level 2
		await page.getByTestId(getItemTestId(3, 1)).press('ArrowDown');
		await expect(page.getByTestId(getItemTestId(3, 2))).toBeFocused();

		// Should move focus to the first item in dropdown content level 2
		await page.getByTestId(getItemTestId(3, 2)).press('ArrowDown');
		await expect(page.getByTestId(getTriggerTestId(3))).toBeFocused();

		// Should close a nested dropdown level 2 and focus on the nested dropdown level 1 first element
		await page.getByTestId(getTriggerTestId(3)).press('Shift+Tab');
		await expect(page.getByTestId(getTriggerTestId(2))).toBeFocused();

		// Should close a nested dropdown level 1 and focus on the nested dropdown level 0 first element
		await page.getByTestId(getTriggerTestId(2)).press('Shift+Tab');
		await expect(page.getByTestId(getTriggerTestId(1))).toBeFocused();

		// Should close a nested dropdown and focus on trigger
		await page.getByTestId(getTriggerTestId(1)).press('Shift+Tab');
		await expect(page.getByTestId(getContentTestId(0))).toBeHidden();
		await expect(page.getByTestId(getTriggerTestId(0))).toBeFocused();
	});

	test('Navigation should work when using multiple nested triggers with DropdownItem', async ({
		page,
	}) => {
		await page.visitExample('design-system', 'dropdown-menu', 'nested-dropdown', {
			featureFlag: 'select-avoid-duplicated-registered-ref',
		});
		// Should open a nested dropdown level 0
		await page
			.getByRole('button', {
				name: 'Nested',
			})
			.focus();
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('ArrowDown');
		await expect(
			page.getByRole('menuitem', {
				name: 'first of many items',
			}),
		).toBeFocused();
		await page.keyboard.press('ArrowDown');
		await expect(
			page.getByRole('menuitem', {
				name: 'second of many items',
			}),
		).toBeFocused();
	});
});

test.describe('Testing returnFocusRef', () => {
	const triggerTestId = 'dropdown--trigger';
	const contentTestId = 'dropdown--content';
	const focusedElementId = 'checkbox2';
	const anotherInteractiveElementId = 'checkbox3';
	const outsideDropdown = 'examples'; // container id

	test('Verify that Dropdown Menu is closing on Tab press and focus on the element specified by returnFocusRef', async ({
		page,
	}) => {
		await page.visitExample('design-system', 'dropdown-menu', 'testing-return-focus-ref');

		await page.getByTestId(triggerTestId).press('Enter');
		await expect(page.getByTestId(contentTestId)).toBeVisible();

		await page.getByTestId(contentTestId).press('Tab');
		await expect(page.getByTestId(contentTestId)).toBeHidden();
		await expect(page.locator(`#${focusedElementId}`)).toBeFocused();
	});

	test('Verify that Dropdown Menu is closing on Shift+Tab press and focus on the element specified by returnFocusRef', async ({
		page,
	}) => {
		await page.visitExample('design-system', 'dropdown-menu', 'testing-return-focus-ref');

		await page.getByTestId(triggerTestId).press('Enter');
		await expect(page.getByTestId(contentTestId)).toBeVisible();

		await page.getByTestId(contentTestId).press('Shift+Tab');
		await expect(page.getByTestId(contentTestId)).toBeHidden();
		await expect(page.locator(`#${focusedElementId}`)).toBeFocused();
	});

	test('Verify that Dropdown Menu is closing on Esc press and focus on the element specified by returnFocusRef', async ({
		page,
	}) => {
		await page.visitExample('design-system', 'dropdown-menu', 'testing-return-focus-ref');

		await page.getByTestId(triggerTestId).press('Enter');
		await expect(page.getByTestId(contentTestId)).toBeVisible();

		await page.getByTestId(contentTestId).press('Escape');
		await expect(page.getByTestId(contentTestId)).toBeHidden();
		await expect(page.locator(`#${focusedElementId}`)).toBeFocused();
	});

	test('Verify that Dropdown Menu is closing on dropdown item selected (keyboard) and focus on the element specified by returnFocusRef', async ({
		page,
	}) => {
		await page.visitExample('design-system', 'dropdown-menu', 'testing-return-focus-ref');

		await page.getByTestId(triggerTestId).press('Enter');
		await expect(page.getByTestId(contentTestId)).toBeVisible();

		await page.getByRole('menuitem').first().press('Enter');

		await expect(page.getByTestId(contentTestId)).toBeHidden();
		await expect(page.locator(`#${focusedElementId}`)).toBeFocused();
	});

	test('Verify that Dropdown Menu is closing on dropdown item selected (mouse) and focus on the element specified by returnFocusRef', async ({
		page,
	}) => {
		await page.visitExample('design-system', 'dropdown-menu', 'testing-return-focus-ref');

		await page.getByTestId(triggerTestId).press('Enter');
		await expect(page.getByTestId(contentTestId)).toBeVisible();

		await page.getByRole('menuitem').first().click();

		await expect(page.getByTestId(contentTestId)).toBeHidden();
		await expect(page.locator(`#${focusedElementId}`)).toBeFocused();
	});

	test('Verify that Dropdown Menu is closing on click on an interactive element and focus on the element specified by returnFocusRef', async ({
		page,
	}) => {
		await page.visitExample('design-system', 'dropdown-menu', 'testing-return-focus-ref');

		await page.getByTestId(triggerTestId).press('Enter');
		await expect(page.getByTestId(contentTestId)).toBeVisible();

		await page.locator(`#${anotherInteractiveElementId}`).click();
		await expect(page.getByTestId(contentTestId)).toBeHidden();
		await expect(page.locator(`#${focusedElementId}`)).toBeFocused();
	});

	test('Verify that Dropdown Menu is closing on click outside the dropdown and focus on the element specified by returnFocusRef', async ({
		page,
	}) => {
		await page.visitExample('design-system', 'dropdown-menu', 'testing-return-focus-ref');

		await page.getByTestId(triggerTestId).press('Enter');
		await expect(page.getByTestId(contentTestId)).toBeVisible();

		await page.locator(`#${outsideDropdown}`).click();
		await expect(page.getByTestId(contentTestId)).toBeHidden();
		await expect(page.locator(`#${focusedElementId}`)).toBeFocused();
	});
});
