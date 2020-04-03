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
import { emojiReadySelector } from '../../__helpers/page-objects/_emoji';
import { waitForLoadedBackgroundImages } from '@atlaskit/visual-regression/helper';
import { Page } from '../../__helpers/page-objects/_types';

describe('Table with block looks correct for fullpage:', () => {
  let page: Page;

  beforeAll(async () => {
    page = global.page;
  });

  afterEach(async () => {
    await waitForLoadedBackgroundImages(page, emojiReadySelector, 10000);
    await snapshot(page);
  });

  it('default layout ', async () => {
    await initFullPageEditorWithAdf(page, adf, Device.LaptopMDPI);
    await page.click(getSelectorForTableCell({ row: 4, cell: 1 }));
  });

  // TODO: ED-7814
  it.skip('default layout with dark theme', async () => {
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

  it('wide layout ', async () => {
    await initFullPageEditorWithAdf(page, adf, Device.LaptopMDPI);
    await page.click(getSelectorForTableCell({ row: 4, cell: 1 }));
    await setTableLayout(page, 'wide');
    await page.click(getSelectorForTableCell({ row: 4, cell: 1 }));
  });

  it('full-width layout ', async () => {
    await initFullPageEditorWithAdf(page, adf, Device.LaptopHiDPI);
    await page.click(getSelectorForTableCell({ row: 4, cell: 1 }));
    await setTableLayout(page, 'full-width');
    await page.click(getSelectorForTableCell({ row: 4, cell: 1 }));
  });
});

describe('Table with block looks correct for comment:', () => {
  let page: Page;

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
