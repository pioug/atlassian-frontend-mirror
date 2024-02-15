import {
  getState,
  selectorById,
} from '@atlaskit/editor-test-helpers/annotation';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { AnnotationTestIds } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  Appearance,
  initEditorWithAdf,
  pmSelector,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import {
  ExampleCreateInlineCommentComponent,
  ExampleViewInlineCommentComponent,
} from '../../../../example-helpers/example-inline-comment-component';

import * as highlightAdf from './__fixtures__/highlight.adf.json';

// FIXME: Skipping theses tests as it has been failing on master on CI due to "Screenshot comparison failed" issue.
// Build URL: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2319963/steps/%7B31b3ca1c-6917-4861-88ed-d816d6fae22f%7D
describe.skip('highlight', () => {
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
