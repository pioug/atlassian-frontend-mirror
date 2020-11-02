import { initFullPageEditorWithAdf, Device, snapshot } from '../_utils';
import adf from './__fixtures__/columns.adf.json';
import {
  clickOnLayoutColumn,
  scrollToLayoutColumn,
} from '../../__helpers/page-objects/_layouts';
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
    );
    await waitForFloatingControl(page, layoutToolbarTitle);
    await scrollToLayoutColumn(page, columnNumber, offset);
    await waitForFloatingControl(page, 'Go wide', undefined, false);

    await snapshot(page);
  });
});
