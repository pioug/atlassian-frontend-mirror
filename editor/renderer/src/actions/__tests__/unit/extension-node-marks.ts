import { AnnotationTypes } from '@atlaskit/adf-schema/annotation';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import RendererActions from '../../index';

const annotationId = 'extension-annotation-id';
const extensionAnnotationGate = 'cc_maui_annotations_on_extensions';
const rendererRef = { current: null };
const docWithExtension = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'extension',
			attrs: {
				extensionType: 'com.atlassian.test',
				extensionKey: 'test-extension',
				parameters: null,
				text: null,
				layout: 'default',
				localId: 'test-extension-local-id',
			},
		},
	],
};

describe('RendererActions extension node marks', () => {
	const initActions = () => {
		const schema = getSchemaBasedOnStage('stage0');
		const actions = new RendererActions(true);
		actions._privateRegisterRenderer(rendererRef, schema.nodeFromJSON(docWithExtension), schema);

		return actions;
	};

	beforeEach(() => {
		getSchemaBasedOnStage.clear();
	});

	it('applies an annotation node mark to an eligible extension', () => {
		passGate(extensionAnnotationGate);
		const result = initActions().applyAnnotation(
			{ from: 0, to: 0 },
			{
				annotationId,
				annotationType: AnnotationTypes.INLINE_COMMENT,
			},
		);

		expect(result).not.toBe(false);
		if (!result) {
			throw new Error('Expected applyAnnotation to return a result');
		}

		expect(result.step.toJSON()).toEqual({
			stepType: 'addNodeMark',
			pos: 0,
			mark: {
				type: 'annotation',
				attrs: {
					id: annotationId,
					annotationType: AnnotationTypes.INLINE_COMMENT,
				},
			},
		});
		expect(result.targetNodeType).toBe('extension');
		expect(result.pos).toBe(0);
		expect(result.doc.content?.[0]).toEqual(
			expect.objectContaining({
				marks: [
					expect.objectContaining({
						attrs: expect.objectContaining({ id: annotationId }),
					}),
				],
			}),
		);
	});

	it('preserves the text-mark fallback when the extension gate is disabled', () => {
		failGate(extensionAnnotationGate);
		const result = initActions().applyAnnotation(
			{ from: 0, to: 0 },
			{
				annotationId,
				annotationType: AnnotationTypes.INLINE_COMMENT,
			},
		);

		expect(result).not.toBe(false);
		if (!result) {
			throw new Error('Expected applyAnnotation to return a result');
		}

		expect(result.step.toJSON()).toEqual({
			stepType: 'addMark',
			from: 0,
			to: 0,
			mark: {
				type: 'annotation',
				attrs: {
					id: annotationId,
					annotationType: AnnotationTypes.INLINE_COMMENT,
				},
			},
		});
		expect(result.targetNodeType).toBe('text');
		expect(result.doc.content?.[0]?.marks).toBeUndefined();
	});
});
