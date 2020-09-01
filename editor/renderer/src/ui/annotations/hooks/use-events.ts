import { useLayoutEffect, useState } from 'react';
import {
  AnnotationUpdateEvent,
  AnnotationUpdateEventPayloads,
  AnnotationUpdateEmitter,
} from '@atlaskit/editor-common';
import {
  AnnotationMarkStates,
  AnnotationId,
  AnnotationTypes,
} from '@atlaskit/adf-schema';

type ListenEventProps = {
  id: AnnotationId;
  updateSubscriber: AnnotationUpdateEmitter | null;
};

type UseAnnotationUpdateSatteByEventProps = {
  type: AnnotationTypes;
  updateSubscriber: AnnotationUpdateEmitter | null;
};
export const useAnnotationStateByTypeEvent = ({
  type,
  updateSubscriber,
}: UseAnnotationUpdateSatteByEventProps) => {
  const [states, setStates] = useState<
    Record<AnnotationId, AnnotationMarkStates | null>
  >({});

  useLayoutEffect(() => {
    if (!updateSubscriber) {
      return;
    }

    const cb = (
      payload?: AnnotationUpdateEventPayloads[AnnotationUpdateEvent.SET_ANNOTATION_STATE],
    ) => {
      if (!payload) {
        return;
      }
      const nextStates = Object.values(payload).reduce((acc, curr) => {
        if (curr.annotationType === type) {
          return {
            ...acc,
            [curr.id]: curr.state,
          };
        }

        return acc;
      }, {} as Record<AnnotationId, AnnotationMarkStates | null>);

      setStates({
        ...states,
        ...nextStates,
      });
    };

    updateSubscriber.on(AnnotationUpdateEvent.SET_ANNOTATION_STATE, cb);

    return () => {
      updateSubscriber.off(AnnotationUpdateEvent.SET_ANNOTATION_STATE, cb);
    };
  }, [states, type, updateSubscriber]);

  return states;
};

export const useHasFocusEvent = ({
  id,
  updateSubscriber,
}: ListenEventProps) => {
  const [hasFocus, setHasFocus] = useState<boolean>(false);

  useLayoutEffect(() => {
    if (!updateSubscriber) {
      return;
    }

    const cb = (
      payload: AnnotationUpdateEventPayloads[AnnotationUpdateEvent.SET_ANNOTATION_FOCUS],
    ) => {
      setHasFocus(payload && payload.annotationId === id);
    };

    const removeFocus = () => {
      setHasFocus(false);
    };

    updateSubscriber.on(AnnotationUpdateEvent.SET_ANNOTATION_FOCUS, cb);
    updateSubscriber.on(
      AnnotationUpdateEvent.REMOVE_ANNOTATION_FOCUS,
      removeFocus,
    );

    return () => {
      updateSubscriber.off(AnnotationUpdateEvent.SET_ANNOTATION_FOCUS, cb);
      updateSubscriber.off(
        AnnotationUpdateEvent.REMOVE_ANNOTATION_FOCUS,
        removeFocus,
      );
    };
  }, [id, updateSubscriber]);

  return hasFocus;
};

type AnnotationInfo = {
  id: AnnotationId;
  type: AnnotationTypes.INLINE_COMMENT;
};

export const useAnnotationClickEvent = (
  props: Pick<ListenEventProps, 'updateSubscriber'>,
) => {
  const [annotations, setAnnotations] = useState<AnnotationInfo[] | null>(null);
  const { updateSubscriber } = props;

  useLayoutEffect(() => {
    if (!updateSubscriber) {
      return;
    }

    const cb = (payload: Array<AnnotationId>) => {
      const annotationsByType = payload.map(id => ({
        id,
        type: AnnotationTypes.INLINE_COMMENT,
      }));

      setAnnotations(annotationsByType);
    };

    updateSubscriber.on(AnnotationUpdateEvent.ON_ANNOTATION_CLICK, cb);

    return () => {
      updateSubscriber.off(AnnotationUpdateEvent.ON_ANNOTATION_CLICK, cb);
    };
  }, [updateSubscriber]);

  return annotations;
};
