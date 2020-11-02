import {
  initFullPageEditorWithAdf,
  snapshot,
  getContentBoundingRectTopLeftCoords,
} from '../_utils';
import * as panel from './__fixtures__/panel-adf.json';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  waitForFloatingControl,
  retryUntilStablePosition,
} from '../../__helpers/page-objects/_toolbar';
import {
  PanelSharedCssClassName,
  PanelSharedSelectors,
} from '@atlaskit/editor-common';
import { waitForNoTooltip } from '@atlaskit/visual-regression/helper';

describe('Panel:', () => {
  let page: PuppeteerPage;

  beforeAll(() => {
    page = global.page;
  });
  beforeEach(async () => {
    await initFullPageEditorWithAdf(page, panel, undefined, {
      width: 800,
      height: 660,
    });
    await waitForFloatingControl(page, 'Panel floating controls');
  });
  afterEach(async () => {
    await snapshot(page);
  });

  it('looks correct', async () => {
    const panelSelector = `.${PanelSharedCssClassName.prefix}`;
    await page.waitForSelector(panelSelector);
    await retryUntilStablePosition(
      page,
      () => page.click(panelSelector),
      '[aria-label*="Panel floating controls"]',
      1000,
    );
  });

  it('displays as selected when click on panel icon', async () => {
    await page.click(`.${PanelSharedCssClassName.icon}`);
  });

  it('displays as selected when click on padding', async () => {
    const contentBoundingRect = await getContentBoundingRectTopLeftCoords(
      page,
      `.${PanelSharedCssClassName.prefix}`,
    );
    await page.mouse.click(contentBoundingRect.left, contentBoundingRect.top);
  });

  it("doesn't lose node selection after changing panel type", async () => {
    await page.click(`.${PanelSharedCssClassName.icon}`);

    // Change panel type to note
    await page.click(PanelSharedSelectors.noteButton);

    // await animationFrame doesn't wait for the button to be styled fully selected, and selected
    // buttons don't have any different selectors we can wait for. However, the snapshot importantly
    // shows the new panel colour, icon and node selection intact
    await waitForNoTooltip(page);
  });
});
