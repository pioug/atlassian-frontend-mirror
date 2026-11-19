import { expect, test } from '@af/integration-testing';

for (const motionEnabled of [false, true]) {
	test(`opening a local panel preserves resized chat width throughout rendering (motion: ${motionEnabled})`, async ({
		page,
	}) => {
		await page.setViewportSize({ width: 1440, height: 900 });
		await page.visitExample<typeof import('../../../examples/page-layout-chat-panel')>(
			'design-system',
			'navigation-system',
			'page-layout-chat-panel',
			motionEnabled ? { featureFlag: 'platform-dst-motion-uplift-panel' } : undefined,
		);
		await page.getByRole('button', { name: 'Ask Rovo', exact: true }).click();
		const chat = page.getByRole('region', { name: 'Chat panel', exact: true });
		await expect(chat.getByRole('region', { name: 'Chat content', exact: true })).toBeVisible();
		const slider = page.getByRole('slider', { name: 'Resize chat panel', exact: true });
		await slider.focus();
		await slider.press('Home');
		await expect.poll(async () => (await chat.boundingBox())?.width).toBe(320);

		// Record each painted frame: checking only the settled width misses a one-frame collapse
		// while the newly opened local panel is waiting to join the active sizing coordinator.
		await chat.evaluate((element) => {
			const samples: number[] = [];
			const sample = () => {
				samples.push(element.getBoundingClientRect().width);
				if (!element.hasAttribute('data-width-sampling-complete')) {
					requestAnimationFrame(sample);
				}
			};
			Object.assign(element, { widthSamples: samples });
			sample();
		});
		await page.getByRole('button', { name: 'open local panel', exact: true }).click();
		await expect(
			page.getByRole('button', { name: 'Close local panel', exact: true }),
		).toBeVisible();
		const samples = await chat.evaluate(async (element) => {
			await Promise.allSettled(document.getAnimations().map((animation) => animation.finished));
			await new Promise(requestAnimationFrame);
			element.setAttribute('data-width-sampling-complete', '');
			return (element as HTMLElement & { widthSamples: number[] }).widthSamples;
		});
		expect(samples.length).toBeGreaterThan(1);
		expect(Math.min(...samples)).toBeGreaterThanOrEqual(320);
		expect(Math.max(...samples)).toBeLessThanOrEqual(320);
		await expect(chat).toBeVisible();
	});
}
