import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  ExampleCreateInlineCommentComponent,
  ExampleViewInlineCommentComponent,
} from '@atlaskit/editor-test-helpers/example-inline-comment-component';
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
  pmSelector,
} from '../../../../__tests__/visual-regression/_utils';
import { AnnotationTestIds } from '../../types';
import * as highlightAdf from './../__fixtures__/highlight.adf.json';
import { getState, selectorById } from '../_utils';

describe('highlight', () => {
  let page: PuppeteerPage;

  it('restores after component close', async () => {
    page = global.page;
    await initEditorWithAdf(page, {
      adf: highlightAdf,
      appearance: Appearance.fullPage,
      viewport: { width: 800, height: 800 },
      editorProps: {
        annotationProviders: {
          inlineComment: {
            createComponent: ExampleCreateInlineCommentComponent,
            viewComponent: ExampleViewInlineCommentComponent,
            getState,
          },
        },
      },
    });

    await page.click(pmSelector);
    await page.click(`#annotation-paragraph`);
    // Highlight should currently be active (tested below)
    selectorById(AnnotationTestIds.componentClose);
    await page.waitForSelector(selectorById(AnnotationTestIds.componentClose));
    await page.click(selectorById(AnnotationTestIds.componentClose));
    // Highlight should no longer be active (tested below)
    await snapshot(page);
  });

  describe('in context', () => {
    beforeAll(async () => {
      page = global.page;
      await initEditorWithAdf(page, {
        adf: highlightAdf,
        appearance: Appearance.fullPage,
        viewport: { width: 800, height: 800 },
        editorProps: {
          annotationProviders: {
            inlineComment: {
              createComponent: ExampleCreateInlineCommentComponent,
              viewComponent: ExampleViewInlineCommentComponent,
              getState,
            },
          },
        },
      });
    });

    it.each([
      'annotation-paragraph',
      'annotation-blockquote',
      'annotation-decisionItem',
      'annotation-taskItem',
      'annotation-listItem',
      'annotation-panel',
    ])('on %s', async (elementId) => {
      await page.click(pmSelector);
      await page.click(`#${elementId}`);
      await snapshot(page);
    });
  });
});
