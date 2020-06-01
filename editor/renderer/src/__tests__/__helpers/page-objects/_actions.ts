import Page from '@atlaskit/webdriver-runner/wd-wrapper';

export async function annotate(
  page: Page,
  annotationId: string,
  annotationType: string = 'inlineComment',
) {
  return page.execute(
    (annotationId, annotationType) => {
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

export async function validateRange(page: Page) {
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
