import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { validateADFEntity } from '@atlaskit/editor-common/utils';

import { renderDocument } from '../../render-document';
import type { Serializer } from '../../serializer';

// Spy on the real implementation: what matters is how *often* validation runs, not what it returns.
jest.mock('@atlaskit/editor-common/utils', () => {
	const actual = jest.requireActual('@atlaskit/editor-common/utils');
	return { ...actual, validateADFEntity: jest.fn(actual.validateADFEntity) };
});

const validateSpy = validateADFEntity as jest.Mock;

const doc = {
	type: 'doc',
	version: 1,
	content: [{ type: 'paragraph', content: [{ type: 'text', text: 'memoised' }] }],
};

/** A fresh, structurally identical document, so comparisons cannot take the identity fast path. */
const freshDoc = (text: string = 'memoised') => ({
	type: 'doc',
	version: 1,
	content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
});

const unsafeInlineCardDoc = {
	type: 'doc',
	version: 1,
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'inlineCard',
					attrs: { url: 'javascript:alert(document.domain)' },
				},
			],
		},
	],
};

const serializeSpy = jest.fn(() => 'serialised');
const serializer: Serializer<string> = { serializeFragment: serializeSpy };

const render = (
	validationOverrides?: {
		allowNestedTables?: boolean;
		allowTableInPanel?: boolean;
	},
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	document: any = doc,
) =>
	renderDocument(
		document,
		serializer,
		defaultSchema,
		undefined /* adfStage */,
		'render-document-test',
		undefined /* dispatchAnalyticsEvent */,
		undefined /* unsupportedContentLevelsTracking */,
		undefined /* appearance */,
		undefined /* includeNodesCountInStats */,
		undefined /* skipValidation */,
		validationOverrides,
	);

// Each test primes the module-level memo, then clears the spy, so only the *second* render is asserted.
describe('renderDocument validation memoisation', () => {
	it('rejects a malformed root object without a node type', () => {
		const result = render(undefined, {});

		expect(result.result).toBeNull();
		expect(result.pmDoc).toBeUndefined();
	});

	it('preserves unsafe card URL rejection without a visual snapshot', () => {
		const { pmDoc } = render(undefined, unsafeInlineCardDoc);
		const card = pmDoc?.firstChild?.firstChild;

		expect(card?.type.name).toBe('inlineCard');
		expect(card?.attrs.url).not.toBe(unsafeInlineCardDoc.content[0].content[0].attrs.url);
		expect(card?.marks.map((mark) => mark.type.name)).toContain('unsupportedNodeAttribute');
	});

	describe('given a value-equal overrides object', () => {
		it('does not re-validate the document', () => {
			render({ allowNestedTables: true });
			validateSpy.mockClear();

			render({ allowNestedTables: true });

			expect(validateSpy).not.toHaveBeenCalled();
		});

		it('still re-validates when an overrides value actually changes', () => {
			render({ allowNestedTables: true });
			validateSpy.mockClear();

			render({ allowNestedTables: false });

			expect(validateSpy).toHaveBeenCalledTimes(1);
		});

		it('still re-validates when overrides go from set to absent', () => {
			render({ allowNestedTables: true });
			validateSpy.mockClear();

			render(undefined);

			expect(validateSpy).toHaveBeenCalledTimes(1);
		});
	});

	// `areDocsEqual` compares ProseMirror nodes with `Node.eq`. Reaching that branch needs the
	// node-building memo to miss while still producing an equal node, which two documents differing
	// only in key order do: their ADF stringifies differently, but `toJSON` normalises the order away.
	describe('ProseMirror node comparison', () => {
		const overrides = { allowNestedTables: true };
		const keyOrderA = { type: 'doc', version: 1, content: [freshDoc().content[0]] };
		const keyOrderB = { version: 1, content: [freshDoc().content[0]], type: 'doc' };

		it('does not re-serialise an equal document', () => {
			render(overrides, keyOrderA);
			validateSpy.mockClear();
			serializeSpy.mockClear();

			render(overrides, keyOrderB);

			// Non-vacuous: validation re-ran, so the node comparison downstream was actually reached.
			expect(validateSpy).toHaveBeenCalledTimes(1);
			expect(serializeSpy).not.toHaveBeenCalled();
		});
	});
});
