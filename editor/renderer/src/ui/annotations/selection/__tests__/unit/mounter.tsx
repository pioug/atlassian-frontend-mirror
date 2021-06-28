import React from 'react';
import { render } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import { InlineCommentSelectionComponentProps } from '@atlaskit/editor-common';
import { SelectionInlineCommentMounter } from '../../mounter';
import { Position } from '../../../types';
import { ApplyAnnotation } from '../../../../../actions/index';
import * as DraftMock from '../../../draft';
import createAnalyticsEventMock from '@atlaskit/editor-test-helpers/create-analytics-event-mock';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
} from '../../../../../analytics/enums';
jest.mock('../../../draft');

describe('Annotations: SelectionInlineCommentMounter', () => {
  const fakeApplyAnnotation: jest.Mock = jest.fn();
  const fakeOnCloseProp: jest.Mock = jest.fn();
  const fakeClearAnnotationDraft: jest.Mock = jest.fn();
  const fakeCreateAnalyticsEvent = createAnalyticsEventMock();
  let container: HTMLElement | null;
  let createRangeMock: jest.SpyInstance;
  let onCloseCallback: Function = () => {};

  const renderMounter = (
    fakeDocumentPosition: Position = { from: 0, to: 10 },
    isAnnotationAllowed = true,
  ) => {
    const wrapperDOM = { current: container } as React.RefObject<
      HTMLDivElement
    >;
    let onCreateCallback: Function = () => {};
    let applyDraftModeCallback: Function = () => {};

    const DummyComponent = (props: InlineCommentSelectionComponentProps) => {
      onCreateCallback = props.onCreate;
      onCloseCallback = props.onClose;
      applyDraftModeCallback = props.applyDraftMode;
      return <span data-dummy>dummy</span>;
    };

    render(
      <SelectionInlineCommentMounter
        range={document.createRange()}
        wrapperDOM={wrapperDOM}
        onClose={fakeOnCloseProp}
        component={DummyComponent}
        documentPosition={fakeDocumentPosition}
        isAnnotationAllowed={isAnnotationAllowed}
        applyAnnotation={fakeApplyAnnotation as ApplyAnnotation}
        applyAnnotationDraftAt={jest.fn()}
        createAnalyticsEvent={fakeCreateAnalyticsEvent}
        clearAnnotationDraft={fakeClearAnnotationDraft}
      />,
      container,
    );
    return { onCreateCallback, applyDraftModeCallback, onCloseCallback };
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
      expect(container!.querySelector('[data-dummy]')).not.toBeNull();
    });
  });

  describe('when draft mode is enabled', () => {
    beforeEach(() => {
      jest
        .spyOn(window, 'requestAnimationFrame')
        .mockImplementation((cb: Function) => cb());
    });

    afterEach(() => {
      (window.requestAnimationFrame as jest.Mock).mockRestore();
    });

    describe('when keepNativeSelection is true', () => {
      it('should update the native selection in the next animation frame', (done) => {
        const { applyDraftModeCallback } = renderMounter();

        expect(
          DraftMock.updateWindowSelectionAroundDraft,
        ).toHaveBeenCalledTimes(0);
        act(() => {
          applyDraftModeCallback(true);
        });

        window.requestAnimationFrame(() => {
          expect(
            DraftMock.updateWindowSelectionAroundDraft,
          ).toHaveBeenCalledTimes(1);
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
          applyDraftModeCallback(false);
        });

        window.requestAnimationFrame(() => {
          expect(removeAllRangesMock).toHaveBeenCalledTimes(1);
          onSelectionMock.mockRestore();

          done();
        });
      });
    });

    describe('and when the document position changes', () => {
      it('should create the annotation in the previous draft position', () => {
        const fakeDocumentPosition = { from: 0, to: 10 };
        const { onCreateCallback, applyDraftModeCallback } = renderMounter(
          fakeDocumentPosition,
        );

        act(() => {
          applyDraftModeCallback();
        });

        const nextDocumentPosition = { from: 30, to: 45 };
        renderMounter(nextDocumentPosition);

        onCreateCallback('annotationId');

        const fakeAnnotation = {
          annotationId: 'annotationId',
          annotationType: AnnotationTypes.INLINE_COMMENT,
        };
        expect(fakeApplyAnnotation).toHaveBeenCalledWith(
          fakeDocumentPosition,
          fakeAnnotation,
        );
      });
    });

    it('sends annotation opened analytics event', () => {
      const { applyDraftModeCallback } = renderMounter();
      act(() => {
        applyDraftModeCallback(true);
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
      const { applyDraftModeCallback } = renderMounter(undefined, false);
      act(() => {
        applyDraftModeCallback(true);
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
        const { onCreateCallback } = renderMounter(fakeDocumentPosition);

        const fakeAnnotation = {
          annotationId: 'annotationId',
          annotationType: AnnotationTypes.INLINE_COMMENT,
        };

        onCreateCallback('annotationId');

        expect(fakeApplyAnnotation).toHaveBeenCalledWith(
          fakeDocumentPosition,
          fakeAnnotation,
        );
      });

      it('sends insert analytics event', () => {
        const fakeDocumentPosition = { from: 0, to: 10 };
        const { onCreateCallback } = renderMounter(fakeDocumentPosition);
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
      onCloseCallback = renderMounter(fakeDocumentPosition).onCloseCallback;

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
});
