import type { ADFEntity } from '../../../types';
import { validator } from '../../validator';

const paragraph = (text: string): ADFEntity => ({
	type: 'paragraph',
	content: [{ type: 'text', text }],
});

/**
 * Covers node types whose spec lookup resolves differently — `codeBlock` and `text` carry variant
 * candidates while `table` and `listItem` carry none — and repeats `paragraph`/`text` so the
 * per-type allowed-content cache is hit as well as missed. The `heading` carries an attribute its
 * spec does not declare, which drives the repair path.
 */
const mixedDoc = (): ADFEntity => ({
	type: 'doc',
	version: 1,
	content: [
		paragraph('first'),
		{
			type: 'heading',
			attrs: { level: 1, unknownAttribute: 'keep-me' },
			content: [{ type: 'text', text: 'titled' }],
		},
		{ type: 'panel', attrs: { panelType: 'info' }, content: [paragraph('in panel')] },
		{
			type: 'codeBlock',
			attrs: { language: 'javascript' },
			content: [{ type: 'text', text: 'code' }],
		},
		{
			type: 'table',
			attrs: { isNumberColumnEnabled: false, layout: 'default', localId: 't1' },
			content: [
				{
					type: 'tableRow',
					content: [{ type: 'tableCell', attrs: {}, content: [paragraph('cell')] }],
				},
			],
		},
		{ type: 'bulletList', content: [{ type: 'listItem', content: [paragraph('item')] }] },
		{ type: 'paragraph', content: [{ type: 'text', text: 'marked', marks: [{ type: 'strong' }] }] },
	],
});

const panelDoc = (): ADFEntity => ({
	type: 'doc',
	version: 1,
	content: [{ type: 'panel', attrs: { panelType: 'info' }, content: [paragraph('only panel')] }],
});

/** Mirrors the editor's callback, which answers attribute errors with a repair mark. */
const repairMark = {
	type: 'unsupportedNodeAttribute',
	attrs: { type: { nodeType: 'heading' }, unsupported: {} },
};

describe('allowed-content cache', () => {
	// The allowed-content cache lives on the validator instance, so a document validated after
	// another one sees a warm cache. A cache keyed or populated incorrectly would hand one node
	// type another type's candidate specs, which shows up as a different result here.
	it('does not let a warmed type cache change the result for a later document', () => {
		const validate = validator();
		validate(mixedDoc(), () => repairMark);

		const warm = validate(panelDoc(), () => repairMark);
		const cold = validator()(panelDoc(), () => repairMark);

		expect(warm).toEqual(cold);
	});

	it('returns the same result when one validator validates the same document twice', () => {
		const validate = validator();

		const first = validate(mixedDoc(), () => repairMark);
		const second = validate(mixedDoc(), () => repairMark);

		expect(second).toEqual(first);
	});
});
