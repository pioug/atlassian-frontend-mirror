import { expect, type Page, test } from '@af/integration-testing';

for (const { mode, buttons, expected } of [
	{
		mode: 'inline',
		buttons: ['open local panel'],
		expected: {
			gridArea: 'panel',
			backgroundColor: 'rgb(255, 255, 255)',
			insetBlockStart: '0px',
			borderInlineStartWidth: '1px',
			borderInlineStartStyle: 'solid',
			boxShadow: 'none',
		},
	},
	{
		mode: 'overlay',
		buttons: ['Ask Rovo', 'open local panel'],
		expected: {
			gridArea: 'main',
			backgroundColor: 'rgb(235, 235, 235)',
			insetBlockStart: '0px',
			borderInlineStartWidth: '0px',
			borderInlineStartStyle: 'none',
			boxShadow: expect.not.stringMatching(/^none$/),
		},
	},
]) {
	test(`local ${mode} presentation follows container placement before and after sizing activation`, async ({
		page,
	}) => {
		await page.setViewportSize({ width: 1300, height: 900 });
		await page.visitExample<typeof import('../../../examples/page-layout-chat-panel.tsx')>(
			'design-system',
			'navigation-system',
			'page-layout-chat-panel',
		);
		// Give the two surface tokens distinct, accessible colours so this also
		// catches the background mismatch hidden by the default light theme.
		await page.addStyleTag({
			content:
				'[data-layout-width-container] { --ds-surface: rgb(255, 255, 255); --ds-surface-overlay: rgb(235, 235, 235); }',
		});
		for (const name of buttons) {
			await page.getByRole('button', { name, exact: true }).click();
		}
		const panel = page.getByTestId('layout-with-panel--panel-slot');
		const presentation = () =>
			panel.evaluate((element) => {
				const style = getComputedStyle(element);
				return {
					gridArea: style.gridArea,
					backgroundColor: style.backgroundColor,
					insetBlockStart: style.insetBlockStart,
					borderInlineStartWidth: style.borderInlineStartWidth,
					borderInlineStartStyle: style.borderInlineStartStyle,
					boxShadow: style.boxShadow,
				};
			});
		const slider = page.getByRole('slider', { name: 'Resize panel', exact: true });
		await expect(slider).toHaveAttribute('max', '500');
		await expect.poll(presentation).toEqual(expected);
		const before = await presentation();
		const width = (await panel.boundingBox())!.width;
		// The surface is sticky inside Main, which already starts below the banner and TopNav.
		await expect.poll(async () => (await panel.boundingBox())?.y).toBe(104);
		await slider.focus();
		await expect(slider).not.toHaveAttribute('max', '500');
		await expect.poll(presentation).toEqual(before);
		await expect(panel).toHaveWidth(width);
		await expect.poll(async () => (await panel.boundingBox())?.y).toBe(104);
		await slider.blur();
		await page.mouse.move(0, 0);
		await expect(page.getByRole('tooltip')).toBeHidden();
	});
}

async function prepareLocalOverlay(page: Page) {
	await page.setViewportSize({ width: 1300, height: 900 });
	await page.visitExample<typeof import('../../../examples/page-layout-chat-panel.tsx')>(
		'design-system',
		'navigation-system',
		'page-layout-chat-panel',
	);
	await page.getByRole('button', { name: 'Ask Rovo', exact: true }).click();
	await page.getByRole('button', { name: 'open local panel', exact: true }).click();
	const panel = page.getByTestId('layout-with-panel--panel-slot');
	const nav = page.getByRole('navigation', { name: 'Sidebar' });
	const chat = page.getByRole('region', { name: 'Chat panel', exact: true });
	const main = page.getByRole('main');
	const assertLayout = async (panelWidth: number) => {
		await expect.poll(async () => (await panel.boundingBox())?.width).toBe(panelWidth);
		await expect
			.poll(() => panel.evaluate((element) => getComputedStyle(element).gridArea))
			.not.toBe('panel');
		await expect(nav).toHaveWidth(320);
		await expect(chat).toHaveWidth(400);
		await expect(main).toHaveWidth(580);
	};
	await assertLayout(400);
	const slider = page.getByRole('slider', { name: 'Resize panel', exact: true });
	await slider.focus();
	await expect(slider).toHaveAttribute('max', '522');
	await assertLayout(400);
	return { slider, assertLayout };
}

test('local overlay keyboard resizing preserves its mode and inline siblings', async ({ page }) => {
	const { slider, assertLayout } = await prepareLocalOverlay(page);
	// Keyboard completion has no start/preview callbacks.
	await slider.press('ArrowRight');
	await expect(slider).toHaveValue('420');
	await assertLayout(420);
	await slider.blur();
	await page.mouse.move(0, 0);
	await expect(page.getByRole('tooltip')).toBeHidden();
	// A genuine layout change releases the mode snapshot; resizing must not pin
	// the panel in overlay forever once enough room becomes available.
	await page.setViewportSize({ width: 1600, height: 900 });
	const panel = page.getByTestId('layout-with-panel--panel-slot');
	await expect
		.poll(() => panel.evaluate((element) => getComputedStyle(element).gridArea))
		.toBe('panel');
	// The same user preference is retained when returning inline.
	await expect.poll(async () => (await panel.boundingBox())?.width).toBe(420);
});

test('local overlay pointer resizing preserves its mode and inline siblings', async ({ page }) => {
	const { slider, assertLayout } = await prepareLocalOverlay(page);
	const handle = page
		.getByTestId('layout-with-panel--panel-slot--splitter')
		.and(page.locator('[draggable="true"]'));
	const box = await handle.boundingBox();
	expect(box).not.toBeNull();
	const x = box!.x + box!.width / 2;
	const y = box!.y + Math.min(100, box!.height / 2);
	await page.mouse.move(x, y);
	await page.mouse.down();
	await page.mouse.move(x - 10, y);
	await page.mouse.move(x - 50, y, { steps: 10 });
	await page.mouse.move(x - 50, y);
	await assertLayout(450);
	await page.mouse.up();
	await assertLayout(450);
	await slider.blur();
	await page.mouse.move(0, 0);
	await expect(page.getByRole('tooltip')).toBeHidden();
});

test('resizing Aside after activation releases the adopted layout without a viewport resize', async ({
	page,
}) => {
	await page.setViewportSize({ width: 1600, height: 900 });
	await page.visitExample<typeof import('../../../examples/resizable-slots.tsx')>(
		'design-system',
		'navigation-system',
		'resizable-slots',
		{ featureFlag: 'platform-dst-chat-panel-layout' },
	);
	const nav = page.getByTestId('side-nav');
	const main = page.getByRole('main');
	await expect(nav).toHaveWidth(320);
	await expect(main).toHaveWidth(530);
	const navSlider = page.getByRole('slider', { name: 'Resize sidebar', exact: true });
	await navSlider.focus();
	await expect(navSlider).toHaveAttribute('max', '530');
	await expect(nav).toHaveWidth(320);
	await expect(main).toHaveWidth(530);
	await navSlider.blur();
	// This existing slot is not managed by the allocator; its own splitter changes
	// the occupied track without changing Root or the viewport.
	const asideSlider = page.getByRole('slider', { name: 'Resize aside', exact: true });
	await asideSlider.focus();
	await asideSlider.press('End');
	await expect(page.locator('#aside')).toHaveWidth(800);
	await expect(main).toHaveWidth(450);
	await expect
		.poll(() => nav.evaluate((element) => getComputedStyle(element).gridArea))
		.toBe('main');
	await expect
		.poll(() =>
			main.evaluate((element) => {
				const root = element.parentElement!;
				return root.scrollWidth <= root.clientWidth;
			}),
		)
		.toBe(true);
	await asideSlider.blur();
	await page.mouse.move(0, 0);
	await expect(page.getByRole('tooltip')).toBeHidden();
});

test('collapsed SideNav flyout does not consume an inline track', async ({ page }) => {
	await page.setViewportSize({ width: 1024, height: 900 });
	await page.visitExample<typeof import('../../../examples/page-layout-chat-panel.tsx')>(
		'design-system',
		'navigation-system',
		'page-layout-chat-panel',
	);
	await page.getByRole('button', { name: 'Collapse side navigation', exact: true }).click();
	const main = page.getByRole('main');
	await expect(main).toHaveWidth(1024);
	// Re-enter after collapsing; the click already left the pointer on the toggle.
	await page.mouse.move(800, 500);
	await page.getByRole('button', { name: 'Expand side navigation', exact: true }).hover();
	const nav = page.getByRole('navigation', { name: 'Sidebar' });
	await expect(nav).toBeVisible();
	await expect
		.poll(() => nav.evaluate((element) => getComputedStyle(element).gridArea))
		.toBe('main');
	await expect(main).toHaveWidth(1024);
	await page.mouse.move(800, 500);
	await expect(nav).toBeHidden();
	await expect(main).toHaveWidth(1024);
});

test('mounting Chat after sizing activation reallocates the adopted widths', async ({ page }) => {
	await page.setViewportSize({ width: 1024, height: 900 });
	await page.visitExample<typeof import('../../../examples/page-layout-chat-panel.tsx')>(
		'design-system',
		'navigation-system',
		'page-layout-chat-panel',
	);
	const slider = page.getByRole('slider', { name: 'Resize side navigation', exact: true });
	await slider.focus();
	// Focus only: adoption must preserve the original width without a resize.
	const nav = page.getByRole('navigation', { name: 'Sidebar' });
	await expect(slider).not.toHaveAttribute('max', '500');
	await expect(nav).toHaveWidth(320);
	await slider.blur();
	await page.getByRole('button', { name: 'Ask Rovo', exact: true }).click();
	const chat = page.getByRole('region', { name: 'Chat panel', exact: true });
	await expect
		.poll(async () => {
			const mainBox = await page.getByRole('main').boundingBox();
			const navBox = await nav.boundingBox();
			const chatBox = await chat.boundingBox();
			return mainBox && navBox && chatBox && mainBox.width + navBox.width + chatBox.width;
		})
		.toBe(1024);
	await expect(page.getByRole('main')).toHaveWidth(320);
	await expect
		.poll(() =>
			page.getByRole('main').evaluate((element) => {
				const root = element.parentElement!;
				return root.scrollWidth <= root.clientWidth;
			}),
		)
		.toBe(true);
	await page.mouse.move(0, 0);
	await expect(page.getByRole('tooltip')).toBeHidden();
});

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
	const slider = page.getByRole('slider', { name: 'Resize sidebar', exact: true });
	await slider.focus();
	await expect(slider).toHaveAttribute('max', '480');
	await slider.blur();
	// Constrain the host without changing the viewport or the real Aside's 400px track.
	await page.addStyleTag({ content: '[data-layout-width-container] { width: 900px; }' });
	const nav = page.getByTestId('side-nav');
	const main = page.getByRole('main');
	await expect.poll(async () => (await main.boundingBox())?.width).toBe(500);
	await slider.focus();
	await expect(slider).toHaveAttribute('max', '450');
	await slider.press('End');
	const keyboardWidth = Number(await slider.inputValue());
	await expect.poll(async () => (await nav.boundingBox())?.width).toBe(keyboardWidth);
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
	await expect.poll(async () => (await nav.boundingBox())?.width).toBe(450);
	await page.mouse.up();
	await expect(nav).toHaveWidth(450);
	await expect(main).toHaveWidth(500);
	await slider.blur();
	await page.mouse.move(0, 0);
	await expect(page.getByRole('tooltip')).toBeHidden();
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
		// Exercise the cold path: CSS must adapt before any splitter loads sizing.
		await page.addStyleTag({
			content: `[data-layout-width-container] { width: ${width}px; }`,
		});
		const chat = page.getByRole('region', { name: 'Chat panel', exact: true });
		await expect
			.poll(async () => (await page.getByRole('main').boundingBox())?.width)
			.toBe(Math.max(320, width));
		await expect
			.poll(async () => (await chat.boundingBox())?.width)
			.toBe(Math.min(320, width * 0.9));
		await expect
			.poll(() => chat.locator('style').textContent())
			.toContain('@container navigation-chat-space');
		const beforeActivation = await chat.boundingBox();
		await slider.focus();
		await expect
			.poll(() => chat.locator('style').textContent())
			.not.toContain('@container navigation-chat-space');
		await expect(chat).toHaveWidth(beforeActivation!.width);
		await expect(slider).toHaveAttribute('min', String(Math.min(320, width * 0.9)));
		await expect(slider).toHaveAttribute('max', String(width * 0.9));
		await slider.press('End');
		await expect(slider).toHaveValue(String(width * 0.9));
		await expect.poll(async () => (await chat.boundingBox())?.width).toBe(width * 0.9);
	});
}

test('local fit honours a custom Main minimum before sizing activation', async ({ page }) => {
	await page.setViewportSize({ width: 1200, height: 900 });
	await page.visitExample<typeof import('../../../examples/page-layout-caller-owned-panel.tsx')>(
		'design-system',
		'navigation-system',
		'page-layout-caller-owned-panel',
		{ featureFlag: 'platform-dst-chat-panel-layout' },
	);
	await page.getByRole('button', { name: 'Collapse navigation', exact: true }).click();
	// Exercise Main's public prop, including the context used by the initial CSS layout.
	await page.getByRole('button', { name: 'Set Main minimum to 500', exact: true }).click();
	await page.addStyleTag({
		content: '[data-layout-width-container] { width: 700px; }',
	});
	const layout = page.getByTestId('caller-layout');
	const panel = page.getByRole('region', { name: 'Preview', exact: true });
	await expect(layout).toHaveWidth(700);
	await expect
		.poll(() => panel.evaluate((element) => getComputedStyle(element).gridArea))
		.not.toBe('panel');
	await expect
		.poll(() => layout.evaluate((element) => element.scrollWidth <= element.clientWidth))
		.toBe(true);
	// Exactly enough room for the configured minima puts the panel inline.
	await page.addStyleTag({ content: '[data-layout-width-container] { width: 820px; }' });
	await expect
		.poll(() => panel.evaluate((element) => getComputedStyle(element).gridArea))
		.toBe('panel');
	await expect(panel).toHaveWidth(320);
	const before = await panel.boundingBox();
	const slider = page.getByRole('slider', { name: 'Resize preview', exact: true });
	await slider.focus();
	await expect(slider).toHaveAttribute('min', '320');
	await expect(panel).toHaveWidth(before!.width);
	await slider.blur();
	await page.mouse.move(0, 0);
	await expect(page.getByRole('tooltip')).toBeHidden();
});
