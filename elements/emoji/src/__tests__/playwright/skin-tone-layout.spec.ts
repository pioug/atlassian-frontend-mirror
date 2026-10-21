import { expect, test } from '@af/integration-testing';

test('opening and selecting a skin tone preserves the picker layout', async ({ page }) => {
	await page.visitExample<
		typeof import('../../../examples/05-standard-emoji-picker-with-upload.tsx')
	>('elements', 'emoji', 'standard-emoji-picker-with-upload', {
		featureFlag: 'platform_suppression_removal_fix_reactions,platform_emoji_skin_tone_blur_fix',
		platformExperimentOverrides: JSON.stringify({
			platform_teamoji_26_refresh_emoji_picker: { isEnabled: true },
		}),
	});
	const actions = page.getByTestId('emoji-actions');
	const grid = page.getByTestId('virtual-list-scroll-container');
	const trigger = actions.getByRole('button', { name: /Choose your skin tone/ });
	await expect(trigger).toBeVisible();
	const actionsBefore = await actions.boundingBox();
	const gridBefore = await grid.boundingBox();
	expect(actionsBefore).not.toBeNull();
	expect(gridBefore).not.toBeNull();

	await trigger.click();
	const choices = actions.getByRole('radiogroup');
	await expect(choices).toBeVisible();
	await expect.poll(async () => (await actions.boundingBox())?.height).toBe(actionsBefore!.height);
	await expect.poll(async () => (await grid.boundingBox())?.y).toBe(gridBefore!.y);

	await choices.getByRole('radio', { name: 'light skin tone', exact: true }).click();
	await expect(trigger).toHaveAttribute('aria-expanded', 'false');
	await expect.poll(async () => (await actions.boundingBox())?.height).toBe(actionsBefore!.height);
	await expect.poll(async () => (await grid.boundingBox())?.y).toBe(gridBefore!.y);
});
