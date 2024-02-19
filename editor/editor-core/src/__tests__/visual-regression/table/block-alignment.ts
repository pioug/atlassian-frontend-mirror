// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { animationFrame } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { emojiSelectors } from '@atlaskit/editor-test-helpers/page-objects/emoji';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  getSelectorForTableCell,
  setTableLayout,
} from '@atlaskit/editor-test-helpers/page-objects/table';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { retryUntilStablePosition } from '@atlaskit/editor-test-helpers/page-objects/toolbar';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  initFullPageEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { waitForLoadedBackgroundImages } from '@atlaskit/visual-regression/helper';

import adf from './__fixtures__/table-with-blocks.adf.json';

// FIXME: This is failing in master-publish pipeline: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2440494/steps/%7B7c2a0f37-ea6f-4ffc-8a60-a5a7868dac4c%7D
describe.skip('Table with block looks correct for fullpage:', () => {
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
