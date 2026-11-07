import { expect, type Page, test } from '@af/integration-testing';

for (const coordinated of [false, true]) {
	test(`caller-owned panel resizes and retains content with chat layout ${coordinated ? 'on' : 'off'}`, async ({
		page,
	}) => {
		await page.setViewportSize({ width: 1600, height: 900 });
		await page.visitExample<typeof import('../../../examples/page-layout-caller-owned-panel')>(
			'design-system',
			'navigation-system',
			'page-layout-caller-owned-panel',
			coordinated ? { featureFlag: 'platform-dst-chat-panel-layout' } : undefined,
		);
		const panel = page.getByRole('region', { name: 'Preview', exact: true });
		const slider = page.getByRole('slider', { name: 'Resize preview', exact: true });
		const offset = page.getByTestId('caller-panel-offset');
		await expect.poll(async () => (await panel.boundingBox())?.width).toBe(400);
		await expect.poll(async () => (await offset.boundingBox())?.width).toBe(400);
		await slider.focus();
		await expect(slider).toHaveAttribute('max', '600');
		await slider.press('End');
		const maximum = 600;
		await expect.poll(async () => (await panel.boundingBox())?.width).toBe(maximum);
		await expect.poll(async () => (await offset.boundingBox())?.width).toBe(maximum);
		await expect(page.getByTestId('caller-resize-result')).toContainText(`"finalWidth":${maximum}`);
		await expect
			.poll(async () => (await page.getByTestId('caller-side-nav').boundingBox())?.width)
			.toBe(320);

		// Pointer input uses the same bounds and updates the main/panel grid together.
		const handle = page
			.getByTestId('caller-layout--panel-slot--splitter')
			.and(page.locator('[draggable="true"]'));
		const box = await handle.boundingBox();
		expect(box).not.toBeNull();
		const x = box!.x + box!.width / 2;
		const y = box!.y + 80;
		// Exceed the 600px -> 320px resize limit without leaving the viewport:
		// Firefox cannot deliver the drop to the page when released outside it.
		const endX = x + 400;
		await page.mouse.move(x, y);
		await page.mouse.down();
		await page.mouse.move(x + 10, y);
		await page.mouse.move(endX, y, { steps: 10 });
		await page.mouse.move(endX, y);
		await expect.poll(async () => (await panel.boundingBox())?.width).toBe(320);
		await expect.poll(async () => (await offset.boundingBox())?.width).toBe(320);
		await page.mouse.up();
		await expect.poll(async () => (await panel.boundingBox())?.width).toBe(320);
		await expect(page.getByTestId('caller-resize-result')).toContainText('"finalWidth":320');
		await expect(page.getByTestId('caller-layout')).toHaveJSProperty(
			'scrollWidth',
			await page.getByTestId('caller-layout').evaluate((el) => el.clientWidth),
		);
		await page.getByRole('button', { name: 'Replace preview', exact: true }).click();
		await expect(page.getByRole('heading', { name: 'Second preview', exact: true })).toBeVisible();
		await page.getByRole('button', { name: 'Close preview', exact: true }).click();
		await expect(panel).toHaveCount(0);
		await expect.poll(async () => (await offset.boundingBox())?.width).toBe(0);
		await page.getByRole('button', { name: 'Open preview', exact: true }).click();
		await expect.poll(async () => (await panel.boundingBox())?.width).toBe(320);
		await expect.poll(async () => (await offset.boundingBox())?.width).toBe(320);
		await page.getByRole('button', { name: 'Set width to 480', exact: true }).click();
		await expect.poll(async () => (await panel.boundingBox())?.width).toBe(480);
		await expect.poll(async () => (await offset.boundingBox())?.width).toBe(480);
	});
}

test('coordinates local-panel placement with viewport, navigation and chat', async ({ page }) => {
	await page.setViewportSize({ width: 1600, height: 900 });
	await page.visitExample<typeof import('../../../examples/page-layout-caller-owned-panel')>(
		'design-system',
		'navigation-system',
		'page-layout-caller-owned-panel',
		{ featureFlag: 'platform-dst-chat-panel-layout' },
	);
	const panel = page.getByRole('region', { name: 'Preview', exact: true });
	const offset = page.getByTestId('caller-panel-offset');
	await page.getByRole('button', { name: 'Open chat', exact: true }).click();
	await expect(panel).toHaveCSS('grid-area', 'panel');
	const localSlider = page.getByRole('slider', { name: 'Resize preview', exact: true });
	await localSlider.focus();
	// Exercise widths that fit beside the other regions. The upstream coordinator's
	// End bound now also permits cascading into those regions.
	for (let step = 0; step < 8; step++) {
		await localSlider.press('ArrowRight');
	}
	await expect.poll(async () => (await panel.boundingBox())?.width).toBe(560);
	await expect
		.poll(async () => (await page.getByTestId('caller-chat').boundingBox())?.width)
		.toBe(400);
	await localSlider.press('Home');
	await expect.poll(async () => (await panel.boundingBox())?.width).toBe(320);
	const chatSlider = page.getByRole('slider', { name: 'Resize chat', exact: true });
	await chatSlider.focus();
	for (let step = 0; step < 12; step++) {
		await chatSlider.press('ArrowRight');
	}
	await expect
		.poll(async () => (await page.getByTestId('caller-chat').boundingBox())?.width)
		.toBe(640);
	await expect.poll(async () => (await panel.boundingBox())?.width).toBe(320);
	const navSlider = page.getByRole('slider', { name: 'Resize navigation', exact: true });
	await navSlider.focus();
	await navSlider.press('Home');
	await expect
		.poll(async () => (await page.getByTestId('caller-side-nav').boundingBox())?.width)
		.toBe(240);
	await expect
		.poll(async () => (await page.getByTestId('caller-chat').boundingBox())?.width)
		.toBe(640);
	await page.setViewportSize({ width: 1100, height: 900 });
	await expect(panel).toHaveCSS('grid-area', 'main');
	// Overlay constraints can make the displayed width smaller than the saved preference.
	await expect
		.poll(async () => (await offset.boundingBox())!.width - (await panel.boundingBox())!.width)
		.toBe(0);
	await page.getByRole('button', { name: 'Collapse navigation', exact: true }).click();
	await expect(panel).toHaveCSS('grid-area', 'panel');
	await page.setViewportSize({ width: 900, height: 900 });
	await expect(panel).toHaveCSS('grid-area', 'main');
	await page.getByRole('button', { name: 'Close chat', exact: true }).click();
	await expect(panel).toHaveCSS('grid-area', 'panel');
	await page.setViewportSize({ width: 600, height: 900 });
	await expect(panel).toHaveCSS('grid-area', 'main');
	// The caller accepted the earlier 320px keyboard resize as its controlled width.
	await expect.poll(async () => (await panel.boundingBox())?.width).toBe(320);
	await page.setViewportSize({ width: 300, height: 900 });
	await expect.poll(async () => (await panel.boundingBox())?.width).toBe(320);
	await expect.poll(async () => (await offset.boundingBox())?.width).toBe(320);
	await expect.poll(async () => (await panel.boundingBox())?.y).toBe(56);
	await expect(page.getByTestId('caller-layout')).toHaveJSProperty('scrollWidth', 300);
});

for (const width of [1024, 1028, 1040]) {
	test(`local overlay leaves 32px clearance before and after activation at ${width}px`, async ({
		page,
	}) => {
		await page.setViewportSize({ width, height: 900 });
		await page.visitExample<typeof import('../../../examples/page-layout-caller-owned-panel')>(
			'design-system',
			'navigation-system',
			'page-layout-caller-owned-panel',
			{ featureFlag: 'platform-dst-chat-panel-layout' },
		);
		await page.getByRole('button', { name: 'Open chat', exact: true }).click();
		const panel = page.getByRole('region', { name: 'Preview', exact: true });
		const nav = page.getByTestId('caller-side-nav');
		const chat = page.getByTestId('caller-chat');
		const gap = async () => {
			const p = (await panel.boundingBox())!;
			const n = (await nav.boundingBox())!;
			return p.x - n.x - n.width;
		};
		await expect.poll(async () => (await panel.boundingBox())?.width).toBe(320);
		await expect.poll(async () => (await nav.boundingBox())?.width).toBe(288);
		await expect.poll(async () => (await chat.boundingBox())?.width).toBe(width - 640);
		await expect.poll(gap).toBe(32);
		const slider = page.getByRole('slider', { name: 'Resize preview', exact: true });
		await slider.focus();
		await expect(slider).toHaveAttribute('max', '368');
		await expect.poll(gap).toBe(32);
		await slider.press('End');
		await expect.poll(async () => (await panel.boundingBox())?.width).toBe(368);
		await expect.poll(async () => (await nav.boundingBox())?.width).toBe(240);
		await expect.poll(async () => (await chat.boundingBox())?.width).toBe(width - 640);
		await expect.poll(gap).toBe(32);
		// A second End uses already-ready bounds, not the first-interaction replay path.
		await slider.press('Home');
		await slider.press('End');
		await expect.poll(async () => (await panel.boundingBox())?.width).toBe(368);
		await slider.press('Home');
		await expect.poll(async () => (await panel.boundingBox())?.width).toBe(320);
		const handle = page
			.getByTestId('caller-layout--panel-slot--splitter')
			.and(page.locator('[draggable="true"]'));
		const box = (await handle.boundingBox())!;
		const x = box.x + box.width / 2;
		const y = box.y + 80;
		await page.mouse.move(x, y);
		await page.mouse.down();
		await page.mouse.move(x - 10, y);
		await page.mouse.move(x - 150, y, { steps: 10 });
		await expect.poll(async () => (await panel.boundingBox())?.width).toBe(368);
		await expect.poll(gap).toBe(32);
		await page.mouse.up();
		await expect.poll(async () => (await panel.boundingBox())?.width).toBe(368);
		await page.getByRole('button', { name: 'Close preview', exact: true }).click();
		await expect.poll(async () => (await nav.boundingBox())?.width).toBe(320);
		await expect.poll(async () => (await chat.boundingBox())?.width).toBe(width - 640);
	});
}

test('SideNav stops at 429px beside local overlay and can shrink again', async ({ page }) => {
	await page.setViewportSize({ width: 1101, height: 900 });
	await page.visitExample<typeof import('../../../examples/page-layout-caller-owned-panel')>(
		'design-system',
		'navigation-system',
		'page-layout-caller-owned-panel',
		{ featureFlag: 'platform-dst-chat-panel-layout' },
	);
	await page.getByRole('button', { name: 'Open chat', exact: true }).click();
	const panel = page.getByRole('region', { name: 'Preview', exact: true });
	const localSlider = page.getByRole('slider', { name: 'Resize preview', exact: true });
	await localSlider.focus();
	await localSlider.press('Home');
	const navSlider = page.getByRole('slider', { name: 'Resize navigation', exact: true });
	await navSlider.focus();
	await expect(navSlider).toHaveAttribute('max', '429');
	await navSlider.press('End');
	await expect(page.getByTestId('caller-side-nav')).toHaveWidth(429);
	await expect(page.getByTestId('caller-chat')).toHaveWidth(320);
	await expect.poll(async () => (await panel.boundingBox())?.width).toBe(320);
	await navSlider.press('Home');
	await expect
		.poll(async () => (await page.getByTestId('caller-side-nav').boundingBox())?.width)
		.toBe(240);
	await page.getByRole('button', { name: 'Close preview', exact: true }).click();
	await expect
		.poll(async () => (await page.getByTestId('caller-side-nav').boundingBox())?.width)
		.toBe(240);
});

for (const width of [1200, 1280]) {
	test(`fits local inline before interaction at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 900 });
		await page.visitExample<typeof import('../../../examples/page-layout-caller-owned-panel')>(
			'design-system',
			'navigation-system',
			'page-layout-caller-owned-panel',
			{ featureFlag: 'platform-dst-chat-panel-layout' },
		);
		await page.getByRole('button', { name: 'Open chat', exact: true }).click();
		const panel = page.getByRole('region', { name: 'Preview', exact: true });
		const nav = page.getByTestId('caller-side-nav');
		const chat = page.getByTestId('caller-chat');
		await expect(panel).toHaveCSS('grid-area', 'panel');
		await expect.poll(async () => (await panel.boundingBox())?.width).toBe(320);
		await expect.poll(async () => (await nav.boundingBox())?.width).toBe(width - 960);
		await expect.poll(async () => (await chat.boundingBox())?.width).toBe(320);
		await page.getByRole('slider', { name: 'Resize preview', exact: true }).focus();
		await expect(panel).toHaveCSS('grid-area', 'panel');
		await expect.poll(async () => (await panel.boundingBox())?.width).toBe(320);
		await expect.poll(async () => (await nav.boundingBox())?.width).toBe(width - 960);
		await expect.poll(async () => (await chat.boundingBox())?.width).toBe(320);
	});
}

test('keyboard shrinking starts from the effective width after viewport compression', async ({
	page,
}) => {
	await page.setViewportSize({ width: 1101, height: 900 });
	await page.visitExample<typeof import('../../../examples/page-layout-caller-owned-panel')>(
		'design-system',
		'navigation-system',
		'page-layout-caller-owned-panel',
		{ featureFlag: 'platform-dst-chat-panel-layout' },
	);
	await page.getByRole('button', { name: 'Open chat', exact: true }).click();
	const panel = page.getByRole('region', { name: 'Preview', exact: true });
	const slider = page.getByRole('slider', { name: 'Resize preview', exact: true });
	const nav = page.getByTestId('caller-side-nav');
	await slider.focus();
	await slider.press('End');
	await expect.poll(async () => (await panel.boundingBox())?.width).toBe(414);
	await page.setViewportSize({ width: 1040, height: 900 });
	await expect.poll(async () => (await panel.boundingBox())?.width).toBe(320);
	await expect(slider).toBeFocused();
	await slider.press('ArrowDown');
	await expect(page.getByTestId('caller-resize-result')).toContainText('"finalWidth":320');
	await expect.poll(async () => (await panel.boundingBox())?.width).toBe(320);
	await expect.poll(async () => (await nav.boundingBox())?.width).toBe(288);
	await slider.press('ArrowUp');
	await expect.poll(async () => (await panel.boundingBox())?.width).toBe(340);
	await slider.press('ArrowDown');
	await expect(page.getByTestId('caller-resize-result')).toContainText('"finalWidth":320');
	await expect.poll(async () => (await panel.boundingBox())?.width).toBe(320);
});

test('caps a saved overlay width consistently before and after activation', async ({ page }) => {
	await page.setViewportSize({ width: 1600, height: 900 });
	await page.visitExample<typeof import('../../../examples/page-layout-caller-owned-panel')>(
		'design-system',
		'navigation-system',
		'page-layout-caller-owned-panel',
		{ featureFlag: 'platform-dst-chat-panel-layout' },
	);
	await page.getByRole('button', { name: 'Set width to 480', exact: true }).click();
	await page.setViewportSize({ width: 900, height: 900 });
	await page.getByRole('button', { name: 'Open chat', exact: true }).click();
	const panel = page.getByRole('region', { name: 'Preview', exact: true });
	const slider = page.getByRole('slider', { name: 'Resize preview', exact: true });
	await expect(panel).toHaveCSS('grid-area', 'main');
	await expect.poll(async () => (await panel.boundingBox())?.width, { timeout: 5000 }).toBe(450);
	await slider.focus();
	await expect(slider).toHaveAttribute('max', '450');
	await expect.poll(async () => (await panel.boundingBox())?.width).toBe(450);
	await page.setViewportSize({ width: 920, height: 900 });
	await expect.poll(async () => (await panel.boundingBox())!.width).toBe(468);
	await slider.press('ArrowUp');
	await expect(page.getByTestId('caller-resize-result')).toContainText('"mode":"overlay"');
	await expect.poll(async () => (await panel.boundingBox())!.width).toBe(468);
});

for (const { width, navWidth, area } of [
	{ width: 1024, navWidth: 320, area: 'main' },
	{ width: 1040, navWidth: 240, area: 'panel' },
]) {
	test(`fits custom local minimum before and after activation at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width: 1600, height: 900 });
		await page.visitExample<typeof import('../../../examples/page-layout-caller-owned-panel')>(
			'design-system',
			'navigation-system',
			'page-layout-caller-owned-panel',
			{ featureFlag: 'platform-dst-chat-panel-layout' },
		);
		await page.getByRole('button', { name: 'Set panel minimum to 480', exact: true }).click();
		await page.setViewportSize({ width, height: 900 });
		await page.getByRole('button', { name: 'Open chat', exact: true }).click();
		const panel = page.getByRole('region', { name: 'Preview', exact: true });
		const nav = page.getByTestId('caller-side-nav');
		const chat = page.getByTestId('caller-chat');
		const gap = async () => {
			const p = (await panel.boundingBox())!;
			const n = (await nav.boundingBox())!;
			return p.x - n.x - n.width;
		};
		await expect(panel).toHaveCSS('grid-area', area);
		await expect(chat).toHaveCSS('grid-area', '2 / 1 / -1 / -1');
		await expect.poll(async () => (await panel.boundingBox())?.width).toBe(480);
		await expect.poll(async () => (await nav.boundingBox())?.width).toBe(navWidth);
		await expect.poll(gap).toBeGreaterThanOrEqual(32);
		await page.getByRole('slider', { name: 'Resize preview', exact: true }).focus();
		await expect(panel).toHaveCSS('grid-area', area);
		await expect(chat).toHaveCSS('grid-area', '2 / 1 / -1 / -1');
		await expect.poll(async () => (await panel.boundingBox())?.width).toBe(480);
		await expect.poll(async () => (await nav.boundingBox())?.width).toBe(navWidth);
		await expect.poll(gap).toBeGreaterThanOrEqual(32);
	});
}

for (const { rootWidth, navWidth, chatWidth, navArea, chatArea } of [
	{
		rootWidth: 700,
		navWidth: 288,
		chatWidth: 380,
		navArea: 'main',
		chatArea: 'chat-panel',
	},
	{
		rootWidth: 752,
		navWidth: 240,
		chatWidth: 400,
		navArea: 'side-nav',
		chatArea: '2 / 1 / -1 / -1',
	},
]) {
	test(`fits a custom local minimum in a ${rootWidth}px constrained Root`, async ({ page }) => {
		await page.setViewportSize({ width: 1600, height: 900 });
		await page.visitExample<typeof import('../../../examples/page-layout-caller-owned-panel')>(
			'design-system',
			'navigation-system',
			'page-layout-caller-owned-panel',
			{ featureFlag: 'platform-dst-chat-panel-layout' },
		);
		await page.getByRole('button', { name: 'Set panel minimum to 480', exact: true }).click();
		await page.addStyleTag({ content: `[data-layout-width-container] { width: ${rootWidth}px; }` });
		await page.getByRole('button', { name: 'Open chat', exact: true }).click();
		const panel = page.getByRole('region', { name: 'Preview', exact: true });
		const nav = page.getByTestId('caller-side-nav');
		const chat = page.getByTestId('caller-chat');
		await expect(nav).toHaveCSS('grid-area', navArea);
		await expect(chat).toHaveCSS('grid-area', chatArea);
		await expect.poll(async () => (await nav.boundingBox())?.width).toBe(navWidth);
		await expect.poll(async () => (await chat.boundingBox())?.width).toBe(chatWidth);
		await expect.poll(async () => (await panel.boundingBox())?.width).toBe(480);
		await page.getByRole('slider', { name: 'Resize preview', exact: true }).focus();
		await expect(nav).toHaveCSS('grid-area', navArea);
		await expect(chat).toHaveCSS('grid-area', chatArea);
		await expect.poll(async () => (await nav.boundingBox())?.width).toBe(navWidth);
		await expect.poll(async () => (await chat.boundingBox())?.width).toBe(chatWidth);
		await expect.poll(async () => (await panel.boundingBox())?.width).toBe(480);
	});
}

for (const viewportWidth of [1000, 1600]) {
	// The desktop case also covers a constrained Root with explicitly collapsed navigation.
	const prepare =
		viewportWidth >= 1024
			? async (page: Page) => {
					await page.getByRole('button', { name: 'Collapse navigation', exact: true }).click();
					await page.addStyleTag({ content: '[data-layout-width-container] { width: 1000px; }' });
				}
			: async (_page: Page) => undefined;

	test(`fits local and Chat inline without SideNav at viewport ${viewportWidth}`, async ({
		page,
	}) => {
		await page.setViewportSize({ width: viewportWidth, height: 900 });
		await page.visitExample<typeof import('../../../examples/page-layout-caller-owned-panel')>(
			'design-system',
			'navigation-system',
			'page-layout-caller-owned-panel',
			{ featureFlag: 'platform-dst-chat-panel-layout' },
		);

		await prepare(page);
		await page.getByRole('button', { name: 'Open chat', exact: true }).click();
		const panel = page.getByRole('region', { name: 'Preview', exact: true });
		const chat = page.getByTestId('caller-chat');
		const assertGeometry = async () => {
			await expect(panel).toHaveCSS('grid-area', 'panel');
			await expect.poll(async () => (await panel.boundingBox())?.width).toBe(320);
			await expect.poll(async () => (await chat.boundingBox())?.width).toBe(360);
		};
		await assertGeometry();
		await page.getByRole('slider', { name: 'Resize preview', exact: true }).focus();
		await assertGeometry();
	});
}
