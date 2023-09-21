import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';
import { ffTest } from '@atlassian/feature-flags-test-utils';

describe('Snapshot Test', () => {
  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
  });
  ffTest('platform.design-system-team.border-checkbox_nyoiu', async () => {
    const url = getExampleUrl(
      'design-system',
      'textfield',
      'variations',
      global.__BASEURL__,
    );

    await loadPage(page, url);

    await page.waitForSelector('input[disabled]');
    await page.waitForSelector('input[required]');
    const image = await takeElementScreenShot(page, '#variations');
    expect(image).toMatchProdImageSnapshot();
  });
});
