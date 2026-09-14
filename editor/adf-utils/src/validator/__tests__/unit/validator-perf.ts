import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import type { ADFEntity } from '../../../types';
import { validator } from '../../validator';

const MUTATION_GATE = 'platform_editor_fix_adf-validator_mutation_bug';

const paragraph = (text: string): ADFEntity => ({
	type: 'paragraph',
	content: [{ type: 'text', text }],
});

/**
 * Covers node types whose spec lookup resolves differently — `codeBlock` and `text` carry variant
 * candidates while `table` and `listItem` carry none — and repeats `paragraph`/`text` so the
 * per-type allowed-content cache is hit as well as missed. The `heading` carries an attribute its
 * spec does not declare, which drives the repair path that reads the mutation-bug gate per node.
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

// `platform_editor_fix_adf-validator_mutation_bug` is resolved once per `validator()` rather than
// once per node and per mark — matching how `rejectStage0Specs` and `acceptEmptyMarks` are resolved
// — so these pin that the hoisted read still yields the gate's behaviour on both sides of its rollout.
describe('mutation-bug gate resolved once per validator', () => {
	it('leaves the input document untouched when the gate is on', () => {
		passGate(MUTATION_GATE);
		const input = mixedDoc();
		const snapshot = JSON.parse(JSON.stringify(input));

		validator()(input, () => repairMark);

		expect(input).toEqual(snapshot);
	});

	it('still mutates the input document when the gate is off', () => {
		failGate(MUTATION_GATE);
		const input = mixedDoc();

		validator()(input, () => repairMark);

		expect(input.content?.[1]?.attrs).not.toHaveProperty('unknownAttribute');
	});
});

describe('allowed-content cache', () => {
	beforeEach(() => {
		passGate(MUTATION_GATE);
	});

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
