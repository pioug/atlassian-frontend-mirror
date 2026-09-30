import { expect, test } from '@af/integration-testing';

test('caps overlay navigation to Main inside a constrained Root with an Aside', async ({
	page,
}) => {
	await page.setViewportSize({ width: 1200, height: 900 });
	await page.visitExample<typeof import('../../../examples/resizable-slots.tsx')>(
		'design-system',
		'navigation-system',
		'resizable-slots',
		{ featureFlag: 'platform-dst-chat-panel-layout' },
	);
	// Constrain the host without changing the viewport or the real Aside's 400px track.
	await page.addStyleTag({ content: '#unsafe-design-system-page-layout-root { width: 900px; }' });
	const nav = page.getByTestId('side-nav');
	const main = page.getByRole('main');
	await expect(main).toHaveWidth(500);
	const slider = page.getByRole('slider', { name: 'Resize sidebar', exact: true });
	await slider.focus();
	await expect(slider).toHaveAttribute('max', '450');
	await slider.press('End');
	const keyboardWidth = Number(await slider.inputValue());
	await expect(nav).toHaveWidth(keyboardWidth);
	expect(keyboardWidth).toBeLessThanOrEqual(450);
	await expect(
		page.getByText(`Last called with: {"initialWidth":320,"finalWidth":${keyboardWidth}}`, {
			exact: true,
		}),
	).toBeVisible();

	// The same bound also applies to a pointer dragged beyond the covered region.
	const handle = page
		.getByTestId('side-nav-slot-panel-splitter')
		.and(page.locator('[draggable="true"]'));
	const box = await handle.boundingBox();
	expect(box).not.toBeNull();
	const x = box!.x + box!.width / 2;
	const y = box!.y + Math.min(100, box!.height / 2);
	await page.mouse.move(x, y);
	await page.mouse.down();
	await page.mouse.move(x + 10, y);
	await page.mouse.move(850, y, { steps: 10 });
	await page.mouse.move(850, y);
	await expect(nav).toHaveWidth(450);
	await page.mouse.up();
	await expect(nav).toHaveWidth(450);
	await expect(main).toHaveWidth(500);
});

for (const width of [600, 300]) {
	test(`chat overlay keyboard width matches its rendered width in a ${width}px Root`, async ({
		page,
	}) => {
		// Splitters are intentionally hidden below 48rem. Keep the viewport desktop
		// sized while constraining the actual region available to the overlay.
		await page.setViewportSize({ width: 1200, height: 900 });
		await page.visitExample<typeof import('../../../examples/page-layout-chat-panel.tsx')>(
			'design-system',
			'navigation-system',
			'page-layout-chat-panel',
		);
		const slider = page.getByRole('slider', { name: 'Resize chat panel', exact: true });
		await page.getByRole('button', { name: 'Collapse side navigation', exact: true }).click();
		await page.getByRole('button', { name: 'Ask Rovo', exact: true }).click();
		await page.addStyleTag({
			content: `#unsafe-design-system-page-layout-root { width: ${width}px; }`,
		});
		const chat = page.getByRole('region', { name: 'Chat panel', exact: true });
		// Root is measured asynchronously. Wait for the resulting overlay geometry
		// before focus snapshots the slider bounds (not merely for the CSS width change).
		await expect(page.getByRole('main')).toHaveWidth(Math.max(320, width));
		await expect(chat).toHaveWidth(Math.min(400, width * 0.9));
		await slider.focus();
		await expect(slider).toHaveAttribute('min', String(Math.min(320, width * 0.9)));
		await expect(slider).toHaveAttribute('max', String(width * 0.9));
		await slider.press('End');
		await expect(slider).toHaveValue(String(width * 0.9));
		await expect(chat).toHaveWidth(width * 0.9);
	});
}
