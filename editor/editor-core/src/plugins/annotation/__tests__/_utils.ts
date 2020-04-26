import { AnnotationTypeProvider, InlineCommentState } from '../types';
import { AnnotationTestIds, AnnotationTypes } from '../types';

export const annotationSelectors = {
  floatingToolbarCreate: `[data-testid="${AnnotationTestIds.floatingToolbarCreateButton}"]`,
  component: `[data-testid="${AnnotationTestIds.floatingComponent}"]`,
  componentSave: `[data-testid="ak-editor-annotation-dummy-save-button"]`,
};

export const selectorById = (id: string) => `[data-testid="${id}"]`;

export const inlineCommentProvider: AnnotationTypeProvider<
  AnnotationTypes.INLINE_COMMENT,
  InlineCommentState
> = {
  getState: async (ids: string[]) =>
    ids.map(id => ({
      annotationType: AnnotationTypes.INLINE_COMMENT,
      id,
      state: { resolved: false },
    })),
};

export const nullComponent = () => {
  return null;
};
