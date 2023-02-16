import {
  getExampleUrl,
  pageSelector,
  PuppeteerPage,
} from '@atlaskit/visual-regression/helper';

export function getURL(
  testName: string,
  mode?: 'dark' | 'light' | 'none',
): string {
  const exampleUrl = getExampleUrl(
    'linking-platform',
    'smart-card',
    testName,
    global.__BASEURL__,
    mode,
  );
  return exampleUrl + `&mediaMock=true`;
}

export async function setup(url: string) {
  const page: PuppeteerPage = global.page;
  await page.goto(url, {
    waitUntil: 'networkidle0',
  });
  await page.waitForSelector(pageSelector);
  return page;
}

export async function takeSnapshot(
  page: PuppeteerPage,
  height: number,
  y = 120,
) {
  const image = await page.screenshot({
    clip: { x: 0, y, width: 800, height },
  });
  return image;
}
