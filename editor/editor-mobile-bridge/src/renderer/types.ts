import {
  AnnotationMarkStates,
  AnnotationId,
  AnnotationTypes,
} from '@atlaskit/adf-schema';

export type AnnotationPayload = {
  annotationId: AnnotationId;
  annotationType: AnnotationTypes;
};

export type AnnotationStatePayload = {
  annotationId: AnnotationId;
  annotationType: AnnotationTypes;
  annotationState: AnnotationMarkStates;
};
