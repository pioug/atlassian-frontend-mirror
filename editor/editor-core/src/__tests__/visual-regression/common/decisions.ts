import {
  snapshot,
  initEditorWithAdf,
  Appearance,
  getContentBoundingRectTopLeftCoords,
} from '../_utils';
import adf from './__fixtures__/decision-adf.json';
import { Page } from '../../__helpers/page-objects/_types';
import { decisionSelectors } from '../../__helpers/page-objects/_decision';

describe('Decisions', () => {
  let page: Page;

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
    const contentBoundingRect = await getContentBoundingRectTopLeftCoords(
      page,
      decisionSelectors.decisionItem,
    );
    await page.mouse.click(contentBoundingRect.left, contentBoundingRect.top);
  });

  it('should display as selected when clicking on icon', async () => {
    await page.click(decisionSelectors.decisionIcon);
  });

  it("doesn't select decision if click and drag before releasing mouse", async () => {
    const contentBoundingRect = await getContentBoundingRectTopLeftCoords(
      page,
      decisionSelectors.decisionItem,
    );

    // start in centre of decision, mousedown and then move to padding before releasing
    await page.mouse.move(
      contentBoundingRect.left + contentBoundingRect.width * 0.5,
      contentBoundingRect.top + contentBoundingRect.height * 0.5,
    );
    await page.mouse.down();
    await page.mouse.move(contentBoundingRect.left, contentBoundingRect.top);
    await page.mouse.up();
  });
});
