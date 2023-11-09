// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initFullPageEditorWithAdf,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import adf from './__fixtures__/table-with-blocks.adf.json';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  setTableLayout,
  getSelectorForTableCell,
} from '@atlaskit/editor-test-helpers/page-objects/table';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { animationFrame } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { emojiSelectors } from '@atlaskit/editor-test-helpers/page-objects/emoji';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { retryUntilStablePosition } from '@atlaskit/editor-test-helpers/page-objects/toolbar';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { waitForLoadedBackgroundImages } from '@atlaskit/visual-regression/helper';

describe('Table with block looks correct for fullpage:', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  afterEach(async () => {
    await animationFrame(page);
    await waitForLoadedBackgroundImages(page, emojiSelectors.standard, 10000);
    await animationFrame(page);
    await snapshot(page);
  });

  it('default layout ', async () => {
    await initFullPageEditorWithAdf(page, adf, Device.LaptopMDPI);
    const cellSelector = getSelectorForTableCell({ row: 4, cell: 1 });
    await page.waitForSelector(cellSelector);
    await retryUntilStablePosition(
      page,
      () => page.click(cellSelector),
      '[aria-label*="Table floating controls"]',
      1000,
    );
  });

  it('default layout with dark theme', async () => {
    await initFullPageEditorWithAdf(
      page,
      adf,
      Device.LaptopMDPI,
      undefined,
      undefined,
      'dark',
    );
    await animationFrame(page);
    await page.click(getSelectorForTableCell({ row: 4, cell: 1 }));
  });

  it('wide layout ', async () => {
    await initFullPageEditorWithAdf(page, adf, Device.LaptopMDPI);
    await animationFrame(page);
    await page.click(getSelectorForTableCell({ row: 4, cell: 1 }));
    await animationFrame(page);
    await setTableLayout(page, 'wide');
    await animationFrame(page);
    await page.click(getSelectorForTableCell({ row: 4, cell: 1 }));
  });

  it('full-width layout ', async () => {
    await initFullPageEditorWithAdf(page, adf, Device.LaptopHiDPI);
    await animationFrame(page);
    await page.click(getSelectorForTableCell({ row: 4, cell: 1 }));
    await animationFrame(page);
    await setTableLayout(page, 'fullWidth');
    await animationFrame(page);
    await page.click(getSelectorForTableCell({ row: 4, cell: 1 }));
  });
});
