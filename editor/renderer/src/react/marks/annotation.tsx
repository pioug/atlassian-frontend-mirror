import React from 'react';
import {
  AnnotationMarkAttributes,
  buildAnnotationMarkDataAttributes,
  AnnotationMarkStates,
  AnnotationId,
} from '@atlaskit/adf-schema';
import { MarkProps } from '../types';

export type Props = {
  children: React.ReactNode;
  getAnnotationState?: (id: AnnotationId) => Promise<AnnotationMarkStates>;
} & AnnotationMarkAttributes;

export default ({
  id,
  annotationType,
  children,
  dataAttributes,
  getAnnotationState,
}: MarkProps<Props>) => {
  const [state, setState] = React.useState<AnnotationMarkStates | null>(null);

  React.useEffect(() => {
    if (getAnnotationState) {
      const promise = getAnnotationState(id);

      promise.then(setState);
    }
  }, [getAnnotationState, id]);

  return (
    <span
      {...dataAttributes}
      {...buildAnnotationMarkDataAttributes({ id, annotationType, state })}
    >
      {children}
    </span>
  );
};
