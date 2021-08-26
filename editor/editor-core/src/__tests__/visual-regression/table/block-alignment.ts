import {
  Device,
  snapshot,
  initFullPageEditorWithAdf,
  initCommentEditorWithAdf,
  editorCommentContentSelector,
} from '../_utils';
import adf from './__fixtures__/table-with-blocks.adf.json';
import {
  setTableLayout,
  getSelectorForTableCell,
} from '../../__helpers/page-objects/_table';
import { emojiSelectors } from '../../__helpers/page-objects/_emoji';
import { retryUntilStablePosition } from '../../__helpers/page-objects/_toolbar';
import {
  PuppeteerPage,
  waitForLoadedBackgroundImages,
} from '@atlaskit/visual-regression/helper';

describe('Table with block looks correct for fullpage:', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  afterEach(async () => {
    await waitForLoadedBackgroundImages(page, emojiSelectors.standard, 10000);
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
    await page.click(getSelectorForTableCell({ row: 4, cell: 1 }));
  });

  // re-enable this test: https://product-fabric.atlassian.net/browse/ED-13630
  it.skip('wide layout ', async () => {
    await initFullPageEditorWithAdf(page, adf, Device.LaptopMDPI);
    await page.click(getSelectorForTableCell({ row: 4, cell: 1 }));
    await setTableLayout(page, 'wide');
    await page.click(getSelectorForTableCell({ row: 4, cell: 1 }));
  });

  // re-enable this test: https://product-fabric.atlassian.net/browse/ED-13630
  it.skip('full-width layout ', async () => {
    await initFullPageEditorWithAdf(page, adf, Device.LaptopHiDPI);
    await page.click(getSelectorForTableCell({ row: 4, cell: 1 }));
    await setTableLayout(page, 'fullWidth');
    await page.click(getSelectorForTableCell({ row: 4, cell: 1 }));
  });
});

// re-enable this test: https://product-fabric.atlassian.net/browse/ED-13630
describe.skip('Table with block looks correct for comment:', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page, undefined, editorCommentContentSelector);
  });

  it('default layout ', async () => {
    await initCommentEditorWithAdf(page, adf, Device.LaptopMDPI);
    await page.click(getSelectorForTableCell({ row: 4, cell: 1 }));
  });
});
