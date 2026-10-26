import {
	type CustomThemeOverrideRegistry,
	getThemeAndOverrides,
	type ThemeWithCustomOverrides,
} from '../../custom-theme-overrides';
import { getThemeHtmlAttrs } from '../../get-theme-html-attrs';
import { getThemeStyles } from '../../get-theme-styles';

describe('UNSAFE-spacing', () => {
	it('serializes independent gap and inset settings and converts rounding booleans', () => {
		const { theme, inlineStyles } = getThemeAndOverrides({
			spacing: {
				id: 'UNSAFE-spacing',
				overrides: {
					dynamicSpaceGapScale: 1.5,
					dynamicSpaceGapCurve: 2,
					dynamicSpaceGapUniformity: 0.2,
					dynamicSpaceGapRound: false,
					dynamicSpaceInsetScale: 0.8,
					dynamicSpaceInsetCurve: 0.5,
					dynamicSpaceInsetUniformity: 1,
					dynamicSpaceInsetRound: true,
				},
			},
		});
		expect(theme).toEqual({ spacing: 'UNSAFE-spacing' });
		for (const [input, value] of Object.entries({
			'gap-scale': 1.5,
			'gap-curve': 2,
			'gap-uniformity': 0.2,
			'gap-round': 0,
			'inset-scale': 0.8,
			'inset-curve': 0.5,
			'inset-uniformity': 1,
			'inset-round': 1,
		})) {
			expect(inlineStyles).toContain(`--ds-dynamic-space-${input}: ${value};`);
		}
		expect(inlineStyles).not.toContain('data-color-mode');
	});

	it.each([{}, { dynamicSpaceGapCurve: undefined, dynamicSpaceInsetRound: null }])(
		'leaves omitted inputs to the CSS defaults: %p',
		(inputs) => {
			const { theme, inlineStyles } = getThemeAndOverrides({
				spacing: { id: 'UNSAFE-spacing', overrides: inputs as never },
			});
			expect(theme).toEqual({ spacing: 'UNSAFE-spacing' });
			expect(inlineStyles).toBe('');
		},
	);

	it('selects the bare theme without creating an override stylesheet', () => {
		expect(getThemeAndOverrides({ spacing: 'UNSAFE-spacing' })).toEqual({
			theme: { spacing: 'UNSAFE-spacing' },
			inlineStyles: '',
		});
	});

	it('serializes partial inputs without injecting defaults', () => {
		const { inlineStyles } = getThemeAndOverrides({
			spacing: {
				id: 'UNSAFE-spacing',
				overrides: { dynamicSpaceGapCurve: 2, dynamicSpaceInsetRound: false },
			},
		});
		expect(inlineStyles).toContain('--ds-dynamic-space-gap-curve: 2;');
		expect(inlineStyles).toContain('--ds-dynamic-space-inset-round: 0;');
		expect(inlineStyles).not.toContain('--ds-dynamic-space-gap-scale');
		expect(inlineStyles).not.toContain('--ds-dynamic-space-inset-scale');
	});

	it('uses shared theme selectors for root overrides and scopes subtree overrides', () => {
		const configuration = {
			spacing: { id: 'UNSAFE-spacing', overrides: { dynamicSpaceGapScale: 2 } },
		} as const;
		const root = getThemeAndOverrides(configuration).inlineStyles;
		const child = getThemeAndOverrides(configuration, 'child').inlineStyles;
		expect(root).toContain(
			'html[data-theme~="spacing:UNSAFE-spacing"], [data-subtree-theme][data-theme~="spacing:UNSAFE-spacing"]',
		);
		expect(child).toContain('[data-subtree-theme][data-theme-overrides-scope="child"]');
	});

	it('loads the registered stylesheet and emits its theme attribute', async () => {
		expect(getThemeHtmlAttrs({ spacing: 'UNSAFE-spacing' })['data-theme']).toContain(
			'spacing:UNSAFE-spacing',
		);
		const styles = await getThemeStyles({ spacing: 'UNSAFE-spacing' });
		expect(styles.find(({ id }) => id === 'UNSAFE-spacing')?.css).toContain(
			'--ds-space-gap-medium:',
		);
	});

	it('types spacing inputs by theme dimension and excludes individual overrides', () => {
		type Inputs = CustomThemeOverrideRegistry['UNSAFE-spacing']['spacing'];
		const valid: ThemeWithCustomOverrides = {
			spacing: { id: 'UNSAFE-spacing', overrides: { dynamicSpaceGapRound: false } },
		};
		// @ts-expect-error Rounding is a boolean, not a CSS value.
		const invalidRound: Inputs = { dynamicSpaceGapRound: '1px' };
		// @ts-expect-error Curve inputs must be numbers.
		const invalidCurve: Inputs = { dynamicSpaceGapCurve: '2' };
		// @ts-expect-error Individual token overrides are not part of this contract.
		const individual: Inputs = { dynamicSpaceGapLarge: '1rem' };
		const wrongDimension: ThemeWithCustomOverrides = {
			// @ts-expect-error Spacing themes cannot be selected for typography.
			typography: { id: 'UNSAFE-spacing', overrides: {} },
		};
		expect([valid, invalidRound, invalidCurve, individual, wrongDimension]).toHaveLength(5);
	});
});
