import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Inline', () => {
  it('should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'primitives',
      'inline-basic',
      global.__BASEURL__,
      'light',
    );
    const { page } = global;

    await loadPage(page, url);

    const image = await takeElementScreenShot(
      page,
      `[data-testid="inline-example"]`,
    );

    expect(image).toMatchProdImageSnapshot();
  });

  it('should render with separator', async () => {
    const url = getExampleUrl(
      'design-system',
      'primitives',
      'inline-separator',
      global.__BASEURL__,
      'light',
    );
    const { page } = global;

    await loadPage(page, url);

    const image = await takeElementScreenShot(
      page,
      `[data-testid="inline-example"]`,
    );

    expect(image).toMatchProdImageSnapshot();
  });

  it('should render with space', async () => {
    const url = getExampleUrl(
      'design-system',
      'primitives',
      'inline-space',
      global.__BASEURL__,
      'light',
    );
    const { page } = global;

    await loadPage(page, url);

    const image = await takeElementScreenShot(
      page,
      `[data-testid="inline-example"]`,
    );

    expect(image).toMatchProdImageSnapshot();
  });

  it('should align along the vertical axis', async () => {
    const url = getExampleUrl(
      'design-system',
      'primitives',
      'inline-align-block',
      global.__BASEURL__,
      'light',
    );
    const { page } = global;

    await loadPage(page, url);

    const image = await takeElementScreenShot(
      page,
      `[data-testid="inline-example"]`,
    );

    expect(image).toMatchProdImageSnapshot();
  });

  it('should align along the horizontal axis', async () => {
    const url = getExampleUrl(
      'design-system',
      'primitives',
      'inline-align-inline',
      global.__BASEURL__,
      'light',
    );
    const { page } = global;

    await loadPage(page, url);

    const image = await takeElementScreenShot(
      page,
      `[data-testid="inline-example"]`,
    );

    expect(image).toMatchProdImageSnapshot();
  });

  it('should spread along the horizontal axis', async () => {
    const url = getExampleUrl(
      'design-system',
      'primitives',
      'inline-spread',
      global.__BASEURL__,
      'light',
    );
    const { page } = global;

    await loadPage(page, url);

    const image = await takeElementScreenShot(
      page,
      `[data-testid="inline-example"]`,
    );

    expect(image).toMatchProdImageSnapshot();
  });

  it('should optionally wrap content', async () => {
    const url = getExampleUrl(
      'design-system',
      'primitives',
      'inline-should-wrap',
      global.__BASEURL__,
      'light',
    );
    const { page } = global;

    await loadPage(page, url);

    const image = await takeElementScreenShot(
      page,
      `[data-testid="inline-example"]`,
    );

    expect(image).toMatchProdImageSnapshot();
  });

  it('should optionally grow to fit container', async () => {
    const url = getExampleUrl(
      'design-system',
      'primitives',
      'inline-grow',
      global.__BASEURL__,
      'light',
    );
    const { page } = global;

    await loadPage(page, url);

    const image = await takeElementScreenShot(
      page,
      `[data-testid="inline-example"]`,
    );

    expect(image).toMatchProdImageSnapshot();
  });
});
