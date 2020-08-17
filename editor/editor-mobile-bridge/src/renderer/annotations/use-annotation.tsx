import { useEffect, useMemo } from 'react';
import {
  AnnotationProviders,
  AnnotationUpdateEmitter,
  AnnotationUpdateEvent,
} from '@atlaskit/editor-common';
import RendererBridgeImplementation from '../native-to-web/implementation';
import { createSelectionComponent } from './create-selection-component';
import { AnnotationStatePayload } from '../types';
import {
  AnnotationId,
  AnnotationMarkStates,
  AnnotationTypes,
} from '@atlaskit/adf-schema';
import {
  EmitterEvents,
  eventDispatcher as mobileBridgeEventDispatcher,
} from '../dispatcher';
import { nativeBridgeAPI as webToNativeBridgeAPI } from '../web-to-native/implementation';
import { AnnotationContext } from '@atlaskit/renderer';

const updateEmitter = new AnnotationUpdateEmitter();
const nativeToWebAPI = new RendererBridgeImplementation();
export const SelectionComponent = createSelectionComponent(nativeToWebAPI);

const setAnnotationStateCallback = (payload?: AnnotationStatePayload[]) => {
  const data = (payload || []).reduce<{
    [AnnotationId: string]: AnnotationMarkStates;
  }>((acc, value) => {
    acc[value.annotationId] = value.annotationState;

    return acc;
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

const onAnnotationClick = (ids?: AnnotationId[]) => {
  const obj = ids
    ? [
        {
          annotationIds: ids,
          annotationType: AnnotationTypes.INLINE_COMMENT,
        },
      ]
    : undefined;
  webToNativeBridgeAPI.onAnnotationClick(obj);
};

const useAnnotationProvider = (
  allowAnnotation: boolean,
): AnnotationProviders<AnnotationMarkStates> | null => {
  return useMemo<AnnotationProviders<AnnotationMarkStates> | null>(() => {
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

          return annotationIds.map(id => {
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
      },
    };
  }, [allowAnnotation]);
};

function useAnnotationContext(
  allowAnnotations: boolean,
): React.ContextType<typeof AnnotationContext> | null {
  return useMemo(() => {
    if (!allowAnnotations) {
      return null;
    }

    return {
      onAnnotationClick,
      enableAutoHighlight: false,
      updateSubscriber: updateEmitter,
    };
  }, [allowAnnotations]);
}

export function useAnnotation(
  allowAnnotations: boolean,
): [
  AnnotationProviders<AnnotationMarkStates> | null,
  React.ContextType<typeof AnnotationContext> | null,
] {
  const provider = useAnnotationProvider(allowAnnotations);
  const context = useAnnotationContext(allowAnnotations);

  useAnnotationBridge(allowAnnotations);

  return [provider, context];
}
