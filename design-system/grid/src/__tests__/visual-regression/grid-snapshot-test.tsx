import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Grid', () => {
  it('example should match snapshot', async () => {
    const url = getExampleUrl(
      'design-system',
      'grid',
      'grid-cards',
      global.__BASEURL__,
    );
    const { page } = global;

    await loadPage(page, url);

    const image = await takeElementScreenShot(page, `[data-testid="grid"]`);
    expect(image).toMatchProdImageSnapshot();
  });
});
