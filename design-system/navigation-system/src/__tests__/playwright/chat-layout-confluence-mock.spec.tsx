import { expect, test } from '@af/integration-testing';

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
