import { PuppeteerPage } from '@atlaskit/visual-regression/helper';

export async function takeSnapshot(page: PuppeteerPage) {
  const image = await page.screenshot({
    clip: { x: 0, y: 0, width: 800, height: 280 },
  });
  return image;
}
