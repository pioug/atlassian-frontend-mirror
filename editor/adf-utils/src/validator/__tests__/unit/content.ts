jest.mock('../../../validator/specs', () => ({
	nodeA: {
		props: {
			type: { type: 'enum', values: ['nodeA'] },
			content: {
				type: 'array',
				items: ['nodeB'],
				minItems: 1,
				maxItems: 2,
			},
		},
	},
	nodeB: {
		props: {
			type: { type: 'enum', values: ['nodeB'] },
		},
	},
	nodeC: {
		props: {
			type: { type: 'enum', values: ['nodeC'] },
			content: {
				type: 'array',
				items: ['nodeA', 'nodeB'],
				isTupleLike: false,
			},
		},
	},
	nodeD: {
		props: {
			type: { type: 'enum', values: ['nodeD'] },
			content: {
				type: 'array',
				items: ['nodeA', 'nodeB'],
				isTupleLike: true,
			},
		},
	},
}));

import { validator } from '../../../validator/validator';

describe('validate content', () => {
	const validate = validator();

	test('isLikeTuple', () => {
		expect(() => {
			validate({
				type: 'nodeC',
				content: [{ type: 'nodeB' }, { type: 'nodeB' }, { type: 'nodeB' }],
			});
		}).not.toThrow();

		expect(() => {
			validate({
				type: 'nodeC',
				content: [
					{ type: 'nodeB' },
					{ type: 'nodeB' },
					{ type: 'nodeA', content: [{ type: 'nodeB' }] },
				],
			});
		}).not.toThrow();

		expect(() => {
			validate({
				type: 'nodeD',
				content: [{ type: 'nodeA', content: [{ type: 'nodeB' }] }, { type: 'nodeB' }],
			});
		}).not.toThrow();

		expect(() => {
			validate({
				type: 'nodeD',
				content: [{ type: 'nodeB' }, { type: 'nodeA', content: [{ type: 'nodeB' }] }],
			});
		}).toThrow();
	});

	test('minItems', () => {
		const run = () => {
			validate({
				type: 'nodeA',
				content: [],
			});
		};
		expect(run).toThrowError(`nodeA: 'content' should have more than 1 child.`);
	});

	test('maxItems', () => {
		const run = () => {
			validate({
				type: 'nodeA',
				content: [{ type: 'nodeB' }, { type: 'nodeB' }, { type: 'nodeB' }],
			});
		};
		expect(run).toThrowError(`nodeA: 'content' should have less than 2 child`);
	});
});
