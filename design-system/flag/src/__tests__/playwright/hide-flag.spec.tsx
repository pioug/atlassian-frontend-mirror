import { expect, test } from '@af/integration-testing';

test.describe('useFlags().hideFlag(id)', () => {
	test('shows and hides a flag by id, and is a no-op when called with no flags on screen', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../../examples/21-flags-provider-hide-flag.tsx')>(
			'design-system',
			'flag',
			'flags-provider-hide-flag',
		);

		const addButton = page.getByTestId('AddFlag');
		const hideButton = page.getByTestId('HideLastFlag');
		const flag = page.getByTestId('MyFlagTestId--1');

		await expect(flag).toBeHidden();

		await addButton.click();
		await expect(flag).toBeVisible();

		await hideButton.click();
		await expect(flag).toBeHidden();

		await hideButton.click();
		await expect(flag).toBeHidden();
	});

	test('hides only the targeted flag when multiple flags are visible', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/21-flags-provider-hide-flag.tsx')>(
			'design-system',
			'flag',
			'flags-provider-hide-flag',
		);

		const addButton = page.getByTestId('AddFlag');
		const hideButton = page.getByTestId('HideLastFlag');

		await addButton.click();
		await addButton.click();

		const flag1 = page.getByTestId('MyFlagTestId--1');
		const flag2 = page.getByTestId('MyFlagTestId--2');

		await expect(flag1).toBeVisible();
		await expect(flag2).toBeVisible();

		await hideButton.click();

		await expect(flag2).toBeHidden();
		await expect(flag1).toBeVisible();
	});

	test('with multiple flags visible, dismissing the top flag via hideFlag(id) leaves the surviving flag in the same state as dismissing via the in-flag dismiss button', async ({
		page,
	}) => {
		const setupTwoFlags = async () => {
			await page.reload();
			await page.getByTestId('AddFlag').click();
			await page.getByTestId('AddFlag').click();
			await expect(page.getByTestId('MyFlagTestId--1')).toBeVisible();
			await expect(page.getByTestId('MyFlagTestId--2')).toBeVisible();
		};

		await page.visitExample<typeof import('../../../examples/21-flags-provider-hide-flag.tsx')>(
			'design-system',
			'flag',
			'flags-provider-hide-flag',
		);

		await setupTwoFlags();
		await page.getByTestId('MyFlagTestId--2-dismiss').click();
		await expect(page.getByTestId('MyFlagTestId--2')).toBeHidden();
		await expect(page.getByTestId('MyFlagTestId--1')).toBeVisible();
		await expect(page.getByTestId('MyFlagTestId--1-dismiss')).toBeVisible();

		await setupTwoFlags();
		await page.getByTestId('HideLastFlag').click();
		await expect(page.getByTestId('MyFlagTestId--2')).toBeHidden();
		await expect(page.getByTestId('MyFlagTestId--1')).toBeVisible();
		await expect(page.getByTestId('MyFlagTestId--1-dismiss')).toBeVisible();
	});
});
