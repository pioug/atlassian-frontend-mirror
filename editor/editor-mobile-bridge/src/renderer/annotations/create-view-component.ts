import { memo, useLayoutEffect } from 'react';
import { InlineCommentViewComponentProps } from '@atlaskit/editor-common';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import { nativeBridgeAPI as webToNativeBridgeAPI } from '../web-to-native/implementation';

export const createViewComponent = () =>
  memo((props: InlineCommentViewComponentProps) => {
    const { annotations } = props;

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
    }, [annotations]);

    return null;
  });
