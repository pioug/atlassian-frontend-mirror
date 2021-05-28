import {
  getExampleUrl,
  pageSelector,
  PuppeteerPage,
} from '@atlaskit/visual-regression/helper';
import { mediaMockQueryOptInFlag } from '@atlaskit/media-test-helpers';

export function getURL(testName: string): string {
  return (
    getExampleUrl('media', 'media-ui', testName, global.__BASEURL__) +
    `&${mediaMockQueryOptInFlag}`
  );
}

export async function setup(url: string) {
  const { page } = global;
  await page.goto(url);
  await page.waitForSelector(pageSelector);
  return page;
}

export async function takeSnapshot(page: PuppeteerPage) {
  const image = await page.screenshot({
    clip: { x: 0, y: 0, width: 800, height: 280 },
  });
  return image;
}
