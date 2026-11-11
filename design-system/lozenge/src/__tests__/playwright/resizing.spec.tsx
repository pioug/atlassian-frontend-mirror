import { expect, test } from '@af/integration-testing';

type ObservedElement = HTMLElement & { resizeAnimations: Animation[] };

for (const testId of ['resizing-lozenge', 'resizing-dropdown']) {
	test(`${testId} preserves observed resize motion and unchanged animation timelines`, async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../../examples/10-resizing')>(
			'design-system',
			'lozenge',
			'resizing',
			{
				featureFlag:
					'platform-dst-motion-uplift,platform-dst-motion-lozenge-truncation-fix,platform-dst-motion-observed-resizing',
			},
		);
		const content = page.getByTestId(`${testId}--content`);
		await expect(content).toBeVisible();
		await content.evaluate((element) => {
			const observed = element as ObservedElement;
			// Keep the animation active long enough to inspect interruption and timeline identity.
			observed.style.setProperty('--ds-duration-medium', '1000ms');
			observed.resizeAnimations = [];
			const originalAnimate = observed.animate;
			observed.animate = (...args) => {
				const animation = originalAnimate.apply(observed, args);
				observed.resizeAnimations.push(animation);
				return animation;
			};
		});
		// Allow the first size observation to establish the baseline.
		await content.evaluate(
			() =>
				new Promise<void>((resolve) => {
					let frames = 4;
					const next = () => {
						if (--frames === 0) resolve();
						else requestAnimationFrame(next);
					};
					requestAnimationFrame(next);
				}),
		);
		expect(
			await content.evaluate((element) => (element as ObservedElement).resizeAnimations.length),
		).toBe(0);

		await page.getByRole('button', { name: 'Long label', exact: true }).click();
		await expect
			.poll(() =>
				content.evaluate((element) => (element as ObservedElement).resizeAnimations.length),
			)
			.toBe(1);
		const retained = await content.evaluate(async (element) => {
			const observed = element as ObservedElement;
			const animation = observed.resizeAnimations[0];
			await animation.ready;
			const before = animation.currentTime as number;
			const startTime = animation.startTime;
			observed.parentElement?.setAttribute('aria-label', 'Updated status');
			observed.style.color = 'rgb(10, 20, 30)';
			await new Promise<void>((resolve) =>
				requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
			);
			return {
				count: observed.resizeAnimations.length,
				same: observed.getAnimations().includes(animation),
				sameStart: animation.startTime === startTime,
				advanced: (animation.currentTime as number) >= before,
			};
		});
		expect(retained).toEqual({ count: 1, same: true, sameStart: true, advanced: true });

		await page.getByRole('button', { name: 'Short label', exact: true }).click();
		await expect
			.poll(() =>
				content.evaluate((element) => (element as ObservedElement).resizeAnimations.length),
			)
			.toBeGreaterThanOrEqual(2);
		await expect.poll(() => content.evaluate((element) => element.getAnimations().length)).toBe(0);

		await page.getByRole('button', { name: 'Toggle percentage width', exact: true }).click();
		await page.getByRole('button', { name: 'Toggle icon and metric', exact: true }).click();
		await page.getByRole('button', { name: 'Long label', exact: true }).click();
		await page.getByRole('button', { name: 'Toggle container width', exact: true }).click();
		await expect
			.poll(() =>
				page.getByTestId(testId).evaluate((element) => (element as HTMLElement).offsetWidth),
			)
			.toBeLessThanOrEqual(75);
		await expect.poll(() => content.evaluate((element) => element.getAnimations().length)).toBe(0);
		const text = page.getByTestId(`${testId}--text`);
		await expect(text).toHaveCSS('text-overflow', 'ellipsis');
		expect(await text.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
		const count = await content.evaluate(
			(element) => (element as ObservedElement).resizeAnimations.length,
		);
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.getByRole('button', { name: 'Short label', exact: true }).click();
		await expect(text).toHaveText('Done');
		await content.evaluate(
			() =>
				new Promise<void>((resolve) =>
					requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
				),
		);
		expect(
			await content.evaluate((element) => (element as ObservedElement).resizeAnimations.length),
		).toBe(count);
	});
}
