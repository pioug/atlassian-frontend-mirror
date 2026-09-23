/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	ACTION_SUBJECT_ID,
} from '@atlaskit/editor-common/analytics';
import { JSONTransformer } from '@atlaskit/editor-json-transformer/JSONTransformer-2';
import { Node } from '@atlaskit/editor-prosemirror/model';
import { Step } from '@atlaskit/editor-prosemirror/transform-override';
import { passGate, failGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import {
	simpleTextWithAnnotation,
	textWithOverlappingAnnotations,
	annotationSpanningMultiText,
	mediaWithAnnotation,
	docWithTextAndMedia,
	docWithInlineNodes,
} from '../../../__tests__/__fixtures__/annotation';
import type { AnalyticsEventPayload } from '../../../analytics/events';
import * as steps from '../../../steps';
import RendererActions from '../../index';

const mockArg = {} as any;
const mockArg2 = {} as any;
const annotationId = '<<<ANNOTATION-ID>>>';

describe.skip('RendererActions', () => {
	it(`can't register the same RendererActions instance on more than one ref`, () => {
		const actions = new RendererActions(true);
		actions._privateRegisterRenderer(mockArg, mockArg, mockArg);
		expect(() => {
			actions._privateRegisterRenderer(mockArg2, mockArg2, mockArg2);
		}).toThrow(
			"Renderer has already been registered! It's not allowed to re-register with another new Renderer instance.",
		);
	});

	it(`no-ops when not init'd from a correct source`, () => {
		const actions = new RendererActions();
		actions._privateRegisterRenderer(mockArg, mockArg, mockArg);
		expect(() => {
			actions._privateRegisterRenderer(mockArg, mockArg, mockArg);
		}).not.toThrow(
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
			const actions = new RendererActions(true);
			actions._privateRegisterRenderer(
				mockArg,
				defaultSchema.nodeFromJSON(doc),
				defaultSchema,
				onAnalyticsEvent,
			);
			return actions;
		}
		it('should delete the annotation with provided ID', () => {
			const actions = initActions(simpleTextWithAnnotation(annotationId));
			const result = actions.deleteAnnotation(annotationId, 'inlineComment');
			if (!result) {
				throw new Error('Expected deleteAnnotation to return a result');
			}
			expect(result.doc).toEqual({
				type: 'doc',
				version: 1,
				content: [
					{
						type: 'paragraph',
						content: [{ type: 'text', text: 'Hello!' }],
					},
				],
			});
			expect(result.step.toJSON()).toMatchObject({
				stepType: 'removeMark',
				mark: {
					type: 'annotation',
					attrs: { annotationType: 'inlineComment', id: annotationId },
				},
				from: 1,
				to: 7,
			});
		});

		it('should delete the annotation on media with provided ID', () => {
			const actions = initActions(mediaWithAnnotation(annotationId));
			const result = actions.deleteAnnotation(annotationId, 'inlineComment');
			if (!result) {
				throw new Error('Expected deleteAnnotation to return a result');
			}
			expect(result.doc).toEqual({
				type: 'doc',
				version: 1,
				content: [
					{
						type: 'media',
						attrs: expect.objectContaining({
							type: 'file',
							id: expect.any(String),
							collection: expect.any(String),
						}),
					},
				],
			});
			expect(result.step.toJSON()).toMatchObject({
				stepType: 'removeNodeMark',
				mark: {
					type: 'annotation',
					attrs: { annotationType: 'inlineComment', id: annotationId },
				},
				pos: 0,
			});
		});

		it('should delete the annotation with provided ID without touching overlapping marks', () => {
			const actions = initActions(textWithOverlappingAnnotations(annotationId));
			const result = actions.deleteAnnotation(annotationId, 'inlineComment');
			if (!result) {
				throw new Error('Expected deleteAnnotation to return a result');
			}
			expect(result.step.toJSON()).toMatchObject({
				stepType: 'removeMark',
				mark: {
					type: 'annotation',
					attrs: { annotationType: 'inlineComment', id: annotationId },
				},
				from: 15,
				to: 25,
			});
			expect(result.doc).toEqual(expect.objectContaining({ type: 'doc', version: 1 }));
		});

		it('should delete the annotation when spanning multiple nodes', () => {
			const actions = initActions(annotationSpanningMultiText(annotationId));
			const result = actions.deleteAnnotation(annotationId, 'inlineComment');
			if (!result) {
				throw new Error('Expected deleteAnnotation to return a result');
			}
			expect(result.step.toJSON()).toMatchObject({
				stepType: 'removeMark',
				mark: {
					type: 'annotation',
					attrs: { annotationType: 'inlineComment', id: annotationId },
				},
				from: 1,
				to: 15,
			});
			expect(result.doc).toEqual(expect.objectContaining({ type: 'doc', version: 1 }));
		});

		it('should trigger the analytics event when annotation is detected', () => {
			const actions = initActions(simpleTextWithAnnotation(annotationId));
			actions.deleteAnnotation(annotationId, 'inlineComment');

			expect(onAnalyticsEvent).toHaveBeenCalledWith({
				action: ACTION.DELETED,
				actionSubject: ACTION_SUBJECT.ANNOTATION,
				actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
				eventType: EVENT_TYPE.TRACK,
				attributes: { inlineNodes: undefined },
			});
		});

		it('should not trigger the analytics event when annotation is not detected', () => {
			const actions = initActions(simpleTextWithAnnotation(annotationId));
			actions.deleteAnnotation('noAnnotation', 'inlineComment');

			expect(onAnalyticsEvent).toHaveBeenCalledTimes(0);
		});
	});

	describe('applyAnnotation', () => {
		const initActions = (doc: any) => {
			const actions = new RendererActions(true);
			actions._privateRegisterRenderer(mockArg, defaultSchema.nodeFromJSON(doc), defaultSchema);
			return actions;
		};

		const annotationMark = {
			attrs: {
				annotationType: 'inlineComment',
				id: annotationId,
			},
			type: 'annotation',
		};
		const newAnnotation: any = {
			annotationId,
			annotationType: annotationMark.attrs.annotationType,
		};

		const transformer = new JSONTransformer();

		const expectAnnotationApplied = ({
			expectedStep,
			expectedTargetNodeType,
			result,
			sourceDoc,
		}: {
			expectedStep:
				| { from: number; stepType: 'addMark'; to: number }
				| { pos: number; stepType: 'addNodeMark' };
			expectedTargetNodeType: string;
			result: Exclude<NonNullable<ReturnType<RendererActions['applyAnnotation']>>, false>;
			sourceDoc: any;
		}) => {
			const serializedStep = {
				...expectedStep,
				mark: annotationMark,
			};
			expect(result.step.toJSON()).toEqual(serializedStep);
			expect(result.targetNodeType).toBe(expectedTargetNodeType);

			const appliedStep = Step.fromJSON(defaultSchema, serializedStep).apply(
				defaultSchema.nodeFromJSON(sourceDoc),
			);
			if (appliedStep.failed || !appliedStep.doc) {
				throw new Error(`Expected annotation step to apply: ${appliedStep.failed}`);
			}
			expect(result.doc).toEqual({
				...transformer.encode(appliedStep.doc),
				version: sourceDoc.version,
			});
		};

		it('should apply annotation to the plain text', () => {
			const actions = initActions(docWithTextAndMedia);
			const result = actions.applyAnnotation({ from: 0, to: 9 }, newAnnotation);
			if (!result) {
				throw new Error('Expected applyAnnotation to return a result');
			}
			expect(result.ancestorNodeTypes).toBeUndefined();
			expectAnnotationApplied({
				expectedStep: { from: 0, stepType: 'addMark', to: 9 },
				expectedTargetNodeType: 'text',
				result,
				sourceDoc: docWithTextAndMedia,
			});
		});

		it('should apply annotation to the formatted text', () => {
			const actions = initActions(docWithTextAndMedia);
			const result = actions.applyAnnotation({ from: 18, to: 30 }, newAnnotation);
			if (!result) {
				throw new Error('Expected applyAnnotation to return a result');
			}
			expect(result.ancestorNodeTypes).toBeUndefined();
			expectAnnotationApplied({
				expectedStep: { from: 18, stepType: 'addMark', to: 30 },
				expectedTargetNodeType: 'text',
				result,
				sourceDoc: docWithTextAndMedia,
			});
		});

		it('should apply annotation to the top-level media', () => {
			const actions = initActions(docWithTextAndMedia);
			const result = actions.applyAnnotation({ from: 39, to: 39 }, newAnnotation);
			if (!result) {
				throw new Error('Expected applyAnnotation to return a result');
			}
			expectAnnotationApplied({
				expectedStep: { pos: 39, stepType: 'addNodeMark' },
				expectedTargetNodeType: 'media',
				result,
				sourceDoc: docWithTextAndMedia,
			});
		});

		it('should apply annotation to caption of top level media', () => {
			const actions = initActions(docWithTextAndMedia);
			const result = actions.applyAnnotation({ from: 41, to: 45 }, newAnnotation);
			if (!result) {
				throw new Error('Expected applyAnnotation to return a result');
			}
			expectAnnotationApplied({
				expectedStep: { from: 41, stepType: 'addMark', to: 45 },
				expectedTargetNodeType: 'caption',
				result,
				sourceDoc: docWithTextAndMedia,
			});
		});

		it('should apply annotation to the nested media', () => {
			const actions = initActions(docWithTextAndMedia);
			const result = actions.applyAnnotation({ from: 61, to: 61 }, newAnnotation);
			if (!result) {
				throw new Error('Expected applyAnnotation to return a result');
			}
			expectAnnotationApplied({
				expectedStep: { pos: 61, stepType: 'addNodeMark' },
				expectedTargetNodeType: 'media',
				result,
				sourceDoc: docWithTextAndMedia,
			});
		});

		it('should apply annotation to the caption of nested media', () => {
			const actions = initActions(docWithTextAndMedia);
			const result = actions.applyAnnotation({ from: 68, to: 71 }, newAnnotation);
			if (!result) {
				throw new Error('Expected applyAnnotation to return a result');
			}
			expectAnnotationApplied({
				expectedStep: { from: 68, stepType: 'addMark', to: 71 },
				expectedTargetNodeType: 'caption',
				result,
				sourceDoc: docWithTextAndMedia,
			});
		});

		it('should apply annotation to text with inline nodes', () => {
			passGate('editor_inline_comments_on_inline_nodes');

			const actions = initActions(docWithInlineNodes);
			const pos = { from: 0, to: 29 };
			const result = actions.applyAnnotation(pos, newAnnotation);
			if (!result) {
				throw new Error('Expected applyAnnotation to return a result');
			}

			expectAnnotationApplied({
				expectedStep: { from: 0, stepType: 'addMark', to: 29 },
				expectedTargetNodeType: 'text',
				result,
				sourceDoc: docWithInlineNodes,
			});
			expect(result.inlineNodeTypes).toEqual(['date', 'emoji', 'status', 'text']);
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
			it('when feature gate editor_inline_comments_on_inline_nodes is ON, returns false and calls isRendererWithinRange', () => {
				passGate('editor_inline_comments_on_inline_nodes');
				const isRendererWithinRangeSpyFn = jest
					.spyOn(actions, 'isRendererWithinRange')
					.mockReturnValueOnce(true);
				expect(actions.isValidAnnotationRange(new Range())).toBe(false);
				expect(isRendererWithinRangeSpyFn).toHaveBeenCalledTimes(1);
			});

			it('when feature gate editor_inline_comments_on_inline_nodes is OFF, does not call isRendererWithinRange', () => {
				failGate('editor_inline_comments_on_inline_nodes');
				const isRendererWithinRangeSpyFn = jest.spyOn(actions, 'isRendererWithinRange');
				actions.isValidAnnotationRange(new Range());
				expect(isRendererWithinRangeSpyFn).toHaveBeenCalledTimes(0);
			});
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

			expect(privateValidatePositionsForAnnotationSpyFn).toHaveBeenCalledTimes(1);
		});
	});

	describe('getSelectionContext', () => {
		it('returns null when renderer state is not registered', () => {
			const actions = new RendererActions(true);
			expect(actions.getSelectionContext()).toBeNull();
		});

		it('returns null when renderer schema is missing', () => {
			const docNode = defaultSchema.nodeFromJSON({
				type: 'doc',
				version: 1,
				content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello world' }] }],
			});
			const actions = new RendererActions(true);
			(actions as any).doc = docNode;
			(actions as any).schema = undefined;

			expect(actions.getSelectionContext()).toBeNull();
		});

		it('returns null with registered renderer state when no DOM range selection exists', () => {
			const docNode = defaultSchema.nodeFromJSON({
				type: 'doc',
				version: 1,
				content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello world' }] }],
			});
			const actions = new RendererActions(true);

			actions._privateRegisterRenderer(mockArg, docNode, defaultSchema);

			expect(actions.getSelectionContext()).toBeNull();
		});

		it('delegates getSelectionContext to selection helper with registered state', () => {
			const mockedGetSelectionContext = jest.fn().mockReturnValue(null);
			let registeredDoc;

			jest.isolateModules(() => {
				jest.doMock('../../selection', () => ({
					getSelectionContext: mockedGetSelectionContext,
				}));
				// eslint-disable-next-line @typescript-eslint/no-var-requires
				const IsolatedRendererActions = require('../../index').default;
				const docNode = defaultSchema.nodeFromJSON({
					type: 'doc',
					version: 1,
					content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello world' }] }],
				});
				registeredDoc = docNode;

				const actions = new IsolatedRendererActions(true);
				actions._privateRegisterRenderer(mockArg, docNode, defaultSchema);
				expect(actions.getSelectionContext()).toBeNull();
			});

			expect(mockedGetSelectionContext).toHaveBeenCalledWith({
				doc: registeredDoc,
				schema: defaultSchema,
			});
			jest.dontMock('../../selection');
			jest.resetModules();
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

	describe('getMediaNodeContext', () => {
		const fileId = 'file-id-1';
		const otherFileId = 'file-id-2';

		type MediaAttrs = Record<string, unknown>;
		type MediaMark = { attrs: Record<string, unknown>; type: string };

		const inlineCommentMark = (id: string): MediaMark => ({
			type: 'annotation',
			attrs: { annotationType: 'inlineComment', id },
		});

		const mediaSingle = (attrs: MediaAttrs, marks?: MediaMark[]) => ({
			type: 'mediaSingle',
			attrs: { layout: 'center' },
			content: [
				{
					type: 'media',
					attrs: { collection: 'test-collection', type: 'file', ...attrs },
					...(marks ? { marks } : {}),
				},
			],
		});

		const docWith = (content: unknown[]) => ({
			type: 'doc',
			version: 1,
			content,
		});

		function initActions(doc: unknown) {
			const actions = new RendererActions(true);
			actions._privateRegisterRenderer(mockArg, defaultSchema.nodeFromJSON(doc), defaultSchema);
			return actions;
		}

		it('returns missing when no document is registered', () => {
			const actions = new RendererActions(true);

			expect(actions.getMediaNodeContext({ id: fileId })).toEqual({ status: 'missing' });
		});

		it('returns missing when no media node matches the file id', () => {
			const actions = initActions(
				docWith([
					{ type: 'paragraph', content: [{ type: 'text', text: 'no media here' }] },
					mediaSingle({ id: otherFileId }),
				]),
			);

			expect(actions.getMediaNodeContext({ id: fileId })).toEqual({ status: 'missing' });
		});

		it('returns missing for a matching media node that is not a file', () => {
			const actions = initActions(
				docWith([
					{
						type: 'mediaSingle',
						attrs: { layout: 'center' },
						content: [
							{
								type: 'media',
								attrs: { type: 'external', url: 'https://example.com/cat.png' },
							},
						],
					},
				]),
			);

			expect(actions.getMediaNodeContext({ id: 'https://example.com/cat.png' })).toEqual({
				status: 'missing',
			});
		});

		it('resolves a single matching media node with its context', () => {
			const actions = initActions(
				docWith([
					{ type: 'paragraph', content: [{ type: 'text', text: 'before' }] },
					mediaSingle({ id: fileId, alt: 'a-cat.png', occurrenceKey: 'occurrence-1' }, [
						inlineCommentMark('annotation-1'),
					]),
				]),
			);

			expect(actions.getMediaNodeContext({ id: fileId })).toEqual({
				status: 'resolved',
				context: {
					fileId,
					annotationIds: ['annotation-1'],
					position: expect.any(Number),
					displayText: 'a-cat.png',
					occurrenceKey: 'occurrence-1',
				},
			});
		});

		it('returns a position that points at the matched media node', () => {
			const doc = docWith([
				{ type: 'paragraph', content: [{ type: 'text', text: 'before' }] },
				mediaSingle({ id: otherFileId, alt: 'other.png' }),
				mediaSingle({ id: fileId, alt: 'wanted.png' }),
			]);
			const docNode = defaultSchema.nodeFromJSON(doc);
			const actions = new RendererActions(true);
			actions._privateRegisterRenderer(mockArg, docNode, defaultSchema);

			// Ground truth computed independently of getMediaNodeContext: sum the preceding
			// siblings' sizes to find where the wanted mediaSingle starts, then step past its
			// opening token to reach the media node it wraps.
			const wantedMediaSingleStart = [docNode.child(0), docNode.child(1)].reduce(
				(pos, node) => pos + node.nodeSize,
				0,
			);
			const expectedPosition = wantedMediaSingleStart + 1;

			expect(actions.getMediaNodeContext({ id: fileId })).toEqual({
				status: 'resolved',
				context: expect.objectContaining({ position: expectedPosition }),
			});
		});

		it('reads only inline-comment annotation ids from the media node marks', () => {
			const actions = initActions(
				docWith([
					mediaSingle({ id: fileId, alt: 'a-cat.png' }, [
						inlineCommentMark('annotation-1'),
						{ type: 'annotation', attrs: { annotationType: 'someOtherType', id: 'annotation-2' } },
						{ type: 'border', attrs: { color: '#091e4224', size: 2 } },
						inlineCommentMark('annotation-3'),
					]),
				]),
			);

			expect(actions.getMediaNodeContext({ id: fileId })).toEqual({
				status: 'resolved',
				context: expect.objectContaining({ annotationIds: ['annotation-1', 'annotation-3'] }),
			});
		});

		it('returns no annotation ids for an unannotated media node', () => {
			const actions = initActions(docWith([mediaSingle({ id: fileId, alt: 'a-cat.png' })]));

			expect(actions.getMediaNodeContext({ id: fileId })).toEqual({
				status: 'resolved',
				context: expect.objectContaining({ annotationIds: [] }),
			});
		});

		it('falls back to the file name for display text and omits an absent occurrence key', () => {
			const actions = initActions(docWith([mediaSingle({ id: fileId, __fileName: 'a-cat.png' })]));

			expect(actions.getMediaNodeContext({ id: fileId })).toEqual({
				status: 'resolved',
				context: expect.objectContaining({ displayText: 'a-cat.png', occurrenceKey: undefined }),
			});
		});

		// `fileName` and `name` are not declared on the media node spec, so
		// `nodeFromJSON` drops them. Assign them onto the built node to exercise the
		// rest of the display-text fallback chain.
		it.each([
			['fileName', 'from-file-name.png'],
			['name', 'from-name.png'],
		])('falls back to the %s attribute for display text', (attribute, expected) => {
			const docNode = defaultSchema.nodeFromJSON(docWith([mediaSingle({ id: fileId })]));
			docNode.descendants((node) => {
				if (node.type.name === 'media') {
					Object.assign(node.attrs, { [attribute]: expected });
				}
				return true;
			});

			const actions = new RendererActions(true);
			actions._privateRegisterRenderer(mockArg, docNode, defaultSchema);

			expect(actions.getMediaNodeContext({ id: fileId })).toEqual({
				status: 'resolved',
				context: expect.objectContaining({ displayText: expected }),
			});
		});

		it('leaves display text undefined when the media node has no name attributes', () => {
			const actions = initActions(docWith([mediaSingle({ id: fileId })]));

			expect(actions.getMediaNodeContext({ id: fileId })).toEqual({
				status: 'resolved',
				context: expect.objectContaining({ displayText: undefined }),
			});
		});

		it('resolves the requested placement when the same file appears twice', () => {
			const actions = initActions(
				docWith([
					mediaSingle({ id: fileId, alt: 'first.png', occurrenceKey: 'occurrence-1' }, [
						inlineCommentMark('annotation-first'),
					]),
					mediaSingle({ id: fileId, alt: 'second.png', occurrenceKey: 'occurrence-2' }, [
						inlineCommentMark('annotation-second'),
					]),
				]),
			);

			expect(actions.getMediaNodeContext({ id: fileId, occurrenceKey: 'occurrence-2' })).toEqual({
				status: 'resolved',
				context: expect.objectContaining({
					occurrenceKey: 'occurrence-2',
					annotationIds: ['annotation-second'],
				}),
			});
		});

		// Deliberate behaviour: failing here would hide comments on the only copy of the
		// file on the page, so the single candidate wins over the occurrence key mismatch.
		it('resolves the only candidate even when its occurrence key differs from the requested one', () => {
			const actions = initActions(
				docWith([
					mediaSingle({ id: fileId, alt: 'a-cat.png', occurrenceKey: 'occurrence-on-node' }, [
						inlineCommentMark('annotation-1'),
					]),
				]),
			);

			expect(actions.getMediaNodeContext({ id: fileId, occurrenceKey: 'a-different-key' })).toEqual(
				{
					status: 'resolved',
					context: expect.objectContaining({ occurrenceKey: 'occurrence-on-node' }),
				},
			);
		});

		it('returns ambiguous when the same file appears twice and no occurrence key is supplied', () => {
			const actions = initActions(
				docWith([
					mediaSingle({ id: fileId, alt: 'first.png', occurrenceKey: 'occurrence-1' }),
					mediaSingle({ id: fileId, alt: 'second.png', occurrenceKey: 'occurrence-2' }),
				]),
			);

			expect(actions.getMediaNodeContext({ id: fileId })).toEqual({ status: 'ambiguous' });
		});

		it('returns ambiguous when the supplied occurrence key matches none of several placements', () => {
			const actions = initActions(
				docWith([
					mediaSingle({ id: fileId, alt: 'first.png', occurrenceKey: 'occurrence-1' }),
					mediaSingle({ id: fileId, alt: 'second.png', occurrenceKey: 'occurrence-2' }),
				]),
			);

			expect(actions.getMediaNodeContext({ id: fileId, occurrenceKey: 'occurrence-3' })).toEqual({
				status: 'ambiguous',
			});
		});
	});
});
