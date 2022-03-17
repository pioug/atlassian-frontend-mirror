import { getURL, setup, takeSnapshot } from '../__utils__/vr-helpers';

describe('Media Inline Card', () => {
  it.each([['renders text wrap correctly', 'vr-media-inline-card-text-wrap']])(
    '%s',
    async (_: string, testName: string) => {
      const url = getURL(testName);
      const page = await setup(url);
      const image = await takeSnapshot(page, 280, 0);

      expect(image).toMatchProdImageSnapshot();
    },
  );
});
