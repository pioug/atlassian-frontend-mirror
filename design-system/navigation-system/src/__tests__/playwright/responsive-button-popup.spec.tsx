import { expect, type Locator, test } from '@af/integration-testing';

for (const topLayer of [false, true]) {
	for (const [initialWidth, resizedWidths] of [
		[800, [600, 800]],
		[600, [800, 600]],
	] as const) {
		test(`preserves popup focus across resizing (top layer: ${topLayer}, initial width: ${initialWidth})`, async ({
			page,
		}) => {
			await page.setViewportSize({ width: 1600, height: 900 });
			await page.visitExample<typeof import('../../../examples/responsive-button-popup')>(
				'design-system',
				'navigation-system',
				'responsive-button-popup',
				{
					featureFlag: [
						'platform-dst-chat-panel-layout',
						...(topLayer ? ['platform-dst-top-layer'] : []),
					].join(','),
				},
			);
			const header = page.getByTestId('popup-top-nav');
			const trigger = page.getByTestId('popup-trigger');
			await resize(header, trigger, initialWidth);
			await trigger.click();
			const input = page.getByRole('textbox', { name: 'Item name' });
			await input.fill('A draft');
			await expect(input).toBeFocused();
			for (const width of resizedWidths) {
				await resize(header, trigger, width);
				// Let Popup's scheduled focus-management frames run before asserting.
				await page.evaluate(
					() =>
						new Promise<void>((resolve) =>
							requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
						),
				);
				await expect(input).toBeFocused();
				await expect(input).toHaveValue('A draft');
			}
			await page.keyboard.press('Escape');
			await expect(input).toBeHidden();
			await expect(trigger).toBeFocused();
		});
	}
}

async function resize(header: Locator, trigger: Locator, width: number) {
	await header.evaluate((node, value) => {
		node.style.width = `${value}px`;
	}, width);
	if (width < 768) {
		await expect.poll(async () => (await trigger.boundingBox())?.width ?? 0).toBe(32);
	} else {
		await expect.poll(async () => (await trigger.boundingBox())?.width ?? 0).toBeGreaterThan(32);
	}
}
