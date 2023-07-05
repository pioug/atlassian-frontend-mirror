import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Pressable', () => {
  ['default', 'styled'].forEach(selector => {
    it(`${selector} example should match snapshot`, async () => {
      const url = getExampleUrl(
        'design-system',
        'primitives',
        `pressable-${selector}`,
        global.__BASEURL__,
        'light',
      );
      const { page } = global;

      await loadPage(page, url);

      const image = await takeElementScreenShot(
        page,
        `[data-testid="pressable-${selector}"]`,
      );
      expect(image).toMatchProdImageSnapshot();
    });
  });
});
