import React from 'react';
import {
  buildAnnotationMarkDataAttributes,
  AnnotationDataAttributes,
} from '@atlaskit/adf-schema';
import { MarkProps, AnnotationMarkMeta } from '../types';
import { AnnotationMark } from '../../ui/annotations';
import { Mark } from 'prosemirror-model';

export const isAnnotationMark = (mark: Mark): boolean => {
  return mark && mark.type && mark.type.name === 'annotation';
};

const AnnotationComponent = ({
  id,
  annotationType,
  children,
  dataAttributes,
  annotationParentIds = [],
  allowAnnotations,
}: MarkProps<AnnotationMarkMeta>) => {
  const data: AnnotationDataAttributes = {
    ...dataAttributes,
    ...buildAnnotationMarkDataAttributes({ id, annotationType }),
  };

  if (allowAnnotations) {
    return (
      <AnnotationMark
        id={id}
        dataAttributes={data}
        annotationParentIds={annotationParentIds}
        annotationType={annotationType}
      >
        {children}
      </AnnotationMark>
    );
  }

  return (
    <span id={id} {...data}>
      {children}
    </span>
  );
};

export default AnnotationComponent;
