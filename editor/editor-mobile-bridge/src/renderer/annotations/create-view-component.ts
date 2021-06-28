import { AnnotationTypes } from '@atlaskit/adf-schema';
import { InlineCommentViewComponentProps } from '@atlaskit/editor-common';
import { memo, useLayoutEffect } from 'react';
import {
  EmitterEvents,
  eventDispatcher as mobileBridgeEventDispatcher,
} from '../dispatcher';
import RendererBridge from '../native-to-web/bridge';
import { AnnotationPayload } from '../types';
import {
  AnnotationPayloadsByType,
  AnnotationWithRectPayloadsByType,
} from '../web-to-native/bridge';
import { nativeBridgeAPI as webToNativeBridgeAPI } from '../web-to-native/implementation';

export const createViewComponent = (nativeToWebAPI: RendererBridge) =>
  memo((props: InlineCommentViewComponentProps) => {
    const { annotations, clickElementTarget, deleteAnnotation } = props;

    useLayoutEffect(() => {
      if (!annotations || annotations.length === 0) {
        webToNativeBridgeAPI.onAnnotationClick();
        webToNativeBridgeAPI.onAnnotationClickWithRect();
        return;
      }

      const payload: AnnotationPayloadsByType[] = [
        {
          annotationType: AnnotationTypes.INLINE_COMMENT,
          annotationIds: annotations.map((annotation) => annotation.id),
        },
      ];
      webToNativeBridgeAPI.onAnnotationClick(payload);

      if (clickElementTarget) {
        const rect = clickElementTarget.getBoundingClientRect();
        const text = clickElementTarget.innerText;

        const geomPayload: AnnotationWithRectPayloadsByType[] = [
          {
            annotationType: AnnotationTypes.INLINE_COMMENT,
            annotations: annotations.map((annotation) => ({
              id: annotation.id,
              rect,
              text,
            })),
          },
        ];
        webToNativeBridgeAPI.onAnnotationClickWithRect(geomPayload);
      }

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
    }, [annotations, clickElementTarget, deleteAnnotation]);

    return null;
  });
