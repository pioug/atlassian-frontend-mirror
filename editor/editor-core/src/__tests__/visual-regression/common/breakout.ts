import {
  initFullPageEditorWithAdf,
  Device,
  snapshot,
  updateEditorProps,
} from '../_utils';
import adf from './__fixtures__/columns.adf.json';
import layoutEmptyAdf from './__fixtures__/layout-empty.adf.json';
import {
  clickOnLayoutColumn,
  scrollToLayoutColumn,
  toggleBreakout,
  layoutSelectors,
} from '../../__helpers/page-objects/_layouts';
import {
  animationFrame,
  clickFirstParagraph,
} from '../../__helpers/page-objects/_editor';
import {
  waitForFloatingControl,
  retryUntilStablePosition,
} from '../../__helpers/page-objects/_toolbar';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { layoutToolbarTitle } from '../../../plugins/layout/toolbar';

describe('Columns:', () => {
  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
    await initFullPageEditorWithAdf(page, adf, Device.LaptopHiDPI);
  });

  it('should show breakout', async () => {
    const columnNumber = 1;
    await retryUntilStablePosition(
      page,
      () => clickOnLayoutColumn(page, columnNumber),
      `[aria-label*="${layoutToolbarTitle}"]`,
      1000,
    );
    await waitForFloatingControl(page, layoutToolbarTitle);
    await waitForFloatingControl(page, 'Go wide', undefined, false);
    await snapshot(page);
  });

  it('should place breakout at the start/end of the scroll', async () => {
    const columnNumber = 1;
    const offset = 100;

    await retryUntilStablePosition(
      page,
      () => clickOnLayoutColumn(page, columnNumber),
      `[aria-label*="${layoutToolbarTitle}"]`,
      1000,
      true,
    );
    await waitForFloatingControl(page, layoutToolbarTitle);
    await scrollToLayoutColumn(page, columnNumber, offset);
    await waitForFloatingControl(page, 'Go wide', undefined, false);
    await snapshot(page);
  });

  it('should place breakout button in correct position after visually hiding, re-rendering and then re-displaying the Editor', async () => {
    await initFullPageEditorWithAdf(page, layoutEmptyAdf, Device.LaptopHiDPI);
    await clickFirstParagraph(page, { topLevelParagraph: false });

    await waitForFloatingControl(page, layoutToolbarTitle);
    await page.waitForSelector(layoutSelectors.column, { visible: true });
    await page.waitForSelector(layoutSelectors.breakoutButton, {
      visible: true,
    });

    // first we make the layout full-width
    await toggleBreakout(page, 2);
    await animationFrame(page);
    await animationFrame(page);

    // then we visually hide and disable the Editor
    await page.evaluate(() => {
      const container = document.querySelector<HTMLDivElement>(
        '#editor-container',
      );
      container!.style.display = 'none';
    });
    await animationFrame(page);
    await animationFrame(page);

    await updateEditorProps(page, { disabled: true });
    await animationFrame(page);
    await animationFrame(page);

    // then we re-enable and visually re-display the Editor
    await updateEditorProps(page, { disabled: false });
    await animationFrame(page);
    await animationFrame(page);

    await page.evaluate(() => {
      const container = document.querySelector<HTMLDivElement>(
        '#editor-container',
      );
      container!.style.display = 'unset';
    });
    await animationFrame(page);
    await animationFrame(page);
    await animationFrame(page);

    await page.waitForSelector(layoutSelectors.column, { visible: true });
    // unfortunately we need to hide floating toolbar as its incorrectly positioned
    // during snapshot, but not in a way that's reproducible locally (and as its not the focus
    // of this test, we ignore it for now). We also cannot simply 'clip' the snapshot because
    // clipping affects layout (and fixes breakout button positioning).
    await hideFloatingToolbar(page);
    await snapshot(page, { tolerance: 0.05, useUnsafeThreshold: true });
  });
});

const hideFloatingToolbar = async (page: PuppeteerPage) => {
  await page.evaluate(
    (floatingToolbarSelector) => {
      const elem = document.querySelector(floatingToolbarSelector);
      elem && (elem.style.display = 'none');
    },
    [layoutSelectors.floatingToolbar],
  );
};
