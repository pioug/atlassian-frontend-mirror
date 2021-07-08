import { memo, useCallback, useLayoutEffect, useState } from 'react';
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
      getAnnotationIndexMatch,
    } = props;

    const [isDraftMode, setIsDraftMode] = useState(false);

    const onNativeSideCreatesAnnotation = useCallback(
      ({ annotationId }) => {
        onClose();
        setIsDraftMode(false);
        const result = onCreate(annotationId);

        if (result && result.doc) {
          webToNativeBridgeAPI.setContent(result.doc);
          nativeToWebAPI.setContent(result.doc);
        }
      },
      [onClose, onCreate],
    );

    const onApplyDraftMode = useCallback(() => {
      if (getAnnotationIndexMatch) {
        const match = getAnnotationIndexMatch();
        if (match) {
          webToNativeBridgeAPI.annotationIndexMatch(match);
        }
      }

      applyDraftMode(false);
      setIsDraftMode(true);
    }, [applyDraftMode, getAnnotationIndexMatch]);

    const onRemoveDraftMode = useCallback(() => {
      removeDraftMode();
      setIsDraftMode(false);
    }, [removeDraftMode]);

    useLayoutEffect(() => {
      webToNativeBridgeAPI.canApplyAnnotationOnCurrentSelection([
        {
          type: AnnotationTypes.INLINE_COMMENT,
          canAnnotate: isAnnotationAllowed,
        },
      ]);
    }, [isAnnotationAllowed]);

    useLayoutEffect(() => {
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
        onRemoveDraftMode,
      );

      return () => {
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
          onRemoveDraftMode,
        );
      };
    }, [
      onClose,
      onNativeSideCreatesAnnotation,
      onApplyDraftMode,
      onRemoveDraftMode,
      removeDraftMode,
      isDraftMode,
    ]);
    return null;
  });
