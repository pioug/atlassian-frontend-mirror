import React from 'react';

import {
  AnnotationUpdateEmitter,
  AnnotationUpdateEvent,
} from '@atlaskit/editor-common';
import { AnnotationMarkStates, AnnotationTypes } from '@atlaskit/adf-schema';
import Annotation, { AnnotationContext } from '../../annotation';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

jest.useFakeTimers();
let container: HTMLElement;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  act(() => {
    unmountComponentAtNode(container);
  });
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
          <AnnotationContext.Provider
            value={{
              onAnnotationClick,
              enableAutoHighlight: false,
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

  describe('with updateSubscriber', () => {
    const updateSubscriber = new AnnotationUpdateEmitter();
    const annotationId = 'random-id';
    const annotationStatePromise = Promise.resolve(AnnotationMarkStates.ACTIVE);

    beforeEach(async () => {
      act(() => {
        render(
          <AnnotationContext.Provider
            value={{
              onAnnotationClick: jest.fn(),
              updateSubscriber,
              enableAutoHighlight: false,
            }}
          >
            <Annotation
              dataAttributes={{
                'data-renderer-mark': true,
              }}
              id={annotationId}
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

      act(() => {
        jest.runAllTimers();
      });
    });

    it('should add a SET_ANNOTATION_FOCUS listener in the emitter', () => {
      expect(
        updateSubscriber.listeners(AnnotationUpdateEvent.SET_ANNOTATION_FOCUS),
      ).toHaveLength(1);
    });

    it('should add a SET_ANNOTATION_STATE listener in the emitter', () => {
      expect(
        updateSubscriber.listeners(AnnotationUpdateEvent.SET_ANNOTATION_STATE),
      ).toHaveLength(1);
    });

    it('should set data attritube hasFocus to true', () => {
      const payload = {
        annotationId,
      };
      act(() => {
        updateSubscriber.emit(
          AnnotationUpdateEvent.SET_ANNOTATION_FOCUS,
          payload,
        );
        jest.runAllTimers();
      });

      const annotation = container.querySelector(
        `[data-id="${annotationId}"]`,
      ) as HTMLElement;
      const dataSet = Object.assign({}, annotation!.dataset);
      expect(dataSet.hasFocus).toBe('true');
    });

    describe('when a SET_ANNOTATION_FOCUS happens twice', () => {
      it('should remove the focus from the previous annotation', async () => {
        const secondAnnotationId = 'secondAnnotationId';

        act(() => {
          render(
            <AnnotationContext.Provider
              value={{
                onAnnotationClick: jest.fn(),
                updateSubscriber,
                enableAutoHighlight: false,
              }}
            >
              <Annotation
                dataAttributes={{
                  'data-renderer-mark': true,
                }}
                id={secondAnnotationId}
                annotationType={AnnotationTypes.INLINE_COMMENT}
                getAnnotationState={() => annotationStatePromise}
              >
                <small>first text test</small>
              </Annotation>
              <Annotation
                dataAttributes={{
                  'data-renderer-mark': true,
                }}
                id={annotationId}
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

        act(() => {
          jest.runAllTimers();
        });

        act(() => {
          updateSubscriber.emit(AnnotationUpdateEvent.SET_ANNOTATION_FOCUS, {
            annotationId,
          });
          jest.runAllTimers();
        });

        let annotation = container.querySelector(
          `[data-id="${annotationId}"]`,
        ) as HTMLElement;
        expect(annotation!.dataset.hasFocus).toBe('true');

        act(() => {
          updateSubscriber.emit(AnnotationUpdateEvent.SET_ANNOTATION_FOCUS, {
            annotationId: secondAnnotationId,
          });
          jest.runAllTimers();
        });

        annotation = container.querySelector(
          `[data-id="${annotationId}"]`,
        ) as HTMLElement;
        expect(annotation!.dataset.hasFocus).toBe('false');

        annotation = container.querySelector(
          `[data-id="${secondAnnotationId}"]`,
        ) as HTMLElement;
        expect(annotation!.dataset.hasFocus).toBe('true');
      });
    });

    describe('when SET_ANNOTATION_STATE is dispatched', () => {
      it('should set the state based on the payload', () => {
        const payload = {
          [annotationId]: AnnotationMarkStates.RESOLVED,
        };

        act(() => {
          updateSubscriber.emit(
            AnnotationUpdateEvent.SET_ANNOTATION_STATE,
            payload,
          );
          jest.runAllTimers();
        });

        const annotation = container.querySelector(
          `[data-id="${annotationId}"]`,
        ) as HTMLElement;
        const dataSet = Object.assign({}, annotation!.dataset);
        expect(dataSet.markAnnotationState).toBe('resolved');
      });
    });

    describe('when REMOVE_ANNOTATION_FOCUS is dispatched', () => {
      it('should set data attritube hasFocus to false', () => {
        act(() => {
          updateSubscriber.emit(AnnotationUpdateEvent.REMOVE_ANNOTATION_FOCUS);
          jest.runAllTimers();
        });

        const annotation = container.querySelector(
          `[data-id="${annotationId}"]`,
        ) as HTMLElement;
        const dataSet = Object.assign({}, annotation!.dataset);
        expect(dataSet.hasFocus).toBe('false');
      });
    });

    describe('when the component is unmounted', () => {
      it('should remove the listener SET_ANNOTATION_FOCUS', () => {
        expect(
          updateSubscriber.listeners(
            AnnotationUpdateEvent.SET_ANNOTATION_FOCUS,
          ),
        ).toHaveLength(1);

        unmountComponentAtNode(container);
        expect(
          updateSubscriber.listeners(
            AnnotationUpdateEvent.SET_ANNOTATION_FOCUS,
          ),
        ).toHaveLength(0);
      });

      it('should remove the listener REMOVE_ANNOTATION_FOCUS', () => {
        expect(
          updateSubscriber.listeners(
            AnnotationUpdateEvent.REMOVE_ANNOTATION_FOCUS,
          ),
        ).toHaveLength(1);

        unmountComponentAtNode(container);
        expect(
          updateSubscriber.listeners(
            AnnotationUpdateEvent.REMOVE_ANNOTATION_FOCUS,
          ),
        ).toHaveLength(0);
      });
    });
  });
});
