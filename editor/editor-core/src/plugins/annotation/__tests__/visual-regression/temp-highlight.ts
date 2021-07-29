import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  animationFrame,
  clickElementWithText,
  waitForElementWithText,
  setSelection,
  scrollToTop,
} from '../../../../__tests__/__helpers/page-objects/_editor';
import {
  ExampleCreateInlineCommentComponent,
  ExampleViewInlineCommentComponent,
} from '@atlaskit/editor-test-helpers/example-inline-comment-component';
import {
  Device,
  snapshot,
  initFullPageEditorWithAdf,
} from '../../../../__tests__/visual-regression/_utils';
import * as tempHighlightAdf from './../__fixtures__/temp-highlight.adf.json';
import { AnnotationTestIds } from '../../types';
import { selectorById, getState } from '../_utils';

describe.skip('Snapshot Tests', () => {
  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
    await initFullPageEditorWithAdf(
      page,
      tempHighlightAdf,
      Device.LaptopHiDPI,
      undefined,
      {
        annotationProviders: {
          inlineComment: {
            createComponent: ExampleCreateInlineCommentComponent,
            viewComponent: ExampleViewInlineCommentComponent,
            getState,
          },
        },
      },
    );
  });

  it('temporary highlight shows up correctly with different content', async () => {
    await animationFrame(page);

    const element1 = await waitForElementWithText(page, '--Text start--', 'p');
    const box1 = await element1?.boundingBox();

    const element2 = await waitForElementWithText(page, 'Heading 3', 'h3');
    const box2 = await element2?.boundingBox();

    if (box1 && box2) {
      await setSelection(
        page,
        { x: box1.x, y: box1.y + 10 },
        { x: box2.x, y: box2.y + 10 + box2.height },
      );
    }

    await animationFrame(page);

    const createButton = await page.waitForSelector(
      selectorById(AnnotationTestIds.floatingToolbarCreateButton),
      { visible: true },
    );
    await createButton?.click();
    await page.waitForSelector(
      selectorById(AnnotationTestIds.floatingComponent),
    );

    // click away to make sure highlight and comment box stays relative to previous text
    await clickElementWithText({
      page,
      tag: 'p',
      text: '--Text end--',
    });

    await scrollToTop(page);
    await snapshot(page);
  });
});
