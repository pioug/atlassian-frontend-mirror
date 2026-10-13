import { expect, test } from '@af/integration-testing';

const properties = 'background-color, color, transform, opacity';
const durations = Array(4).fill('0.15s').join(', ');
const easing = Array(4).fill('cubic-bezier(0.4, 1, 0.6, 1)').join(', ');

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
	for (const size of ['regular', 'large'] as const) {
		test(`Toggle slide and colour motion: ${size}, ${reducedMotion}`, async ({ page }) => {
			await page.emulateMedia({ reducedMotion });
			await page.visitExample<typeof import('../../../examples/12-motion')>(
				'design-system',
				'toggle',
				'motion',
				{ featureFlag: 'platform_design_system_toggle_motion' },
			);
			const toggle = page.getByTestId(`motion-${size}`);
			const input = page.getByTestId(`motion-${size}--input`);
			const check = page.getByTestId(`motion-${size}--toggle-check-icon`).locator('..');
			const cross = page.getByTestId(`motion-${size}--toggle-cross-icon`).locator('..');
			await expect(toggle).toHaveCSS('transition-property', properties);
			await expect(toggle).toHaveCSS('overflow', 'hidden');
			await expect(toggle).toHaveCSS('transition-duration', durations);
			await expect(toggle).toHaveCSS('transition-timing-function', easing);
			await expect(check).toHaveCSS(
				'transition-property',
				reducedMotion === 'reduce' ? 'opacity' : properties,
			);
			const handle = () =>
				toggle.evaluate((el) => {
					const style = getComputedStyle(el, '::before');
					return {
						property: style.transitionProperty,
						duration: style.transitionDuration,
						transform: style.transform,
					};
				});
			expect(await handle()).toMatchObject({
				property: reducedMotion === 'reduce' ? 'none' : properties,
				duration: reducedMotion === 'reduce' ? '0s' : durations,
			});
			const box = await toggle.boundingBox();
			const rest = await toggle.evaluate((el) => getComputedStyle(el).backgroundColor);
			await toggle.hover();
			await expect(toggle).not.toHaveCSS('background-color', rest);
			await toggle.evaluate(async (el) => {
				await Promise.all(el.getAnimations().map((a) => a.finished));
			});
			const hovered = await toggle.evaluate((el) => getComputedStyle(el).backgroundColor);
			await page.mouse.down();
			await expect(toggle).not.toHaveCSS('background-color', hovered);
			await page.mouse.move(500, 500);
			await page.mouse.up();
			await input.focus();
			await input.press('Space');
			await expect(input).toBeChecked();
			await expect(input).toBeFocused();
			await expect(check).toHaveCSS('opacity', '1');
			await expect(check).toHaveCSS('transform', 'none');
			await expect(cross).toHaveCSS('opacity', '0');
			const distance = { regular: 16, large: 20 }[size];
			await expect
				.poll(async () => (await handle()).transform)
				.toBe(`matrix(1, 0, 0, 1, ${distance}, 0)`);
			await expect(cross).toHaveCSS('transform', `matrix(1, 0, 0, 1, ${distance}, 0)`);
			expect(await toggle.boundingBox()).toEqual(box);
			await input.press('Space');
			await expect(input).not.toBeChecked();
			await expect(cross).toHaveCSS('opacity', '1');
			await expect(check).toHaveCSS('opacity', '0');
			await expect(check).toHaveCSS('transform', `matrix(1, 0, 0, 1, -${distance}, 0)`);
			await expect.poll(async () => (await handle()).transform).toBe('none');
		});
	}
}

test('Icons enter and exit at opposite track edges alongside the handle', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'no-preference' });
	await page.visitExample<typeof import('../../../examples/12-motion')>(
		'design-system',
		'toggle',
		'motion',
		{ featureFlag: 'platform_design_system_toggle_motion' },
	);
	const toggle = page.getByTestId('motion-regular');
	const input = page.getByTestId('motion-regular--input');
	await input.focus();
	await input.evaluate((el) => (el as HTMLInputElement).click());
	const positions = await toggle.evaluate(async (el) => {
		await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
		const animations = el.getAnimations({ subtree: true });
		for (const animation of animations) {
			animation.pause();
			animation.currentTime = 75;
		}
		const check = el.querySelector(
			'[data-testid="motion-regular--toggle-check-icon"]',
		)!.parentElement!;
		const cross = el.querySelector(
			'[data-testid="motion-regular--toggle-cross-icon"]',
		)!.parentElement!;
		const offset = (style: CSSStyleDeclaration) =>
			style.transform === 'none' ? 0 : Number.parseFloat(style.transform.split(',')[4]);
		return {
			check: offset(getComputedStyle(check)),
			cross: offset(getComputedStyle(cross)),
			handle: offset(getComputedStyle(el, '::before')),
		};
	});
	// The check approaches its left-hand resting position from outside the left edge.
	// The cross leaves its right-hand resting position through the right edge.
	expect(positions.check).toBeGreaterThan(-16);
	expect(positions.check).toBeLessThan(0);
	expect(positions.cross).toBeGreaterThan(0);
	expect(positions.cross).toBeLessThan(16);
	expect(positions.handle).toBeCloseTo(positions.cross);
	await expect(input).toBeChecked();
	await expect(input).toBeFocused();
});

test('Disabled toggles change instantly and loading toggles keep their feedback', async ({
	page,
}) => {
	await page.visitExample<typeof import('../../../examples/12-motion')>(
		'design-system',
		'toggle',
		'motion',
		{ featureFlag: 'platform_design_system_toggle_motion' },
	);
	const disabled = page.getByTestId('motion-disabled');
	await expect(disabled).toHaveCSS('transition-property', 'none');
	expect(await disabled.evaluate((el) => getComputedStyle(el, '::before').transitionProperty)).toBe(
		'none',
	);
	const disabledIcon = page.getByTestId('motion-disabled--toggle-check-icon').locator('..');
	await expect(disabledIcon).toHaveCSS('transition-property', 'none');
	await expect(page.getByRole('checkbox', { name: 'Disabled toggle' })).toBeDisabled();
	await expect(page.getByRole('checkbox', { name: /Loading toggle/ })).not.toBeChecked();
	await page.getByRole('button', { name: 'Change controlled state' }).click();
	await expect(page.getByRole('checkbox', { name: 'Disabled toggle' })).toBeChecked();
	await expect(page.getByRole('checkbox', { name: /Loading toggle/ })).toBeChecked();
});

test('Gate off preserves legacy transitions', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/12-motion')>(
		'design-system',
		'toggle',
		'motion',
	);
	const toggle = page.getByTestId('motion-regular');
	await expect(toggle).toHaveCSS('transition-property', 'transform');
	expect(await toggle.evaluate((el) => getComputedStyle(el, '::before').transitionDuration)).toBe(
		'0.2s',
	);
	const check = page.getByTestId('motion-regular--toggle-check-icon').locator('..');
	await expect(check).toHaveCSS('transition-property', 'opacity');
	await expect(check).toHaveCSS('transition-duration', '0.2s');
	await expect(check).toHaveCSS('transform', 'none');
});

test('Forced colours preserve instant, non-spatial feedback', async ({ page }) => {
	await page.emulateMedia({ forcedColors: 'active' });
	await page.visitExample<typeof import('../../../examples/12-motion')>(
		'design-system',
		'toggle',
		'motion',
		{ featureFlag: 'platform_design_system_toggle_motion' },
	);
	const toggle = page.getByTestId('motion-regular');
	await expect(toggle).toHaveCSS('transition-property', 'none');
	expect(await toggle.evaluate((el) => getComputedStyle(el, '::before').transitionProperty)).toBe(
		'none',
	);
	await page.getByTestId('motion-regular--input').press('Space');
	await expect(page.getByTestId('motion-regular--input')).toBeChecked();
});
