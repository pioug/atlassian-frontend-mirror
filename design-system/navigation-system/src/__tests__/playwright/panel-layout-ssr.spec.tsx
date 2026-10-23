import { expect, type Locator, test } from '@af/integration-testing';

for (const coordinated of [false, true]) {
	for (const [viewportWidth, rootWidth] of [
		[1600, 1600],
		[1600, 700],
		[1200, 1200],
		[1200, 600],
		[1200, 639],
		[1200, 640],
		// Narrow/reflow widths, including the equivalent of a 1280px viewport at 400% zoom.
		[320, 320],
		[270, 270],
	]) {
		const isInline = rootWidth >= 640;
		const panelWidth = Math.min(600, isInline ? rootWidth - 320 : rootWidth * 0.9);
		const mainWidth = isInline ? rootWidth - panelWidth : rootWidth;
		const area = isInline ? 'panel' : 'main';
		// Splitters are hidden below 48rem; those cases retain CSS sizing after hydration.
		const prepareCoordinator =
			viewportWidth < 768
				? (splitter: Locator) => expect(splitter).toBeHidden()
				: (splitter: Locator) => splitter.focus();
		const remainingFallbacks = viewportWidth < 768 ? 1 : 0;

		test(`SSR geometry remains stable (viewport: ${viewportWidth}, Root: ${rootWidth}, chat: ${coordinated})`, async ({
			page,
		}) => {
			await page.setViewportSize({ width: viewportWidth, height: 900 });
			await page.visitExample<typeof import('../../../examples/panel-layout-ssr')>(
				'design-system',
				'navigation-system',
				'panel-layout-ssr',
				coordinated ? { featureFlag: 'platform-dst-chat-panel-layout' } : undefined,
			);
			await page.addStyleTag({
				content: `#unsafe-design-system-page-layout-root { width: ${rootWidth}px; }`,
			});
			const shell = page.getByTestId('ssr-layout');
			const main = shell.locator(':scope > div').first();
			const panel = page.getByRole('region', { name: 'Panel', exact: true });
			const panelWidthOffset = page.getByTestId('panel-width-offset');
			const expectMeasuredWidth = () =>
				expect
					.poll(async () => (await panelWidthOffset.boundingBox())?.width)
					.toBeCloseTo(panelWidth, 1);
			// Text locators exclude style contents, so inspect the stylesheet text directly.
			const fallbackCount = () =>
				page
					.locator('style')
					.evaluateAll(
						(styles) =>
							styles.filter((style) => style.textContent?.includes('@container local-panel-layout'))
								.length,
					);
			const splitter = page.getByRole('slider', {
				name: 'Resize panel',
				exact: true,
				includeHidden: true,
			});
			// These are actual server-markup rectangles; the sizing effects have not run yet.
			await expect.poll(fallbackCount).toBe(1);
			await expect.poll(async () => (await panel.boundingBox())?.width).toBeCloseTo(panelWidth, 1);
			await expect(main).toHaveWidth(mainWidth);
			// No JavaScript measurement runs on the server; consumers use their 0px fallback.
			await expect(panelWidthOffset).toHaveWidth(0);
			const before = await panel.boundingBox();
			const mainBefore = await main.boundingBox();
			await page.getByRole('button', { name: 'Hydrate layout' }).click();
			// The splitter portal mounts after hydration. CSS still owns sizing until interaction.
			await expect(splitter).toHaveCount(1);
			await expect.poll(fallbackCount).toBe(1);
			await expect(panel).toHaveCSS('grid-area', area);
			expect(await panel.boundingBox()).toEqual(before);
			expect(await main.boundingBox()).toEqual(mainBefore);
			await expectMeasuredWidth();

			// Where resizing is available, focus activates sizing without requesting a new width.
			await prepareCoordinator(splitter);
			await expect.poll(fallbackCount).toBe(remainingFallbacks);
			await expect(panel).toHaveCSS('grid-area', area);
			await expect.poll(async () => (await panel.boundingBox())?.width).toBeCloseTo(panelWidth, 1);
			await expect(main).toHaveWidth(mainWidth);
			await expectMeasuredWidth();
			expect(await panel.boundingBox()).toEqual(before);
			expect(await main.boundingBox()).toEqual(mainBefore);
		});
	}
}
