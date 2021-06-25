import { waitForResolvedInlineCard } from '@atlaskit/media-integration-test-helpers';
import { getURL, setup, takeSnapshot } from '../__utils__/vr-helpers';

describe('Inline Card', () => {
  it.each([
    ['shows default icon on inline cards', 'vr-inline-card-default-icon'],
    ['renders lozenge correctly on inline card', 'vr-inline-card-lozenge'],
  ])('%s', async (_: string, testName: string) => {
    const url = getURL(testName);
    const page = await setup(url);

    await waitForResolvedInlineCard(page);

    const image = await takeSnapshot(page);
    expect(image).toMatchProdImageSnapshot();
  });
});
