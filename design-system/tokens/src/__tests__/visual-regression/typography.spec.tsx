// eslint-disable-next-line import/no-extraneous-dependencies
import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Typography tokens', () => {
  it.each(['none', 'light'] as const)(
    'should honour the typography theme if applied (%s)',
    async (theme) => {
      const url = getExampleUrl(
        'design-system',
        'tokens',
        'typography-vr',
        global.__BASEURL__,
        theme,
      );

      const { page } = global;
      await loadPage(page, url);

      const image = await takeElementScreenShot(
        page,
        '[data-testid="typography"]',
      );
      expect(image).toMatchProdImageSnapshot();
    },
  );
});
