import { failGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { validator } from '../../validator';

/**
 * `unknownAttribute` is not declared by the `heading` spec, so validation reports it as unsupported
 * and the repair path deletes it from `attrs` and attaches an `unsupportedNodeAttribute` mark.
 */
const docWithUnsupportedNodeAttribute = () => ({
	type: 'doc',
	version: 1,
	content: [
		{
			type: 'heading',
			attrs: { level: 1, unknownAttribute: 'keep-me' },
			content: [{ type: 'text', text: 'hello' }],
		},
	],
});

/**
 * `text` declares no `attrs`, so a stray attribute takes the same repair path. This node already
 * carries a mark, which sends the repair through the append branch rather than the
 * create-a-new-array branch; appending is what reaches into the caller's array.
 */
const docWithMarkedTextAndUnsupportedAttribute = () => ({
	type: 'doc',
	version: 1,
	content: [
		{
			type: 'paragraph',
			content: [
				{ type: 'text', text: 'hello', marks: [{ type: 'strong' }], attrs: { bogus: 'value' } },
			],
		},
	],
});

/**
 * A node that already carries an `unsupportedNodeAttribute` mark from an earlier repair. To avoid
 * duplicate marks the repair path overwrites that mark's `attrs` in place, so an uncopied `marks`
 * array lets the current (empty) payload replace the recorded one in the caller's document.
 */
const docWithExistingRepairMark = () => ({
	type: 'doc',
	version: 1,
	content: [
		{
			type: 'heading',
			attrs: { level: 1, unknownAttribute: 'keep-me' },
			marks: [
				{
					type: 'unsupportedNodeAttribute',
					attrs: { type: { nodeType: 'heading' }, unsupported: { previous: 'value' } },
				},
			],
			content: [{ type: 'text', text: 'hello' }],
		},
	],
});

/** Two siblings each carrying their own unsupported attribute. */
const docWithSiblingUnsupportedAttrs = () => ({
	type: 'doc',
	version: 1,
	content: [
		{
			type: 'heading',
			attrs: { level: 2, bogusOne: 'one' },
			content: [{ type: 'text', text: 'b' }],
		},
		{
			type: 'heading',
			attrs: { level: 3, bogusTwo: 'two' },
			content: [{ type: 'text', text: 'c' }],
		},
	],
});

/** An unsupported attribute four levels down, inside a table cell. */
const docWithNestedUnsupportedAttr = () => ({
	type: 'doc',
	version: 1,
	content: [
		{
			type: 'table',
			attrs: { isNumberColumnEnabled: false, layout: 'default', localId: 't1' },
			content: [
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableCell',
							attrs: {},
							content: [
								{
									type: 'heading',
									attrs: { level: 4, deepBogus: 'deep' },
									content: [{ type: 'text', text: 'deep' }],
								},
							],
						},
					],
				},
			],
		},
	],
});

describe('platform_editor_fix_adf-validator_mutation_bug', () => {
	const repairMark = {
		type: 'unsupportedNodeAttribute',
		attrs: { type: { nodeType: 'heading' }, unsupported: {} },
	};

	describe('when the gate is enabled', () => {
		it('does not delete unsupported attributes from the input document', () => {
			const input = docWithUnsupportedNodeAttribute();

			validator()(input, () => repairMark);

			expect(input.content[0].attrs).toEqual({ level: 1, unknownAttribute: 'keep-me' });
		});

		it('does not append the repair mark to the input document', () => {
			const input = docWithMarkedTextAndUnsupportedAttribute();

			validator()(input, () => repairMark);

			expect(input.content[0].content[0].marks).toEqual([{ type: 'strong' }]);
		});

		it('leaves the input untouched entirely', () => {
			const input = docWithUnsupportedNodeAttribute();
			const snapshot = JSON.parse(JSON.stringify(input));

			validator()(input, () => repairMark);

			expect(input).toEqual(snapshot);
		});

		it('reports the same error when the same document object is validated twice', () => {
			const input = docWithUnsupportedNodeAttribute();
			const validate = validator();

			const first = jest.fn().mockReturnValue(repairMark);
			validate(input, first);
			const second = jest.fn().mockReturnValue(repairMark);
			validate(input, second);

			expect(second.mock.calls.length).toBe(first.mock.calls.length);
			expect(second.mock.calls[0][1]).toEqual(first.mock.calls[0][1]);
		});

		it('does not overwrite the payload of an existing unsupportedNodeAttribute mark', () => {
			const input = docWithExistingRepairMark();

			validator()(input, () => repairMark);

			expect(input.content[0].marks[0].attrs).toEqual({
				type: { nodeType: 'heading' },
				unsupported: { previous: 'value' },
			});
		});

		it('preserves unsupported attributes on every sibling', () => {
			const input = docWithSiblingUnsupportedAttrs();

			validator()(input, () => repairMark);

			expect([input.content[0].attrs, input.content[1].attrs]).toEqual([
				{ level: 2, bogusOne: 'one' },
				{ level: 3, bogusTwo: 'two' },
			]);
		});

		it('preserves an unsupported attribute nested deep inside the document', () => {
			const input = docWithNestedUnsupportedAttr();

			validator()(input, () => repairMark);

			expect(input.content[0].content[0].content[0].content[0].attrs).toEqual({
				level: 4,
				deepBogus: 'deep',
			});
		});

		// The repair mark is added to the cloned entity, so it is absent from the original marks the
		// marks pass rebuilds from. Without carrying it over, the only record of the unknown attribute
		// is destroyed for any node that also has marks of its own.
		it('keeps the repair mark on the output when the node has its own marks', () => {
			const input = {
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'codeBlock',
						attrs: { language: 'javascript', unknownAttribute: 'keep-me' },
						marks: [{ type: 'breakout', attrs: { mode: 'wide', width: null } }],
					},
				],
			};

			// Mirror the editor's callback, which answers attribute errors and mark errors differently.
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const { entity } = validator()(input as any, (marked: any, _error: any, options: any) =>
				options.isNodeAttribute
					? repairMark
					: { type: 'unsupportedMark', attrs: { originalValue: marked } },
			);

			// The node's own valid mark is kept, and the repair mark survives alongside it.
			expect((entity?.content?.[0]?.marks ?? []).map((mark) => mark.type)).toEqual([
				'breakout',
				'unsupportedNodeAttribute',
			]);
		});
	});

	describe('when the gate is disabled', () => {
		beforeEach(() => {
			failGate('platform_editor_fix_adf-validator_mutation_bug');
		});

		// Pins the gate-off path so the rollback behaviour stays defined.
		it('mutates the input document', () => {
			const input = docWithUnsupportedNodeAttribute();

			validator()(input, () => repairMark);

			expect(input.content[0].attrs).not.toHaveProperty('unknownAttribute');
		});
	});
});
