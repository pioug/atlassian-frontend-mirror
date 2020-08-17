import { WebDriverPage } from './_types';

export async function annotate(
  page: WebDriverPage,
  annotationId: string,
  annotationType: string = 'inlineComment',
) {
  return page.execute(
    (annotationId: string, annotationType: string) => {
      // @ts-ignore
      const actions = window.__rendererActions;
      if (actions) {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
          return;
        }

        const result = actions.annotate(
          selection.getRangeAt(0),
          annotationId,
          annotationType,
        );

        if (!result) {
          return result;
        }

        return {
          doc: result.doc,
          step: result.step.toJSON(),
        };
      }
    },
    annotationId,
    annotationType,
  );
}

export async function validateRange(page: WebDriverPage) {
  return page.execute(() => {
    // @ts-ignore
    const actions = window.__rendererActions;
    if (actions) {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        return;
      }

      return actions.isValidAnnotationRange(selection.getRangeAt(0));
    }
  });
}
