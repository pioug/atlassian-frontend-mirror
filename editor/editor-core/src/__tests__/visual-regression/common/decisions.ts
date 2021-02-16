import {
  snapshot,
  initEditorWithAdf,
  Appearance,
  getBoundingClientRect,
} from '../_utils';
import adf from './__fixtures__/decision-adf.json';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { decisionSelectors } from '../../__helpers/page-objects/_decision';

describe('Decisions', () => {
  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
    await initEditorWithAdf(page, {
      adf,
      appearance: Appearance.fullPage,
      viewport: { width: 800, height: 400 },
    });
  });

  afterEach(async () => {
    await snapshot(page);
  });

  it('should display as selected when clicked on', async () => {
    const contentBoundingRect = await getBoundingClientRect(
      page,
      decisionSelectors.decisionItem,
    );
    await page.mouse.click(contentBoundingRect.left, contentBoundingRect.top);
  });

  it('should display as selected when clicking on icon', async () => {
    await page.click(decisionSelectors.decisionIcon);
  });
});
