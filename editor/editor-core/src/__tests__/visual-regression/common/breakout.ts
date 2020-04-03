import { initFullPageEditorWithAdf, Device, snapshot } from '../_utils';
import adf from './__fixtures__/columns.adf.json';
import {
  clickOnLayoutColumn,
  scrollToLayoutColumn,
} from '../../__helpers/page-objects/_layouts';
import { Page } from '../../__helpers/page-objects/_types';

describe('Columns:', () => {
  let page: Page;
  beforeEach(async () => {
    page = global.page;
    await initFullPageEditorWithAdf(page, adf, Device.LaptopHiDPI);
  });

  it('should show breakout', async () => {
    const columnNumber = 1;
    await clickOnLayoutColumn(page, columnNumber);

    await snapshot(page);
  });

  it('should place breakout at the start/end of the scroll', async () => {
    const columnNumber = 1;
    const offset = 100;

    await clickOnLayoutColumn(page, columnNumber);
    await scrollToLayoutColumn(page, columnNumber, offset);

    await snapshot(page);
  });
});
