import React, { useMemo, useCallback, useContext } from 'react';
import {
  AnnotationId,
  AnnotationDataAttributes,
  AnnotationMarkStates,
  AnnotationTypes,
} from '@atlaskit/adf-schema';
import { MarkComponent } from './mark';
import {
  useInlineCommentSubscriberContext,
  useHasFocusEvent,
  useInlineCommentsFilter,
} from '../hooks';
import { InlineCommentsStateContext } from '../context';
import {
  AnnotationUpdateEvent,
  OnAnnotationClickPayload,
} from '@atlaskit/editor-common';

type MarkElementProps = {
  id: AnnotationId;
  annotationParentIds: AnnotationId[];
  dataAttributes: AnnotationDataAttributes;
  annotationType: AnnotationTypes;
};

const MarkElement: React.FC<MarkElementProps> = ({
  annotationParentIds,
  children,
  dataAttributes,
  id,
}) => {
  const updateSubscriber = useInlineCommentSubscriberContext();
  const states = useContext(InlineCommentsStateContext);
  const hasFocus = useHasFocusEvent({ id, updateSubscriber });
  const dataAttributesMemorized = useMemo(() => dataAttributes, [
    dataAttributes,
  ]);
  const onClick = useCallback(
    (props: OnAnnotationClickPayload) => {
      if (!updateSubscriber) {
        return;
      }

      const { eventTarget, annotationIds } = props;
      updateSubscriber.emit(AnnotationUpdateEvent.ON_ANNOTATION_CLICK, {
        annotationIds,
        eventTarget,
      });
    },
    [updateSubscriber],
  );

  const activeParentIds = useInlineCommentsFilter({
    annotationIds: annotationParentIds,
    filter: {
      state: AnnotationMarkStates.ACTIVE,
    },
  });

  return (
    <MarkComponent
      id={id}
      dataAttributes={dataAttributesMemorized}
      annotationParentIds={activeParentIds}
      onClick={onClick}
      hasFocus={hasFocus}
      state={states[id]}
    >
      {children}
    </MarkComponent>
  );
};

export { MarkElement };
