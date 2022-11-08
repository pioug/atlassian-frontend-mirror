import {
  initFullPageEditorWithAdf,
  snapshot,
  updateEditorProps,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import adf from './__fixtures__/columns.adf.json';
import layoutEmptyAdf from './__fixtures__/layout-empty.adf.json';
import {
  clickOnLayoutColumn,
  scrollToLayoutColumn,
  toggleBreakout,
  layoutSelectors,
} from '@atlaskit/editor-test-helpers/page-objects/layouts';
import { clickFirstParagraph } from '@atlaskit/editor-test-helpers/page-objects/editor';
import {
  waitForFloatingControl,
  retryUntilStablePosition,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';
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

    // first we make the node's layout wide
    await toggleBreakout(page, 1);

    // then we visually hide and disable the Editor
    await page.evaluate(() => {
      const container = document.querySelector<HTMLDivElement>(
        '#editor-container',
      );
      container!.style.display = 'none';
    });

    await updateEditorProps(page, { disabled: true });

    // then we re-enable and visually re-display the Editor
    await updateEditorProps(page, { disabled: false });

    await page.evaluate(() => {
      const container = document.querySelector<HTMLDivElement>(
        '#editor-container',
      );
      container!.style.display = 'unset';
    });

    await page.waitForSelector(layoutSelectors.column, { visible: true });
    // unfortunately we need to hide floating toolbar as its incorrectly positioned
    // during snapshot, but not in a way that's reproducible locally (and as its not the focus
    // of this test, we ignore it for now). We also cannot simply 'clip' the snapshot because
    // clipping affects layout (and fixes breakout button positioning).
    await hideFloatingToolbar(page);
    await snapshot(page);
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
