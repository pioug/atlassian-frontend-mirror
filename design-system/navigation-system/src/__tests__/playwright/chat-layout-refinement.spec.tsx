import { expect, type Page, test } from '@af/integration-testing';

async function visit(page: Page, width: number) {
	await page.setViewportSize({ width, height: 900 });
	await page.visitExample<typeof import('../../../examples/page-layout-chat-panel.tsx')>(
		'design-system',
		'navigation-system',
		'page-layout-chat-panel',
	);
}

for (const width of [800, 1023]) {
	test(`compact defaults remain 320px before and after activation at ${width}px`, async ({
		page,
	}) => {
		await visit(page, width);
		await page.getByRole('button', { name: 'Ask Rovo', exact: true }).click();
		await page.getByRole('button', { name: 'open local panel', exact: true }).click();
		const panel = page.getByTestId('layout-with-panel--panel-slot');
		const chat = page.getByRole('region', { name: 'Chat panel', exact: true });
		await expect(panel).toHaveWidth(320);
		await expect(chat).toHaveWidth(320);
		const slider = page.getByRole('slider', { name: 'Resize chat panel', exact: true });
		await slider.focus();
		await expect(slider).not.toHaveAttribute('max', '500');
		await expect(panel).toHaveWidth(320);
		await expect(chat).toHaveWidth(320);
		await slider.blur();
		await page.setViewportSize({ width: 1600, height: 900 });
		await expect.poll(async () => (await chat.boundingBox())?.width).toBe(400);
		await expect(panel).toHaveWidth(400);
		await page.setViewportSize({ width, height: 900 });
		await expect.poll(async () => (await chat.boundingBox())?.width).toBe(320);
		await expect(panel).toHaveWidth(320);
		// A real resize is a preference, unlike automatic viewport compression.
		await slider.focus();
		await slider.press('ArrowRight');
		await expect.poll(async () => (await chat.boundingBox())?.width).toBe(340);
		await slider.blur();
		await page.setViewportSize({ width: 1600, height: 900 });
		await expect.poll(async () => (await chat.boundingBox())?.width).toBe(340);
	});
}

for (const area of ['panel', 'chat panel']) {
	test(`growing ${area} stops with desktop SideNav still inline`, async ({ page }) => {
		await visit(page, 1600);
		await page.getByRole('button', { name: 'Ask Rovo', exact: true }).click();
		await page.getByRole('button', { name: 'open local panel', exact: true }).click();
		const slider = page.getByRole('slider', { name: `Resize ${area}`, exact: true });
		await slider.focus();
		await slider.press('End');
		const nav = page.getByRole('navigation', { name: 'Sidebar' });
		await expect(nav).toBeVisible();
		await expect(nav).toHaveWidth(240);
		await expect.poll(() => nav.evaluate((el) => getComputedStyle(el).gridArea)).toBe('side-nav');
		await expect(page.getByTestId('layout-with-panel--panel-slot')).toHaveWidth(
			area === 'panel' ? 640 : 320,
		);
		await expect(page.getByRole('region', { name: 'Chat panel', exact: true })).toHaveWidth(
			area === 'panel' ? 400 : 720,
		);
		await slider.blur();
	});
}

test('one local drag can shrink wide Chat to its minimum and reverse without release', async ({
	page,
}) => {
	await visit(page, 1920);
	await page.getByRole('button', { name: 'Ask Rovo', exact: true }).click();
	await page.getByRole('button', { name: 'open local panel', exact: true }).click();
	const chatSlider = page.getByRole('slider', { name: 'Resize chat panel', exact: true });
	await chatSlider.focus();
	// Keep navigation present in both implementations when preparing the regression.
	for (let i = 0; i < 32; i++) {
		await chatSlider.press('ArrowRight');
	}
	const chat = page.getByRole('region', { name: 'Chat panel', exact: true });
	await expect(chat).toHaveWidth(1040);
	const panel = page.getByTestId('layout-with-panel--panel-slot');
	await expect(panel).toHaveWidth(320);
	await chatSlider.blur();
	const handle = page
		.getByTestId('layout-with-panel--panel-slot--splitter')
		.and(page.locator('[draggable="true"]'));
	const box = (await handle.boundingBox())!;
	const x = box.x + box.width / 2;
	const y = box.y + 100;
	await page.mouse.move(x, y);
	await page.mouse.down();
	await page.mouse.move(x + 10, y);
	for (const delta of [400, 720, 600]) {
		await page.mouse.move(x + delta, y, { steps: 10 });
		await page.mouse.move(x + delta, y);
		await expect(panel).toHaveWidth(320);
		await expect.poll(async () => (await chat.boundingBox())?.width).toBe(1040 - delta);
	}
	await page.mouse.up();
	await expect(chat).toHaveWidth(440);
});

for (const { width, openButtons } of [
	{ width: 600, openButtons: ['Show more', 'Ask Rovo'] },
	{ width: 800, openButtons: ['Ask Rovo'] },
]) {
	test(`opening Rovo while mobile SideNav is open keeps Rovo open at ${width}px`, async ({
		page,
	}) => {
		await visit(page, width);
		await page.getByRole('button', { name: 'Expand side navigation', exact: true }).click();
		await expect(page.getByRole('navigation', { name: 'Sidebar' })).toBeVisible();
		for (const name of openButtons) {
			await page.getByRole('button', { name, exact: true }).click();
		}
		await expect(page.getByRole('region', { name: 'Chat panel', exact: true })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Ask Rovo', exact: true })).toBeHidden();
	});
}
