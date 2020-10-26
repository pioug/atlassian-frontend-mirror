import {
  PuppeteerPage,
  waitForTooltip,
} from '@atlaskit/visual-regression/helper';
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '../../../../__tests__/visual-regression/_utils';
import { mentionSelectors } from '../../../../__tests__/__helpers/page-objects/_mention';
import { layoutSelectors } from '../../../../__tests__/__helpers/page-objects/_layouts';
import { animationFrame } from '../../../../__tests__/__helpers/page-objects/_editor';
import selectionLayoutAdf from './__fixtures__/layout.adf.json';

describe('Selection:', () => {
  let page: PuppeteerPage;
  describe('Layout', () => {
    beforeAll(() => {
      page = global.page;
    });

    beforeEach(async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: selectionLayoutAdf,
        viewport: { width: 1040, height: 400 },
      });
    });

    afterEach(async () => {
      // Wait for a frame because we are using RAF to throttle floating toolbar render
      await animationFrame(page);

      await page.waitForSelector(layoutSelectors.removeButton);
      await page.hover(layoutSelectors.removeButton);
      await page.waitForSelector(`[data-layout-section].danger`);
      await waitForTooltip(page);
      await snapshot(page);
    });

    it('displays danger styling when node is selected', async () => {
      await page.click(layoutSelectors.column);
    });

    it('displays danger styling when child node is selected', async () => {
      await page.click(mentionSelectors.mention);
    });
  });
});
