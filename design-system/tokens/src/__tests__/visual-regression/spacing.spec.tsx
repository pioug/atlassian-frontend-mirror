// eslint-disable-next-line import/no-extraneous-dependencies
import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Spacing tokens', () => {
  it('should honour the spacing theme if applied (%s)', async () => {
    const url = getExampleUrl(
      'design-system',
      'tokens',
      'spacing-vr',
      global.__BASEURL__,
    );

    const { page } = global;
    await loadPage(page, url);

    const image = await takeElementScreenShot(page, '[data-testid="spacing"]');
    expect(image).toMatchProdImageSnapshot();
  });
});
