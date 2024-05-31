import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import RendererActions from '../../index';
import {
	simpleTextWithAnnotation,
	textWithOverlappingAnnotations,
	annotationSpanningMultiText,
	mediaWithAnnotation,
	docWithTextAndMedia,
} from '../../../__tests__/__fixtures__/annotation';
import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	ACTION_SUBJECT_ID,
} from '@atlaskit/editor-common/analytics';
import type { AnalyticsEventPayload } from '../../../analytics/events';

const mockArg = {} as any;
const mockArg2 = {} as any;
const annotationId = '<<<ANNOTATION-ID>>>';

describe('RendererActions', () => {
	it(`can't register the same RendererActions instance on more than one ref`, () => {
		const actions = new RendererActions(true);
		actions._privateRegisterRenderer(mockArg, mockArg, mockArg);
		expect(() => {
			actions._privateRegisterRenderer(mockArg2, mockArg2, mockArg2);
		}).toThrowError(
			"Renderer has already been registered! It's not allowed to re-register with another new Renderer instance.",
		);
	});

	it(`no-ops when not init'd from a correct source`, () => {
		const actions = new RendererActions();
		actions._privateRegisterRenderer(mockArg, mockArg, mockArg);
		expect(() => {
			actions._privateRegisterRenderer(mockArg, mockArg, mockArg);
		}).not.toThrowError(
			"Renderer has already been registered! It's not allowed to re-register with another new Renderer instance.",
		);
	});

	describe('deleteAnnotation', () => {
		let onAnalyticsEvent:
			| jest.Mock<any, any>
			| ((event: AnalyticsEventPayload) => void)
			| undefined;

		beforeEach(() => {
			onAnalyticsEvent = jest.fn();
		});

		function initActions(doc: any) {
			let actions = new RendererActions(true);
			actions._privateRegisterRenderer(
				mockArg,
				defaultSchema.nodeFromJSON(doc),
				defaultSchema,
				onAnalyticsEvent,
			);
			return actions;
		}
		it('should delete the annotation with provided ID', () => {
			let actions = initActions(simpleTextWithAnnotation(annotationId));
			expect(actions.deleteAnnotation(annotationId, 'inlineComment')).toMatchSnapshot();
		});

		it('should delete the annotation on media with provided ID', () => {
			let actions = initActions(mediaWithAnnotation(annotationId));
			expect(actions.deleteAnnotation(annotationId, 'inlineComment')).toMatchSnapshot();
		});

		it('should delete the annotation with provided ID without touching overlapping marks', () => {
			let actions = initActions(textWithOverlappingAnnotations(annotationId));
			expect(actions.deleteAnnotation(annotationId, 'inlineComment')).toMatchSnapshot();
		});

		it('should delete the annotation when spanning multiple nodes', () => {
			let actions = initActions(annotationSpanningMultiText(annotationId));
			expect(actions.deleteAnnotation(annotationId, 'inlineComment')).toMatchSnapshot();
		});

		it('should trigger the analytics event when annotation is detected', () => {
			let actions = initActions(simpleTextWithAnnotation(annotationId));
			actions.deleteAnnotation(annotationId, 'inlineComment');

			expect(onAnalyticsEvent).toBeCalledWith({
				action: ACTION.DELETED,
				actionSubject: ACTION_SUBJECT.ANNOTATION,
				actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
				eventType: EVENT_TYPE.TRACK,
			});
		});

		it('should not trigger the analytics event when annotation is not detected', () => {
			let actions = initActions(simpleTextWithAnnotation(annotationId));
			actions.deleteAnnotation('noAnnotation', 'inlineComment');

			expect(onAnalyticsEvent).toBeCalledTimes(0);
		});
	});

	describe('applyAnnotation', () => {
		const initActions = (doc: any) => {
			let actions = new RendererActions(true);
			actions._privateRegisterRenderer(mockArg, defaultSchema.nodeFromJSON(doc), defaultSchema);
			return actions;
		};

		const newAnnotation: any = {
			annotationId,
			annotationType: 'inlineComment',
		};

		it('should apply annotation to the plain text', () => {
			const actions = initActions(docWithTextAndMedia);
			expect(actions.applyAnnotation({ from: 0, to: 9 }, newAnnotation, false)).toMatchSnapshot();

			expect(actions.applyAnnotation({ from: 0, to: 9 }, newAnnotation, true)).toMatchObject(
				actions.applyAnnotation({ from: 0, to: 9 }, newAnnotation, false),
			);
		});

		it('should apply annotation to the formatted text', () => {
			const actions = initActions(docWithTextAndMedia);
			expect(actions.applyAnnotation({ from: 18, to: 30 }, newAnnotation, false)).toMatchSnapshot();

			expect(actions.applyAnnotation({ from: 18, to: 30 }, newAnnotation, true)).toMatchObject(
				actions.applyAnnotation({ from: 18, to: 30 }, newAnnotation, false),
			);
		});

		it('should apply annotation to the top-level media', () => {
			const actions = initActions(docWithTextAndMedia);
			expect(actions.applyAnnotation({ from: 40, to: 40 }, newAnnotation, false)).toMatchSnapshot();

			expect(actions.applyAnnotation({ from: 39, to: 39 }, newAnnotation, true)).toMatchObject(
				actions.applyAnnotation({ from: 40, to: 40 }, newAnnotation, false),
			);
		});

		it('should apply annotation to caption of top level media', () => {
			const actions = initActions(docWithTextAndMedia);

			expect(actions.applyAnnotation({ from: 41, to: 45 }, newAnnotation, false)).toMatchSnapshot();

			expect(actions.applyAnnotation({ from: 41, to: 45 }, newAnnotation, true)).toMatchObject(
				actions.applyAnnotation({ from: 41, to: 45 }, newAnnotation, false),
			);
		});

		it('should apply annotation to the nested media', () => {
			const actions = initActions(docWithTextAndMedia);
			expect(actions.applyAnnotation({ from: 62, to: 62 }, newAnnotation, false)).toMatchSnapshot();

			expect(actions.applyAnnotation({ from: 61, to: 61 }, newAnnotation, true)).toMatchObject(
				actions.applyAnnotation({ from: 62, to: 62 }, newAnnotation, false),
			);
		});

		it('should apply annotation to the caption of nested media', () => {
			const actions = initActions(docWithTextAndMedia);
			expect(actions.applyAnnotation({ from: 68, to: 71 }, newAnnotation, false)).toMatchSnapshot();

			expect(actions.applyAnnotation({ from: 68, to: 71 }, newAnnotation, true)).toMatchObject(
				actions.applyAnnotation({ from: 68, to: 71 }, newAnnotation, false),
			);
		});

		it('should not return targetNodeType when commentOnMediaBugFix is disabled', () => {
			const actions = initActions(docWithTextAndMedia);
			expect(
				actions.applyAnnotation({ from: 39, to: 39 }, newAnnotation, false),
			).not.toHaveProperty('targetNodeType');
		});

		it('should return targetNodeType for media when commentOnMediaBugFix is enabled', () => {
			const actions = initActions(docWithTextAndMedia);
			expect(actions.applyAnnotation({ from: 39, to: 39 }, newAnnotation, true)).toEqual(
				expect.objectContaining({ targetNodeType: 'media' }),
			);
		});

		it('should return targetNodeType for text when commentOnMediaBugFix is enabled', () => {
			const actions = initActions(docWithTextAndMedia);
			expect(actions.applyAnnotation({ from: 18, to: 30 }, newAnnotation, true)).toEqual(
				expect.objectContaining({ targetNodeType: 'text' }),
			);
		});
	});
});
