import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Grid', () => {
  it('grid-cards example should match snapshot', async () => {
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

  it('grid-widths example should match snapshot', async () => {
    const url = getExampleUrl(
      'design-system',
      'grid',
      'grid-widths',
      global.__BASEURL__,
    );
    const { page } = global;

    await loadPage(page, url);

    const image = await takeElementScreenShot(page, `[id="examples"]`);
    expect(image).toMatchProdImageSnapshot();
  });

  it('no-inline-padding example should match snapshot', async () => {
    const url = getExampleUrl(
      'design-system',
      'grid',
      'grid-no-inline-padding',
      global.__BASEURL__,
    );
    const { page } = global;

    await loadPage(page, url);

    const image = await takeElementScreenShot(page, `[id="examples"]`);
    expect(image).toMatchProdImageSnapshot();
  });

  it('hidden-item example should match snapshot', async () => {
    const url = getExampleUrl(
      'design-system',
      'grid',
      'grid-hidden-item',
      global.__BASEURL__,
    );
    const { page } = global;

    await loadPage(page, url);

    const image = await takeElementScreenShot(page, `[id="examples"]`);
    expect(image).toMatchProdImageSnapshot();
  });

  it('jsm-grid example should match snapshot', async () => {
    const url = getExampleUrl(
      'design-system',
      'grid',
      'jsm-grid',
      global.__BASEURL__,
    );
    const { page } = global;

    await loadPage(page, url);

    const image = await takeElementScreenShot(page, `[id="examples"]`);
    expect(image).toMatchProdImageSnapshot();
  });
});
