import { expect, test } from '@af/integration-testing';

const labelQuery = "[data-testid='red--radio-label']";

const inputQuery = "[data-testid='red--radio-input']";

test('Radio should be able to be clicked by data-testid', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/99-testing.tsx')>(
		'design-system',
		'radio',
		'testing',
	);
	await page.locator(labelQuery).first().click();
	const input = page.locator(inputQuery).first();
	await expect(input).toBeChecked();
});

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
	test(`Cross-fade preserves radio group interaction (${reducedMotion})`, async ({ page }) => {
		await page.emulateMedia({ reducedMotion });
		await page.visitExample<typeof import('../../../examples/99-testing.tsx')>(
			'design-system',
			'radio',
			'testing',
			{ featureFlag: 'platform_design_system_selection_radial_fade' },
		);
		const red = page.getByRole('radio', { name: 'Red', exact: true });
		const blue = page.getByRole('radio', { name: 'Blue', exact: true });
		const geometry = await red.boundingBox();
		await expect(red).toHaveCSS(
			'transition-property',
			reducedMotion === 'reduce'
				? 'none'
				: 'background-color, border-color, color, fill, stroke, opacity',
		);
		await expect(red).toHaveCSS(
			'transition-duration',
			reducedMotion === 'reduce' ? '0s' : '0.15s, 0.15s, 0.15s, 0.15s, 0.15s, 0.15s',
		);
		await page.mouse.move(500, 500);
		await red.evaluate(async (el) => {
			await Promise.all(el.getAnimations().map((animation) => animation.finished));
		});
		const restColor = await red.evaluate((el) => getComputedStyle(el).backgroundColor);
		await red.hover();
		await expect(red).not.toHaveCSS('background-color', restColor);
		await page.mouse.down();
		await expect(red).toHaveCSS(
			'transition-duration',
			reducedMotion === 'reduce' ? '0s' : '0.15s, 0.15s, 0.15s, 0.15s, 0.15s, 0.15s',
		);
		await page.mouse.move(500, 500);
		await page.mouse.up();
		await expect(red).toHaveCSS('background-color', restColor);
		await red.check();
		await expect(red).toBeChecked();
		for (const pseudo of ['::after']) {
			await expect
				.poll(() =>
					red.evaluate((el, selector) => getComputedStyle(el, selector).transitionProperty, pseudo),
				)
				.toBe(
					reducedMotion === 'reduce'
						? 'none'
						: 'background-color, border-color, color, fill, stroke, opacity',
				);
			await expect
				.poll(() => red.evaluate((el, selector) => getComputedStyle(el, selector).opacity, pseudo))
				.toBe('1');
			await expect
				.poll(() =>
					red.evaluate((el, selector) => getComputedStyle(el, selector).transform, pseudo),
				)
				.toBe('none');
			await expect
				.poll(() =>
					red.evaluate((el, selector) => getComputedStyle(el, selector).transitionDuration, pseudo),
				)
				.toBe(reducedMotion === 'reduce' ? '0s' : '0.15s, 0.15s, 0.15s, 0.15s, 0.15s, 0.15s');
		}
		expect(await red.boundingBox()).toEqual(geometry);
		await red.press('ArrowDown');
		await expect(blue).toBeChecked();
		await expect(blue).toBeFocused();
		await expect(red).not.toBeChecked();
		await expect
			.poll(() => red.evaluate((el) => getComputedStyle(el, '::after').opacity))
			.toBe('0');
	});
}
