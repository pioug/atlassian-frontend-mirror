import { Device } from './../../../../../../renderer/src/__tests__/visual-regression/_utils';
import { Page, BoundingBox } from 'puppeteer';
import {
  ExampleCreateInlineCommentComponent,
  ExampleViewInlineCommentComponent,
} from '@atlaskit/editor-test-helpers';
import {
  animationFrame,
  clickElementWithText,
  waitForElementWithText,
  setSelection,
} from '../../../../__tests__/__helpers/page-objects/_editor';
import {
  snapshot,
  initFullPageEditorWithAdf,
} from '../../../../__tests__/visual-regression/_utils';
import { AnnotationTestIds } from '../../types';
import * as tempHighlightAdf from './../__fixtures__/temp-highlight.adf.json';
import { selectorById } from '../_utils';

describe('Snapshot Tests', () => {
  let page: Page;
  beforeEach(async () => {
    page = global.page;
    await initFullPageEditorWithAdf(
      page,
      tempHighlightAdf,
      Device.LaptopHiDPI,
      undefined,
      {
        annotationProvider: {
          createComponent: ExampleCreateInlineCommentComponent,
          viewComponent: ExampleViewInlineCommentComponent,
          providers: {
            inlineComment: {
              pollingInterval: 10000,
              getState: async () => [],
            },
          },
        },
      },
    );
  });

  it('temporary highlight shows up correctly with different content', async () => {
    await animationFrame(page);

    const element1 = await waitForElementWithText(page, '--Text start--', 'p');
    const box1 = (await element1.boundingBox()) as BoundingBox;

    const element2 = await waitForElementWithText(page, 'Heading 3', 'h3');
    const box2 = (await element2.boundingBox()) as BoundingBox;

    await setSelection(
      page,
      { x: box1.x, y: box1.y + 10 },
      { x: box2.x, y: box2.y + 10 + box2.height },
    );

    await animationFrame(page);

    const createButton = await page.waitForSelector(
      selectorById(AnnotationTestIds.floatingToolbarCreateButton),
      { visible: true },
    );
    await createButton.click();

    // click away to make sure highlight and comment box stays relative to previous text
    await clickElementWithText({
      page,
      tag: 'p',
      text: '--Text end--',
    });

    await snapshot(page);
  });
});
