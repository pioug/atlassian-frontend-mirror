import { figmaFormatter as formatter } from '../../figma';

describe('formatter', () => {
	it('should parse token', () => {
		const result = formatter({
			dictionary: {
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

		expect(result).toEqual(
			expect.stringContaining(
				JSON.stringify(
					{
						name: 'Dark',
						tokens: {
							'Dark/color.brand': {
								value: '#ffffff',
							},
						},
						renameMap: {},
					},
					null,
					2,
				),
			),
		);
	});

	it('should not parse UNSAFE token', () => {
		const result = formatter({
			dictionary: {
				allTokens: [
					{
						name: 'brand',
						value: '#ffffff',
						path: ['color', 'brand'],
						attributes: { group: 'paint' },
					},
					{
						name: 'UNSAFE_brand',
						value: '#ffffff',
						path: ['utility', 'UNSAFE_brand'],
						attributes: { group: 'raw' },
					},
				],
			},
			options: {
				themeName: 'atlassian-dark',
			},
		} as any);

		expect(result).toEqual(
			expect.stringContaining(
				JSON.stringify(
					{
						name: 'Dark',
						tokens: {
							'Dark/color.brand': {
								value: '#ffffff',
							},
						},
						renameMap: {},
					},
					null,
					2,
				),
			),
		);
	});

	it('should remove [default] keywords in path', () => {
		const result = formatter({
			dictionary: {
				allTokens: [
					{
						name: 'background/[default]/foo',
						value: '#ffffff',
						path: ['color', 'background', '[default]', 'foo'],
						attributes: { group: 'paint' },
					},
				],
			},
			options: {
				themeName: 'atlassian-dark',
			},
		} as any);

		expect(result).toEqual(
			expect.stringContaining(
				JSON.stringify(
					{
						name: 'Dark',
						tokens: {
							'Dark/color.background.foo': {
								value: '#ffffff',
							},
						},
						renameMap: {},
					},
					null,
					2,
				),
			),
		);
	});

	it('should prefix path with theme name', () => {
		const result = formatter({
			dictionary: {
				allTokens: [
					{
						name: 'background/[default]',
						value: '#ffffff',
						path: ['color', 'background', '[default]'],
						attributes: { group: 'paint' },
					},
				],
			},
			options: {
				themeName: 'atlassian-light',
			},
		} as any);

		expect(result).toEqual(expect.stringContaining('Light/'));
	});

	it('should generate correct rename mapping', () => {
		const result = formatter({
			dictionary: {
				allTokens: [
					{
						name: 'background/[default]',
						value: '#ffffff',
						path: ['color', 'background', '[default]'],
						attributes: {
							group: 'paint',
							replacement: 'color.background.foo.bar.[default]',
						},
					},
				],
			},
			options: {
				themeName: 'atlassian-dark',
			},
		} as any);

		expect(result).toEqual(
			expect.stringContaining(`\"Dark/color.background\": \"Dark/color.background.foo.bar\"`),
		);
	});
});
