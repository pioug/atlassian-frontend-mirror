import { waitForResolvedInlineCard } from '@atlaskit/media-integration-test-helpers';
import { getURL, setup, takeSnapshot } from '../__utils__/vr-helpers';

describe('Inline Card', () => {
  it('shows default icon on inline cards', async () => {
    const url = getURL('vr-inline-card-default-icon');
    const page = await setup(url);

    await waitForResolvedInlineCard(page);

    const image = await takeSnapshot(page);
    expect(image).toMatchProdImageSnapshot();
  });
});
