import {
  getExampleUrl,
  pageSelector,
} from '@atlaskit/visual-regression/helper';
import { sleep } from '@atlaskit/media-test-helpers';

describe('Empty file view', () => {
  const url = getExampleUrl(
    'media',
    'media-viewer',
    'vr-empty-file',
    global.__BASEURL__,
  );

  it('should render empty file view', async () => {
    const { page } = global;
    await page.goto(url);
    await page.waitForSelector(pageSelector);
    await page.waitForSelector('button[data-testid="media-native-preview"]');
    await page.click('button[data-testid="media-native-preview"]');
    await page.waitForSelector('img');
    await page.hover('div[data-testid="media-viewer-error"]');
    await sleep(300);

    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });
});
