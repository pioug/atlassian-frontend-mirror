import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('xcss', () => {
  it.each(['none', 'light', 'dark'] as const)(
    'basic xcss example should match snapshot (mode: %s)',
    async mode => {
      const url = getExampleUrl(
        'design-system',
        'primitives',
        'classname-basic',
        global.__BASEURL__,
        mode,
      );
      const { page } = global;
      await loadPage(page, url);

      const image = await takeElementScreenShot(
        page,
        '[data-testid="classname-examples"]',
      );
      expect(image).toMatchProdImageSnapshot();
    },
  );
});
