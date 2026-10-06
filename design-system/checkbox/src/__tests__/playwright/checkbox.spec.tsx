import { expect, test } from '@af/integration-testing';

const checkboxLabelQuery = "[data-testid='the-checkbox--checkbox-label']";

const hiddenCheckboxQuery = "[data-testid='the-checkbox--hidden-checkbox']";

test('Checkbox should be able to be clicked by data-testid', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/99-testing.tsx')>(
		'design-system',
		'checkbox',
		'testing',
	);
	await page.click(checkboxLabelQuery);
	await expect(page.locator(hiddenCheckboxQuery)).toBeChecked();
});

test('Checkbox should be checked when clicked with a modifier such as shift+click', async ({
	page,
}) => {
	await page.visitExample<typeof import('../../../examples/99-testing.tsx')>(
		'design-system',
		'checkbox',
		'testing',
	);
	await page.click(checkboxLabelQuery, { modifiers: ['Shift'] });
	await expect(page.locator(hiddenCheckboxQuery)).toBeChecked();
});

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
	test(`Cross-fade preserves checkbox interaction (${reducedMotion})`, async ({ page }) => {
		await page.emulateMedia({ reducedMotion });
		await page.visitExample<typeof import('../../../examples/99-testing.tsx')>(
			'design-system',
			'checkbox',
			'testing',
			{ featureFlag: 'platform_design_system_selection_radial_fade' },
		);
		const input = page.getByRole('checkbox', { name: 'Basic checkbox' });
		const layers = page.locator(`${checkboxLabelQuery} svg > g`);
		await expect(layers).toHaveCount(1);
		const icon = page.locator(`${checkboxLabelQuery} svg`);
		const border = icon.locator('rect');
		const tick = icon.locator('path').first();
		await expect(tick).toHaveCSS('opacity', '0');
		for (const element of [icon, border, tick]) {
			await expect(element).toHaveCSS(
				'transition-property',
				reducedMotion === 'reduce'
					? 'none'
					: 'background-color, border-color, color, fill, stroke, opacity',
			);
			await expect(element).toHaveCSS(
				'transition-duration',
				reducedMotion === 'reduce' ? '0s' : Array(6).fill('0.15s').join(', '),
			);
			await expect(element).toHaveCSS('transform', 'none');
			await expect(element).toHaveCSS(
				'transition-timing-function',
				reducedMotion === 'reduce'
					? 'ease'
					: Array(6).fill('cubic-bezier(0.4, 1, 0.6, 1)').join(', '),
			);
		}
		await page.mouse.move(500, 500);
		await icon.evaluate(async (el) => {
			await Promise.all(el.getAnimations().map((animation) => animation.finished));
		});
		const restColor = await icon.evaluate((el) => getComputedStyle(el).color);
		await page.locator(checkboxLabelQuery).hover();
		await expect(icon).not.toHaveCSS('color', restColor);
		await page.mouse.down();
		await expect(border).toHaveCSS(
			'transition-duration',
			reducedMotion === 'reduce' ? '0s' : '0.15s, 0.15s, 0.15s, 0.15s, 0.15s, 0.15s',
		);
		await page.mouse.move(500, 500);
		await page.mouse.up();
		await expect(icon).toHaveCSS('color', restColor);
		await input.focus();
		await input.press('Space');
		await expect(input).toBeChecked();
		await expect(input).toBeFocused();
		await expect(tick).toHaveCSS('transform', 'none');
		await expect(tick).toHaveCSS('opacity', '1');
		await input.press('Space');
		await expect(input).not.toBeChecked();
		await expect(tick).toHaveCSS('opacity', '0');
	});
}
