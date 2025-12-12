import { transform } from '../../../transforms/adfToJson/adfToJson';
import { adfNode } from '../../../adfNode';
import { $or } from '../../../$or';

describe('extends', () => {
	test('should produce extends json schema for a node', () => {
		const p = adfNode('paragraph').define({}).variant('with_alignment', {});
		const doc = adfNode('doc').define({
			root: true,
			content: [$or(p, p.use('with_alignment')!)],
		});

		const res = transform(doc, true);

		expect(res.definitions?.paragraph_with_alignment_node).toEqual({
			allOf: [
				{ $ref: '#/definitions/paragraph_node' },
				{ additionalProperties: true, properties: {}, type: 'object' },
			],
		});
	});

	test('should output full spec with noExtend property', () => {
		const p = adfNode('paragraph').define({}).variant('with_alignment', { noExtend: true });
		const doc = adfNode('doc').define({
			root: true,
			content: [$or(p, p.use('with_alignment')!)],
		});

		const res = transform(doc, true);

		expect(res.definitions?.paragraph_with_alignment_node).toEqual({
			additionalProperties: false,
			properties: { type: { enum: ['paragraph'] } },
			required: ['type'],
			type: 'object',
		});
	});

	test('should output overwright for extends use case if node variant defines its own attributes', () => {
		const p = adfNode('paragraph')
			.define({
				attrs: {},
			})
			.variant('with_alignment', {
				attrs: {
					columnRuleStyle: { type: 'string', default: undefined, optional: true },
				},
			});
		const doc = adfNode('doc').define({
			root: true,
			content: [$or(p, p.use('with_alignment')!)],
		});

		const res = transform(doc, true);

		expect(res.definitions?.paragraph_with_alignment_node).toEqual({
			type: 'object',
			properties: {
				type: {
					enum: ['paragraph'],
				},
				attrs: {
					type: 'object',
					properties: {
						columnRuleStyle: {
							type: 'string',
						},
					},
					additionalProperties: false,
				},
			},
			additionalProperties: false,
			required: ['type'],
		});
	});

	test("should not output attributes overwright for extends use case if node variant doesn't define its own attributes", () => {
		const p = adfNode('paragraph')
			.define({
				attrs: {
					columnRuleStyle: { type: 'string', default: undefined, optional: true },
				},
			})
			.variant('with_alignment', {});
		const doc = adfNode('doc').define({
			root: true,
			content: [$or(p, p.use('with_alignment')!)],
		});

		const res = transform(doc, true);

		expect(res.definitions?.paragraph_with_alignment_node).toEqual({
			allOf: [
				{ $ref: '#/definitions/paragraph_node' },
				{
					additionalProperties: true,
					properties: {},
					type: 'object',
				},
			],
		});
	});
});
