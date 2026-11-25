import React, { act } from 'react';

import { AnnotationTypes } from '@atlaskit/adf-schema/annotation';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { doc } from '@atlaskit/adf-utils/doc';
import { paragraph as p } from '@atlaskit/adf-utils/paragraph';
import { status } from '@atlaskit/adf-utils/status';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics/types/enums';
import { createAnnotationManager } from '@atlaskit/editor-common/annotation';
import type { AnnotationManager } from '@atlaskit/editor-common/annotation';
import type {
	AnnotationActionResult,
	InlineCommentSelectionComponentProps,
} from '@atlaskit/editor-common/types/annotation';
import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import createAnalyticsEventMock from '@atlaskit/editor-test-helpers/create-analytics-event-mock';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/editor-experiment';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { passGate, failGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

import type { ApplyAnnotation } from '../../../../../actions/index';
import type RendererActions from '../../../../../actions/index';
import { RendererContext } from '../../../../RendererActionsContext';
import { AnnotationManagerProvider } from '../../../contexts/AnnotationManagerContext';
import { updateWindowSelectionAroundDraft } from '../../../draft/dom';
import type { Position } from '../../../types';
import { SelectionInlineCommentMounter } from '../../mounter';
jest.mock('../../../draft/dom');
jest.mock('@atlaskit/tmp-editor-statsig/editor-experiment', () => ({
	...jest.requireActual('@atlaskit/tmp-editor-statsig/editor-experiment'),
	editorExperiment: jest.fn(() => false),
}));

const inlineNodeTypesTestId = 'inline-nodes-type';

describe('Annotations: SelectionInlineCommentMounter', () => {
	const fakeApplyAnnotation: jest.Mock = jest.fn().mockReturnValue({});
	const fakeOnCloseProp: jest.Mock = jest.fn();
	const fakeCreateAnalyticsEvent = createAnalyticsEventMock();
	let container: HTMLElement | null;
	let createRangeMock: jest.SpyInstance;
	let onCloseCallback: Function = () => {};

	const renderMounter = ({
		fakeDocumentPosition = { from: 0, to: 10 },
		isAnnotationAllowed = true,
		actionsDoc,
		annotationManager,
		hasValidAnnotationRange = true,
		hasRangeAnnotatable = true,
	}: {
		actionsDoc?: PMNode;
		annotationManager?: AnnotationManager;
		fakeDocumentPosition?: Position | false;
		hasRangeAnnotatable?: boolean;
		hasValidAnnotationRange?: boolean;
		isAnnotationAllowed?: boolean;
	} = {}) => {
		const wrapperDOM = {
			current: container!,
		} as React.RefObject<HTMLDivElement>;
		let onCreateCallback: Function = () => {};
		let applyDraftModeCallback: Function = () => {};
		// @ts-ignore
		const actions = {
			doc: actionsDoc,
			isValidAnnotationPosition: jest.fn(() => true),
			isValidAnnotationRange: jest.fn(() => hasValidAnnotationRange),
			isRangeAnnotatable: jest.fn(() => hasRangeAnnotatable),
			getAnnotationsByPosition: jest.fn(() => []),
		} as RendererActions;

		const DummyComponent = (props: InlineCommentSelectionComponentProps) => {
			onCreateCallback = props.onCreate;
			onCloseCallback = props.onClose;
			applyDraftModeCallback = props.applyDraftMode;
			return (
				<span data-dummy>
					<div data-testid={inlineNodeTypesTestId}>{JSON.stringify(props.inlineNodeTypes)}</div>
				</span>
			);
		};

		render(
			<RendererContext.Provider value={actions}>
				<AnnotationManagerProvider annotationManager={annotationManager}>
					<SelectionInlineCommentMounter
						range={document.createRange()}
						draftRange={null}
						wrapperDOM={wrapperDOM}
						onClose={fakeOnCloseProp}
						component={DummyComponent}
						documentPosition={fakeDocumentPosition}
						isAnnotationAllowed={isAnnotationAllowed}
						applyAnnotation={fakeApplyAnnotation as ApplyAnnotation}
						createAnalyticsEvent={fakeCreateAnalyticsEvent}
					/>
				</AnnotationManagerProvider>
			</RendererContext.Provider>,
			{ container: container! },
		);
		return {
			onCreateCallback,
			applyDraftModeCallback,
			onCloseCallback,
		};
	};

	beforeEach(() => {
		fakeApplyAnnotation.mockReturnValue({});
		container = document.createElement('div');
		document.body.appendChild(container);
		createRangeMock = jest.spyOn(document, 'createRange');
		createRangeMock.mockImplementation(() => {
			return new Range();
		});
	});

	afterEach(() => {
		document.body.removeChild(container!);
		container = null;
		jest.clearAllMocks();
	});

	describe('on mounting', () => {
		it('should render the prop component', () => {
			renderMounter();
			expect(document.querySelector('[data-dummy]')).not.toBeNull();
		});
	});

	describe('native selection ownership', () => {
		let runFrame: FrameRequestCallback | undefined;
		let animationFrameMock: jest.SpyInstance;
		let text: Text;

		const select = (from: number, to: number) => {
			const range = document.createRange();
			range.setStart(text, from);
			range.setEnd(text, to);
			window.getSelection()!.removeAllRanges();
			window.getSelection()!.addRange(range);
		};

		beforeEach(() => {
			runFrame = undefined;
			animationFrameMock = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
				runFrame = cb;
				return 1;
			});
		});

		afterEach(() => {
			animationFrameMock.mockRestore();
			window.getSelection()!.removeAllRanges();
		});

		const startDraft = ({ withNativeSelection = true } = {}) => {
			const { applyDraftModeCallback } = renderMounter();
			text = document.createTextNode('First target and second target');
			container!.appendChild(text);
			window.getSelection()!.removeAllRanges();
			if (withNativeSelection) {
				select(0, 5);
			}
			act(() => {
				applyDraftModeCallback({ annotationId: 'draft', keepNativeSelection: false });
			});
		};

		it('clears the native selection synchronously without scheduling a frame', () => {
			mockExpEnabled('platform_editor_annotation_selection_ownership');
			startDraft();

			expect(window.getSelection()!.rangeCount).toBe(0);
			expect(animationFrameMock).not.toHaveBeenCalled();
		});

		it('preserves a newer selection made after drafting starts', () => {
			mockExpEnabled('platform_editor_annotation_selection_ownership');
			startDraft();
			select(17, 23);

			expect(animationFrameMock).not.toHaveBeenCalled();
			expect(window.getSelection()!.toString()).toBe('second');
		});

		it('preserves a selection created after drafting without a native selection', () => {
			mockExpEnabled('platform_editor_annotation_selection_ownership');
			startDraft({ withNativeSelection: false });
			select(17, 23);

			expect(animationFrameMock).not.toHaveBeenCalled();
			expect(window.getSelection()!.toString()).toBe('second');
		});

		it('preserves deferred selection clearing with the experiment off', () => {
			mockExpDisabled('platform_editor_annotation_selection_ownership');
			startDraft();

			expect(window.getSelection()!.toString()).toBe('First');
			expect(animationFrameMock).toHaveBeenCalledTimes(1);
			select(17, 23);
			act(() => runFrame?.(0));
			expect(window.getSelection()!.rangeCount).toBe(0);
		});
	});

	describe('when draft mode is enabled', () => {
		beforeEach(() => {
			jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: Function) => cb());
		});

		afterEach(() => {
			(window.requestAnimationFrame as jest.Mock).mockRestore();
		});

		describe('when keepNativeSelection is true', () => {
			it('should update the native selection in the next animation frame', (done) => {
				const { applyDraftModeCallback } = renderMounter();

				expect(updateWindowSelectionAroundDraft).toHaveBeenCalledTimes(0);
				act(() => {
					applyDraftModeCallback({ keepNativeSelection: true });
				});

				window.requestAnimationFrame(() => {
					expect(updateWindowSelectionAroundDraft).toHaveBeenCalledTimes(1);
					done();
				});
			});
		});

		describe('when keepNativeSelection is false', () => {
			it('should remove the native selection in the next animation frame', (done) => {
				mockExpDisabled('platform_editor_annotation_selection_ownership');
				const onSelectionMock = jest.spyOn(window, 'getSelection');
				const removeAllRangesMock = jest.fn();
				(onSelectionMock as any).mockReturnValue({
					removeAllRanges: removeAllRangesMock,
				});

				const { applyDraftModeCallback } = renderMounter();

				act(() => {
					applyDraftModeCallback({ keepNativeSelection: false });
				});

				window.requestAnimationFrame(() => {
					expect(removeAllRangesMock).toHaveBeenCalledTimes(1);
					onSelectionMock.mockRestore();

					done();
				});
			});
		});

		describe('when annotationId is provided', () => {
			it('should return a step for that annotation with a valid range', () => {
				let retVal: AnnotationActionResult = false;

				const { applyDraftModeCallback } = renderMounter();

				act(() => {
					retVal = applyDraftModeCallback({ annotationId: '12345' });
				});

				expect(retVal).toBeTruthy();
			});

			it('should return false for the annotation if the range is not valid', () => {
				let retVal: AnnotationActionResult = false;

				const { applyDraftModeCallback } = renderMounter({ fakeDocumentPosition: false });

				act(() => {
					retVal = applyDraftModeCallback({ annotationId: '12345' });
				});

				expect(retVal).toBe(false);
			});
		});

		describe('and when the document position changes', () => {
			it('should create the annotation in the previous draft position (gate off)', () => {
				const fakeDocumentPosition = { from: 0, to: 10 };
				const { onCreateCallback, applyDraftModeCallback } = renderMounter({
					fakeDocumentPosition,
				});

				act(() => {
					applyDraftModeCallback({ keepNativeSelection: true });
				});

				const nextDocumentPosition = { from: 30, to: 45 };
				renderMounter({ fakeDocumentPosition: nextDocumentPosition });

				onCreateCallback('annotationId');

				const fakeAnnotation = {
					annotationId: 'annotationId',
					annotationType: AnnotationTypes.INLINE_COMMENT,
				};
				expect(fakeApplyAnnotation).toHaveBeenCalledWith(fakeDocumentPosition, fakeAnnotation);
			});

			describe('COMMENTS-6594: experiment on — creates annotation at current position', () => {
				beforeEach(() => {
					(editorExperiment as jest.Mock).mockImplementation(
						(key: string, param: string) =>
							key === 'confluence_inline_comments_fix_stale_selection' && param === 'isEnabled',
					);
				});

				afterEach(() => {
					(editorExperiment as jest.Mock).mockReset();
				});

				it('should use current position, not stale position from previous selection', () => {
					// Render with position #1, trigger applyDraftMode
					const { applyDraftModeCallback } = renderMounter({
						fakeDocumentPosition: { from: 0, to: 10 },
					});
					act(() => {
						applyDraftModeCallback({ annotationId: 'test-id', keepNativeSelection: false });
					});

					// Re-render with position #2 — captures fresh onCreateCallback closing over new documentPosition
					const nextDocumentPosition = { from: 30, to: 45 };
					const { onCreateCallback } = renderMounter({
						fakeDocumentPosition: nextDocumentPosition,
					});

					// onCreate should use position #2 (not stale position #1)
					onCreateCallback('test-id');

					expect(fakeApplyAnnotation).toHaveBeenLastCalledWith(nextDocumentPosition, {
						annotationId: 'test-id',
						annotationType: AnnotationTypes.INLINE_COMMENT,
					});
				});
			});
		});

		it('sends annotation opened analytics event', () => {
			const { applyDraftModeCallback } = renderMounter();

			act(() => {
				applyDraftModeCallback({ keepNativeSelection: true });
			});

			expect(fakeCreateAnalyticsEvent).toHaveBeenCalledWith({
				action: ACTION.OPENED,
				actionSubject: ACTION_SUBJECT.ANNOTATION,
				actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
				eventType: EVENT_TYPE.TRACK,
				attributes: {
					overlap: 0,
				},
			});
		});

		it('sends create not allowed analytics event when annotation is not allowed', () => {
			const { applyDraftModeCallback } = renderMounter({ isAnnotationAllowed: false });
			act(() => {
				applyDraftModeCallback({ keepNativeSelection: true });
			});
			expect(fakeCreateAnalyticsEvent).toHaveBeenCalledWith({
				action: ACTION.CREATE_NOT_ALLOWED,
				actionSubject: ACTION_SUBJECT.ANNOTATION,
				actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
				attributes: {
					documentPosition: {
						from: 0,
						to: 10,
					},
					inlineNodeNames: undefined,
					isAnnotationAllowed: false,
				},
				eventType: EVENT_TYPE.TRACK,
			});
		});
	});

	describe('draft failure diagnostics', () => {
		it.each([
			{
				fakeDocumentPosition: false as const,
				isAnnotationAllowed: true,
				reason: 'document-position-missing',
			},
			{
				fakeDocumentPosition: { from: 0, to: 10 },
				isAnnotationAllowed: false,
				reason: 'annotation-not-allowed',
			},
		])('reports $reason without changing the return value', ({ reason, ...props }) => {
			const onFailure = jest.fn();
			const { applyDraftModeCallback } = renderMounter(props);

			expect(applyDraftModeCallback({ annotationId: 'draft-id', onFailure })).toBe(false);
			expect(onFailure).toHaveBeenCalledTimes(1);
			expect(onFailure).toHaveBeenCalledWith({
				reason,
				hasDocumentPosition: !!props.fakeDocumentPosition,
				isAnnotationAllowed: props.isAnnotationAllowed,
				hasRange: true,
				rangeCollapsed: true,
				inlineNodeTypes: undefined,
			});
			expect(fakeApplyAnnotation).not.toHaveBeenCalled();
		});

		it('preserves rejection when no diagnostic callback is provided', () => {
			const { applyDraftModeCallback } = renderMounter({ isAnnotationAllowed: false });

			expect(applyDraftModeCallback({ annotationId: 'draft-id' })).toBe(false);
			expect(fakeApplyAnnotation).not.toHaveBeenCalled();
		});

		it('reports a missing annotation ID', () => {
			const onFailure = jest.fn();
			const { applyDraftModeCallback } = renderMounter();

			act(() => {
				expect(applyDraftModeCallback({ onFailure })).toBe(false);
			});
			expect(onFailure).toHaveBeenCalledWith(
				expect.objectContaining({ reason: 'annotation-id-missing' }),
			);
			expect(fakeApplyAnnotation).not.toHaveBeenCalled();
		});

		it('reports a failed annotation application', () => {
			fakeApplyAnnotation.mockReturnValue(false);
			const onFailure = jest.fn();
			const { applyDraftModeCallback } = renderMounter();

			act(() => {
				expect(applyDraftModeCallback({ annotationId: 'draft-id', onFailure })).toBe(false);
			});
			expect(onFailure).toHaveBeenCalledWith(
				expect.objectContaining({ reason: 'apply-annotation-failed' }),
			);
			expect(fakeApplyAnnotation).toHaveBeenCalledTimes(1);
		});

		it('preserves renderer diagnostics through the manager result', () => {
			const annotationManager = createAnnotationManager();
			renderMounter({ annotationManager, isAnnotationAllowed: false });

			expect(annotationManager.startDraft()).toEqual({
				success: false,
				reason: 'invalid-range',
				diagnostics: {
					reason: 'annotation-not-allowed',
					hasDocumentPosition: true,
					isAnnotationAllowed: false,
					hasRange: true,
					rangeCollapsed: true,
					inlineNodeTypes: undefined,
				},
			});
		});

		it('preserves application failure diagnostics through the manager result', () => {
			fakeApplyAnnotation.mockReturnValue(false);
			const annotationManager = createAnnotationManager();
			renderMounter({ annotationManager });

			act(() => {
				expect(annotationManager.startDraft()).toEqual({
					success: false,
					reason: 'invalid-range',
					diagnostics: {
						reason: 'apply-annotation-failed',
						hasDocumentPosition: true,
						isAnnotationAllowed: true,
						hasRange: true,
						rangeCollapsed: true,
						inlineNodeTypes: undefined,
					},
				});
			});
		});

		it('does not report failures for a successful annotation', () => {
			const onFailure = jest.fn();
			const { applyDraftModeCallback } = renderMounter();

			act(() => {
				expect(applyDraftModeCallback({ annotationId: 'draft-id', onFailure })).toEqual({});
			});
			expect(onFailure).not.toHaveBeenCalled();
		});
	});

	describe('onCreate', () => {
		describe('when the position is valid', () => {
			it('should call applyAnnotation method', () => {
				const fakeDocumentPosition = { from: 0, to: 10 };
				const { onCreateCallback } = renderMounter({ fakeDocumentPosition });

				const fakeAnnotation = {
					annotationId: 'annotationId',
					annotationType: AnnotationTypes.INLINE_COMMENT,
				};

				onCreateCallback('annotationId');

				expect(fakeApplyAnnotation).toHaveBeenCalledWith(fakeDocumentPosition, fakeAnnotation);
			});

			it('sends insert analytics event', () => {
				const fakeDocumentPosition = { from: 0, to: 10 };
				const { onCreateCallback } = renderMounter({ fakeDocumentPosition });
				onCreateCallback('annotationId');

				expect(fakeCreateAnalyticsEvent).toHaveBeenCalledWith({
					action: ACTION.INSERTED,
					actionSubject: ACTION_SUBJECT.ANNOTATION,
					actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
					attributes: {},
					eventType: EVENT_TYPE.TRACK,
				});
			});
		});
	});

	describe('onClose', () => {
		let onCloseCallback: Function;
		beforeEach(() => {
			const fakeDocumentPosition = { from: 0, to: 10 };
			onCloseCallback = renderMounter({ fakeDocumentPosition }).onCloseCallback;

			act(() => {
				onCloseCallback();
			});
		});

		it('clears draft annotation', () => {
			expect(fakeOnCloseProp).toHaveBeenCalled();
		});

		it('calls on annotation close analytics event', () => {
			expect(fakeCreateAnalyticsEvent).toHaveBeenCalledWith({
				action: ACTION.CLOSED,
				actionSubject: ACTION_SUBJECT.ANNOTATION,
				actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
				eventType: EVENT_TYPE.TRACK,
				attributes: {},
			});
		});
	});

	describe('inlineNodeTypes', () => {
		describe('should provide inlineNodeTypes props to the component', () => {
			const actionsDoc = PMNode.fromJSON(defaultSchema, doc(p('start', status(), 'end')));

			it('when feature gate editor_inline_comments_on_inline_nodes is ON, provides inlineNodeTypes including status and text', () => {
				passGate('editor_inline_comments_on_inline_nodes');
				renderMounter({ actionsDoc });

				expect(screen.getByTestId(inlineNodeTypesTestId)).toHaveTextContent('["status","text"]');
			});

			it('when feature gate editor_inline_comments_on_inline_nodes is OFF, does not provide text in inlineNodeTypes', () => {
				failGate('editor_inline_comments_on_inline_nodes');
				renderMounter({ actionsDoc });

				expect(screen.getByTestId(inlineNodeTypesTestId)).not.toHaveTextContent('text');
			});
		});

		it('should provide empty inlineNodeTypes if the isValidAnnotationRange returns false', () => {
			const actionsDoc = PMNode.fromJSON(defaultSchema, doc(p('start', status(), 'end')));

			renderMounter({ actionsDoc, hasValidAnnotationRange: false });

			expect(screen.getByTestId(inlineNodeTypesTestId)).toHaveTextContent('');
		});
	});
});
