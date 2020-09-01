import React from 'react';
import { InlineCommentViewComponentProps } from '@atlaskit/editor-common';
import { render, unmountComponentAtNode } from 'react-dom';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import { nativeBridgeAPI as webToNativeBridgeAPI } from '../../../web-to-native/implementation';
import { createViewComponent } from '../../create-view-component';

let container: HTMLElement | null;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container!);
  unmountComponentAtNode(container!);
  container = null;
});

describe('Mobile Renderer: Annotations/create-view-component', () => {
  describe('#ViewComponent', () => {
    let ViewComponent: React.FC<InlineCommentViewComponentProps>;

    beforeEach(() => {
      ViewComponent = createViewComponent();
      jest.restoreAllMocks();

      jest.spyOn(webToNativeBridgeAPI, 'onAnnotationClick');
    });

    describe('when annotations is empty', () => {
      it('should call onAnnotationClick without parameters', () => {
        expect(webToNativeBridgeAPI.onAnnotationClick).toHaveBeenCalledTimes(0);
        render(<ViewComponent annotations={[]} />, container);

        expect(webToNativeBridgeAPI.onAnnotationClick).toHaveBeenCalledWith();
      });
    });

    describe('when annotations is not empty', () => {
      it('should call onAnnotationClick with the mobile bridge annotation format', () => {
        expect(webToNativeBridgeAPI.onAnnotationClick).toHaveBeenCalledTimes(0);
        const annotations = [
          { id: 'lol1', type: AnnotationTypes.INLINE_COMMENT },
          { id: 'lol2', type: AnnotationTypes.INLINE_COMMENT },
        ];
        render(<ViewComponent annotations={annotations} />, container);

        const payload = [
          {
            annotationType: AnnotationTypes.INLINE_COMMENT,
            annotationIds: ['lol1', 'lol2'],
          },
        ];
        expect(webToNativeBridgeAPI.onAnnotationClick).toHaveBeenCalledWith(
          payload,
        );
      });
    });
  });
});
