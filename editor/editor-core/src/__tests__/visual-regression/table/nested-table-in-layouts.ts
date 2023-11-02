/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import type { ViewportSize } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import {
  deviceViewPorts,
  Device,
} from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import {
  initFullPageEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import tableIn2ColAdf from './__fixtures__/table-in-2-col-layout.adf.json';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { layoutMessages as toolbarMessages } from '@atlaskit/editor-common/messages';
import { clickFirstCell } from '@atlaskit/editor-test-helpers/page-objects/table';
import { animationFrame } from '@atlaskit/editor-test-helpers/page-objects/editor';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import {
  toggleBreakout,
  waitForLayoutChange,
  clickOnLayoutColumn,
  waitForLayoutToolbar,
  waitForBreakoutNestedLayout,
  layoutSelectors,
} from '@atlaskit/editor-test-helpers/page-objects/layouts';

describe('Snapshot Test: Nested table inside layouts', () => {
  let page: PuppeteerPage;

  // FIXME These tests were flakey in the Puppeteer v10 Upgrade
  const { rightSidebar, /* leftSidebar, */ threeColumns } = toolbarMessages;
  const layoutButtonTestids = [
    rightSidebar.id,
    // leftSidebar.id,
    threeColumns.id,
  ];

  const initEditor = async (
    viewport: ViewportSize = deviceViewPorts[Device.LaptopHiDPI],
  ) => {
    await initFullPageEditorWithAdf(page, tableIn2ColAdf, undefined, viewport, {
      allowLayouts: { allowBreakout: true, UNSAFE_addSidebarLayouts: true },
    });
  };

  beforeAll(async () => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page, { useUnsafeThreshold: true, tolerance: 0.03 });
  });

  // FIXME These tests were flakey in the Puppeteer v10 Upgrade
  // want one size above and one below dynamic text sizing breakpoint (1265px)
  [
    /* deviceViewPorts[Device.LaptopHiDPI], */ { width: 1260, height: 800 },
  ].forEach((viewport) => {
    describe(`${viewport.width}x${viewport.height}: resizing table when changing layout`, () => {
      beforeEach(async () => {
        await initEditor(viewport);
      });
      layoutButtonTestids.forEach((dataTestid) => {
        const layoutBtnSelector = `[data-testid="${dataTestid}"]`;
        it(`should resize when changing to ${dataTestid}`, async () => {
          await page.waitForSelector(layoutSelectors.content);
          await clickOnLayoutColumn(page, 2);
          await animationFrame(page);
          await waitForLayoutToolbar(page);
          await page.waitForSelector(layoutBtnSelector);
          await page.click(layoutBtnSelector);
          await animationFrame(page);
          await waitForLayoutChange(page, dataTestid);
          await clickFirstCell(page, true);
          await animationFrame(page);
        });
      });
    });
  });

  describe('breakout modes', () => {
    beforeEach(async () => {
      await initEditor();
      await clickFirstCell(page);
    });
    ['wide', 'full-width'].forEach((breakout, idx) => {
      // TODO: https://product-fabric.atlassian.net/browse/ED-13527
      it(`should display correctly for layout in ${breakout} breakout mode`, async () => {
        await toggleBreakout(page, idx + 1);
        await animationFrame(page);
        await waitForBreakoutNestedLayout(
          page,
          breakout as 'wide' | 'full-width',
        );
        await animationFrame(page);
        await clickFirstCell(page);
      });
    });
  });

  it('should display correctly when columns are stacked', async () => {
    await initEditor({ width: 768, height: 600 });
    await animationFrame(page);
    await clickFirstCell(page);
  });
});
