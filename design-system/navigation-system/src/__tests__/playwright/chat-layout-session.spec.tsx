import { expect, type Locator, type Page, test } from '@af/integration-testing';

async function visit(page: Page, width: number) {
	await page.setViewportSize({ width, height: 900 });
	await page.visitExample<typeof import('../../../examples/page-layout-caller-owned-panel.tsx')>(
		'design-system',
		'navigation-system',
		'page-layout-caller-owned-panel',
		{ featureFlag: 'platform-dst-chat-panel-layout' },
	);
}

async function dragBy(page: Page, testId: string, delta: number, panel: Locator, expected: number) {
	const handle = page.getByTestId(testId).and(page.locator('[draggable="true"]'));
	await expect(handle).toBeVisible();
	await handle.hover();
	const box = (await handle.boundingBox())!;
	const x = box.x + box.width / 2;
	const y = box.y + Math.min(100, box.height / 2);
	await page.mouse.move(x, y);
	await page.mouse.down();
	await page.mouse.move(x + Math.sign(delta) * 10, y);
	await page.mouse.move(x + delta, y, { steps: 10 });
	await page.mouse.move(x + delta, y);
	await expect.poll(async () => (await panel.boundingBox())?.width).toBe(expected);
	await page.mouse.up();
}

const resizeChat: Record<
	string,
	(page: Page, slider: Locator, chat: Locator, target: number) => Promise<void>
> = {
	keyboard: async (_page, slider, _chat, target) => {
		for (let i = 0; i < Math.abs(target - 400) / 20; i++) {
			await slider.press(target > 400 ? 'ArrowRight' : 'ArrowLeft');
		}
	},
	pointer: async (page, slider, chat, target) => {
		await slider.blur();
		await dragBy(page, 'caller-chat-splitter', 400 - target, chat, target);
	},
};

for (const [input, resize] of Object.entries(resizeChat)) {
	for (const viewport of [1600, 600]) {
		for (const target of [360, 480]) {
			test(`Chat retains a ${target}px ${input} resize across close/reopen at ${viewport}px`, async ({
				page,
			}) => {
				await visit(page, viewport);
				await page.getByRole('button', { name: 'Close preview', exact: true }).click();
				await page.getByRole('button', { name: 'Open chat', exact: true }).click();
				const chat = page.getByTestId('caller-chat');
				await expect.poll(async () => (await chat.boundingBox())?.width).toBe(400);
				const slider = page.getByRole('slider', { name: 'Resize chat', exact: true });
				await slider.focus();
				await expect(slider).toHaveAttribute('min', '320');
				await resize(page, slider, chat, target);
				await expect.poll(async () => (await chat.boundingBox())?.width).toBe(target);
				for (let cycle = 0; cycle < 2; cycle++) {
					await page.getByRole('button', { name: 'Close chat', exact: true }).click();
					await expect(chat).toBeHidden();
					await expect
						.poll(async () => (await page.getByRole('main').boundingBox())?.width)
						.toBe(viewport >= 1024 ? viewport - 320 : viewport);
					await page.getByRole('button', { name: 'Open chat', exact: true }).click();
					await expect.poll(async () => (await chat.boundingBox())?.width).toBe(target);
				}
			});
		}
	}
}

for (const viewport of [375, 600, 639]) {
	for (const area of ['preview', 'chat'] as const) {
		const openButtons = area === 'chat' ? ['Close preview', 'Open chat'] : [];

		test(`${area} overlay supports keyboard and pointer resizing at ${viewport}px`, async ({
			page,
		}) => {
			await visit(page, viewport);
			for (const name of openButtons) {
				await page.getByRole('button', { name, exact: true }).click();
			}
			const panel = page.getByTestId(area === 'chat' ? 'caller-chat' : 'caller-layout--panel-slot');
			const slider = page.getByRole('slider', { name: `Resize ${area}`, exact: true });
			await expect(slider).toBeVisible();
			await slider.focus();
			await slider.press('Home');
			await expect.poll(async () => (await panel.boundingBox())?.width).toBe(320);
			await slider.press('ArrowRight');
			const maximum = Number(await slider.getAttribute('max'));
			await expect
				.poll(async () => (await panel.boundingBox())?.width)
				.toBe(Math.min(340, maximum));
			await slider.press('Home');
			await expect.poll(async () => (await panel.boundingBox())?.width).toBe(320);
			await slider.blur();
			await dragBy(
				page,
				area === 'chat' ? 'caller-chat-splitter' : 'caller-layout--panel-slot--splitter',
				-10,
				panel,
				330,
			);
			await expect.poll(async () => (await panel.boundingBox())?.width).toBe(330);
		});
	}
}

test('Chat remembers inline and overlay widths separately across close/reopen', async ({
	page,
}) => {
	await visit(page, 1600);
	await page.getByRole('button', { name: 'Close preview', exact: true }).click();
	const chat = page.getByTestId('caller-chat');
	const slider = page.getByRole('slider', { name: 'Resize chat', exact: true });
	for (const { viewport, before, keys, after } of [
		{ viewport: 1600, before: 400, keys: ['ArrowLeft'], after: 380 },
		{ viewport: 600, before: 400, keys: ['ArrowRight'], after: 420 },
		{ viewport: 1600, before: 380, keys: [], after: 380 },
		{ viewport: 600, before: 420, keys: [], after: 420 },
	]) {
		await page.setViewportSize({ width: viewport, height: 900 });
		await page.getByRole('button', { name: 'Open chat', exact: true }).click();
		await expect.poll(async () => (await chat.boundingBox())?.width).toBe(before);
		for (const key of keys) {
			await slider.focus();
			await slider.press(key);
		}
		await expect.poll(async () => (await chat.boundingBox())?.width).toBe(after);
		await page.getByRole('button', { name: 'Close chat', exact: true }).click();
		await expect(chat).toBeHidden();
	}
});
