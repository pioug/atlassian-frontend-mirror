import { expect, type Locator, type Page, test } from '@af/integration-testing';

async function visit(page: Page, width: number) {
	await page.setViewportSize({ width, height: 900 });
	await page.visitExample<typeof import('../../../examples/page-layout-uncontrolled-panel')>(
		'design-system',
		'navigation-system',
		'page-layout-uncontrolled-panel',
		{ featureFlag: 'platform-dst-chat-panel-layout' },
	);
}

async function resizeWithKeyboard(page: Page, panel: Locator, target: number) {
	const slider = page.getByRole('slider', { name: 'Resize preview', exact: true });
	await slider.focus();
	const initial = (await panel.boundingBox())!.width;
	for (let i = 0; i < Math.abs(target - initial) / 20; i++) {
		await slider.press(target > initial ? 'ArrowUp' : 'ArrowDown');
	}
	// Key handling awaits resize preparation; a returned press is not a completed resize.
	await expect.poll(async () => (await panel.boundingBox())?.width).toBe(target);
	await expect(page.getByTestId('caller-resize-result')).toContainText(`"finalWidth":${target}`);
}

const inputs: Record<string, (page: Page, panel: Locator, target: number) => Promise<void>> = {
	keyboard: resizeWithKeyboard,
	pointer: async (page, panel, target) => {
		const handle = page
			.getByTestId('caller-layout--panel-slot--splitter')
			.and(page.locator('[draggable="true"]'));
		await expect(handle).toBeVisible();
		await handle.hover();
		const box = (await handle.boundingBox())!;
		const delta = (await panel.boundingBox())!.width - target;
		const x = box.x + box.width / 2;
		const y = box.y + 100;
		await page.mouse.move(x, y);
		await page.mouse.down();
		await page.mouse.move(x + Math.sign(delta) * 10, y);
		await page.mouse.move(x + delta, y, { steps: 10 });
		await page.mouse.move(x + delta, y);
		await expect.poll(async () => (await panel.boundingBox())?.width).toBe(target);
		await page.mouse.up();
	},
};

for (const [input, resize] of Object.entries(inputs)) {
	for (const overlayFirst of [false, true]) {
		const initialViewport = overlayFirst ? 600 : 1600;
		const modes = [
			{ viewport: 1600, initial: 400, preferred: 480, area: 'panel' },
			{ viewport: 600, initial: 320, preferred: 360, area: 'main' },
		];
		const ordered = overlayFirst ? [...modes].reverse() : modes;

		test(`local remembers separate widths with ${input}, overlay first: ${overlayFirst}`, async ({
			page,
		}) => {
			await visit(page, initialViewport);
			const panel = page.getByRole('region', { name: 'Preview', exact: true });
			for (const { viewport, initial, preferred, area } of ordered) {
				await page.setViewportSize({ width: viewport, height: 900 });
				await expect(panel).toHaveCSS('grid-area', area);
				await expect.poll(async () => (await panel.boundingBox())?.width).toBe(initial);
				await resize(page, panel, preferred);
				await expect.poll(async () => (await panel.boundingBox())?.width).toBe(preferred);
				await expect(page.getByTestId('caller-resize-result')).toContainText(
					`"finalWidth":${preferred}`,
				);
			}
			for (const { viewport, preferred } of modes) {
				await page.setViewportSize({ width: viewport, height: 900 });
				await expect.poll(async () => (await panel.boundingBox())?.width).toBe(preferred);
				await page.getByRole('button', { name: 'Close preview', exact: true }).click();
				await expect(panel).toHaveCount(0);
				await page.getByRole('button', { name: 'Open preview', exact: true }).click();
				await expect.poll(async () => (await panel.boundingBox())?.width).toBe(preferred);
			}
			// Automatic fitting in either mode does not replace the saved preference.
			for (const { viewport, expected } of [
				{ viewport: 320, expected: 320 },
				{ viewport: 600, expected: 360 },
				{ viewport: 640, expected: 320 },
				{ viewport: 1600, expected: 480 },
			]) {
				await page.setViewportSize({ width: viewport, height: 900 });
				await expect.poll(async () => (await panel.boundingBox())?.width).toBe(expected);
			}
		});
	}
}

test('local overlay sibling compression does not replace inline preferences', async ({ page }) => {
	await visit(page, 1600);
	const panel = page.getByRole('region', { name: 'Preview', exact: true });
	await inputs.keyboard(page, panel, 480);
	await page.getByRole('button', { name: 'Open chat', exact: true }).click();
	await page.setViewportSize({ width: 1040, height: 900 });
	await expect(panel).toHaveCSS('grid-area', 'main');
	await expect.poll(async () => (await panel.boundingBox())?.width).toBe(320);
	await inputs.keyboard(page, panel, 360);
	const nav = page.getByTestId('caller-side-nav');
	await expect.poll(async () => (await nav.boundingBox())?.width).toBe(248);
	await expect
		.poll(async () => {
			const p = (await panel.boundingBox())!;
			const n = (await nav.boundingBox())!;
			return p.x - n.x - n.width;
		})
		.toBe(32);
	await page.getByRole('button', { name: 'Close preview', exact: true }).click();
	await expect.poll(async () => (await nav.boundingBox())?.width).toBe(320);
	await page.setViewportSize({ width: 1600, height: 900 });
	await page.getByRole('button', { name: 'Open preview', exact: true }).click();
	await expect.poll(async () => (await panel.boundingBox())?.width).toBe(480);
	await expect
		.poll(async () => (await page.getByTestId('caller-chat').boundingBox())?.width)
		.toBe(400);
});

for (const direction of ['ltr', 'rtl']) {
	test(`saved defaults restore widths before and after activation (${direction})`, async ({
		page,
	}) => {
		await page.setViewportSize({ width: 500, height: 900 });
		await page.visitExample<typeof import('../../../examples/page-layout-restored-panel')>(
			'design-system',
			'navigation-system',
			'page-layout-restored-panel',
			{ featureFlag: 'platform-dst-chat-panel-layout' },
		);
		await page.addStyleTag({ content: `html { direction: ${direction}; }` });
		const panel = page.getByRole('region', { name: 'Preview', exact: true });
		const slider = page.getByRole('slider', { name: 'Resize preview', exact: true });
		await expect.poll(async () => (await panel.boundingBox())?.width).toBe(500);
		await expect(slider).toBeVisible();
		await slider.focus();
		await expect(slider).toHaveAttribute('max', '500');
		await expect.poll(async () => (await panel.boundingBox())?.width).toBe(500);
		await page.setViewportSize({ width: 1600, height: 900 });
		await expect.poll(async () => (await panel.boundingBox())?.width).toBe(500);
		await inputs.keyboard(page, panel, 480);
		await page.setViewportSize({ width: 600, height: 900 });
		await expect(panel).toHaveCSS('grid-area', 'main');
		await expect.poll(async () => (await panel.boundingBox())?.width).toBe(500);
		await inputs.keyboard(page, panel, 360);
		await page.setViewportSize({ width: 1600, height: 900 });
		await expect.poll(async () => (await panel.boundingBox())?.width).toBe(480);
	});
}
