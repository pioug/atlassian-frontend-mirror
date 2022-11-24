import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('@atlaskit/badge Snapshot Test', () => {
  it.each(['light', 'dark', 'none', 'spacing'] as const)(
    'badge (%s) configurations should match production example',
    async (theme) => {
      const url = getExampleUrl(
        'design-system',
        'badge',
        'basic',
        global.__BASEURL__,
        theme,
      );
      const { page } = global;

      await loadPage(page, url);

      const image = await takeElementScreenShot(page, '[data-testid="badge"]');
      expect(image).toMatchProdImageSnapshot();
    },
  );
});
