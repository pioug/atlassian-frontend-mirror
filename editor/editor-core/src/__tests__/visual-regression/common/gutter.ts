import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { initFullPageEditorWithAdf, snapshot, Device } from '../_utils';
import longContent from './__fixtures__/long-content-adf.json';
import { typeInEditorAtEndOfDocument } from '../../__helpers/page-objects/_editor';
import { tableSelectors } from '../../__helpers/page-objects/_table';
import { panelSelectors } from '../../__helpers/page-objects/_panel';
import { decisionSelectors } from '../../__helpers/page-objects/_decision';
import { pressKey } from '../../__helpers/page-objects/_keyboard';
import { quickInsert } from '../../__helpers/page-objects/_extensions';

const waitForScrollGutter = async (page: PuppeteerPage) => {
  await page.waitForSelector('#editor-scroll-gutter');
};

describe('Gutter:', () => {
  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
    await initFullPageEditorWithAdf(page, longContent, Device.LaptopMDPI);
  });

  afterEach(async () => {
    await snapshot(page);
  });

  it('should add gutter at the bottom of the page', async () => {
    await typeInEditorAtEndOfDocument(page, 'Hello World');
    await waitForScrollGutter(page);
  });

  it.skip('should add gutter if a table is added at the end of the editor', async () => {
    await typeInEditorAtEndOfDocument(page, '');
    await quickInsert(page, 'Table', false);
    await pressKey(page, 'Enter');
    await page.waitForSelector(tableSelectors.tableTh);

    await pressKey(page, ['ArrowDown', 'ArrowDown']); // Go to last row
    await waitForScrollGutter(page);
  });

  it.skip('should add gutter if a panel is added at the end of the editor', async () => {
    await typeInEditorAtEndOfDocument(page, '');
    await quickInsert(page, 'info', false);
    await pressKey(page, 'Enter');

    await page.waitForSelector(panelSelectors.infoPanel);
    await waitForScrollGutter(page);
  });

  it.skip('should add gutter if a decision is added at the end of the editor', async () => {
    await typeInEditorAtEndOfDocument(page, '');
    await quickInsert(page, 'decision', false);
    await pressKey(page, 'Enter');

    await page.waitForSelector(decisionSelectors.decisionItem);
    await waitForScrollGutter(page);
  });
});
