import { cssVariableFormatter as formatter } from '../../css-variable-formatter';

describe('formatter', () => {
	it('should parse token', () => {
		const result = formatter({
			dictionary: {
				getReferences: jest.fn().mockReturnValue([]),
				usesReference: jest.fn().mockReturnValue(false),
				allTokens: [
					{
						name: 'brand',
						value: '#ffffff',
						path: ['color', 'brand'],
						attributes: { group: 'paint' },
					},
				],
			},
			options: {
				themeName: 'atlassian-dark',
			},
		} as any);

		expect(result)
			.toEqual(`html[data-color-mode="light"][data-theme~="light:dark"], [data-subtree-theme][data-color-mode="light"][data-theme~="light:dark"],
html[data-color-mode="dark"][data-theme~="dark:dark"], [data-subtree-theme][data-color-mode="dark"][data-theme~="dark:dark"] {
  color-scheme: dark;
  --ds-brand: #ffffff;
}
`);
	});

	it('should preserve camelCase tokens', () => {
		const result = formatter({
			dictionary: {
				getReferences: jest.fn().mockReturnValue([]),
				usesReference: jest.fn().mockReturnValue(false),
				allTokens: [
					{
						name: 'colorAccent',
						value: '#ffffff',
						path: ['color', 'colorAccent'],
						attributes: { group: 'paint' },
					},
				],
			},
			options: {
				themeName: 'atlassian-dark',
			},
		} as any);

		expect(result)
			.toEqual(`html[data-color-mode="light"][data-theme~="light:dark"], [data-subtree-theme][data-color-mode="light"][data-theme~="light:dark"],
html[data-color-mode="dark"][data-theme~="dark:dark"], [data-subtree-theme][data-color-mode="dark"][data-theme~="dark:dark"] {
  color-scheme: dark;
  --ds-colorAccent: #ffffff;
}
`);
	});

	it('should omit palette tokens', () => {
		const result = formatter({
			dictionary: {
				getReferences: jest.fn().mockReturnValue([]),
				usesReference: jest.fn().mockReturnValue(false),
				allTokens: [
					{
						name: 'B900',
						value: '#ffffff',
						path: ['color', 'B900'],
						attributes: {
							group: 'palette',
						},
					},
				],
			},
			options: {
				themeName: 'atlassian-dark',
			},
		} as any);

		expect(result)
			.toEqual(`html[data-color-mode="light"][data-theme~="light:dark"], [data-subtree-theme][data-color-mode="light"][data-theme~="light:dark"],
html[data-color-mode="dark"][data-theme~="dark:dark"], [data-subtree-theme][data-color-mode="dark"][data-theme~="dark:dark"] {
  color-scheme: dark;
}
`);
	});

	it('should parse nested token', () => {
		const result = formatter({
			dictionary: {
				getReferences: jest.fn().mockReturnValue([]),
				usesReference: jest.fn().mockReturnValue(false),
				allTokens: [
					{
						name: 'accent',
						value: '#ffffff',
						path: ['color', 'accent'],
						attributes: { group: 'paint' },
					},
				],
			},
			options: {
				themeName: 'atlassian-dark',
			},
		} as any);

		expect(result)
			.toEqual(`html[data-color-mode="light"][data-theme~="light:dark"], [data-subtree-theme][data-color-mode="light"][data-theme~="light:dark"],
html[data-color-mode="dark"][data-theme~="dark:dark"], [data-subtree-theme][data-color-mode="dark"][data-theme~="dark:dark"] {
  color-scheme: dark;
  --ds-accent: #ffffff;
}
`);
	});

	it('should parse deeply nested token', () => {
		const result = formatter({
			dictionary: {
				getReferences: jest.fn().mockReturnValue([]),
				usesReference: jest.fn().mockReturnValue(false),
				allTokens: [
					{
						name: 'brand',
						value: '#ffffff',
						path: ['color', 'accent', 'brand'],
						attributes: { group: 'paint' },
					},
				],
			},
			options: {
				themeName: 'atlassian-dark',
			},
		} as any);

		expect(result)
			.toEqual(`html[data-color-mode="light"][data-theme~="light:dark"], [data-subtree-theme][data-color-mode="light"][data-theme~="light:dark"],
html[data-color-mode="dark"][data-theme~="dark:dark"], [data-subtree-theme][data-color-mode="dark"][data-theme~="dark:dark"] {
  color-scheme: dark;
  --ds-accent-brand: #ffffff;
}
`);
	});

	it('should omit [default] keywords in token paths', () => {
		const result = formatter({
			dictionary: {
				getReferences: jest.fn().mockReturnValue([]),
				usesReference: jest.fn().mockReturnValue(false),
				allTokens: [
					{
						name: '[default]',
						value: '#ffffff',
						path: ['color', 'background', 'brand', '[default]'],
						attributes: {
							group: 'paint',
						},
					},
				],
			},
			options: {
				themeName: 'atlassian-dark',
			},
		} as any);

		expect(result)
			.toEqual(`html[data-color-mode="light"][data-theme~="light:dark"], [data-subtree-theme][data-color-mode="light"][data-theme~="light:dark"],
html[data-color-mode="dark"][data-theme~="dark:dark"], [data-subtree-theme][data-color-mode="dark"][data-theme~="dark:dark"] {
  color-scheme: dark;
  --ds-background-brand: #ffffff;
}
`);
	});

	it('should omit nested [default] keywords in token paths', () => {
		const result = formatter({
			dictionary: {
				getReferences: jest.fn().mockReturnValue([]),
				usesReference: jest.fn().mockReturnValue(false),
				allTokens: [
					{
						name: '[default]',
						value: '#ffffff',
						path: ['color', 'background', 'brand', '[default]', '[default]'],
						attributes: {
							group: 'paint',
						},
					},
				],
			},
			options: {
				themeName: 'atlassian-dark',
			},
		} as any);

		expect(result)
			.toEqual(`html[data-color-mode="light"][data-theme~="light:dark"], [data-subtree-theme][data-color-mode="light"][data-theme~="light:dark"],
html[data-color-mode="dark"][data-theme~="dark:dark"], [data-subtree-theme][data-color-mode="dark"][data-theme~="dark:dark"] {
  color-scheme: dark;
  --ds-background-brand: #ffffff;
}
`);
	});

	it('should omit nested [default] keywords in the middle of token paths', () => {
		const result = formatter({
			dictionary: {
				getReferences: jest.fn().mockReturnValue([]),
				usesReference: jest.fn().mockReturnValue(false),
				allTokens: [
					{
						name: '[default]',
						value: '#ffffff',
						path: ['color', 'background', 'brand', '[default]', '[default]', 'pressed'],
						attributes: {
							group: 'paint',
						},
					},
				],
			},
			options: {
				themeName: 'atlassian-light',
			},
		} as any);

		expect(result)
			.toEqual(`html[data-color-mode="light"][data-theme~="light:light"], [data-subtree-theme][data-color-mode="light"][data-theme~="light:light"],
html[data-color-mode="dark"][data-theme~="dark:light"], [data-subtree-theme][data-color-mode="dark"][data-theme~="dark:light"] {
  color-scheme: light;
  --ds-background-brand-pressed: #ffffff;
}
`);
	});

	it('should omit prefers-color-scheme media selector for non-color themes', () => {
		const result = formatter({
			dictionary: {
				getReferences: jest.fn().mockReturnValue([]),
				usesReference: jest.fn().mockReturnValue(false),
				allTokens: [
					{
						value: '0',
						name: 'space.Space0',
						path: ['space', 'Space0'],
						attributes: {
							group: 'scale',
						},
					},
					{
						value: '11px',
						name: 'fontSize.FontSize050',
						path: ['fontSize', 'FontSize050'],
						attributes: {
							group: 'scale',
						},
					},
				],
			},
			options: {
				themeName: 'atlassian-spacing',
			},
		} as any);

		expect(result)
			.toEqual(`html[data-theme~="spacing:spacing"], [data-subtree-theme][data-theme~="spacing:spacing"] {
  --ds-FontSize050: 11px;
  --ds-space-Space0: 0;
}
`);
	});

	it('should inject color-scheme for color themes with a light mode', () => {
		const result = formatter({
			dictionary: {
				getReferences: jest.fn().mockReturnValue([]),
				usesReference: jest.fn().mockReturnValue(false),
				allTokens: [
					{
						name: 'brand',
						value: '#ffffff',
						path: ['color', 'brand'],
						attributes: { group: 'paint', mode: 'light' },
					},
				],
			},
			options: {
				themeName: 'atlassian-light',
			},
		} as any);

		expect(result)
			.toEqual(`html[data-color-mode="light"][data-theme~="light:light"], [data-subtree-theme][data-color-mode="light"][data-theme~="light:light"],
html[data-color-mode="dark"][data-theme~="dark:light"], [data-subtree-theme][data-color-mode="dark"][data-theme~="dark:light"] {
  color-scheme: light;
  --ds-brand: #ffffff;
}
`);
	});

	it('should inject color-scheme for color themes with a dark mode', () => {
		const result = formatter({
			dictionary: {
				getReferences: jest.fn().mockReturnValue([]),
				usesReference: jest.fn().mockReturnValue(false),
				allTokens: [
					{
						name: 'brand',
						value: '#ffffff',
						path: ['color', 'brand'],
						attributes: { group: 'paint', mode: 'dark' },
					},
				],
			},
			options: {
				themeName: 'atlassian-dark',
			},
		} as any);

		expect(result)
			.toEqual(`html[data-color-mode="light"][data-theme~="light:dark"], [data-subtree-theme][data-color-mode="light"][data-theme~="light:dark"],
html[data-color-mode="dark"][data-theme~="dark:dark"], [data-subtree-theme][data-color-mode="dark"][data-theme~="dark:dark"] {
  color-scheme: dark;
  --ds-brand: #ffffff;
}
`);
	});

	it('should not inject color-scheme for non-color themes with a dark mode', () => {
		const result = formatter({
			dictionary: {
				getReferences: jest.fn().mockReturnValue([]),
				usesReference: jest.fn().mockReturnValue(false),
				allTokens: [
					{
						name: 'brand',
						value: '16px',
						path: ['typog', 'base'],
						attributes: { group: 'spacing', mode: 'dark' },
					},
				],
			},
			options: {
				themeName: 'atlassian-spacing',
			},
		} as any);

		expect(result)
			.toEqual(`html[data-theme~="spacing:spacing"], [data-subtree-theme][data-theme~="spacing:spacing"] {
  --ds-base: 16px;
}
`);
	});

	it('should create correct format for typographic tokens', () => {
		const result = formatter({
			dictionary: {
				getReferences: jest.fn().mockReturnValue([]),
				usesReference: jest.fn().mockReturnValue(false),
				allTokens: [
					{
						name: 'brand',
						value: {
							fontWeight: 'bold',
							fontStyle: 'normal',
							fontSize: '16px',
							fontFamily: 'sans-serif',
							lineHeight: '24px',
						},
						original: {
							value: {
								fontWeight: 'XXXX',
								fontStyle: 'XXXX',
								fontSize: 'XXXX',
								fontFamily: 'FontValue',
								lineHeight: 'XXXX',
							},
						},
						path: ['typog', 'base'],
						attributes: { group: 'typography' },
					},
				],
			},
			options: {
				themeName: 'atlassian-typography',
			},
		} as any);

		expect(result)
			.toEqual(`html[data-theme~="typography:typography"], [data-subtree-theme][data-theme~="typography:typography"] {
  --ds-base: normal bold 16px/24px sans-serif;
}
`);
	});

	describe('customProperties', () => {
		const colorToken = (name: string, value: string) => ({
			name,
			value,
			path: ['color', name],
			attributes: { group: 'paint' },
			original: { value, attributes: { group: 'paint' } },
		});

		const format = (allTokens: object[], customProperties?: object[]) =>
			formatter({
				dictionary: {
					getReferences: jest.fn().mockReturnValue([]),
					usesReference: jest.fn().mockReturnValue(false),
					allTokens,
				},
				options: { themeName: 'atlassian-dark', customProperties },
			} as any);

		const base = {
			property: '--ds-shared-base',
			value: 'oklch(from var(--input) 0.5 c h)',
			resolvedValue: 'oklch(from var(--input) 0.5 c h)',
		};
		const derived = {
			property: '--ds-shared-derived',
			value: 'oklch(from var(--ds-shared-base) l c h / 0.3)',
			resolvedValue: 'oklch(from oklch(from var(--input) 0.5 c h) l c h / 0.3)',
		};
		const unused = {
			property: '--ds-shared-unused',
			value: 'oklch(from var(--input) 0.1 c h)',
			resolvedValue: 'oklch(from var(--input) 0.1 c h)',
		};

		it('should declare used custom properties once and reference them from matching tokens', () => {
			const result = format(
				[
					colorToken('one', base.resolvedValue),
					colorToken('two', base.resolvedValue),
					colorToken('three', '#ffffff'),
				],
				[base, unused],
			);

			const definition = `  --ds-shared-base: ${base.value};\n`;
			expect(result.split(definition)).toHaveLength(2);
			expect(result).toContain('  --ds-one: var(--ds-shared-base);\n');
			expect(result).toContain('  --ds-two: var(--ds-shared-base);\n');
			expect(result).toContain('  --ds-three: #ffffff;\n');
			expect(result.indexOf(definition)).toBeLessThan(result.indexOf('  --ds-one:'));
			expect(result).not.toContain('--ds-shared-unused');
		});

		it('should declare custom properties only referenced by other custom properties', () => {
			const result = format([colorToken('one', derived.resolvedValue)], [base, derived, unused]);

			expect(result).toContain(`  --ds-shared-base: ${base.value};
  --ds-shared-derived: ${derived.value};
  --ds-one: var(--ds-shared-derived);
`);
			expect(result).not.toContain('--ds-shared-unused');
		});

		it('should only replace exact matches', () => {
			const partial = `${base.resolvedValue}, #000000`;
			const result = format([colorToken('one', partial)], [base]);

			expect(result).toContain(`  --ds-one: ${partial};`);
			expect(result).not.toContain('--ds-shared-base');
		});

		it('should output tokens unchanged without custom properties', () => {
			expect(format([colorToken('one', base.resolvedValue)])).toContain(
				`  --ds-one: ${base.resolvedValue};`,
			);
		});
	});
});
