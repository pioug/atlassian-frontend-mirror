import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

import { PRODUCT_HOME_BREAKPOINT } from '../../common/constants';

const bitbucketNav = `[data-testid='bitbucket-nav-header']`;
const bitbucketProductHome = `[data-testid='bitbucket-product-home-container']`;
const customNav = `[data-testid='custom-nav-header']`;
const customProductHome = `[data-testid='custom-product-home-container']`;

describe('Custom Product Home', () => {
  const url = getExampleUrl(
    'navigation',
    'atlassian-navigation',
    'custom-product-home-example',
    global.__BASEURL__,
  );

  const openExamplesAndWaitFor = async (
    selector: string,
    viewportWidth: 'small' | 'large' = 'large',
  ) => {
    const { page } = global;

    await page.setViewport({
      width: viewportWidth === 'large' ? 1280 : 800,
      height: 800,
    });
    await loadPage(page, url);
    await page.waitForSelector(selector);
  };

  // bitbucket product home

  it('should render Bitbucket nav', async () => {
    const { page } = global;
    await openExamplesAndWaitFor(bitbucketNav);

    expect(
      await takeElementScreenShot(page, bitbucketNav),
    ).toMatchProdImageSnapshot();
  });

  it('should render correct hover state on Bitbucket product home button', async () => {
    const { page } = global;
    await openExamplesAndWaitFor(bitbucketNav);
    await page.hover(bitbucketProductHome);

    expect(
      await takeElementScreenShot(page, bitbucketNav),
    ).toMatchProdImageSnapshot();
  });

  it('should render correct focus state on Bitbucket product home button', async () => {
    const { page } = global;
    await openExamplesAndWaitFor(bitbucketNav);
    await page.focus(bitbucketProductHome);

    expect(
      await takeElementScreenShot(page, bitbucketNav),
    ).toMatchProdImageSnapshot();
  });

  it('should render correct active state on Bitbucket product home button', async () => {
    const { page } = global;
    await openExamplesAndWaitFor(bitbucketNav);
    await page.hover(bitbucketProductHome);
    await page.mouse.down();

    expect(
      await takeElementScreenShot(page, bitbucketNav),
    ).toMatchProdImageSnapshot();
  });

  // custom default product home

  it('should render default custom nav', async () => {
    const { page } = global;
    await openExamplesAndWaitFor(customNav);

    expect(
      await takeElementScreenShot(page, customNav),
    ).toMatchProdImageSnapshot();
  });

  it('should render correct hover state on custom product home button', async () => {
    const { page } = global;
    await openExamplesAndWaitFor(customNav);
    await page.hover(customProductHome);

    expect(
      await takeElementScreenShot(page, customNav),
    ).toMatchProdImageSnapshot();
  });

  it('should render correct focus state on custom product home button', async () => {
    const { page } = global;
    await openExamplesAndWaitFor(customNav);
    await page.focus(customProductHome);

    expect(
      await takeElementScreenShot(page, customNav),
    ).toMatchProdImageSnapshot();
  });

  it('should render correct active state on custom product home button', async () => {
    const { page } = global;
    await openExamplesAndWaitFor(customNav);
    await page.hover(customProductHome);
    await page.mouse.down();

    expect(
      await takeElementScreenShot(page, customNav),
    ).toMatchProdImageSnapshot();
  });

  it('should correctly apply logoMaxWidth', async () => {
    const url = getExampleUrl(
      'navigation',
      'atlassian-navigation',
      'logo-max-width',
    );
    const selector = '[data-testid="custom-product-home-header"]';

    const { page } = global;
    await page.setViewport({
      width: PRODUCT_HOME_BREAKPOINT,
      height: 800,
    });
    await loadPage(page, url);

    await page.waitForSelector(selector);
    const snapshot = await takeElementScreenShot(page, selector);
    expect(snapshot).toMatchProdImageSnapshot();
  });
});
