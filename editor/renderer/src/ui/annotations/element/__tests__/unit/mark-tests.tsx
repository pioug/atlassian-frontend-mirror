import React from 'react';

import { AnnotationMarkStates, AnnotationTypes } from '@atlaskit/adf-schema';
import { render, unmountComponentAtNode } from 'react-dom';
import { MarkComponent } from '../../mark';
import { fireEvent } from '@testing-library/react';

let container: HTMLElement;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
});

describe('Annotations/Mark', () => {
  const fakeId = 'fakeId';
  const annotationParentIds = ['lol_1'];
  const fakeDataAttributes = {
    'data-renderer-mark': true,
    'data-mark-type': 'annotation',
    'data-mark-annotation-type': AnnotationTypes.INLINE_COMMENT,
    'data-id': fakeId,
  };
  let onClick: jest.Mock;

  beforeEach(() => {
    onClick = jest.fn();
  });

  describe('when state is active', () => {
    const state = AnnotationMarkStates.ACTIVE;

    beforeEach(() => {
      render(
        <MarkComponent
          id={fakeId}
          annotationParentIds={annotationParentIds}
          dataAttributes={fakeDataAttributes}
          state={state}
          hasFocus={false}
          onClick={onClick}
        >
          <small>some</small>
        </MarkComponent>,
        container,
      );
    });

    it('should render the data attributes', async () => {
      const markWrapper = container.querySelector('mark');
      expect(markWrapper).not.toBeNull();
      expect(Object.assign({}, markWrapper!.dataset)).toEqual({
        id: fakeId,
        markAnnotationType: 'inlineComment',
        markAnnotationState: 'active',
        markType: 'annotation',
        rendererMark: 'true',
        hasFocus: 'false',
      });
    });

    it('should render the aria-details with parent ids and the mark id', async () => {
      const markWrapper = container.querySelector('mark');
      expect(markWrapper).not.toBeNull();
      expect(markWrapper!.getAttribute('aria-details')).toEqual(
        'lol_1, fakeId',
      );
    });

    it('should not render the aria-disabled', async () => {
      const markWrapper = container.querySelector('mark');
      expect(markWrapper!.getAttribute('aria-disabled')).toBeNull();
    });

    it('should prevent default when clicked', async () => {
      const markWrapper = container.querySelector('mark');
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      Object.assign(clickEvent, { preventDefault: jest.fn() });
      fireEvent(markWrapper!, clickEvent);
      expect(clickEvent.preventDefault).toHaveBeenCalledTimes(1);
    });

    it('should call onClick prop when clicked', async () => {
      const markWrapper = container.querySelector('mark');
      markWrapper!.click();
      expect(onClick).toHaveBeenCalledWith(
        expect.objectContaining({
          annotationIds: [...annotationParentIds, fakeId],
        }),
      );
    });
  });

  describe('when 2 marks overlaps in active state', () => {
    const state = AnnotationMarkStates.ACTIVE;
    const childFakeId = 'childFakeId';
    const childAnnotationParentIds = [fakeId];
    const childFakeDataAttributes = {
      'data-renderer-mark': true,
      'data-mark-type': 'annotation',
      'data-mark-annotation-type': AnnotationTypes.INLINE_COMMENT,
      'data-id': childFakeId,
    };

    beforeEach(() => {
      render(
        <MarkComponent
          id={fakeId}
          annotationParentIds={annotationParentIds}
          dataAttributes={fakeDataAttributes}
          state={state}
          hasFocus={false}
          onClick={onClick}
        >
          <MarkComponent
            id={childFakeId}
            annotationParentIds={childAnnotationParentIds}
            dataAttributes={childFakeDataAttributes}
            state={state}
            hasFocus={false}
            onClick={onClick}
          >
            <small>some</small>
          </MarkComponent>
        </MarkComponent>,
        container,
      );
    });

    it('should call onClick only once', async () => {
      const markWrapper = container.querySelector('#childFakeId');
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      Object.assign(clickEvent, { preventDefault: jest.fn() });
      fireEvent(markWrapper!, clickEvent);
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('when state is not active', () => {
    const state = AnnotationMarkStates.RESOLVED;

    beforeEach(() => {
      render(
        <MarkComponent
          id={fakeId}
          annotationParentIds={annotationParentIds}
          dataAttributes={fakeDataAttributes}
          state={state}
          hasFocus={false}
          onClick={onClick}
        >
          <small>some</small>
        </MarkComponent>,
        container,
      );
    });

    it('should not call onClick prop when clicked', async () => {
      const markWrapper = container.querySelector('mark');
      markWrapper!.click();
      expect(onClick).not.toHaveBeenCalledWith([
        ...annotationParentIds,
        fakeId,
      ]);
    });

    it('should render the aria-disabled', async () => {
      const markWrapper = container.querySelector('mark');
      expect(markWrapper!.getAttribute('aria-disabled')).toEqual('true');
    });

    it('should not render the aria-details', async () => {
      const markWrapper = container.querySelector('mark');
      expect(markWrapper).not.toBeNull();
      expect(markWrapper!.getAttribute('aria-details')).toBeNull();
    });
  });
});
