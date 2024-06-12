import type { TransformedToken } from 'style-dictionary';

import sortTokens from '../../../sort-tokens';

type Group = 'spacing' | 'paint' | 'fontWeight' | 'palette' | 'typography';
type PaletteCategory =
	| 'red'
	| 'orange'
	| 'yellow'
	| 'green'
	| 'teal'
	| 'blue'
	| 'purple'
	| 'magenta'
	| 'gray'
	| 'light mode neutral'
	| 'dark mode neutral'
	| 'opacity';

const fakeToken = (
	tokenName: string,
	options?: {
		group?: Group;
		category?: PaletteCategory;
	},
): TransformedToken => {
	const attributes = {
		group: options?.group || '',
		category: options?.category || '',
	};

	return {
		name: tokenName,
		path: tokenName.split('.'),
		isSource: false,
		filePath: '',
		attributes,
		original: {
			attributes,
			value: '',
		},
		value: "#ff4'",
	};
};

const fakeTokens = (
	tokenNames: string[] | Array<{ name: string; category: PaletteCategory }>,
	options?: { group?: Group },
) =>
	sortTokens(
		tokenNames.map((tokenName) =>
			fakeToken(typeof tokenName === 'string' ? tokenName : tokenName.name, {
				...options,
				category: typeof tokenName === 'string' ? undefined : tokenName.category,
			}),
		),
	);

describe('sortTokens', () => {
	it('sorts tokens by root paths using a predefined order', () => {
		const result = fakeTokens(['elevation.foo', 'opacity.bar', 'color.baz']);
		expect(result[0].name).toEqual('color.baz');
		expect(result[1].name).toEqual('elevation.foo');
		expect(result[2].name).toEqual('opacity.bar');
	});

	it('sorts tokens by subpaths using a predefined order', () => {
		const result = fakeTokens(['color.link', 'color.accent.red', 'color.text']);
		expect(result[0].name).toEqual('color.text');
		expect(result[1].name).toEqual('color.link');
		expect(result[2].name).toEqual('color.accent.red');
	});

	it('sorts tokens by path length', () => {
		const result = fakeTokens(['foo.bar.baz', 'foo', 'foo.bar']);
		expect(result[0].name).toEqual('foo');
		expect(result[1].name).toEqual('foo.bar');
		expect(result[2].name).toEqual('foo.bar.baz');
	});

	it('sorts token number values from smallest to largest', () => {
		const result = fakeTokens([
			'foo.size.050',
			'foo.size.100',
			'foo.size.075',
			'foo.size.1000',
			'foo.size.025',
			'foo.size.0',
		]);
		expect(result[0].name).toEqual('foo.size.0');
		expect(result[1].name).toEqual('foo.size.025');
		expect(result[2].name).toEqual('foo.size.050');
		expect(result[3].name).toEqual('foo.size.075');
		expect(result[4].name).toEqual('foo.size.100');
		expect(result[5].name).toEqual('foo.size.1000');
	});

	describe('semantic tokens', () => {
		it('are sorted in the correct predefined order', () => {
			const result = fakeTokens([
				'foo.danger',
				'foo.success',
				'foo.warning',
				'foo.information',
				'foo.brand',
				'foo.discovery',
			]);
			expect(result[0].name).toEqual('foo.brand');
			expect(result[1].name).toEqual('foo.danger');
			expect(result[2].name).toEqual('foo.warning');
			expect(result[3].name).toEqual('foo.success');
			expect(result[4].name).toEqual('foo.discovery');
			expect(result[5].name).toEqual('foo.information');
		});

		it('are grouped with children', () => {
			const result = fakeTokens([
				'background.danger',
				'background.danger.bold.hovered',
				'background.warning',
				'background.danger.bold',
				'zoo.zar',
				'ahh.baz',
				'background.danger.hovered',
			]);
			expect(result[0].name).toEqual('ahh.baz');
			expect(result[1].name).toEqual('background.danger');
			expect(result[2].name).toEqual('background.danger.hovered');
			expect(result[3].name).toEqual('background.danger.bold');
			expect(result[4].name).toEqual('background.danger.bold.hovered');
			expect(result[5].name).toEqual('background.warning');
			expect(result[6].name).toEqual('zoo.zar');
		});

		it('are sorted after non-semantic tokens', () => {
			const result = fakeTokens(['foo.information', 'foo.bar', 'foo.brand']);
			expect(result[0].name).toEqual('foo.bar');
			expect(result[1].name).toEqual('foo.brand');
			expect(result[2].name).toEqual('foo.information');
		});
	});

	describe('color tokens', () => {
		it('are sorted in the correct predefined order for paint tokens', () => {
			const result = fakeTokens(
				[
					'foo.bar.gray',
					'foo.bar.orange',
					'foo.bar.purple',
					'foo.bar.magenta',
					'foo.bar.green',
					'foo.bar.blue',
					'foo.bar.red',
					'foo.bar.yellow',
					'foo.bar.teal',
				],
				{ group: 'paint' },
			);
			expect(result[0].name).toEqual('foo.bar.red');
			expect(result[1].name).toEqual('foo.bar.orange');
			expect(result[2].name).toEqual('foo.bar.yellow');
			expect(result[3].name).toEqual('foo.bar.green');
			expect(result[4].name).toEqual('foo.bar.teal');
			expect(result[5].name).toEqual('foo.bar.blue');
			expect(result[6].name).toEqual('foo.bar.purple');
			expect(result[7].name).toEqual('foo.bar.magenta');
			expect(result[8].name).toEqual('foo.bar.gray');
		});

		it('are not sorted by color for non-paint tokens', () => {
			const result = fakeTokens([
				'foo.bar.blue',
				'foo.bar.orange',
				'foo.bar.yellow',
				'foo.bar.magenta',
				'foo.bar.gray',
				'foo.bar.teal',
				'foo.bar.green',
				'foo.bar.red',
				'foo.bar.purple',
			]);
			expect(result[0].name).not.toEqual('foo.bar.red');
			expect(result[8].name).not.toEqual('foo.bar.gray');
		});

		it('are sorted after non-color tokens', () => {
			const result = fakeTokens(['foo.bar.red', 'foo.bar.baz', 'foo.bar.blue'], { group: 'paint' });
			expect(result[0].name).toEqual('foo.bar.baz');
			expect(result[1].name).toEqual('foo.bar.red');
			expect(result[2].name).toEqual('foo.bar.blue');
		});
	});

	describe('emphasis tokens', () => {
		it('are sorted from subtlest to boldest', () => {
			const result = fakeTokens(['boldest', 'bold', 'subtle', 'subtler', 'bolder', 'subtlest']);
			expect(result[0].name).toEqual('subtlest');
			expect(result[1].name).toEqual('subtler');
			expect(result[2].name).toEqual('subtle');
			expect(result[3].name).toEqual('bold');
			expect(result[4].name).toEqual('bolder');
			expect(result[5].name).toEqual('boldest');
		});

		it('are sorted after non-emphasis tokens', () => {
			const result = fakeTokens(['foo.bold', 'foo.bar', 'foo.subtle']);
			expect(result[0].name).toEqual('foo.bar');
			expect(result[1].name).toEqual('foo.subtle');
			expect(result[2].name).toEqual('foo.bold');
		});

		it('are not sorted for fontWeight tokens (to avoid `font-weight: bold` naming conflicts)', () => {
			const result = fakeTokens(['boldest', 'bold', 'subtle', 'subtler', 'bolder', 'subtlest'], {
				group: 'fontWeight',
			});
			expect(result[0].name).not.toEqual('subtlest');
			expect(result[5].name).not.toEqual('boldest');
		});
	});

	describe('palette tokens', () => {
		it('are sorted in the correct predefined order for groups', () => {
			const result = fakeTokens(
				[
					{ name: 'color.palette.Gray100', category: 'gray' },
					{ name: 'color.palette.Yellow100', category: 'yellow' },
					{
						name: 'color.palette.Opacity100',
						category: 'opacity',
					},
					{
						name: 'color.palette.DarkNeutral100',
						category: 'dark mode neutral',
					},
					{ name: 'color.palette.Green100', category: 'green' },
					{ name: 'color.palette.Orange100', category: 'orange' },
					{ name: 'color.palette.Magenta100', category: 'magenta' },
					{ name: 'color.palette.Neutral100', category: 'light mode neutral' },
					{ name: 'color.palette.Blue100', category: 'blue' },
					{ name: 'color.palette.Purple100', category: 'purple' },
					{ name: 'color.palette.Teal100', category: 'teal' },
					{ name: 'color.palette.Red100', category: 'red' },
				],
				{ group: 'palette' },
			);
			expect(result[0].name).toEqual('color.palette.Red100');
			expect(result[1].name).toEqual('color.palette.Orange100');
			expect(result[2].name).toEqual('color.palette.Yellow100');
			expect(result[3].name).toEqual('color.palette.Green100');
			expect(result[4].name).toEqual('color.palette.Teal100');
			expect(result[5].name).toEqual('color.palette.Blue100');
			expect(result[6].name).toEqual('color.palette.Purple100');
			expect(result[7].name).toEqual('color.palette.Magenta100');
			expect(result[8].name).toEqual('color.palette.Gray100');
			expect(result[9].name).toEqual('color.palette.Neutral100');
			expect(result[10].name).toEqual('color.palette.DarkNeutral100');
			expect(result[11].name).toEqual('color.palette.Opacity100');
		});

		it('are sorted by numerical value', () => {
			const result = fakeTokens(
				[
					{ name: 'color.palette.Green1000', category: 'green' },
					{ name: 'color.palette.Green1', category: 'green' },
					{ name: 'color.palette.Green500', category: 'green' },
				],
				{ group: 'palette' },
			);
			expect(result[0].name).toEqual('color.palette.Green1');
			expect(result[1].name).toEqual('color.palette.Green500');
			expect(result[2].name).toEqual('color.palette.Green1000');
		});

		it('numerical value sorting accounts for negative numbers', () => {
			const result = fakeTokens(
				[
					{ name: 'color.palette.Red100', category: 'red' },
					{ name: 'color.palette.Red-50', category: 'red' },
					{ name: 'color.palette.Red-1000', category: 'red' },
				],
				{ group: 'palette' },
			);
			expect(result[0].name).toEqual('color.palette.Red-1000');
			expect(result[1].name).toEqual('color.palette.Red-50');
			expect(result[2].name).toEqual('color.palette.Red100');
		});

		it('are sorted with alpha tokens after solid equivalents', () => {
			const result = fakeTokens(
				[
					{ name: 'color.palette.Blue100A', category: 'blue' },
					{ name: 'color.palette.Blue100', category: 'blue' },
				],
				{ group: 'palette' },
			);
			expect(result[0].name).toEqual('color.palette.Blue100');
			expect(result[1].name).toEqual('color.palette.Blue100A');
		});
	});

	describe('typography tokens', () => {
		it('are sorted from largest to smallest', () => {
			const result = fakeTokens(
				['font.medium', 'font.large', 'font.xxlarge', 'font.xxsmall', 'font.small'],
				{ group: 'typography' },
			);
			expect(result[0].name).toEqual('font.xxlarge');
			expect(result[1].name).toEqual('font.large');
			expect(result[2].name).toEqual('font.medium');
			expect(result[3].name).toEqual('font.small');
			expect(result[4].name).toEqual('font.xxsmall');
		});

		it('are sorted heading -> body -> code', () => {
			const result = fakeTokens(['font.body', 'font.code', 'font.heading'], {
				group: 'typography',
			});
			expect(result[0].name).toEqual('font.heading');
			expect(result[1].name).toEqual('font.body');
			expect(result[2].name).toEqual('font.code');
		});
	});
});
