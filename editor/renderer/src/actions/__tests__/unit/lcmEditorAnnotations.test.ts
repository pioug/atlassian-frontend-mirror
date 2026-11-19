import { defaultSchema } from '@atlaskit/adf-schema/schema-default';

import RendererActions from '../../index';

describe('RendererActions legacy annotation discovery', () => {
	const annotation = (id: string) => ({
		type: 'annotation',
		attrs: { id, annotationType: 'inlineComment' },
	});
	const paragraph = (id: string) => ({
		type: 'paragraph',
		content: [{ type: 'text', text: id, marks: [annotation(id)] }],
	});
	const legacyContent = (content: unknown[]) => ({
		type: 'extension',
		attrs: {
			extensionType: 'com.atlassian.confluence.migration',
			extensionKey: 'legacy-content',
			parameters: { nestedContent: { type: 'doc', version: 1, content } },
		},
	});
	const toDoc = (content: unknown[]) =>
		defaultSchema.nodeFromJSON({ type: 'doc', version: 1, content });

	it('discovers updated deep legacy marks for every renderer registration', () => {
		const actions = new RendererActions(true);
		const otherActions = new RendererActions(true);
		const rendererRef = { current: null };
		const legacyDoc = toDoc([legacyContent([paragraph('other')])]);
		otherActions._privateRegisterRenderer({ current: null }, legacyDoc, defaultSchema);
		expect(otherActions.getAnnotationMarks().map((mark) => mark.attrs.id)).toEqual(['other']);

		actions._privateRegisterRenderer(
			rendererRef,
			toDoc([paragraph('root'), legacyContent([legacyContent([paragraph('nested')])])]),
			defaultSchema,
		);
		expect(actions.getAnnotationMarks().map((mark) => mark.attrs.id)).toEqual(['root', 'nested']);

		actions.doc = toDoc([legacyContent([legacyContent([paragraph('updated')])])]);
		expect(actions.getAnnotationMarks().map((mark) => mark.attrs.id)).toEqual(['updated']);

		actions._privateUnregisterRenderer();
		actions._privateRegisterRenderer(
			rendererRef,
			toDoc([legacyContent([paragraph('registered-again')])]),
			defaultSchema,
		);
		expect(actions.getAnnotationMarks().map((mark) => mark.attrs.id)).toEqual(['registered-again']);
	});
});
