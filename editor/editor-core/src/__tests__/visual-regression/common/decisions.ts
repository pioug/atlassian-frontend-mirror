import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import { getBoundingClientRect } from '@atlaskit/editor-test-helpers/vr-utils/bounding-client-rect';
import adf from './__fixtures__/decision-adf.json';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { decisionSelectors } from '@atlaskit/editor-test-helpers/page-objects/decision';

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
