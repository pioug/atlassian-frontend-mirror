import { getThemeAndOverrides } from '../../custom-theme-overrides';

describe('getThemeAndOverrides', () => {
	const dynamicOverrides = {
		dynamicForeground: '#0055cc',
		dynamicBackground: '#ffffff',
	};

	it('normalizes inline custom theme overrides to a plain theme and override styles', () => {
		const { theme, inlineStyles } = getThemeAndOverrides({
			light: { id: 'UNSAFE-dynamic', overrides: dynamicOverrides },
			spacing: 'spacing',
		});

		expect(theme).toEqual({ light: 'UNSAFE-dynamic', spacing: 'spacing' });
		expect(inlineStyles).toContain('--ds-dynamic-foreground: #0055cc;');
		expect(inlineStyles).toContain('--ds-dynamic-background: #ffffff;');
	});

	it('generates a color-mode-specific selector for color themes', () => {
		const { inlineStyles } = getThemeAndOverrides({
			light: { id: 'UNSAFE-dynamic', overrides: dynamicOverrides },
		});

		expect(inlineStyles).toContain(
			'html[data-color-mode="light"][data-theme~="light:UNSAFE-dynamic"]',
		);
		expect(inlineStyles).toContain(
			'[data-subtree-theme][data-color-mode="light"][data-theme~="light:UNSAFE-dynamic"]',
		);
	});

	it('scopes light and dark dynamic inputs to their own color mode', () => {
		const { theme, inlineStyles } = getThemeAndOverrides({
			light: { id: 'UNSAFE-dynamic', overrides: dynamicOverrides },
			dark: {
				id: 'UNSAFE-dynamic-dark',
				overrides: { dynamicForeground: '#ffffff', dynamicBackground: '#1d2125' },
			},
		});

		expect(theme).toEqual({ light: 'UNSAFE-dynamic', dark: 'UNSAFE-dynamic-dark' });
		expect(inlineStyles).toContain(
			'html[data-color-mode="dark"][data-theme~="dark:UNSAFE-dynamic-dark"]',
		);
		expect(inlineStyles).toContain('--ds-dynamic-background: #1d2125;');
		expect(inlineStyles).toContain('--ds-dynamic-background: #ffffff;');
	});

	it('writes set heading scales and skips unset ones so the theme fallback applies', () => {
		const { inlineStyles } = getThemeAndOverrides({
			typography: {
				id: 'UNSAFE-typography',
				overrides: {
					dynamicFontFamily: 'Georgia, serif',
					dynamicFontScale: 1,
					dynamicFontHeadingXxlargeScale: 1.6,
					dynamicFontHeadingXlargeScale: undefined,
				},
			},
		});

		expect(inlineStyles).toContain('--ds-dynamic-font-heading-xxlarge-scale: 1.6;');
		expect(inlineStyles).not.toContain('--ds-dynamic-font-heading-xlarge-scale');
		expect(inlineStyles).not.toContain('undefined');
	});

	it('generates a color-mode-independent selector for typography themes', () => {
		const { theme, inlineStyles } = getThemeAndOverrides({
			typography: {
				id: 'UNSAFE-typography',
				overrides: { dynamicFontFamily: 'Georgia, serif', dynamicFontScale: 1.25 },
			},
		});

		expect(theme).toEqual({ typography: 'UNSAFE-typography' });
		expect(inlineStyles).toContain('[data-theme~="typography:UNSAFE-typography"]');
		expect(inlineStyles).not.toContain('data-color-mode');
		expect(inlineStyles).toContain('--ds-dynamic-font-family: Georgia, serif;');
		expect(inlineStyles).toContain('--ds-dynamic-font-scale: 1.25;');
	});

	it('serializes supplied untyped properties using the CSS variable convention', () => {
		const { inlineStyles } = getThemeAndOverrides({
			light: {
				id: 'UNSAFE-dynamic',
				overrides: { dynamicForeground: '#0055cc', unregisteredProperty: 'value' } as never,
			},
		});

		expect(inlineStyles).toContain('--ds-dynamic-foreground: #0055cc;');
		expect(inlineStyles).not.toContain('--ds-dynamic-background');
		expect(inlineStyles).toContain('--ds-unregistered-property: value;');
	});
});
