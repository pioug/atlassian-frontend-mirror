import { expect, test } from '@af/integration-testing';

for (const coordinated of [false, true]) {
	for (const direction of ['ltr', 'rtl']) {
		test(`CSS owns the panel layout snap with chat layout ${coordinated} in ${direction}`, async ({
			page,
		}) => {
			await page.setViewportSize({ width: 1600, height: 900 });
			await page.emulateMedia({ reducedMotion: 'no-preference' });
			await page.visitExample<typeof import('../../../examples/page-layout-caller-owned-panel')>(
				'design-system',
				'navigation-system',
				'page-layout-caller-owned-panel',
				{
					featureFlag: [
						'platform-dst-motion-uplift-panel',
						...(coordinated ? ['platform-dst-chat-panel-layout'] : []),
					].join(','),
				},
			);
			await page.evaluate((dir) => document.documentElement.setAttribute('dir', dir), direction);
			const layout = page.getByTestId('caller-layout');
			const panel = page.getByRole('region', { name: 'Preview', exact: true });
			await page.getByRole('button', { name: 'Close preview', exact: true }).click();
			await expect(panel).toHaveCount(0);
			await page.addStyleTag({
				content: '[data-testid="caller-layout"] { animation-play-state: paused; }',
			});
			const mainWidth = () =>
				layout.evaluate((el) => el.firstElementChild!.getBoundingClientRect().width);
			const closedWidth = await mainWidth();
			await page.getByRole('button', { name: 'Open preview', exact: true }).click();
			await expect.poll(() => layout.evaluate((el) => el.getAnimations().length)).toBe(1);
			await expect(layout).toHaveCSS('animation-duration', '0.06s');
			const seek = (time: number) =>
				layout.evaluate(async (el, currentTime) => {
					const animation = el.getAnimations()[0];
					await animation.ready;
					animation.currentTime = currentTime;
				}, time);
			await seek(59);
			await expect(panel).toHaveCSS('grid-area', 'main');
			expect(await mainWidth()).toBe(closedWidth);
			// Seek just beyond the endpoint to avoid fractional timeline rounding.
			await seek(61);
			await expect(panel).toHaveCSS('grid-area', 'panel');
			expect(await mainWidth()).toBe(closedWidth - 400);

			// A fresh opening can be cancelled before its CSS snap.
			await page.getByRole('button', { name: 'Close preview', exact: true }).click();
			await expect(panel).toHaveCount(0);
			await page.getByRole('button', { name: 'Open preview', exact: true }).click();
			await expect.poll(() => layout.evaluate((el) => el.getAnimations().length)).toBe(1);
			await seek(30);
			await page.getByRole('button', { name: 'Close preview', exact: true }).click();
			expect(await mainWidth()).toBe(closedWidth);
			expect(await layout.evaluate((el) => el.getAnimations().length)).toBe(0);
			await page.getByRole('button', { name: 'Open preview', exact: true }).click();
			await expect.poll(() => layout.evaluate((el) => el.getAnimations().length)).toBe(1);
			await seek(59);
			expect(await mainWidth()).toBe(closedWidth);
			// Seek just beyond the endpoint to avoid fractional timeline rounding.
			await seek(61);
			expect(await mainWidth()).toBe(closedWidth - 400);
		});
	}
}

for (const mode of ['gate off', 'reduced motion']) {
	test(`panel layout snaps immediately with ${mode}`, async ({ page }) => {
		await page.setViewportSize({ width: 1600, height: 900 });
		await page.emulateMedia({
			reducedMotion: mode === 'reduced motion' ? 'reduce' : 'no-preference',
		});
		await page.visitExample<typeof import('../../../examples/page-layout-caller-owned-panel')>(
			'design-system',
			'navigation-system',
			'page-layout-caller-owned-panel',
			mode === 'gate off' ? undefined : { featureFlag: 'platform-dst-motion-uplift-panel' },
		);
		await page.getByRole('button', { name: 'Close preview', exact: true }).click();
		await page.getByRole('button', { name: 'Open preview', exact: true }).click();
		const layout = page.getByTestId('caller-layout');
		expect(await layout.evaluate((el) => el.getAnimations().length)).toBe(0);
		await expect(page.getByRole('region', { name: 'Preview', exact: true })).toHaveCSS(
			'grid-area',
			'panel',
		);
	});
}

test('the opening content token owns its delay and easing and outlasts the surface slide', async ({
	page,
}) => {
	await page.setViewportSize({ width: 1600, height: 900 });
	await page.emulateMedia({ reducedMotion: 'no-preference' });
	await page.visitExample<typeof import('../../../examples/page-layout-caller-owned-panel')>(
		'design-system',
		'navigation-system',
		'page-layout-caller-owned-panel',
		{ featureFlag: 'platform-dst-motion-uplift-panel' },
	);
	await page.getByRole('button', { name: 'Close preview', exact: true }).click();
	await expect(page.getByRole('region', { name: 'Preview', exact: true })).toHaveCount(0);
	await page.addStyleTag({
		content:
			'[data-testid="caller-layout--panel-slot--scroll-container"] { animation-play-state: paused; }',
	});
	await page.getByRole('button', { name: 'Open preview', exact: true }).click();
	const content = page.getByTestId('caller-layout--panel-slot--scroll-container');
	await expect(content).toHaveCSS('animation-delay', '0.1s');
	await expect(content).toHaveCSS('animation-duration', '0.15s');
	await expect(content).toHaveCSS('animation-timing-function', 'cubic-bezier(0.16, 1, 0.3, 1)');
	await expect(content).toHaveCSS('opacity', '0');
	await page.getByRole('region', { name: 'Preview', exact: true }).evaluate(async (el) => {
		await Promise.all(el.getAnimations().map((animation) => animation.finished));
	});
	// The surface has completed, but its content animation must still be attached.
	await content.evaluate((el) => {
		el.getAnimations()[0].currentTime = 99;
	});
	await expect(content).toHaveCSS('opacity', '0');
	await content.evaluate((el) => {
		el.getAnimations()[0].currentTime = 250;
	});
	await expect(content).toHaveCSS('opacity', '1');
});
