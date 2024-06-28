import { AnnotationTypes } from '@atlaskit/adf-schema';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { doc, p, status } from '@atlaskit/adf-utils/builders';
import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import type {
	AnnotationActionResult,
	InlineCommentSelectionComponentProps,
} from '@atlaskit/editor-common/types';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import type { ApplyAnnotation } from '../../../../../actions/index';
import type RendererActions from '../../../../../actions/index';
import { RendererContext } from '../../../../RendererActionsContext';
import * as DraftMock from '../../../draft';
import type { Position } from '../../../types';
import { SelectionInlineCommentMounter } from '../../mounter';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import createAnalyticsEventMock from '@atlaskit/editor-test-helpers/create-analytics-event-mock';
import { ffTest } from '@atlassian/feature-flags-test-utils';

jest.mock('../../../draft');

const inlineNodeTypesTestId = 'inline-nodes-type';

describe('Annotations: SelectionInlineCommentMounter', () => {
	const fakeApplyAnnotation: jest.Mock = jest.fn().mockReturnValue({});
	const fakeOnCloseProp: jest.Mock = jest.fn();
	const fakeClearAnnotationDraft: jest.Mock = jest.fn();
	const fakeCreateAnalyticsEvent = createAnalyticsEventMock();
	let container: HTMLElement | null;
	let createRangeMock: jest.SpyInstance;
	let onCloseCallback: Function = () => {};

	const renderMounter = ({
		fakeDocumentPosition = { from: 0, to: 10 },
		isAnnotationAllowed = true,
		actionsDoc,
	}: {
		fakeDocumentPosition?: Position | false;
		isAnnotationAllowed?: boolean;
		actionsDoc?: PMNode;
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
			isValidAnnotationRange: jest.fn(() => true),
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
				<SelectionInlineCommentMounter
					range={document.createRange()}
					draftRange={null}
					wrapperDOM={wrapperDOM}
					onClose={fakeOnCloseProp}
					component={DummyComponent}
					documentPosition={fakeDocumentPosition}
					isAnnotationAllowed={isAnnotationAllowed}
					applyAnnotation={fakeApplyAnnotation as ApplyAnnotation}
					applyAnnotationDraftAt={jest.fn()}
					createAnalyticsEvent={fakeCreateAnalyticsEvent}
					clearAnnotationDraft={fakeClearAnnotationDraft}
				/>
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

				expect(DraftMock.updateWindowSelectionAroundDraft).toHaveBeenCalledTimes(0);
				act(() => {
					applyDraftModeCallback({ keepNativeSelection: true });
				});

				window.requestAnimationFrame(() => {
					expect(DraftMock.updateWindowSelectionAroundDraft).toHaveBeenCalledTimes(1);
					done();
				});
			});
		});

		describe('when keepNativeSelection is false', () => {
			it('should remove the native selection in the next animation frame', (done) => {
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
			it('should create the annotation in the previous draft position', () => {
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
				expect(fakeApplyAnnotation).toHaveBeenCalledWith(
					fakeDocumentPosition,
					fakeAnnotation,
					false,
				);
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
				attributes: {},
				eventType: EVENT_TYPE.TRACK,
			});
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

				expect(fakeApplyAnnotation).toHaveBeenCalledWith(
					fakeDocumentPosition,
					fakeAnnotation,
					false,
				);
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
			expect(fakeClearAnnotationDraft).toHaveBeenCalled();
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

	describe('should provide inlineNodeTypes props to the component', () => {
		const actionsDoc = PMNode.fromJSON(defaultSchema, doc(p('start', status(), 'end')));

		ffTest(
			'platform.editor.allow-inline-comments-for-inline-nodes-round-2_ctuxz',
			() => {
				renderMounter({ actionsDoc });

				expect(screen.getByTestId(inlineNodeTypesTestId)).toHaveTextContent('["status","text"]');
			},
			() => {
				renderMounter({ actionsDoc });

				expect(screen.getByTestId(inlineNodeTypesTestId)).not.toHaveTextContent('text');
			},
		);
	});
});
