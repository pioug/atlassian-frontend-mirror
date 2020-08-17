import React from 'react';
import { render } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import { InlineCommentSelectionComponentProps } from '@atlaskit/editor-common';
import { SelectionInlineCommentMounter } from '../../mounter';
import { Position } from '../../../types';
import { ApplyAnnotation } from '../../../../../actions/index';
import * as DraftMock from '../../../draft';
jest.mock('../../../draft');

let container: HTMLElement | null;
let createRangeMock: jest.SpyInstance;
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
  createRangeMock.mockRestore();
});

describe('Annotations: SelectionInlineCommentMounter', () => {
  const fakeApplyAnotation: jest.Mock = jest.fn();

  const renderMounter = (
    fakeDocumentPosition: Position = { from: 0, to: 10 },
  ) => {
    const wrapperDOM = { current: container } as React.RefObject<
      HTMLDivElement
    >;
    let onCreateCallback: Function = () => {};
    let applyDraftModeCallback: Function = () => {};

    const DummyComponent = (props: InlineCommentSelectionComponentProps) => {
      onCreateCallback = props.onCreate;
      applyDraftModeCallback = props.applyDraftMode;
      return <span data-dummy>dummy</span>;
    };

    render(
      <SelectionInlineCommentMounter
        range={document.createRange()}
        wrapperDOM={wrapperDOM}
        onClose={jest.fn()}
        component={DummyComponent}
        documentPosition={fakeDocumentPosition}
        isAnnotationAllowed={true}
        applyAnnotation={fakeApplyAnotation as ApplyAnnotation}
        applyAnnotationDraftAt={jest.fn()}
        clearAnnotationDraft={jest.fn()}
      />,
      container,
    );

    return [onCreateCallback, applyDraftModeCallback];
  };

  beforeEach(() => {
    fakeApplyAnotation.mockReset();
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
      it('should remove the native selection in the next animation frame', done => {
        const [, applyDraftModeCallback] = renderMounter();

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
      it('should remove the native selection in the next animation frame', done => {
        const onSelectionMock = jest.spyOn(window, 'getSelection');
        const removeAllRangesMock = jest.fn();
        (onSelectionMock as any).mockReturnValue({
          removeAllRanges: removeAllRangesMock,
        });

        const [, applyDraftModeCallback] = renderMounter();

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
        const [onCreateCallback, applyDraftModeCallback] = renderMounter(
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
        expect(fakeApplyAnotation).toHaveBeenCalledWith(
          fakeDocumentPosition,
          fakeAnnotation,
        );
      });
    });
  });

  describe('onCreate', () => {
    describe('when the position is valid', () => {
      it('should call applyAnnotation method', () => {
        const fakeDocumentPosition = { from: 0, to: 10 };
        const [onCreateCallback] = renderMounter(fakeDocumentPosition);

        const fakeAnnotation = {
          annotationId: 'annotationId',
          annotationType: AnnotationTypes.INLINE_COMMENT,
        };

        onCreateCallback('annotationId');

        expect(fakeApplyAnotation).toHaveBeenCalledWith(
          fakeDocumentPosition,
          fakeAnnotation,
        );
      });
    });
  });
});
