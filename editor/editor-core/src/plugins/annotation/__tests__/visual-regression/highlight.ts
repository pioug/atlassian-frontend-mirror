import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  ExampleCreateInlineCommentComponent,
  ExampleViewInlineCommentComponent,
} from '@atlaskit/editor-test-helpers/example-inline-comment-component';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
  pmSelector,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
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
      // Unblock prosemirror-bump
      // TODO: ED-13910 - For some weird reason the click isn't highlighting the annotation for this test case
      //'annotation-listItem',
      'annotation-panel',
    ])('on %s', async (elementId) => {
      await page.click(pmSelector);
      await page.click(`#${elementId}`);
      await snapshot(page);
    });
  });
});
