import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';

import RendererActions from '../../index';

describe('RendererActions scoped legacy annotation discovery', () => {
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

	it('discovers updated deep legacy marks only while the editor registration is active', () => {
		mockExpDisabled('platform_editor_fix_lcm_renderer_annotations');
		const actions = new RendererActions(true);
		const unoptedActions = new RendererActions(true);
		const rendererRef = { current: null };
		const legacyDoc = toDoc([legacyContent([paragraph('unopted')])]);
		unoptedActions._privateRegisterRenderer({ current: null }, legacyDoc, defaultSchema);
		expect(unoptedActions.getAnnotationMarks()).toEqual([]);

		actions._privateRegisterRenderer(
			rendererRef,
			toDoc([paragraph('root'), legacyContent([legacyContent([paragraph('nested')])])]),
			defaultSchema,
			undefined,
			true,
		);
		expect(actions.getAnnotationMarks().map((mark) => mark.attrs.id)).toEqual(['root', 'nested']);

		actions.doc = toDoc([legacyContent([legacyContent([paragraph('updated')])])]);
		expect(actions.getAnnotationMarks().map((mark) => mark.attrs.id)).toEqual(['updated']);

		actions._privateUnregisterRenderer();
		actions._privateRegisterRenderer(
			rendererRef,
			toDoc([legacyContent([paragraph('off')])]),
			defaultSchema,
		);
		expect(actions.getAnnotationMarks()).toEqual([]);
	});
});
