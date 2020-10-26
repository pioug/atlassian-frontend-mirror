import React from 'react';
import { AnnotationUpdateEvent } from '@atlaskit/editor-common';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import { MarkElement } from '../../';
import TestRenderer from 'react-test-renderer';
import { MarkComponent } from '../../mark';
import * as HooksMock from '../../../hooks/use-inline-comment-subscriber';
jest.mock('../../../hooks/use-inline-comment-subscriber');

describe('Annotations/Mark', () => {
  describe('when on click is called', () => {
    it('should emit click event', async () => {
      const fakeId = 'fakeId';
      const fakeDataAttributes = {
        'data-renderer-mark': true,
        'data-mark-type': 'annotation',
        'data-mark-annotation-type': AnnotationTypes.INLINE_COMMENT,
        'data-id': fakeId,
      };
      const annotationParentIds: string[] = [];
      const updateSubscriberFake = {
        on: jest.fn(),
        emit: jest.fn(),
      };
      // @ts-ignore
      HooksMock.useInlineCommentSubscriberContext.mockReturnValue(
        updateSubscriberFake,
      );

      const testRenderer = TestRenderer.create(
        <MarkElement
          id={fakeId}
          dataAttributes={fakeDataAttributes}
          annotationType={AnnotationTypes.INLINE_COMMENT}
          annotationParentIds={annotationParentIds}
        >
          <small>some</small>
        </MarkElement>,
      );
      const testInstance = testRenderer.root;
      const markComponent = testInstance.findByType(MarkComponent);
      const onClick = markComponent.props.onClick;

      expect(onClick).toBeDefined();

      const annotationIds = ['lol'];
      onClick({ annotationIds, eventTarget: testRenderer });
      expect(updateSubscriberFake.emit).toHaveBeenCalledWith(
        AnnotationUpdateEvent.ON_ANNOTATION_CLICK,
        {
          annotationIds,
          eventTarget: testRenderer,
        },
      );
    });
  });
});
