import React from 'react';
import { AnnotationMarkStates, AnnotationTypes } from '@atlaskit/adf-schema';
import Annotation, {
  AnnotationContext,
  AnnotationsProvider,
} from '../../annotation';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

let container: HTMLElement;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
});

describe('Renderer - React/Marks/Annottation', () => {
  it('should render the annotation state', async () => {
    const annotationStatePromise = Promise.resolve(AnnotationMarkStates.ACTIVE);
    act(() => {
      render(
        <Annotation
          dataAttributes={{
            'data-renderer-mark': true,
          }}
          id="random-id"
          annotationType={AnnotationTypes.INLINE_COMMENT}
          getAnnotationState={() => annotationStatePromise}
        >
          <small>some</small>
        </Annotation>,
        container,
      );
    });

    let spanWrapper = container.querySelector('span');
    expect(spanWrapper).not.toBeNull();
    expect(Object.assign({}, spanWrapper!.dataset)).toEqual({
      id: 'random-id',
      markAnnotationType: 'inlineComment',
      markType: 'annotation',
      rendererMark: 'true',
    });

    await annotationStatePromise;

    spanWrapper = container.querySelector('mark');
    expect(Object.assign({}, spanWrapper!.dataset)).toEqual({
      id: 'random-id',
      markAnnotationType: 'inlineComment',
      markAnnotationState: 'active',
      markType: 'annotation',
      rendererMark: 'true',
    });
  });

  describe('without auto highlight', () => {
    const onAnnotationClick = jest.fn();
    let annotation: HTMLElement;
    beforeEach(async () => {
      onAnnotationClick.mockClear();
      const annotationStatePromise = Promise.resolve(
        AnnotationMarkStates.ACTIVE,
      );
      act(() => {
        render(
          <AnnotationsProvider
            onAnnotationClick={onAnnotationClick}
            enableAutoHighlight={false}
          >
            <Annotation
              dataAttributes={{
                'data-renderer-mark': true,
              }}
              id="random-id"
              annotationType={AnnotationTypes.INLINE_COMMENT}
              getAnnotationState={() => annotationStatePromise}
            >
              <small>second test</small>
            </Annotation>
          </AnnotationsProvider>,
          container,
        );
      });

      await annotationStatePromise;

      annotation = document.querySelector(
        `[data-id="random-id"]`,
      ) as HTMLElement;
    });

    describe('when the click event happens', () => {
      it('should call the onClick function', () => {
        annotation.click();

        expect(onAnnotationClick).toHaveBeenCalledWith(['random-id']);
      });
    });

    describe('when the native focus happens', () => {
      it('should not call the onClick function', () => {
        annotation.focus();

        expect(onAnnotationClick).not.toHaveBeenCalledWith(['random-id']);
      });
    });

    describe('when the native blur happens', () => {
      it('should not call the onClick', () => {
        annotation.focus();
        annotation.blur();

        expect(onAnnotationClick).not.toHaveBeenCalled();
      });
    });
  });

  describe('with auto highlight', () => {
    const onAnnotationClick = jest.fn();
    let annotation: HTMLElement;
    const annotationStatePromise = Promise.resolve(AnnotationMarkStates.ACTIVE);

    beforeEach(async () => {
      onAnnotationClick.mockClear();
      act(() => {
        render(
          <AnnotationContext.Provider
            value={{
              onAnnotationClick,
              enableAutoHighlight: true,
            }}
          >
            <Annotation
              dataAttributes={{
                'data-renderer-mark': true,
              }}
              id="random-id"
              annotationType={AnnotationTypes.INLINE_COMMENT}
              getAnnotationState={() => annotationStatePromise}
            >
              <small>second test</small>
            </Annotation>
          </AnnotationContext.Provider>,
          container,
        );
      });

      await annotationStatePromise;

      annotation = document.querySelector(
        `[data-id="random-id"]`,
      ) as HTMLElement;
    });

    describe('when the click event happens', () => {
      it('should call the onClick function', () => {
        annotation.click();

        expect(onAnnotationClick).toHaveBeenCalledWith(['random-id']);
      });
    });

    describe('when the native focus happens', () => {
      it('should call the onClick function', () => {
        annotation.focus();

        expect(annotation).toBeDefined();
        expect(onAnnotationClick).toHaveBeenCalledWith(['random-id']);
      });
    });

    describe('when the native blur happens', () => {
      it('should call the onClick function without args', () => {
        annotation.focus();
        annotation.blur();

        expect(annotation).toBeDefined();
        expect(onAnnotationClick).toHaveBeenCalledWith();
      });
    });
  });
});
