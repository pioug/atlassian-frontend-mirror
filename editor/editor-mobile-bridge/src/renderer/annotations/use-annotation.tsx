import { useEffect, useMemo } from 'react';
import {
  AnnotationProviders,
  AnnotationUpdateEmitter,
  AnnotationUpdateEvent,
  AnnotationState,
} from '@atlaskit/editor-common';
import RendererBridgeImplementation from '../native-to-web/implementation';
import { createSelectionComponent } from './create-selection-component';
import { createViewComponent } from './create-view-component';
import { AnnotationStatePayload } from '../types';
import { AnnotationId, AnnotationTypes } from '@atlaskit/adf-schema';
import {
  EmitterEvents,
  eventDispatcher as mobileBridgeEventDispatcher,
} from '../dispatcher';
import { nativeBridgeAPI as webToNativeBridgeAPI } from '../web-to-native/implementation';

const updateEmitter = new AnnotationUpdateEmitter();
const nativeToWebAPI = new RendererBridgeImplementation();
const ViewComponent = createViewComponent(nativeToWebAPI);
const SelectionComponent = createSelectionComponent(nativeToWebAPI);

const setAnnotationStateCallback = (payload?: AnnotationStatePayload[]) => {
  const data = (payload || []).reduce<
    Record<AnnotationId, AnnotationState<AnnotationTypes.INLINE_COMMENT>>
  >((acc, value) => {
    const { annotationId, annotationState } = value;

    return {
      ...acc,
      [value.annotationId]: {
        annotationType: AnnotationTypes.INLINE_COMMENT,
        id: annotationId,
        state: annotationState,
      },
    };
  }, {});

  updateEmitter.emit(AnnotationUpdateEvent.SET_ANNOTATION_STATE, data);
};
const setAnnotationFocusCallback = (payload?: {
  annotationId: AnnotationId;
}) => {
  if (payload) {
    updateEmitter.emit(AnnotationUpdateEvent.SET_ANNOTATION_FOCUS, payload);
  }
};
const removeAnnotationFocusCallback = () => {
  updateEmitter.emit(AnnotationUpdateEvent.REMOVE_ANNOTATION_FOCUS);
};

function useAnnotationBridge(allowAnnotations: boolean) {
  useEffect(() => {
    if (!allowAnnotations) {
      return;
    }

    mobileBridgeEventDispatcher.on(
      EmitterEvents.SET_ANNOTATION_STATE,
      setAnnotationStateCallback,
    );
    mobileBridgeEventDispatcher.on(
      EmitterEvents.SET_ANNOTATION_FOCUS,
      setAnnotationFocusCallback,
    );
    mobileBridgeEventDispatcher.on(
      EmitterEvents.REMOVE_ANNOTATION_FOCUS,
      removeAnnotationFocusCallback,
    );

    return () => {
      if (!allowAnnotations) {
        return;
      }
      mobileBridgeEventDispatcher.off(
        EmitterEvents.SET_ANNOTATION_STATE,
        setAnnotationStateCallback,
      );
      mobileBridgeEventDispatcher.off(
        EmitterEvents.SET_ANNOTATION_FOCUS,
        setAnnotationFocusCallback,
      );
      mobileBridgeEventDispatcher.off(
        EmitterEvents.REMOVE_ANNOTATION_FOCUS,
        removeAnnotationFocusCallback,
      );
    };
  }, [allowAnnotations]);
}

const useAnnotationProvider = (
  allowAnnotation: boolean,
): AnnotationProviders | null => {
  return useMemo<AnnotationProviders | null>(() => {
    if (!allowAnnotation) {
      return null;
    }

    return {
      inlineComment: {
        getState: async (annotationIds: AnnotationId[]) => {
          webToNativeBridgeAPI.fetchAnnotationStates([
            {
              annotationIds,
              annotationType: AnnotationTypes.INLINE_COMMENT,
            },
          ]);

          return annotationIds.map((id) => {
            return {
              id,
              annotationType: AnnotationTypes.INLINE_COMMENT,
              state: null,
            };
          });
        },
        updateSubscriber: updateEmitter,
        allowDraftMode: true,
        selectionComponent: SelectionComponent,
        viewComponent: ViewComponent,
      },
    };
  }, [allowAnnotation]);
};

export function useAnnotation(
  allowAnnotations: boolean,
): AnnotationProviders | null {
  const provider = useAnnotationProvider(allowAnnotations);

  useAnnotationBridge(allowAnnotations);

  return provider;
}
