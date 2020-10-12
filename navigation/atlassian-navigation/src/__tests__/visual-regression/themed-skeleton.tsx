import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const atlassianNavigation = "[data-testid='atlassian-navigation-header']";
const toggleSkeleton = "[data-testid='toggle-skeleton']";
const changeTheme = "[data-testid='change-theme']";

describe('<AtlassianNavigation />', () => {
  const url = getExampleUrl(
    'navigation',
    'atlassian-navigation',
    'skeleton-buttons',
    global.__BASEURL__,
  );

  const openExamplesAndWaitFor = async (
    selector: string,
    viewportWidth: 'small' | 'large' = 'large',
  ) => {
    const { page } = global;

    await page.setViewport({
      width: viewportWidth === 'large' ? 1680 : 800,
      height: 800,
    });

    await loadPage(page, url);
    await page.waitForSelector(selector);
  };

  it('should render the skeleton button example', async () => {
    const { page } = global;
    await openExamplesAndWaitFor(atlassianNavigation);

    expect(
      await takeElementScreenShot(page, atlassianNavigation),
    ).toMatchProdImageSnapshot();
  });

  it('should render the skeleton button example with regular buttons', async () => {
    const { page } = global;
    await openExamplesAndWaitFor(atlassianNavigation);

    // Toggling the toolbar reflows the buttons.
    await page.waitForSelector(toggleSkeleton);
    await page.click(toggleSkeleton);

    // Wait for new layout (create buttons get switched out from 'CREATE' to '+')
    await page.waitForSelector('#createGlobalItemIconButton');

    expect(
      await takeElementScreenShot(page, atlassianNavigation),
    ).toMatchProdImageSnapshot();
  });

  it('should render the skeleton button example with skeleton buttons with a different theme', async () => {
    const { page } = global;
    await openExamplesAndWaitFor(atlassianNavigation);
    await page.waitForSelector(changeTheme);
    await page.click(changeTheme);

    expect(
      await takeElementScreenShot(page, atlassianNavigation),
    ).toMatchProdImageSnapshot();
  });

  it('should render the skeleton button example with regular buttons with a different theme', async () => {
    const { page } = global;
    await openExamplesAndWaitFor(atlassianNavigation);
    await page.waitForSelector(changeTheme);
    await page.click(changeTheme);
    await page.click(toggleSkeleton);

    expect(
      await takeElementScreenShot(page, atlassianNavigation),
    ).toMatchProdImageSnapshot();
  });
});
