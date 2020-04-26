import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import { Page } from '../../__helpers/page-objects/_types';
import {
  clickOnStatus,
  waitForStatusToolbar,
} from '../../__helpers/page-objects/_status';
import { animationFrame } from '../../__helpers/page-objects/_editor';
import adf from './__fixtures__/status-adf.json';

describe('Status:', () => {
  let page: Page;
  beforeEach(async () => {
    page = global.page;
  });

  it('should display as selected', async () => {
    await initEditorWithAdf(page, {
      adf,
      appearance: Appearance.fullPage,
      viewport: { width: 600, height: 300 },
    });
    await animationFrame(page);
    await clickOnStatus(page);
    await animationFrame(page);
    await waitForStatusToolbar(page);
    await animationFrame(page);
    await snapshot(page);
  });
});
