import React from 'react';
import { render } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Position } from '../../types';
import {
  AnnotationsDraftContextWrapper,
  AnnotationsDraftContext,
} from '../../context';

let container: HTMLElement | null;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container!);
  container = null;
});

type ChildrenProps = {
  applyAnnotationDraftAt: (position: Position) => void;
  clearAnnotationDraft: () => void;
};
describe('Annotations: AnnotationsDraftContextWrapper', () => {
  let applyAnnotationDraftAt: Function;
  let clearAnnotationDraft: Function;
  const mockComponent = jest.fn();
  beforeEach(() => {
    const MyFakeComponent: React.FC<ChildrenProps> = (props) => {
      applyAnnotationDraftAt = props.applyAnnotationDraftAt;
      clearAnnotationDraft = props.clearAnnotationDraft;
      return (
        <AnnotationsDraftContext.Consumer>
          {mockComponent}
        </AnnotationsDraftContext.Consumer>
      );
    };

    render(
      <>
        <AnnotationsDraftContextWrapper>
          {MyFakeComponent}
        </AnnotationsDraftContextWrapper>
      </>,
      container,
    );

    mockComponent.mockReset();
  });

  describe('when the applyAnnotationDraftAt is called', () => {
    it('should set replace the current position', () => {
      const position = { from: 1, to: 10 };
      act(() => {
        applyAnnotationDraftAt!(position);
      });

      expect(mockComponent).toHaveBeenCalledTimes(1);
      expect(mockComponent).toHaveBeenNthCalledWith(1, position);
    });
  });

  describe('when the clearAnnotationDraft is called', () => {
    it('should set the position as null', () => {
      act(() => {
        const position = { from: 1, to: 10 };
        applyAnnotationDraftAt!(position);
      });

      mockComponent.mockReset();

      act(() => {
        clearAnnotationDraft!();
      });

      expect(mockComponent).toHaveBeenCalledWith(null);
    });
  });
});
