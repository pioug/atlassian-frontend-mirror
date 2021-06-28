import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import {
  AnnotationState,
  AnnotationUpdateEmitter,
  AnnotationUpdateEvent,
} from '@atlaskit/editor-common';
import { AnnotationTypes, AnnotationMarkStates } from '@atlaskit/adf-schema';
import {
  useAnnotationStateByTypeEvent,
  useHasFocusEvent,
  useAnnotationClickEvent,
} from '../../use-events';

let container: HTMLElement | null;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container!);
  container = null;
});

function createFakeAnnotationState(
  id: string,
): AnnotationState<AnnotationTypes.INLINE_COMMENT> {
  return {
    id,
    annotationType: AnnotationTypes.INLINE_COMMENT,
    state: AnnotationMarkStates.ACTIVE,
  };
}

function createFakeAnnotationStateWithOtherType(
  id: string,
): AnnotationState<number> {
  return {
    id,
    annotationType: -1,
    state: AnnotationMarkStates.ACTIVE,
  };
}

describe('Annotations: Hooks/useEvents', () => {
  const fakeId = 'fakeId';
  let updateSubscriberFake: AnnotationUpdateEmitter;

  beforeEach(() => {
    jest.spyOn(AnnotationUpdateEmitter.prototype, 'off');
    jest.spyOn(AnnotationUpdateEmitter.prototype, 'on');
    updateSubscriberFake = new AnnotationUpdateEmitter();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#useHasFocusEvent', () => {
    let CustomComp: React.FC;
    let fakeFunction: jest.Mock;

    beforeEach(() => {
      fakeFunction = jest.fn();
      CustomComp = () => {
        const hasFocus = useHasFocusEvent({
          id: fakeId,
          updateSubscriber: updateSubscriberFake,
        });

        fakeFunction(hasFocus);

        return null;
      };
    });

    it('should listen for the focus events', () => {
      expect(updateSubscriberFake.on).toHaveBeenCalledTimes(0);

      render(<CustomComp />, container);

      expect(updateSubscriberFake.on).toHaveBeenCalledWith(
        AnnotationUpdateEvent.SET_ANNOTATION_FOCUS,
        expect.any(Function),
      );
      expect(updateSubscriberFake.on).toHaveBeenCalledWith(
        AnnotationUpdateEvent.REMOVE_ANNOTATION_FOCUS,
        expect.any(Function),
      );
    });

    describe('when the component is unmounted', () => {
      it('should stop listen for the focus events', () => {
        expect(updateSubscriberFake.off).toHaveBeenCalledTimes(0);

        render(<CustomComp />, container);

        act(() => {
          unmountComponentAtNode(container!);
        });

        expect(updateSubscriberFake.off).toHaveBeenCalledWith(
          AnnotationUpdateEvent.SET_ANNOTATION_FOCUS,
          expect.any(Function),
        );
        expect(updateSubscriberFake.off).toHaveBeenCalledWith(
          AnnotationUpdateEvent.REMOVE_ANNOTATION_FOCUS,
          expect.any(Function),
        );
      });
    });

    describe('when REMOVE_ANNOTATION_FOCUS is emitted', () => {
      it('should set hasFocus to false', () => {
        expect(fakeFunction).toHaveBeenCalledTimes(0);

        render(<CustomComp />, container);

        expect(fakeFunction).toHaveBeenCalledTimes(1);
        expect(fakeFunction).toHaveBeenCalledWith(false);

        act(() => {
          updateSubscriberFake.emit(
            AnnotationUpdateEvent.SET_ANNOTATION_FOCUS,
            { annotationId: fakeId },
          );
        });

        expect(fakeFunction).toHaveBeenCalledTimes(2);
        expect(fakeFunction).toHaveBeenCalledWith(true);

        act(() => {
          updateSubscriberFake.emit(
            AnnotationUpdateEvent.REMOVE_ANNOTATION_FOCUS,
          );
        });

        expect(fakeFunction).toHaveBeenCalledTimes(3);
        expect(fakeFunction).toHaveBeenCalledWith(false);
      });
    });

    describe('when SET_ANNOTATION_FOCUS is emitted', () => {
      it('should not set hasFocus when the id is different', () => {
        expect(fakeFunction).toHaveBeenCalledTimes(0);

        render(<CustomComp />, container);

        expect(fakeFunction).toHaveBeenCalledWith(false);

        const otherId = 'otherId';
        act(() => {
          updateSubscriberFake.emit(
            AnnotationUpdateEvent.SET_ANNOTATION_FOCUS,
            { annotationId: otherId },
          );
        });

        expect(fakeFunction).toHaveBeenCalledWith(false);
      });

      it('should set hasFocus for the id emitted', () => {
        expect(fakeFunction).toHaveBeenCalledTimes(0);

        render(<CustomComp />, container);

        expect(fakeFunction).toHaveBeenCalledWith(false);

        act(() => {
          updateSubscriberFake.emit(
            AnnotationUpdateEvent.SET_ANNOTATION_FOCUS,
            { annotationId: fakeId },
          );
        });

        expect(fakeFunction).toHaveBeenCalledWith(true);
      });
    });
  });

  describe('#useAnnotationStateByTypeEvent', () => {
    let CustomComp: React.FC;
    let fakeFunction: jest.Mock;

    beforeEach(() => {
      fakeFunction = jest.fn();
      CustomComp = () => {
        const states = useAnnotationStateByTypeEvent({
          type: AnnotationTypes.INLINE_COMMENT,
          updateSubscriber: updateSubscriberFake,
        });
        fakeFunction(states);
        return null;
      };
    });

    it('should listen for SET_ANNOTATION_STATE', () => {
      expect(updateSubscriberFake.on).toHaveBeenCalledTimes(0);

      render(<CustomComp />, container);

      expect(updateSubscriberFake.on).toHaveBeenCalledWith(
        AnnotationUpdateEvent.SET_ANNOTATION_STATE,
        expect.any(Function),
      );
    });

    describe('when the component is unmounted', () => {
      it('should stop listen for SET_ANNOTATION_STATE', () => {
        expect(updateSubscriberFake.off).toHaveBeenCalledTimes(0);

        render(<CustomComp />, container);

        act(() => {
          unmountComponentAtNode(container!);
        });

        expect(updateSubscriberFake.off).toHaveBeenCalledWith(
          AnnotationUpdateEvent.SET_ANNOTATION_STATE,
          expect.any(Function),
        );
      });
    });

    describe('when SET_ANNOTATION_STATE is emitted', () => {
      it('should not set the state when the type is different', () => {
        expect(fakeFunction).toHaveBeenCalledTimes(0);

        render(<CustomComp />, container);

        expect(fakeFunction).toHaveBeenCalledWith({});

        const otherId = 'otherId';
        const payload = {
          [otherId]: createFakeAnnotationStateWithOtherType(otherId),
        };
        act(() => {
          updateSubscriberFake.emit(
            AnnotationUpdateEvent.SET_ANNOTATION_STATE,
            // @ts-ignore
            payload,
          );
        });

        expect(fakeFunction).toHaveBeenCalledWith({});
      });

      it('should set the state for the id emitted', () => {
        expect(fakeFunction).toHaveBeenCalledTimes(0);

        render(<CustomComp />, container);

        expect(fakeFunction).toHaveBeenCalledWith({});

        const payload = {
          [fakeId]: createFakeAnnotationState(fakeId),
        };
        act(() => {
          updateSubscriberFake.emit(
            AnnotationUpdateEvent.SET_ANNOTATION_STATE,
            payload,
          );
        });

        expect(fakeFunction).toHaveBeenCalledWith({
          [fakeId]: AnnotationMarkStates.ACTIVE,
        });
      });
    });
  });

  describe('#useAnnotationClickEvent', () => {
    let CustomComp: React.FC;
    let fakeFunction: jest.Mock;
    beforeEach(() => {
      fakeFunction = jest.fn();

      CustomComp = () => {
        const annotations = useAnnotationClickEvent({
          updateSubscriber: updateSubscriberFake,
        });

        fakeFunction(annotations);
        return null;
      };
    });

    it('should listen for ON_ANNOTATION_CLICK', () => {
      expect(updateSubscriberFake.on).toHaveBeenCalledTimes(0);

      render(<CustomComp />, container);

      expect(updateSubscriberFake.on).toHaveBeenCalledWith(
        AnnotationUpdateEvent.ON_ANNOTATION_CLICK,
        expect.any(Function),
      );
    });

    describe('when the component is unmounted', () => {
      it('should stop listen for ON_ANNOTATION_CLICK', () => {
        expect(updateSubscriberFake.off).toHaveBeenCalledTimes(0);

        render(<CustomComp />, container);

        act(() => {
          unmountComponentAtNode(container!);
        });

        expect(updateSubscriberFake.off).toHaveBeenCalledWith(
          AnnotationUpdateEvent.ON_ANNOTATION_CLICK,
          expect.any(Function),
        );
      });
    });

    describe('when ON_ANNOTATION_CLICK is emitted', () => {
      it('should set annotations', () => {
        const annotationIds = ['lol1', 'lol2'];
        expect(fakeFunction).toHaveBeenCalledTimes(0);

        render(<CustomComp />, container);

        expect(fakeFunction).toHaveBeenCalledWith(null);

        act(() => {
          updateSubscriberFake.emit(AnnotationUpdateEvent.ON_ANNOTATION_CLICK, {
            annotationIds,
            eventTarget: container!, // The container is created before each test and destroyed after
          });
        });

        const expected = {
          annotations: annotationIds.map((id) => ({
            id,
            type: AnnotationTypes.INLINE_COMMENT,
          })),
          clickElementTarget: container!,
        };

        expect(fakeFunction).toHaveBeenCalledWith(expected);
      });
    });
  });
});
