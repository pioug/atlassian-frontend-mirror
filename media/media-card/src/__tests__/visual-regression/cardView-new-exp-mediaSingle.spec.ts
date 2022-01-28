import {
  getExampleUrl,
  pageSelector,
} from '@atlaskit/visual-regression/helper';
import { sleep } from '@atlaskit/media-test-helpers';

function getURL(params: string): string {
  return (
    getExampleUrl('media', 'media-card', 'card-view-vr', global.__BASEURL__) +
    params
  );
}

describe('Media Card Singles', () => {
  describe('Show tooltip when overlay is enabled', () => {
    it.each(['uploading', 'complete', 'failed-processing', 'error'])(
      'with filestate %s',
      async (status) => {
        const url = getURL(`&status=${status}`);
        const { page } = global;

        await page.goto(url);
        await page.waitForSelector(pageSelector);
        await page.hover('[data-test-media-name=".img"]');
        await sleep(1000);

        const image = await page.screenshot();
        expect(image).toMatchProdImageSnapshot({
          failureThreshold: '0.002',
          failureThresholdType: 'percent',
        });
      },
    );
  });

  describe('Hide tooltip when overlay is disabled', () => {
    it.each(['uploading', 'complete', 'failed-processing', 'error'])(
      'with filestate %s',
      async (status) => {
        const url = getURL(`&disableOverlay=true&status=${status}`);
        const { page } = global;

        await page.goto(url);
        await page.waitForSelector(pageSelector);
        await page.hover('[data-test-media-name=".img"]');
        await sleep(500);

        const image = await page.screenshot();
        expect(image).toMatchProdImageSnapshot();
      },
    );
  });
});
