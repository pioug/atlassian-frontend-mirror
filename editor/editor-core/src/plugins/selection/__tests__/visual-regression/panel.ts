import {
  PuppeteerPage,
  waitForTooltip,
} from '@atlaskit/visual-regression/helper';
import {
  PanelSharedCssClassName,
  PanelSharedSelectors,
} from '@atlaskit/editor-common';
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '../../../../__tests__/visual-regression/_utils';
import { mentionSelectors } from '../../../../__tests__/__helpers/page-objects/_mention';
import { animationFrame } from '../../../../__tests__/__helpers/page-objects/_editor';
import selectionPanelAdf from './__fixtures__/panel.adf.json';

describe('Selection:', () => {
  let page: PuppeteerPage;

  describe('Panel', () => {
    beforeAll(() => {
      page = global.page;
    });

    beforeEach(async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: selectionPanelAdf,
        viewport: { width: 800, height: 320 },
      });
    });

    afterEach(async () => {
      // Wait for a frame because we are using RAF to throttle floating toolbar render
      await animationFrame(page);

      await page.waitForSelector(PanelSharedSelectors.removeButton);
      await page.hover(PanelSharedSelectors.removeButton);
      await page.waitForSelector(`.${PanelSharedCssClassName.prefix}.danger`);
      await waitForTooltip(page);
      await snapshot(page);
    });

    it('displays danger styling when node is selected', async () => {
      await page.click(`.${PanelSharedCssClassName.icon}`);
    });

    it('displays danger styling when child node is selected', async () => {
      await page.click(mentionSelectors.mention);
    });
  });
});
