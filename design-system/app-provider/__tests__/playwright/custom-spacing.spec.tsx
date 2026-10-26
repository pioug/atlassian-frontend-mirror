import { expect, test } from '@af/integration-testing';

test('updates typed spacing inputs from controls and keeps controls outside the theme', async ({
	page,
}) => {
	await page.visitExample<typeof import('../../examples/custom-theme-spacing.wb.ap')>(
		'design-system',
		'app-provider',
		'custom-theme-spacing',
	);
	const preview = page.getByTestId('gap-spacing-preview');
	await expect(preview).toBeVisible();
	await page.getByRole('button', { name: /Spacious/ }).click();
	const measure = async (token: string) =>
		preview.evaluate((element, name) => {
			const probe = document.createElement('div');
			probe.style.rowGap = `var(--ds-${name})`;
			element.appendChild(probe);
			const value = parseFloat(getComputedStyle(probe).rowGap);
			probe.remove();
			return value;
		}, token);
	await expect.poll(() => measure('space-gap-large')).toBe(15);
	await page.getByRole('tab', { name: 'Insets', exact: true }).click();
	await page.getByRole('slider', { name: 'Inset scale', exact: true }).press('End');
	await expect.poll(() => measure('space-inset-3xlarge')).toBe(144);
	await expect.poll(() => measure('space-gap-large')).toBe(15);
	await page.getByRole('checkbox', { name: 'Round inset values' }).uncheck();
	await expect.poll(() => measure('space-inset-medium')).toBeCloseTo(16 * 3 ** (12 / 44), 3);
	const controlsGap = await page
		.getByRole('region', { name: 'Inset spacing', exact: true })
		.evaluate((element) => {
			const probe = document.createElement('div');
			probe.style.rowGap = 'var(--ds-space-gap-large)';
			element.appendChild(probe);
			const value = parseFloat(getComputedStyle(probe).rowGap);
			probe.remove();
			return value;
		});
	expect(controlsGap).toBe(12);

	const link = page.getByRole('checkbox', { name: 'Link gap and inset settings' });
	await link.press('Space');
	await expect(link).toBeChecked();
	await expect.poll(() => measure('space-gap-xxlarge')).toBe(72);
	await expect.poll(() => measure('space-inset-3xlarge')).toBe(144);
	await link.press('Space');
	await expect(link).not.toBeChecked();
	await page.getByRole('slider', { name: 'Scale uniformity', exact: true }).press('End');
	await page.getByRole('slider', { name: 'Inset scale', exact: true }).press('Home');
	await expect.poll(() => measure('space-inset-3xlarge')).toBeCloseTo(14.4, 3);
	await expect.poll(() => measure('space-gap-xxlarge')).toBe(72);
});

test('calculates independent curved gap and inset ramps in CSS', async ({ page }) => {
	await page.visitExample<typeof import('../../examples/custom-theme-spacing.wb.ap')>(
		'design-system',
		'app-provider',
		'custom-theme-spacing',
	);
	const preview = page.getByTestId('gap-spacing-preview');
	await expect(preview).toBeVisible();
	const result = await preview.evaluate((element) => {
		const theme = element.closest<HTMLElement>('[data-subtree-theme]')!;
		const probe = document.createElement('div');
		element.appendChild(probe);
		const measure = (family: string, names: string[]) =>
			names.map((name) => {
				probe.style.rowGap = `var(--ds-space-${family}-${name})`;
				return parseFloat(getComputedStyle(probe).rowGap);
			});
		const gaps = ['xxsmall', 'xsmall', 'small', 'medium', 'large', 'xlarge', 'xxlarge'];
		const insets = [...gaps, '3xlarge'];
		const defaults = { gap: measure('gap', gaps), inset: measure('inset', insets) };
		theme.style.setProperty('--ds-dynamic-space-gap-scale', '2');
		theme.style.setProperty('--ds-dynamic-space-gap-curve', '2');
		theme.style.setProperty('--ds-dynamic-space-gap-round', '0');
		const curved = { gap: measure('gap', gaps), inset: measure('inset', insets) };
		theme.style.setProperty('--ds-dynamic-space-gap-round', '1');
		const rounded = measure('gap', gaps);
		theme.style.setProperty('--ds-dynamic-space-inset-scale', '1.5');
		theme.style.setProperty('--ds-dynamic-space-inset-uniformity', '1');
		const expandedInsets = measure('inset', insets);
		theme.style.setProperty('--ds-dynamic-space-gap-scale', '0.3');
		theme.style.setProperty('--ds-dynamic-space-gap-curve', '3');
		const contracted = measure('gap', gaps);
		probe.remove();
		return { defaults, curved, rounded, expandedInsets, contracted };
	});
	expect(result.defaults.gap).toEqual([2, 4, 6, 8, 12, 16, 24]);
	expect(result.defaults.inset).toEqual([4, 8, 12, 16, 20, 24, 32, 48]);
	expect(result.curved.inset).toEqual(result.defaults.inset);
	expect(result.curved.gap[0]).toBe(2);
	expect(result.curved.gap[6]).toBe(48);
	expect(result.curved.gap[3]).toBeCloseTo(8 * 2 ** (((8 - 2) / (24 - 2)) ** 2), 3);
	expect(result.rounded).toEqual(result.curved.gap.map(Math.round));
	expect(result.expandedInsets).toEqual([6, 12, 18, 24, 30, 36, 48, 72]);
	expect(result.contracted).toEqual([...result.contracted].sort((a, b) => a - b));
});

test('uses CSS defaults and inherits omitted inputs while respecting subtree overrides', async ({
	page,
}) => {
	await page.visitExample<typeof import('../../examples/custom-theme-spacing.wb.ap')>(
		'design-system',
		'app-provider',
		'custom-theme-spacing',
	);
	await expect(page.getByTestId('gap-spacing-preview')).toBeVisible();
	const result = await page.evaluate(() => {
		const createTheme = () => {
			const element = document.createElement('div');
			element.setAttribute('data-subtree-theme', 'true');
			element.setAttribute('data-theme', 'spacing:UNSAFE-spacing');
			return element;
		};
		const parent = createTheme();
		const child = createTheme();
		const sibling = createTheme();
		parent.appendChild(child);
		document.body.append(parent, sibling);
		const measure = (element: HTMLElement, token: string) => {
			const probe = document.createElement('div');
			probe.style.rowGap = `var(--ds-space-${token})`;
			element.appendChild(probe);
			const value = parseFloat(getComputedStyle(probe).rowGap);
			probe.remove();
			return value;
		};
		const defaults = {
			gap: measure(sibling, 'gap-xxlarge'),
			inset: measure(sibling, 'inset-3xlarge'),
		};
		parent.style.setProperty('--ds-dynamic-space-gap-scale', '1.5');
		parent.style.setProperty('--ds-dynamic-space-gap-curve', '2');
		parent.style.setProperty('--ds-dynamic-space-gap-round', '0');
		const inherited = {
			parent: measure(parent, 'gap-medium'),
			child: measure(child, 'gap-medium'),
		};
		child.style.setProperty('--ds-dynamic-space-gap-scale', '2');
		child.style.setProperty('--ds-dynamic-space-gap-round', '1');
		const independent = {
			parent: measure(parent, 'gap-xxlarge'),
			child: measure(child, 'gap-xxlarge'),
			sibling: measure(sibling, 'gap-xxlarge'),
			rounded: measure(child, 'gap-medium'),
			inset: measure(child, 'inset-3xlarge'),
		};
		parent.style.removeProperty('--ds-dynamic-space-gap-scale');
		const reset = measure(parent, 'gap-xxlarge');
		parent.remove();
		sibling.remove();
		return { defaults, inherited, independent, reset };
	});
	expect(result.defaults).toEqual({ gap: 24, inset: 48 });
	expect(result.inherited.parent).toBeCloseTo(8 * 1.5 ** ((6 / 22) ** 2), 3);
	expect(result.inherited.child).toBe(result.inherited.parent);
	expect(result.independent).toEqual({ parent: 36, child: 48, sibling: 24, rounded: 8, inset: 48 });
	expect(result.reset).toBe(24);
});

test('shows calculated spacing on graph hover and keyboard focus', async ({ page }) => {
	await page.visitExample<typeof import('../../examples/custom-theme-spacing.wb.ap')>(
		'design-system',
		'app-provider',
		'custom-theme-spacing',
	);
	await expect(page.getByRole('heading', { name: 'Calculated gaps' })).toHaveCount(0);
	await page.getByRole('button', { name: 'space.gap.large: 12px', exact: true }).hover();
	await expect(page.getByRole('tooltip')).toHaveText('space.gap.large: 12px');
	await page.mouse.move(0, 0);
	await expect(page.getByRole('tooltip')).toBeHidden();
	const firstGap = page.getByRole('button', { name: 'space.gap.xxsmall: 2px', exact: true });
	await firstGap.focus();
	await firstGap.press('Tab');
	await expect(
		page.getByRole('button', { name: 'space.gap.xsmall: 4px', exact: true }),
	).toBeFocused();
	await expect(page.getByRole('tooltip')).toHaveText('space.gap.xsmall: 4px');
	await page.keyboard.press('Escape');
	await expect(page.getByRole('tooltip')).toBeHidden();
	await page.getByRole('tab', { name: 'Insets', exact: true }).click();
	await expect(page.getByRole('heading', { name: 'Calculated insets' })).toHaveCount(0);
	await page.getByRole('button', { name: 'space.inset.3xlarge: 48px', exact: true }).hover();
	await expect(page.getByRole('tooltip')).toHaveText('space.inset.3xlarge: 48px');
	await page.getByRole('slider', { name: 'Inset scale', exact: true }).press('End');
	await page.getByRole('button', { name: 'space.inset.3xlarge: 144px', exact: true }).hover();
	await expect(page.getByRole('tooltip')).toHaveText('space.inset.3xlarge: 144px');
});
