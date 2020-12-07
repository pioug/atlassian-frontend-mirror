import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
  waitForElementCount,
} from '@atlaskit/visual-regression/helper';

const header = "[data-testid='themed-header']";
const primaryActions = "[data-testid='themed-primary-actions']";
const secondaryActions = "[data-testid='themed-secondary-actions']";
const productHomeLogo = "[data-testid='jira-home-logo']";
const productHomeIcon = "[data-testid='jira-home-icon']";

describe('<AtlassianNavigation />', () => {
  const url = getExampleUrl(
    'navigation',
    'atlassian-navigation',
    'themed-navigation',
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

  it('should render the themed header', async () => {
    const { page } = global;
    await openExamplesAndWaitFor(header);

    expect(
      await takeElementScreenShot(page, header),
    ).toMatchProdImageSnapshot();
  });

  it('should render the themed product logo', async () => {
    const { page } = global;
    await openExamplesAndWaitFor(header);

    expect(
      await takeElementScreenShot(page, productHomeLogo),
    ).toMatchProdImageSnapshot();
  });

  it('should render the themed product icon', async () => {
    const { page } = global;
    await openExamplesAndWaitFor(header, 'small');

    expect(
      await takeElementScreenShot(page, productHomeIcon),
    ).toMatchProdImageSnapshot();
  });

  it('should render the themed header primary actions', async () => {
    const { page } = global;
    await openExamplesAndWaitFor(header);

    expect(
      await takeElementScreenShot(page, primaryActions),
    ).toMatchProdImageSnapshot();
  });

  it('should render the themed header secondary actions', async () => {
    const { page } = global;
    await openExamplesAndWaitFor(header);

    expect(
      await takeElementScreenShot(page, secondaryActions),
    ).toMatchProdImageSnapshot();
  });

  it('should render all themed navigation example', async () => {
    const url = getExampleUrl(
      'navigation',
      'atlassian-navigation',
      'theming-example',
      global.__BASEURL__,
    );

    const { page } = global;

    await page.setViewport({
      width: 1280,
      height: 800,
    });
    await loadPage(page, url);
    await waitForElementCount(page, 'header[role = "banner"]', 6);
    // This particular test was inconsistent. It was due to the difference in some shadow around the icons buttons.
    // Increase the failureThreshold will avoid this issue but will still capture unwanted changes.
    expect(await page.screenshot()).toMatchProdImageSnapshot({
      failureThreshold: '0.003',
      failureThresholdType: 'percent',
    });
  });
});
