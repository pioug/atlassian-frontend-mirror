import {
  getExampleUrl,
  pageSelector,
} from '@atlaskit/visual-regression/helper';
import { sleep } from '@atlaskit/media-test-helpers';
import { mediaMockQueryOptInFlag } from '@atlaskit/media-test-helpers/media-mock';

function getURL(): string {
  return (
    getExampleUrl(
      'media',
      'media-card',
      'inline-video-card',
      global.__BASEURL__,
    ) + `&${mediaMockQueryOptInFlag}`
  );
}

async function setup(url: string) {
  const { page } = global;
  await page.goto(url);
  await page.waitForSelector(pageSelector);

  await sleep(500);
  const image = await page.screenshot({
    clip: { x: 0, y: 72, width: 800, height: 354 },
  });
  return { image };
}

describe('Inline Video Card', () => {
  it('Inline Video Card tests', async () => {
    const url = getURL();

    const { image } = await setup(url);
    expect(image).toMatchProdImageSnapshot();
  });
});
