import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import RendererActions from '../../index';
import {
	simpleTextWithAnnotation,
	textWithOverlappingAnnotations,
	annotationSpanningMultiText,
	mediaWithAnnotation,
	docWithTextAndMedia,
	docWithInlineNodes,
} from '../../../__tests__/__fixtures__/annotation';
import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	ACTION_SUBJECT_ID,
} from '@atlaskit/editor-common/analytics';
import type { AnalyticsEventPayload } from '../../../analytics/events';
// eslint-disable-next-line @atlaskit/platform/no-alias
import * as platformFeatureFlags from '@atlaskit/platform-feature-flags';
import * as steps from '../../../steps';
import { Node } from '@atlaskit/editor-prosemirror/model';
import { ffTest } from '@atlassian/feature-flags-test-utils';

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
				attributes: { inlineNodes: undefined },
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
			expect(actions.applyAnnotation({ from: 0, to: 9 }, newAnnotation)).toMatchSnapshot();
		});

		it('should apply annotation to the formatted text', () => {
			const actions = initActions(docWithTextAndMedia);
			expect(actions.applyAnnotation({ from: 18, to: 30 }, newAnnotation)).toMatchSnapshot();
		});

		it('should apply annotation to the top-level media', () => {
			const actions = initActions(docWithTextAndMedia);
			expect(actions.applyAnnotation({ from: 39, to: 39 }, newAnnotation)).toMatchSnapshot();
		});

		it('should apply annotation to caption of top level media', () => {
			const actions = initActions(docWithTextAndMedia);
			expect(actions.applyAnnotation({ from: 41, to: 45 }, newAnnotation)).toMatchSnapshot();
		});

		it('should apply annotation to the nested media', () => {
			const actions = initActions(docWithTextAndMedia);
			expect(actions.applyAnnotation({ from: 61, to: 61 }, newAnnotation)).toMatchSnapshot();
		});

		it('should apply annotation to the caption of nested media', () => {
			const actions = initActions(docWithTextAndMedia);
			expect(actions.applyAnnotation({ from: 68, to: 71 }, newAnnotation)).toMatchSnapshot();
		});

		it('should apply annotation to text with inline nodes', () => {
			jest
				.spyOn(platformFeatureFlags, 'fg')
				.mockImplementation((flag) => flag === 'editor_inline_comments_on_inline_nodes');

			const actions = initActions(docWithInlineNodes);
			const pos = { from: 0, to: 29 };

			expect(actions.applyAnnotation(pos, newAnnotation)).toMatchSnapshot();
		});

		it('should return targetNodeType for media when commentOnMediaBugFix is enabled', () => {
			const actions = initActions(docWithTextAndMedia);
			expect(actions.applyAnnotation({ from: 39, to: 39 }, newAnnotation)).toEqual(
				expect.objectContaining({ targetNodeType: 'media' }),
			);
		});

		it('should return targetNodeType for text when commentOnMediaBugFix is enabled', () => {
			const actions = initActions(docWithTextAndMedia);
			expect(actions.applyAnnotation({ from: 18, to: 30 }, newAnnotation)).toEqual(
				expect.objectContaining({ targetNodeType: 'text' }),
			);
		});
	});

	describe('isValidAnnotationRange', () => {
		it('should return false when range is falsy', () => {
			const actions = new RendererActions();
			expect(actions.isValidAnnotationRange(null)).toBe(false);
		});

		describe('should return false when isRendererWithinRange is truthy', () => {
			afterEach(() => {
				jest.resetAllMocks();
			});
			const actions = new RendererActions();
			ffTest(
				'editor_inline_comments_on_inline_nodes',
				() => {
					const isRendererWithinRangeSpyFn = jest
						.spyOn(actions, 'isRendererWithinRange')
						.mockReturnValueOnce(true);
					expect(actions.isValidAnnotationRange(new Range())).toBe(false);
					expect(isRendererWithinRangeSpyFn).toBeCalledTimes(1);
				},
				() => {
					const isRendererWithinRangeSpyFn = jest.spyOn(actions, 'isRendererWithinRange');
					actions.isValidAnnotationRange(new Range());
					expect(isRendererWithinRangeSpyFn).toBeCalledTimes(0);
				},
			);
		});

		it('should return false if doc is falsy', () => {
			const actions = new RendererActions();

			actions.doc = undefined;
			expect(actions.isValidAnnotationRange(new Range())).toBe(false);
		});

		it('should return false if getPosFromRange returns a falsy pos', () => {
			const actions = new RendererActions();
			jest.spyOn(steps, 'getPosFromRange').mockReturnValueOnce(false);

			expect(actions.isValidAnnotationRange(new Range())).toBe(false);
		});

		it('should call privateValidatePositionsForAnnotation with the pos details', () => {
			jest.spyOn(steps, 'getPosFromRange').mockReturnValueOnce({ from: 0, to: 10 });

			const actions = new RendererActions();

			actions.doc = new Node();

			const privateValidatePositionsForAnnotationSpyFn = jest.spyOn(
				actions,
				'_privateValidatePositionsForAnnotation',
			);

			actions.isValidAnnotationRange(new Range());

			expect(privateValidatePositionsForAnnotationSpyFn).toBeCalledTimes(1);
		});
	});

	describe('isRendererWithinRange', () => {
		it('should return false when no renderer within range', () => {
			const actions = new RendererActions();
			const mockRange = new Range();

			expect(actions.isRendererWithinRange(mockRange)).toBe(false);
		});

		it('should return true when renderer within range', () => {
			const actions = new RendererActions();
			const mockRange = new Range();
			const mockNode = document.createElement('span');
			const mockParentElement = document.createElement('div');
			mockParentElement.classList.add('ak-renderer-extension');

			Object.defineProperty(mockNode, 'parentElement', { value: mockParentElement });

			Object.defineProperty(mockRange, 'startContainer', { value: mockNode });

			expect(actions.isRendererWithinRange(mockRange)).toBe(true);
		});
	});

	describe('isRangeAnnotatable', () => {
		it('should return false when isValidAnnotationRange throws', () => {
			const actions = new RendererActions();
			const mockRange = new Range();
			const mockNode = document.createElement('span');
			Object.defineProperty(mockNode, 'parentElement', { value: document.createElement('div') });

			Object.defineProperty(mockRange, 'startContainer', { value: mockNode });

			actions.isValidAnnotationRange = () => {
				throw new Error();
			};

			expect(actions.isRangeAnnotatable(mockRange)).toBe(false);
		});

		it('should return false when range is in a nested renderer', () => {
			const actions = new RendererActions();
			const mockRange = new Range();
			const mockNode = document.createElement('span');
			const mockParentElement = document.createElement('div');
			mockParentElement.classList.add('ak-renderer-extension');
			Object.defineProperty(mockNode, 'parentElement', { value: mockParentElement });
			Object.defineProperty(mockRange, 'startContainer', { value: mockNode });

			actions.isValidAnnotationRange = () => true;

			expect(actions.isRangeAnnotatable(mockRange)).toBe(false);
		});

		it('should return true when range is not in a nested renderer', () => {
			const actions = new RendererActions();
			const mockRange = new Range();
			const mockNode = document.createElement('span');
			Object.defineProperty(mockNode, 'parentElement', { value: document.createElement('div') });
			Object.defineProperty(mockRange, 'startContainer', { value: mockNode });

			actions.isValidAnnotationRange = () => true;

			expect(actions.isRangeAnnotatable(mockRange)).toBe(true);
		});
	});
});
