import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
  waitForLoadedBackgroundImages,
} from '@atlaskit/visual-regression/helper';
import { emojiSprite } from '../../components/common/styles';

// FIXME: flaky test https://product-fabric.atlassian.net/browse/COLLAB-904
describe.skip('Snapshot Test', () => {
  let page: PuppeteerPage;
  const url = getExampleUrl(
    'elements',
    'emoji',
    'standard-emoji-picker-with-upload',
    global.__BASEURL__,
  );

  beforeAll(async () => {
    page = global.page;
    await loadPage(page, url);
    // Wait for emoji picker
    await page.waitForSelector('div[data-emoji-picker-container="true"]');
    await waitForLoadedBackgroundImages(page, `.${emojiSprite}`);
  });

  it(`should render emoji picker`, async () => {
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot({
      failureThreshold: '100',
      failureThresholdType: 'pixel',
    });
  });
});
