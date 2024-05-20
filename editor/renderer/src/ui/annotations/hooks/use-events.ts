import { useLayoutEffect, useState } from 'react';
import { AnnotationUpdateEvent } from '@atlaskit/editor-common/types';

import type {
  AnnotationUpdateEventPayloads,
  InlineCommentViewComponentProps,
  OnAnnotationClickPayload,
  AnnotationUpdateEmitter,
} from '@atlaskit/editor-common/types';

import type { AnnotationMarkStates, AnnotationId } from '@atlaskit/adf-schema';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
} from '@atlaskit/editor-common/analytics';
import { FabricChannel } from '@atlaskit/analytics-listeners';

type ListenEventProps = {
  id: AnnotationId;
  updateSubscriber: AnnotationUpdateEmitter | null;
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
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
      const nextStates = Object.values(payload).reduce(
        (acc, curr) => {
          if (curr.id && curr.annotationType === type) {
            // Check for empty state to prevent additional renders
            const isEmpty = curr.state === null || curr.state === undefined;

            return {
              ...acc,
              [curr.id]: !isEmpty ? curr.state : states[curr.id],
            };
          }

          return acc;
        },
        {} as Record<AnnotationId, AnnotationMarkStates | null>,
      );

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

type AnnotationsWithClickTarget = Pick<
  InlineCommentViewComponentProps,
  'annotations' | 'clickElementTarget'
> | null;

export const useAnnotationClickEvent = (
  props: Pick<ListenEventProps, 'updateSubscriber' | 'createAnalyticsEvent'> & {
    isCommentsOnMediaAnalyticsEnabled?: boolean;
  },
): AnnotationsWithClickTarget => {
  const [annotationClickEvent, setAnnotationClickEvent] =
    useState<AnnotationsWithClickTarget>(null);
  const {
    updateSubscriber,
    createAnalyticsEvent,
    isCommentsOnMediaAnalyticsEnabled,
  } = props;

  useLayoutEffect(() => {
    if (!updateSubscriber) {
      return;
    }

    const clickCb = ({
      annotationIds,
      eventTarget,
      eventTargetType,
      viewMethod,
    }: OnAnnotationClickPayload) => {
      const annotationsByType = annotationIds
        .filter((id) => !!id)
        .map((id) => ({
          id,
          type: AnnotationTypes.INLINE_COMMENT,
        }));

      if (createAnalyticsEvent) {
        createAnalyticsEvent({
          action: ACTION.VIEWED,
          actionSubject: ACTION_SUBJECT.ANNOTATION,
          actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
          eventType: EVENT_TYPE.TRACK,
          attributes: {
            overlap: annotationsByType.length || 0,
            ...(isCommentsOnMediaAnalyticsEnabled && {
              targetNodeType: eventTargetType,
              method: viewMethod,
            }),
          },
        }).fire(FabricChannel.editor);
      }

      setAnnotationClickEvent({
        annotations: annotationsByType,
        clickElementTarget: eventTarget,
      });
    };

    const deselectCb = () => {
      setAnnotationClickEvent({
        annotations: [],
        clickElementTarget: undefined,
      });
    };

    updateSubscriber.on(AnnotationUpdateEvent.ON_ANNOTATION_CLICK, clickCb);
    updateSubscriber.on(AnnotationUpdateEvent.DESELECT_ANNOTATIONS, deselectCb);

    return () => {
      updateSubscriber.off(AnnotationUpdateEvent.ON_ANNOTATION_CLICK, clickCb);
      updateSubscriber.off(
        AnnotationUpdateEvent.DESELECT_ANNOTATIONS,
        deselectCb,
      );
    };
  }, [
    updateSubscriber,
    createAnalyticsEvent,
    isCommentsOnMediaAnalyticsEnabled,
  ]);

  return annotationClickEvent;
};
