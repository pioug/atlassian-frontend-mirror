import { expect, type Locator, test } from '@af/integration-testing';

for (const coordinated of [false, true]) {
	for (const [viewportWidth, rootWidth] of [
		[1768, 1768],
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
		const panelWidth = Math.min(
			600,
			isInline
				? rootWidth - 320
				: coordinated
					? Math.max(320, Math.min(rootWidth, Math.max(400, rootWidth * 0.9)))
					: rootWidth * 0.9,
		);
		const mainWidth = isInline ? rootWidth - panelWidth : rootWidth;
		const area = isInline ? 'panel' : 'main';
		// Only the legacy layout hides small-screen splitters and retains CSS sizing.
		const isSplitterHidden = !coordinated && viewportWidth < 768;
		const prepareCoordinator = isSplitterHidden
			? (splitter: Locator) => expect(splitter).toBeHidden()
			: (splitter: Locator) => splitter.focus();
		const remainingFallbacks = isSplitterHidden ? 1 : 0;

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

for (const [width, navWidth, chatWidth, panelWidth, area, gap] of [
	[1000, 0, 320, 320, 'panel', 360],
	[1040, 288, 400, 320, 'main', 32],
	[1200, 240, 320, 320, 'panel', 320],
	[1280, 320, 320, 320, 'panel', 320],
	[1767, 320, 400, 400, 'panel', 647],
	[1768, 320, 400, 500, 'panel', 548],
	[1769, 320, 400, 500, 'panel', 549],
	[1984, 320, 400, 500, 'panel', 764],
] as const) {
	test(`all-open SSR keeps its geometry through hydration at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 900 });
		await page.visitExample<typeof import('../../../examples/panel-layout-all-open-ssr')>(
			'design-system',
			'navigation-system',
			'panel-layout-all-open-ssr',
			{ featureFlag: 'platform-dst-chat-panel-layout' },
		);
		const nav = page.getByTestId('ssr-side-nav');
		const chat = page.getByTestId('ssr-chat');
		const panel = page.getByRole('region', { name: 'Panel', exact: true });
		const assertGeometry = async () => {
			await expect.poll(async () => (await nav.boundingBox())?.width ?? 0).toBe(navWidth);
			await expect.poll(async () => (await chat.boundingBox())?.width).toBe(chatWidth);
			await expect.poll(async () => (await panel.boundingBox())?.width).toBe(panelWidth);
			await expect(panel).toHaveCSS('grid-area', area);
			await expect
				.poll(async () => {
					const p = (await panel.boundingBox())!;
					const n = await nav.boundingBox();
					return p.x - (n?.x ?? 0) - (n?.width ?? 0);
				})
				.toBe(gap);
		};
		await assertGeometry();
		await page.getByRole('button', { name: 'Hydrate layout' }).click();
		await assertGeometry();
		await page.getByRole('slider', { name: 'Resize panel', exact: true }).focus();
		await assertGeometry();
	});
}

test('local default follows XL viewport changes before and after sizing activates', async ({
	page,
}) => {
	await page.setViewportSize({ width: 1767, height: 900 });
	await page.visitExample<typeof import('../../../examples/panel-layout-all-open-ssr')>(
		'design-system',
		'navigation-system',
		'panel-layout-all-open-ssr',
		{ featureFlag: 'platform-dst-chat-panel-layout' },
	);
	const panel = page.getByRole('region', { name: 'Panel', exact: true });
	const chat = page.getByTestId('ssr-chat');
	await expect.poll(async () => (await panel.boundingBox())?.width).toBe(400);
	await page.setViewportSize({ width: 1768, height: 900 });
	await expect.poll(async () => (await panel.boundingBox())?.width).toBe(500);
	await page.getByRole('button', { name: 'Hydrate layout' }).click();
	await page.getByRole('slider', { name: 'Resize panel', exact: true }).focus();
	// Resize immediately: the lazy sizing chunk may still be loading.
	for (const [width, expected] of [
		[1767, 400],
		[1768, 500],
		[1984, 500],
	]) {
		await page.setViewportSize({ width, height: 900 });
		await expect.poll(async () => (await panel.boundingBox())?.width).toBe(expected);
		await expect.poll(async () => (await chat.boundingBox())?.width).toBe(400);
	}
});

for (const [width, expected, hostWidth, rootWidth] of [
	[1767, 400],
	[1768, 500],
	[1768, 400, 720],
	[1768, 500, 500],
	[1768, 320, 0, 1280],
]) {
	test(`unmeasured panel motion retains its viewport default at ${width}px in ${hostWidth || 'full'} host and ${rootWidth || 'full'} Root`, async ({
		page,
	}) => {
		await page.setViewportSize({ width, height: 900 });
		await page.emulateMedia({ reducedMotion: 'no-preference' });
		await page.visitExample<typeof import('../../../examples/panel-layout-all-open-ssr')>(
			'design-system',
			'navigation-system',
			'panel-layout-all-open-ssr',
			{
				featureFlag: ['platform-dst-chat-panel-layout', 'platform-dst-motion-uplift-panel'].join(
					',',
				),
			},
		);
		// Hold entry/exit long enough to measure the animation width, not only the settled frame.
		await page.addStyleTag({
			content: `[data-layout-with-panel-slot] { animation-duration: 2s !important; }
				${hostWidth ? `div:has(> [data-testid="ssr-layout"]) { width: ${hostWidth}px; }` : ''}
				${rootWidth ? `[data-layout-width-container] { width: ${rootWidth}px; }` : ''}`,
		});
		const panel = page.getByRole('region', { name: 'Panel', exact: true });
		await expect.poll(async () => (await panel.boundingBox())?.width).toBe(expected);
		await page.getByRole('button', { name: 'Hydrate layout' }).click();
		await expect.poll(async () => (await panel.boundingBox())?.width).toBe(expected);
		await expect(panel).toHaveCSS('animation-name', 'none');
		// The fixture control can be covered by a full-width overlay.
		await page.getByRole('button', { name: 'Toggle local panel' }).dispatchEvent('click');
		await expect(panel).not.toHaveCSS('animation-name', 'none');
		expect((await panel.boundingBox())?.width).toBeCloseTo(expected, 2);
		await expect(panel).toHaveCount(0);
		await expect
			.poll(async () => (await page.getByTestId('ssr-chat').boundingBox())?.width)
			.toBe(400);
		// The fixture control can be covered by a full-width overlay.
		await page.getByRole('button', { name: 'Toggle local panel' }).dispatchEvent('click');
		await expect(panel).not.toHaveCSS('animation-name', 'none');
		expect((await panel.boundingBox())?.width).toBeCloseTo(expected, 2);
		await expect(panel).toHaveCSS('animation-name', 'none');
		await expect.poll(async () => (await panel.boundingBox())?.width).toBe(expected);
	});
}
