import { AnnotationTestIds, InlineCommentAnnotationProvider } from '../types';
import { AnnotationTypes } from '@atlaskit/adf-schema';

export const annotationSelectors = {
  floatingToolbarCreate: `[data-testid="${AnnotationTestIds.floatingToolbarCreateButton}"]`,
  component: `[data-testid="${AnnotationTestIds.floatingComponent}"]`,
  componentSave: `[data-testid="${AnnotationTestIds.componentSave}"]`,
  componentClose: `[data-testid="${AnnotationTestIds.componentClose}"]`,
};

export const selectorById = (id: string) => `[data-testid="${id}"]`;

export const getState = async (ids: string[]) => {
  return ids.map((id) => ({
    annotationType: AnnotationTypes.INLINE_COMMENT,
    id,
    state: { resolved: false },
  }));
};

export const nullComponent = () => {
  return null;
};

export const inlineCommentProvider: InlineCommentAnnotationProvider = {
  getState: getState,
  createComponent: nullComponent,
  viewComponent: nullComponent,
};
