import { waitForResolvedBlockCard } from '@atlaskit/media-integration-test-helpers';
import { getURL, setup, takeSnapshot } from '../__utils__/vr-helpers';

describe('Block Card', () => {
  it.each([
    ['shows collborators on block cards', 'vr-block-card-collaborators'],
    ['shows default icon on block cards', 'vr-block-card-default-icon'],
  ])('%s', async (_: string, testName: string) => {
    const url = getURL(testName);
    const page = await setup(url);

    await waitForResolvedBlockCard(page);

    const image = await takeSnapshot(page);
    expect(image).toMatchProdImageSnapshot();
  });
});
