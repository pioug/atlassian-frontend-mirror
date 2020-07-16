import {
  snapshot,
  initEditorWithAdf,
  Appearance,
  getContentBoundingRectTopLeftCoords,
} from '../_utils';
import adf from './__fixtures__/code-block-adf.json';
import { Page } from '../../__helpers/page-objects/_types';
import { waitForFloatingControl } from '../../__helpers/page-objects/_toolbar';
import { codeBlockSelectors } from '../../__helpers/page-objects/_code-block';

describe('Code block:', () => {
  let page: Page;

  beforeAll(() => {
    page = global.page;
  });

  beforeEach(async () => {
    await initEditorWithAdf(page, {
      adf,
      appearance: Appearance.fullPage,
      viewport: { width: 1280, height: 500 },
    });
  });

  afterEach(async () => {
    await waitForFloatingControl(page, 'CodeBlock floating controls');
    await snapshot(page);
  });

  it('looks correct', async () => {
    await page.click(codeBlockSelectors.code);
  });

  it('displays as selected when click on line numbers', async () => {
    await page.click(codeBlockSelectors.lineNumbers);
  });

  it('displays as selected when click on padding', async () => {
    const contentBoundingRect = await getContentBoundingRectTopLeftCoords(
      page,
      codeBlockSelectors.content,
    );
    await page.mouse.click(contentBoundingRect.left, contentBoundingRect.top);
  });

  it("doesn't select codeblock if click and drag before releasing mouse", async () => {
    const contentBoundingRect = await getContentBoundingRectTopLeftCoords(
      page,
      codeBlockSelectors.content,
    );

    // start in centre of codeblock, mousedown and then move to padding before releasing
    await page.mouse.move(
      contentBoundingRect.left + contentBoundingRect.width * 0.5,
      contentBoundingRect.top + contentBoundingRect.height * 0.5,
    );
    await page.mouse.down();
    await page.mouse.move(contentBoundingRect.left, contentBoundingRect.top);
    await page.mouse.up();
  });
});
