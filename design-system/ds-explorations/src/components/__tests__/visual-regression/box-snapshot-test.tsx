import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Box', () => {
  [
    'borderColor',
    'backgroundColor',
    'background-and-padding',
    'background-and-paddingBlock',
    'background-and-paddingInline',
  ].forEach((selector) => {
    it(`example with ${selector} should match snapshot`, async () => {
      const url = getExampleUrl(
        'design-system',
        'ds-explorations',
        'box',
        global.__BASEURL__,
      );
      const { page } = global;

      await loadPage(page, url);

      const image = await takeElementScreenShot(
        page,
        `[data-testid="box-with-${selector}"]`,
      );
      expect(image).toMatchProdImageSnapshot();
    });
  });
});
