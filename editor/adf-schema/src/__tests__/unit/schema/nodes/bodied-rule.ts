import { fromHTML, toHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';

import { bodiedRule as bodiedRuleSchema } from '../../../../next-schema/nodes/bodiedRule';
import { createSchema } from '../../../../schema/create-schema';
import { bodiedRule, bodiedRuleRootOnlyStage0 } from '../../../../schema/nodes/bodied-rule';
import { bodiedRule as bodiedRuleValidatorSpec } from '../../../../validator-schema/generated/validatorSpec';

const schema = createSchema({
	nodes: ['doc', 'paragraph', 'heading', 'text', 'bodiedRule'],
});
const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema bodiedRule node`, () => {
	it('returns the generated node spec', () => {
		expect(bodiedRule).toStrictEqual({
			attrs: {
				alignment: { default: null },
				color: { default: null },
				localId: { default: '' },
				style: { default: null },
				weight: { default: null },
			},
			content: '(paragraph | heading){1,1}',
			group: 'block',
			parseDOM: [{ tag: 'div[data-node-type="bodied-rule"]', getAttrs: expect.any(Function) }],
			toDOM: expect.any(Function),
		});
	});

	it('requires localId and defaults it to an empty string', () => {
		expect(bodiedRuleValidatorSpec.props.attrs).not.toHaveProperty('optional');
		expect(bodiedRuleValidatorSpec.props.attrs.props.localId).toEqual({
			minLength: 1,
			type: 'string',
		});
		expect(schema.nodes.bodiedRule.create({}, schema.nodes.paragraph.create()).attrs.localId).toBe(
			'',
		);
	});

	it('supports unsupported marks in every Stage-0 variant', () => {
		expect(bodiedRuleSchema.getSpec().marks?.map((mark) => mark.getType())).toEqual([
			'unsupportedMark',
			'unsupportedNodeAttribute',
		]);
		expect(
			bodiedRuleSchema
				.use('root_only')
				?.getSpec()
				.marks?.map((mark) => mark.getType()),
		).toEqual(['breakout', 'unsupportedMark', 'unsupportedNodeAttribute']);
	});

	it('supports breakout in the root-only Stage-0 spec', () => {
		expect(bodiedRuleRootOnlyStage0).toStrictEqual({
			...bodiedRule,
			marks: 'breakout unsupportedMark unsupportedNodeAttribute',
		});
	});

	it('restricts weight to values from 1 through 3', () => {
		expect(bodiedRuleValidatorSpec.props.attrs.props.weight).toEqual({
			maximum: 3,
			minimum: 1,
			optional: true,
			type: 'number',
		});
	});

	it('requires exactly one content child in the validator spec', () => {
		expect(bodiedRuleValidatorSpec.props.content).toEqual({
			items: [['paragraph_with_no_marks', 'heading_with_no_marks']],
			maxItems: 1,
			minItems: 1,
			type: 'array',
		});
	});

	it('round-trips attributes and paragraph content through HTML', () => {
		const paragraph = schema.nodes.paragraph.create({}, schema.text('Label'));
		const node = schema.nodes.bodiedRule.create(
			{
				alignment: 'end',
				color: '#deebff',
				localId: 'rule-id',
				style: 'dashed',
				weight: 2,
			},
			paragraph,
		);
		const html = toHTML(node, schema);
		const parsedNode = fromHTML(html, schema).firstChild!;

		expect(parsedNode.toJSON()).toEqual(node.toJSON());
	});

	it('generates a localId when parsing HTML without it', () => {
		const html = '<div data-node-type="bodied-rule"><p>Label</p></div>';
		const parsedNode = fromHTML(html, schema).firstChild!;

		expect(parsedNode.attrs.localId).toEqual(expect.any(String));
		expect(parsedNode.attrs.localId).not.toBe('');
		expect(toHTML(parsedNode, schema)).toContain(`data-local-id="${parsedNode.attrs.localId}"`);
	});

	it('treats an empty data-weight attribute as absent', () => {
		const html =
			'<div data-node-type="bodied-rule" data-local-id="rule-id" data-weight=""><p>Label</p></div>';
		const parsedNode = fromHTML(html, schema).firstChild!;

		expect(parsedNode.attrs.weight).toBeNull();
	});

	it('requires exactly one paragraph or heading child', () => {
		expect(() => schema.nodes.bodiedRule.createChecked({}, [])).toThrow();
		expect(() =>
			schema.nodes.bodiedRule.createChecked({}, schema.nodes.paragraph.create()),
		).not.toThrow();
		expect(() =>
			schema.nodes.bodiedRule.createChecked({}, schema.nodes.heading.create({ level: 2 })),
		).not.toThrow();
		expect(() =>
			schema.nodes.bodiedRule.createChecked({}, [
				schema.nodes.paragraph.create(),
				schema.nodes.paragraph.create(),
			]),
		).toThrow();
	});
});
