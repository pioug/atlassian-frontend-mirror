import { waitForResolvedBlockCard } from '@atlaskit/media-integration-test-helpers';
import { getURL, setup, takeSnapshot } from '../__utils__/vr-helpers';

describe('Block Card', () => {
  it.each([
    ['shows collaborators on block cards', 'vr-block-card-collaborators'],
    ['shows default icon on block cards', 'vr-block-card-default-icon'],
    ['renders lozenge correctly on block cards', 'vr-block-card-lozenge'],
    ['shows preview button on block cards', 'vr-block-card-preview'],
  ])('%s', async (_: string, testName: string) => {
    const url = getURL(testName);
    const page = await setup(url);

    await waitForResolvedBlockCard(page);

    const image = await takeSnapshot(page);
    expect(image).toMatchProdImageSnapshot();
  });
});
