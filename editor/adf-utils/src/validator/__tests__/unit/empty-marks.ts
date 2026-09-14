import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import type { ADFEntity } from '../../../types';
import { validator } from '../../validator';

const GATE = 'platform_editor_adf_validator_empty_marks';

const docWith = (node: ADFEntity): ADFEntity => ({ type: 'doc', version: 1, content: [node] });

const paragraph: ADFEntity = { type: 'paragraph', content: [], marks: [] };
const heading: ADFEntity = { type: 'heading', attrs: { level: 1 }, content: [], marks: [] };
const extension: ADFEntity = {
	type: 'extension',
	attrs: { extensionType: 'com.acme.editor', extensionKey: 'block-eh' },
	marks: [],
};
const codeBlockInPanel: ADFEntity = {
	type: 'panel',
	attrs: { panelType: 'tip' },
	content: [{ type: 'codeBlock', content: [], attrs: { language: 'javascript' }, marks: [] }],
};
const expand: ADFEntity = {
	type: 'expand',
	attrs: { title: 'Expand' },
	content: [{ type: 'paragraph', content: [] }],
	marks: [],
};

describe('validator: empty marks array, gate ON', () => {
	let validate: ReturnType<typeof validator>;
	beforeEach(() => {
		passGate(GATE);
		validate = validator();
	});

	// ADF gives these nodes a `marks` property that no mark type may go into
	// (`marks: { type: 'array', maxItems: 0 }`), so an empty array is the only value it can hold and
	// the JSON schema accepts it. `extension` is offered by `doc` as the `extension_with_marks`
	// variant, and `codeBlock` here is reached through `panel` content, so between them the cases cover
	// a candidate that widens the mark types and a plainly-named child.
	it.each([
		['paragraph', paragraph],
		['heading', heading],
		['extension', extension],
		['panel with a codeBlock', codeBlockInPanel],
		['expand', expand],
	])('accepts an empty marks array on %s', (_name, node) => {
		expect(() => validate(docWith(node))).not.toThrow();
	});

	it('drops the empty marks array from the validated entity', () => {
		const { entity } = validate(docWith(paragraph));

		expect(entity?.content?.[0]).toEqual({ type: 'paragraph', content: [] });
	});

	// ADF defines no `marks` property on these, so an empty array is a property that does not belong
	// on the node rather than an empty list of marks.
	it.each([
		['rule', { type: 'rule', marks: [] }],
		['panel', { type: 'panel', attrs: { panelType: 'info' }, content: [paragraph], marks: [] }],
		[
			'mediaGroup',
			{
				type: 'mediaGroup',
				content: [{ type: 'media', attrs: { id: '1', type: 'file', collection: '' } }],
				marks: [],
			},
		],
	])('rejects an empty marks array on %s, which declares no marks', (_name, node) => {
		expect(() => validate(docWith(node as ADFEntity))).toThrow('redundant marks');
	});

	// `mention` declares `annotation` in the validator spec because that spec is generated from the
	// stage-0 view of each node, while full ADF gives `mention` no `marks` property at all. Accepting
	// an empty array here would part company with the full JSON schema, which rejects it.
	it('rejects an empty marks array on mention, which declares a mark', () => {
		const mention: ADFEntity = {
			type: 'paragraph',
			content: [{ type: 'mention', attrs: { id: 'test-id', text: 'Test User' }, marks: [] }],
		};

		expect(() => validate(docWith(mention))).toThrow();
	});

	it('still rejects a mark that is not allowed on codeBlock', () => {
		const withStrong: ADFEntity = {
			type: 'panel',
			attrs: { panelType: 'tip' },
			content: [{ type: 'codeBlock', content: [], marks: [{ type: 'strong' }] }],
		};

		expect(() => validate(docWith(withStrong))).toThrow();
	});
});

describe('validator: empty marks array, gate OFF', () => {
	let validate: ReturnType<typeof validator>;
	beforeEach(() => {
		failGate(GATE);
		validate = validator();
	});

	it.each([
		['paragraph', paragraph],
		['heading', heading],
		['extension', extension],
		['panel with a codeBlock', codeBlockInPanel],
		['expand', expand],
	])('rejects an empty marks array on %s', (_name, node) => {
		expect(() => validate(docWith(node))).toThrow();
	});
});
