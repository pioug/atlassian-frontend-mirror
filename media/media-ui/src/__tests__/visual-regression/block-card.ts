import {
  getExampleUrl,
  pageSelector,
} from '@atlaskit/visual-regression/helper';
import { mediaMockQueryOptInFlag } from '@atlaskit/media-test-helpers/media-mock';
import { waitForResolvedBlockCard } from '@atlaskit/media-integration-test-helpers';
import { takeSnapshot } from '../__utils__/vr-helpers';

function getURL(testName: string): string {
  return (
    getExampleUrl('media', 'media-ui', testName, global.__BASEURL__) +
    `&${mediaMockQueryOptInFlag}`
  );
}

async function setup(url: string) {
  const { page } = global;
  await page.goto(url);
  await page.waitForSelector(pageSelector);
  return page;
}

describe('Block Card', () => {
  it('shows collborators on block cards', async () => {
    const url = getURL('vr-block-card-collaborators');
    const page = await setup(url);

    await waitForResolvedBlockCard(page);

    const image = await takeSnapshot(page);
    expect(image).toMatchProdImageSnapshot();
  });
});
