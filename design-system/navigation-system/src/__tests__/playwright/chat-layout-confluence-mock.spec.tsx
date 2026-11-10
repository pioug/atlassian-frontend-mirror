import { expect, test } from '@af/integration-testing';

for (const width of [320, 375, 639, 640, 767, 768, 800, 1023]) {
	test(`Confluence mock uses compact defaults independently at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 900 });
		await page.visitExample<
			typeof import('../../../examples/page-layout-chat-panel-confluence-mock.tsx')
		>('design-system', 'navigation-system', 'page-layout-chat-panel-confluence-mock');
		const chat = page.getByRole('region', { name: 'Chat panel', exact: true });
		await expect.poll(async () => (await chat.boundingBox())?.width).toBe(320);
		await page.getByRole('slider', { name: 'Resize Rovo', exact: true }).focus();
		await expect.poll(async () => (await chat.boundingBox())?.width).toBe(320);
		await page.getByRole('button', { name: 'Close Rovo', exact: true }).click();
		await page
			.getByRole('button', { name: 'ADS layout updates for chat panel – Beta release On track' })
			.click();
		const panel = page.getByRole('region', { name: 'Panel', exact: true });
		await expect(panel).toHaveWidth(320);
		await page.getByRole('slider', { name: 'Resize panel', exact: true }).focus();
		await expect(panel).toHaveWidth(320);
	});
}

for (const width of [800, 1023]) {
	test(`Confluence mock uses compact local and Chat defaults at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 900 });
		await page.visitExample<
			typeof import('../../../examples/page-layout-chat-panel-confluence-mock.tsx')
		>('design-system', 'navigation-system', 'page-layout-chat-panel-confluence-mock');
		await page
			.getByRole('button', { name: 'ADS layout updates for chat panel – Beta release On track' })
			.click();
		const panel = page.getByRole('region', { name: 'Panel', exact: true });
		const chat = page.getByRole('region', { name: 'Chat panel', exact: true });
		await expect(panel).toHaveWidth(320);
		await expect(chat).toHaveWidth(320);
		await page.getByRole('slider', { name: 'Resize panel', exact: true }).focus();
		await expect(panel).toHaveWidth(320);
		await expect(chat).toHaveWidth(320);
	});
}

test('the Chat resize rail stays visible beside TopNav across its full width', async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.visitExample<
		typeof import('../../../examples/page-layout-chat-panel-confluence-mock.tsx')
	>('design-system', 'navigation-system', 'page-layout-chat-panel-confluence-mock');
	const slider = page.getByRole('slider', { name: 'Resize Rovo', exact: true });
	await slider.focus();
	const line = slider.locator('..').locator('..').locator(':scope > span').last();
	await expect
		.poll(() =>
			line.evaluate((element) => {
				const rect = element.getBoundingClientRect();
				return [20, 100].every((offset) =>
					[0.5, 1.5, 2.5].every(
						(x) => document.elementFromPoint(rect.left + x, rect.top + offset) === element,
					),
				);
			}),
		)
		.toBe(true);
});
