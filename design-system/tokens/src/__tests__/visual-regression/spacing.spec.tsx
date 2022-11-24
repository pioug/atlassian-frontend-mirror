// eslint-disable-next-line import/no-extraneous-dependencies
import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Spacing tokens', () => {
  it.each(['none', 'spacing'] as const)(
    'should honour the spacing theme if applied (%s)',
    async (mode) => {
      const url = getExampleUrl(
        'design-system',
        'tokens',
        'spacing-vr',
        global.__BASEURL__,
        mode,
      );

      const { page } = global;
      await loadPage(page, url);

      const image = await takeElementScreenShot(
        page,
        '[data-testid="spacing"]',
      );
      expect(image).toMatchProdImageSnapshot();
    },
  );
});
