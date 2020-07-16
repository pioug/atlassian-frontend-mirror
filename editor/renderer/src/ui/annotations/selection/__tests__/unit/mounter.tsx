import React from 'react';
import { render } from 'react-dom';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import { InlineCommentSelectionComponentProps } from '@atlaskit/editor-common';
import { SelectionInlineCommentMounter } from '../../mounter';
import { Position } from '../../../types';
import { ApplyAnnotation } from '../../../../../actions/index';

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
  let onCloseMock: jest.Mock;
  const fakeApplyAnotation: ApplyAnnotation = jest.fn();
  const fakeApplyAnnotationDraftAt = (position: Position) => {};
  const fakeClearAnnotationDraft = jest.fn();
  const fakePositon = { from: 0, to: 10 };
  const wrapperDOM = { current: container } as React.RefObject<HTMLDivElement>;
  const DummyComponent = () => {
    return <span data-dummy>dummy</span>;
  };

  beforeEach(() => {
    onCloseMock = jest.fn();
  });

  describe('on mounting', () => {
    beforeEach(() => {
      render(
        <SelectionInlineCommentMounter
          range={document.createRange()}
          wrapperDOM={wrapperDOM}
          onClose={onCloseMock}
          component={DummyComponent}
          documentPosition={false}
          isAnnotationAllowed={false}
          applyAnnotation={fakeApplyAnotation}
          applyAnnotationDraftAt={fakeApplyAnnotationDraftAt}
          clearAnnotationDraft={fakeClearAnnotationDraft}
        />,

        container,
      );
    });

    it('should render the prop component', () => {
      expect(container!.querySelector('[data-dummy]')).not.toBeNull();
    });
  });

  describe('onCreate', () => {
    describe('when the position is valid', () => {
      it('should call applyAnnotation method', () => {
        let onCreateCallback: Function = () => {};
        const DummyComponent = (
          props: InlineCommentSelectionComponentProps,
        ) => {
          onCreateCallback = props.onCreate;
          return <span data-dummy>dummy</span>;
        };
        const fakeDocumentPosition = { from: 0, to: 10 };

        render(
          <SelectionInlineCommentMounter
            range={document.createRange()}
            wrapperDOM={wrapperDOM}
            onClose={onCloseMock}
            component={DummyComponent}
            documentPosition={fakeDocumentPosition}
            isAnnotationAllowed={true}
            applyAnnotation={fakeApplyAnotation}
            applyAnnotationDraftAt={fakeApplyAnnotationDraftAt}
            clearAnnotationDraft={fakeClearAnnotationDraft}
          />,
          container,
        );

        const fakeAnnotation = {
          annotationId: 'annotationId',
          annotationType: AnnotationTypes.INLINE_COMMENT,
        };

        onCreateCallback('annotationId');

        expect(fakeApplyAnotation).toHaveBeenCalledWith(
          fakePositon,
          fakeAnnotation,
        );
      });
    });
  });
});
