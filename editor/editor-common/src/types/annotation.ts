import { AnnotationTypes, AnnotationId } from '@atlaskit/adf-schema';

export interface AnnotationState<Type, State> {
  annotationType: Type;
  id: AnnotationId;
  state: State;
}

interface AnnotationGenericProvider<Type, State> {
  getState: (
    annotationIds: AnnotationId[],
  ) => Promise<AnnotationState<Type, State>[]>;
}

export type AnnotationProviders<State> = {
  [AnnotationTypes.INLINE_COMMENT]: AnnotationGenericProvider<
    AnnotationTypes.INLINE_COMMENT,
    State
  >;
};
