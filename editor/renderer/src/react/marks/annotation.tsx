import React from 'react';
import type { AnnotationDataAttributes } from '@atlaskit/adf-schema';
import { buildAnnotationMarkDataAttributes } from '@atlaskit/adf-schema';
import type { MarkProps, AnnotationMarkMeta } from '../types';
import { AnnotationMark } from '../../ui/annotations';
import type { Mark } from '@atlaskit/editor-prosemirror/model';

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
  useBlockLevel,
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
        useBlockLevel={useBlockLevel}
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
