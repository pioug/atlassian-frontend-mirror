import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const menuTrigger = "[data-testid='overflow-menu-trigger']";
const menuPopup = "[data-testid='overflow-menu-popup']";
const dashboardsButton = "[data-testid='Dashboards']";
const projectsTrigger = "[data-testid='Projects-popup-trigger']";
const projectsPopup = "[data-testid='Projects-popup']";
const itServicesButton = "[data-testid='it-services']";
const createIconButton = "[data-testid='create-cta-icon-button']";
const createButton = "[data-testid='create-cta-button']";

describe('<AtlassianNavigation />', () => {
  const url = getExampleUrl(
    'navigation',
    'atlassian-navigation',
    'jira-integration-example',
    global.__BASEURL__,
  );

  const openExamplesAndWaitFor = async (selector: string) => {
    const { page } = global;
    await page.setViewport({
      height: 800,
      width: 800,
    });
    await loadPage(page, url);
    await page.waitForSelector(selector);
  };

  // Investigate why the tests fail on CI
  it.skip('should match the open menu on dropdown item click in a regular menu', async () => {
    const { page } = global;
    await openExamplesAndWaitFor(menuTrigger);
    await page.click(projectsTrigger);
    await page.waitForSelector(projectsPopup);
    await page.click(itServicesButton);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  // Investigate why the tests fail on CI
  it.skip('should match the closed overflow menu on dropdown item click snapshot', async () => {
    const { page } = global;
    await openExamplesAndWaitFor(menuTrigger);
    await page.click(menuTrigger);
    await page.waitForSelector(menuPopup);
    await page.click(dashboardsButton);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('should match the large screen create icon without overflow menu with production example', async () => {
    const { page } = global;

    await page.setViewport({
      height: 800,
      width: 1400,
    });
    await loadPage(page, url);
    await page.waitForSelector(createButton);

    const image = await takeElementScreenShot(page, createButton);
    expect(image).toMatchProdImageSnapshot();
  });

  it('should match the small screen create icon with production example', async () => {
    const { page } = global;
    await openExamplesAndWaitFor(createIconButton);

    const image = await takeElementScreenShot(page, createIconButton);
    expect(image).toMatchProdImageSnapshot();
  });

  it('should match overflow menu with production example', async () => {
    const { page } = global;
    await openExamplesAndWaitFor(menuTrigger);
    await page.click(menuTrigger);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
