import { Page } from 'puppeteer';
import {
  ExampleCreateInlineCommentComponent,
  ExampleViewInlineCommentComponent,
} from '@atlaskit/editor-test-helpers';
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
  pmSelector,
} from '../../../../__tests__/visual-regression/_utils';
import * as highlightAdf from './../__fixtures__/highlight.adf.json';
import { getState } from '../_utils';

describe('highlight', () => {
  let page: Page;
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
  ])('on %s', async elementId => {
    await page.click(pmSelector);
    await page.click(`#${elementId}`);
    await snapshot(page);
  });
});
