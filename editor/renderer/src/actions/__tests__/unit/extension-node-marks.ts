import { AnnotationTypes } from '@atlaskit/adf-schema/annotation';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import {
	simpleTextWithAnnotation,
	mediaWithAnnotation,
} from '../../../__tests__/__fixtures__/annotation';
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

	it.each([false, true])(
		'preserves text and media annotation deletion (extension gate: %s)',
		(gateEnabled) => {
			if (gateEnabled) {
				passGate(extensionAnnotationGate);
			} else {
				failGate(extensionAnnotationGate);
			}
			const schema = getSchemaBasedOnStage('stage0');
			for (const { fixture, stepType } of [
				{ fixture: simpleTextWithAnnotation, stepType: 'removeMark' },
				{ fixture: mediaWithAnnotation, stepType: 'removeNodeMark' },
			]) {
				const actions = new RendererActions(true);
				const doc = schema.nodeFromJSON(fixture(annotationId));
				actions._privateRegisterRenderer(rendererRef, doc, schema);

				const result = actions.deleteAnnotation(annotationId, AnnotationTypes.INLINE_COMMENT);
				if (!result) {
					throw new Error('Expected deleteAnnotation to return a result');
				}
				expect(result.step.toJSON().stepType).toBe(stepType);
				const updatedDoc = schema.nodeFromJSON(result.doc);
				updatedDoc.descendants((node) => {
					expect(node.marks.some((mark) => mark.attrs.id === annotationId)).toBe(false);
				});
				expect(updatedDoc.textContent).toBe(doc.textContent);
				expect(updatedDoc.content.size).toBe(doc.content.size);
			}
		},
	);

	it('preserves the range-removal fallback when the extension gate is disabled', () => {
		failGate(extensionAnnotationGate);
		const schema = getSchemaBasedOnStage('stage0');
		const mark = schema.marks.annotation.create({
			id: annotationId,
			annotationType: AnnotationTypes.INLINE_COMMENT,
		});
		const extension = schema.nodeFromJSON(docWithExtension.content[0]).mark([mark]);
		const doc = schema.nodes.doc.create(null, [extension]);
		const actions = new RendererActions(true);
		actions._privateRegisterRenderer(rendererRef, doc, schema);

		const result = actions.deleteAnnotation(annotationId, AnnotationTypes.INLINE_COMMENT);
		if (!result) {
			throw new Error('Expected deleteAnnotation to return a result');
		}
		expect(result.step.toJSON()).toEqual({
			stepType: 'removeMark',
			from: 0,
			to: extension.nodeSize,
			mark: mark.toJSON(),
		});
		expect(schema.nodeFromJSON(result.doc).eq(doc)).toBe(true);
	});

	it.each([false, true])(
		'deletes an extension annotation without changing another chart (preceding paragraph: %s)',
		(hasPrecedingParagraph) => {
			passGate(extensionAnnotationGate);
			const schema = getSchemaBasedOnStage('stage0');
			const mark = schema.marks.annotation.create({
				id: annotationId,
				annotationType: AnnotationTypes.INLINE_COMMENT,
			});
			const otherMark = schema.marks.annotation.create({
				id: 'other-chart-annotation-id',
				annotationType: AnnotationTypes.INLINE_COMMENT,
			});
			const extension = schema.nodeFromJSON(docWithExtension.content[0]);
			const otherExtension = schema.nodes.extension.create(
				{ ...extension.attrs, localId: 'other-chart-local-id' },
				null,
				[otherMark],
			);
			const prefix = hasPrecedingParagraph
				? [schema.nodes.paragraph.create(null, schema.text('Before chart'))]
				: [];
			const doc = schema.nodes.doc.create(null, [
				...prefix,
				extension.mark([mark]),
				otherExtension,
			]);
			const actions = new RendererActions(true);
			actions._privateRegisterRenderer(rendererRef, doc, schema);

			const result = actions.deleteAnnotation(annotationId, AnnotationTypes.INLINE_COMMENT);
			if (!result) {
				throw new Error('Expected deleteAnnotation to return a result');
			}

			// Check the returned ADF, not just whether the comment disappeared from the UI.
			const updatedDoc = schema.nodeFromJSON(result.doc);
			expect(updatedDoc.child(prefix.length).marks).toEqual([]);
			expect(
				updatedDoc.eq(schema.nodes.doc.create(null, [...prefix, extension, otherExtension])),
			).toBe(true);
			expect(result.step.toJSON()).toEqual({
				stepType: 'removeNodeMark',
				pos: prefix[0]?.nodeSize ?? 0,
				mark: mark.toJSON(),
			});
		},
	);
});
