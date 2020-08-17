import { memo, useCallback, useLayoutEffect } from 'react';
import { InlineCommentSelectionComponentProps } from '@atlaskit/editor-common';
import { nativeBridgeAPI as webToNativeBridgeAPI } from '../web-to-native/implementation';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import {
  EmitterEvents,
  eventDispatcher as mobileBridgeEventDispatcher,
} from '../dispatcher';
import RendererBridge from '../native-to-web/bridge';

export const createSelectionComponent = (nativeToWebAPI: RendererBridge) =>
  memo((props: InlineCommentSelectionComponentProps) => {
    const {
      onClose,
      onCreate,
      isAnnotationAllowed,
      removeDraftMode,
      applyDraftMode,
    } = props;

    const onNativeSideCreatesAnnotation = useCallback(
      ({ annotationId }) => {
        onClose();
        const result = onCreate(annotationId);

        if (result && result.doc) {
          webToNativeBridgeAPI.setContent(result.doc);
          nativeToWebAPI.setContent(result.doc);
        }
      },
      [onClose, onCreate],
    );

    const onApplyDraftMode = useCallback(() => {
      applyDraftMode(false);
    }, [applyDraftMode]);

    useLayoutEffect(() => {
      webToNativeBridgeAPI.canApplyAnnotationOnCurrentSelection([
        {
          type: AnnotationTypes.INLINE_COMMENT,
          canAnnotate: isAnnotationAllowed,
        },
      ]);
    }, [isAnnotationAllowed]);

    useLayoutEffect(() => {
      const onMouseUp = () => {
        onClose();
      };

      document.addEventListener('mouseup', onMouseUp);

      mobileBridgeEventDispatcher.on(
        EmitterEvents.CREATE_ANNOTATION_ON_SELECTION,
        onNativeSideCreatesAnnotation,
      );
      mobileBridgeEventDispatcher.on(
        EmitterEvents.APPLY_DRAFT_ANNOTATION,
        onApplyDraftMode,
      );
      mobileBridgeEventDispatcher.on(
        EmitterEvents.REMOVE_DRAFT_ANNOTATION,
        removeDraftMode,
      );

      return () => {
        document.removeEventListener('mouseup', onMouseUp);

        mobileBridgeEventDispatcher.off(
          EmitterEvents.CREATE_ANNOTATION_ON_SELECTION,
          onNativeSideCreatesAnnotation,
        );

        mobileBridgeEventDispatcher.off(
          EmitterEvents.APPLY_DRAFT_ANNOTATION,
          onApplyDraftMode,
        );

        mobileBridgeEventDispatcher.off(
          EmitterEvents.REMOVE_DRAFT_ANNOTATION,
          removeDraftMode,
        );
      };
    }, [
      onClose,
      onNativeSideCreatesAnnotation,
      onApplyDraftMode,
      removeDraftMode,
    ]);
    return null;
  });
