import { memo, useLayoutEffect } from 'react';
import { InlineCommentViewComponentProps } from '@atlaskit/editor-common';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import { nativeBridgeAPI as webToNativeBridgeAPI } from '../web-to-native/implementation';
import {
  eventDispatcher as mobileBridgeEventDispatcher,
  EmitterEvents,
} from '../dispatcher';
import { AnnotationPayload } from '../types';
import RendererBridge from '../native-to-web/bridge';

export const createViewComponent = (nativeToWebAPI: RendererBridge) =>
  memo((props: InlineCommentViewComponentProps) => {
    const { annotations, deleteAnnotation } = props;

    useLayoutEffect(() => {
      if (!annotations || annotations.length === 0) {
        webToNativeBridgeAPI.onAnnotationClick();
      }

      const payload = [
        {
          annotationType: AnnotationTypes.INLINE_COMMENT,
          annotationIds: (annotations || []).map(annotation => annotation.id),
        },
      ];
      webToNativeBridgeAPI.onAnnotationClick(payload);

      const callback = (payload?: AnnotationPayload) => {
        if (payload) {
          const result =
            deleteAnnotation &&
            deleteAnnotation({
              id: payload.annotationId,
              type: payload.annotationType,
            });

          if (result && result.doc) {
            webToNativeBridgeAPI.setContent(result.doc);
            nativeToWebAPI.setContent(result.doc);
          }
        }
      };

      mobileBridgeEventDispatcher.on(EmitterEvents.DELETE_ANNOTATION, callback);
      return () => {
        mobileBridgeEventDispatcher.off(
          EmitterEvents.DELETE_ANNOTATION,
          callback,
        );
      };
    }, [annotations, deleteAnnotation]);

    return null;
  });
