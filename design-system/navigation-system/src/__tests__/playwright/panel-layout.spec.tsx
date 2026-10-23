import { expect, test } from '@af/integration-testing';

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
		await expect(offset).toHaveWidth(400);
		await slider.focus();
		await expect(slider).toHaveAttribute('max', '600');
		await slider.press('End');
		const maximum = 600;
		await expect.poll(async () => (await panel.boundingBox())?.width).toBe(maximum);
		await expect(offset).toHaveWidth(maximum);
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
		await expect(offset).toHaveWidth(320);
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
		await expect(offset).toHaveWidth(0);
		await page.getByRole('button', { name: 'Open preview', exact: true }).click();
		await expect.poll(async () => (await panel.boundingBox())?.width).toBe(320);
		await expect(offset).toHaveWidth(320);
		await page.getByRole('button', { name: 'Set width to 480', exact: true }).click();
		await expect.poll(async () => (await panel.boundingBox())?.width).toBe(480);
		await expect(offset).toHaveWidth(480);
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
	await expect.poll(async () => (await panel.boundingBox())?.width).toBe(270);
	await expect(offset).toHaveWidth(270);
	await expect.poll(async () => (await panel.boundingBox())?.y).toBe(56);
	await expect(page.getByTestId('caller-layout')).toHaveJSProperty('scrollWidth', 300);
});
