import React from 'react';
import { AnnotationMarkStates, AnnotationTypes } from '@atlaskit/adf-schema';
import Annotation from '../../annotation';
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

    const spanWrapper = container.querySelector('span');
    expect(spanWrapper).not.toBeNull();
    expect(Object.assign({}, spanWrapper!.dataset)).toEqual({
      id: 'random-id',
      markAnnotationType: 'inlineComment',
      markType: 'annotation',
      rendererMark: 'true',
    });

    await annotationStatePromise;
    expect(Object.assign({}, spanWrapper!.dataset)).toEqual({
      id: 'random-id',
      markAnnotationType: 'inlineComment',
      markAnnotationState: 'active',
      markType: 'annotation',
      rendererMark: 'true',
    });
  });
});
