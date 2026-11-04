import { expect, test } from '@af/integration-testing';

for (const newTheme of [false, true]) {
	test(`container presentation works before and after hydration (new theme: ${newTheme})`, async ({
		page,
	}) => {
		await page.setViewportSize({ width: 1600, height: 900 });
		await page.visitExample<typeof import('../../../examples/top-nav-container-ssr')>(
			'design-system',
			'navigation-system',
			'top-nav-container-ssr',
			{
				featureFlag: newTheme
					? ['platform-dst-chat-panel-layout', 'platform_dst_nav4_custom_theming_fhs_1'].join(',')
					: 'platform-dst-chat-panel-layout',
			},
		);
		const header = page.getByTestId('container-top-nav');
		const start = page.getByTestId('container-top-nav-start');
		const title = page.getByTestId('container-top-nav-title');
		const middle = page.getByTestId('container-search').locator('..');
		const settings = page.getByRole('button', { name: 'Settings' });
		const resize = async (width: number) => {
			// Size the slot independently of Root's desktop main-area minimum.
			await header.evaluate((element, value) => {
				element.style.width = `${value}px`;
			}, width);
			await expect(header).toHaveWidth(width);
		};
		for (const width of [1200, 1024, 1023, 800, 768, 767, 320, 270, 1200]) {
			await resize(width);
			await expect(middle).toHaveCSS('display', width < 768 ? 'flex' : 'grid');
			await expect(start).toHaveCSS('min-width', width < 1024 ? 'max-content' : '330px');
			await expect(title).toBeVisible({ visible: width >= 1024 });
			await expect(page.getByText('Confluence', { exact: true })).toBeVisible({
				visible: width >= 1024,
			});
			await expect(settings).toBeVisible({ visible: width >= 768 });
			const startBounds = (await start.boundingBox())!;
			const middleBounds = (await middle.boundingBox())!;
			expect(startBounds.x + startBounds.width).toBeLessThanOrEqual(middleBounds.x);
			// This minimal SSR fixture checks CSS reflow; full hydrated composition is covered separately.
			expect(await header.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
				true,
			);
		}
		// Exercise actual narrow viewports as well as a narrow container on desktop.
		// 320 CSS pixels represents a 1280px viewport at 400% browser zoom.
		for (const width of [320, 270]) {
			await page.setViewportSize({ width, height: 900 });
			await resize(width);
			await expect(middle).toHaveCSS('display', 'flex');
			await expect(title).toBeHidden();
			expect(await header.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
				true,
			);
		}
		await page.setViewportSize({ width: 1600, height: 900 });
		await resize(800);
		await page.addStyleTag({ content: 'html { font-size: 20px; }' });
		await expect(middle).toHaveCSS('display', 'flex');
		await expect(settings).toBeHidden();
		await expect(page.getByRole('button', { name: 'Show more' })).toHaveCount(0);
		await page.getByRole('button', { name: 'Hydrate navigation' }).click();
		await page.getByRole('button', { name: 'Show more' }).click();
		await expect(settings).toBeVisible();
		await page.addStyleTag({ content: 'html { font-size: 16px; }' });
		await expect(middle).toHaveCSS('display', 'grid');
		await expect(page.getByRole('button', { name: 'Show more' })).toHaveCount(0);
		await expect(settings).toBeVisible();
		// Recheck after hydration: compact navigation now includes the overflow trigger.
		for (const width of [767, 320, 270]) {
			await resize(width);
			const overflow = header.getByRole('button', { name: 'Show more' });
			await expect(overflow).toHaveCount(1);
			await expect
				.poll(() => header.evaluate((element) => element.scrollWidth <= element.clientWidth))
				.toBe(true);
			const headerBounds = (await header.boundingBox())!;
			const triggerBounds = (await overflow.boundingBox())!;
			expect(triggerBounds.x + triggerBounds.width).toBeLessThanOrEqual(
				headerBounds.x + headerBounds.width,
			);
			await overflow.click();
			await expect(settings).toBeVisible();
			await overflow.click();
			await expect(settings).toBeHidden();
		}
		for (const width of [768, 1200]) {
			await resize(width);
			await expect(header.getByRole('button', { name: 'Show more' })).toHaveCount(0);
			await expect(settings).toBeVisible();
			await expect
				.poll(() => header.evaluate((element) => element.scrollWidth <= element.clientWidth))
				.toBe(true);
		}
	});
}

test('gate off retains viewport presentation when the host narrows', async ({ page }) => {
	await page.setViewportSize({ width: 1600, height: 900 });
	await page.visitExample<typeof import('../../../examples/top-nav-container-ssr')>(
		'design-system',
		'navigation-system',
		'top-nav-container-ssr',
	);
	await page.getByTestId('container-top-nav-host').evaluate((host) => {
		host.style.width = '600px';
	});
	await expect(page.getByTestId('container-top-nav-title')).toBeVisible();
	await expect(page.getByTestId('container-top-nav-start')).toHaveCSS('min-width', '330px');
	await expect(page.getByTestId('container-search').locator('..')).toHaveCSS('display', 'grid');
});
