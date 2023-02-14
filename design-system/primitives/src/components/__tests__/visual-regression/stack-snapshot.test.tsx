import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Stack', () => {
  it('should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'primitives',
      'stack-basic',
      global.__BASEURL__,
      'light',
    );
    const { page } = global;

    await loadPage(page, url);

    const image = await takeElementScreenShot(
      page,
      `[data-testid="stack-example"]`,
    );

    expect(image).toMatchProdImageSnapshot();
  });

  it('should render with space', async () => {
    const url = getExampleUrl(
      'design-system',
      'primitives',
      'stack-space',
      global.__BASEURL__,
      'light',
    );
    const { page } = global;

    await loadPage(page, url);

    const image = await takeElementScreenShot(
      page,
      `[data-testid="stack-example"]`,
    );

    expect(image).toMatchProdImageSnapshot();
  });

  it('should align along the vertical axis', async () => {
    const url = getExampleUrl(
      'design-system',
      'primitives',
      'stack-align-block',
      global.__BASEURL__,
      'light',
    );
    const { page } = global;

    await loadPage(page, url);

    const image = await takeElementScreenShot(
      page,
      `[data-testid="stack-example"]`,
    );

    expect(image).toMatchProdImageSnapshot();
  });

  it('should align along the horizontal axis', async () => {
    const url = getExampleUrl(
      'design-system',
      'primitives',
      'stack-align-inline',
      global.__BASEURL__,
      'light',
    );
    const { page } = global;

    await loadPage(page, url);

    const image = await takeElementScreenShot(
      page,
      `[data-testid="stack-example"]`,
    );

    expect(image).toMatchProdImageSnapshot();
  });

  it('should spread along the vertical axis', async () => {
    const url = getExampleUrl(
      'design-system',
      'primitives',
      'stack-spread',
      global.__BASEURL__,
      'light',
    );
    const { page } = global;

    await loadPage(page, url);

    const image = await takeElementScreenShot(
      page,
      `[data-testid="stack-example"]`,
    );

    expect(image).toMatchProdImageSnapshot();
  });

  it('should optionally grow to fit container', async () => {
    const url = getExampleUrl(
      'design-system',
      'primitives',
      'stack-grow',
      global.__BASEURL__,
      'light',
    );
    const { page } = global;

    await loadPage(page, url);

    const image = await takeElementScreenShot(
      page,
      `[data-testid="stack-example"]`,
    );

    expect(image).toMatchProdImageSnapshot();
  });
});
