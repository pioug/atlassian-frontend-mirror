import {
  snapshot,
  initEditorWithAdf,
  Appearance,
  getContentBoundingRectTopLeftCoords,
} from '../_utils';
import adf from './__fixtures__/code-block-adf.json';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  waitForFloatingControl,
  retryUntilStablePosition,
} from '../../__helpers/page-objects/_toolbar';
import { codeBlockSelectors } from '../../__helpers/page-objects/_code-block';

describe('Code block:', () => {
  let page: PuppeteerPage;

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
    await page.waitForSelector(codeBlockSelectors.code);
    await retryUntilStablePosition(
      page,
      () => page.click(codeBlockSelectors.code),
      '[aria-label*="CodeBlock floating controls"]',
      1000,
    );
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
});
