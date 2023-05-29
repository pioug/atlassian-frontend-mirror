import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
  waitForLoadedBackgroundImages,
  waitForLoadedImageElements,
} from '@atlaskit/visual-regression/helper';
import { emojiSprite } from '../../components/common/styles';

async function waitForContent(page: PuppeteerPage) {
  // Wait for the 3 emojis
  await page.waitForSelector('.emoji-common-node[aria-label=":blue_star:"]');
  await page.waitForSelector('.emoji-common-node[aria-label=":wtf:"]');
  await page.waitForSelector('.emoji-common-node[aria-label=":grimacing:"]');
  // :blue_star: and :wtf: use HTML image elements
  await waitForLoadedImageElements(page, 5000);
  // :grimacing: uses a CSS background-image
  await waitForLoadedBackgroundImages(page, `.${emojiSprite}`);
}

describe('Snapshot Test', () => {
  let page: PuppeteerPage;
  const url = getExampleUrl(
    'elements',
    'emoji',
    'simple-emoji',
    global.__BASEURL__,
  );

  beforeAll(async () => {
    page = global.page;
    await loadPage(page, url);
    await waitForContent(page);
  });

  it(`should render emoji`, async () => {
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
