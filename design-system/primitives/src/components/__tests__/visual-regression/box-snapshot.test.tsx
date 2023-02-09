import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe.skip('Box', () => {
  [
    'borderColor',
    'backgroundColor',
    'background-and-padding',
    'background-and-paddingBlock',
    'background-and-paddingInline',
    'shadow',
    'layer',
  ].forEach(selector => {
    it(`example with ${selector} should match snapshot`, async () => {
      const url = getExampleUrl(
        'design-system',
        'primitives',
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
