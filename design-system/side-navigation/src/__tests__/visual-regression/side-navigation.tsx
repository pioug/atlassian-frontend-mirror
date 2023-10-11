import {
  disableAllSideEffects,
  getExampleUrl,
  navigateToUrl,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

// Css-selectors
const sideNavigation = "[data-testid='side-navigation']";
const filterNestingItem = "[data-testid='filter-nesting-item--item']";

const clickNextButton = async () => {
  const { page } = global;

  const nextButton = await page.$$('[data-testid="spotlight--dialog"] button');
  await nextButton[0].click();
};

type openFnOpts = Partial<{
  screenSize: { width: number; height: number };
  disableSideEffects: boolean;
  theme: 'dark' | 'light' | 'none';
}>;

describe('<SideNavigation /> integration tests', () => {
  const openExamplesAndWaitFor = async (
    example: string,
    selector: string,
    optsOverrides: openFnOpts = {},
  ) => {
    const { screenSize, disableSideEffects, theme } = Object.assign(
      {
        screenSize: {
          width: 1920,
          height: 800,
        },
        disableSideEffects: true,
        theme: 'none',
      },
      optsOverrides,
    );

    const url = getExampleUrl(
      'design-system',
      'side-navigation',
      example,
      global.__BASEURL__,
      theme,
    );

    const { page } = global;

    await navigateToUrl(page, url, false);
    if (disableSideEffects) {
      await disableAllSideEffects(page);
    }
    await page.waitForSelector('#examples');

    await page.setViewport(screenSize);
    await page.waitForSelector(selector);
  };

  it('should match the simple sidebar', async () => {
    await openExamplesAndWaitFor('simple-sidebar', sideNavigation);

    expect(
      await takeElementScreenShot(global.page, sideNavigation),
    ).toMatchProdImageSnapshot();
  });

  it('should match the top level view for nested navigation', async () => {
    await openExamplesAndWaitFor('nested-side-navigation', sideNavigation);

    expect(
      await takeElementScreenShot(global.page, sideNavigation),
    ).toMatchProdImageSnapshot();
  });

  it('should match nested navigation custom icon with production example', async () => {
    await openExamplesAndWaitFor(
      'nested-side-navigation',
      '[data-custom-icon]',
    );

    expect(
      await takeElementScreenShot(global.page, sideNavigation),
    ).toMatchProdImageSnapshot();
  });

  it('should match nested navigation hover icon behaviour with production example', async () => {
    await openExamplesAndWaitFor(
      'nested-side-navigation',
      '[data-custom-icon]',
    );

    const { page } = global;
    await page.hover('[data-custom-icon]');
    expect(
      await takeElementScreenShot(global.page, sideNavigation),
    ).toMatchProdImageSnapshot();
  });

  it('should render a scrollable section when items overflow', async () => {
    await openExamplesAndWaitFor('nested-side-navigation', sideNavigation, {
      screenSize: {
        width: 1920,
        height: 400,
      },
      // Keep side effects enabled in VR to allow CSS transitions
      // which are needed for the nested menu component
      disableSideEffects: false,
    });
    const { page } = global;
    await page.waitForSelector(filterNestingItem);
    await page.click(filterNestingItem);

    // Wait for the animation to finish
    await page.waitForTimeout(1000);

    expect(
      await takeElementScreenShot(page, sideNavigation),
    ).toMatchProdImageSnapshot();
  });

  it('should not render a scrollable section when items do not overflow', async () => {
    await openExamplesAndWaitFor('nested-side-navigation', sideNavigation, {
      // Keep side effects enabled in VR allow CSS transitions
      // which are needed for the nested menu component
      disableSideEffects: false,
    });
    const { page } = global;
    await page.waitForSelector(filterNestingItem);
    await page.click(filterNestingItem);

    // Wait for the animation to finish
    await page.waitForTimeout(1000);

    expect(
      await takeElementScreenShot(global.page, sideNavigation),
    ).toMatchProdImageSnapshot();
  });

  it('should match the static loading skeletons', async () => {
    await openExamplesAndWaitFor('loading-skeletons', sideNavigation);

    expect(
      await takeElementScreenShot(global.page, sideNavigation),
    ).toMatchProdImageSnapshot();
  });

  it('should match the static loading skeletons when nested', async () => {
    await openExamplesAndWaitFor('loading-skeletons-nested', sideNavigation);

    expect(
      await takeElementScreenShot(global.page, sideNavigation),
    ).toMatchProdImageSnapshot();
  });

  it('should match customised component example', async () => {
    await openExamplesAndWaitFor('customised-components', sideNavigation);

    expect(
      await takeElementScreenShot(global.page, sideNavigation),
    ).toMatchProdImageSnapshot();
  });

  it('should match the spotlight example', async () => {
    const { page } = global;
    const startSpotlight = '#show-spotlight';

    const buttonItemSpotlight = '[data-testid="buttonItemSpotlightMessage"]';
    const linkItemSpotlight = '[data-testid="linkItemSpotlightMessage"]';
    const disabledItemSpotlight =
      '[data-testid="disabledItemSpotlightMessage"]';
    const nestingItemSpotlight = '[data-testid="nestingItemSpotlightMessage"]';
    const selectedNestingItemSpotlight =
      '[data-testid="selectedNestingItemSpotlightMessage"]';

    const spotlightClone = '[data-testid="spotlight--target"]';

    await openExamplesAndWaitFor('with-spotlight', sideNavigation);

    await page.click(startSpotlight);
    await page.waitForSelector(buttonItemSpotlight);
    expect(
      await takeElementScreenShot(global.page, spotlightClone),
    ).toMatchProdImageSnapshot();

    await clickNextButton();
    await page.waitForSelector(linkItemSpotlight);
    expect(
      await takeElementScreenShot(global.page, spotlightClone),
    ).toMatchProdImageSnapshot();

    await clickNextButton();
    await page.waitForSelector(disabledItemSpotlight);
    expect(
      await takeElementScreenShot(global.page, spotlightClone),
    ).toMatchProdImageSnapshot();

    await clickNextButton();
    await page.waitForSelector(nestingItemSpotlight);
    expect(
      await takeElementScreenShot(global.page, spotlightClone),
    ).toMatchProdImageSnapshot();

    await clickNextButton();
    await page.waitForSelector(selectedNestingItemSpotlight);
    expect(
      await takeElementScreenShot(global.page, spotlightClone),
    ).toMatchProdImageSnapshot();
  });

  it('should match the hover states', async () => {
    const settingsButton = "[data-testid='settings-nesting-item--item']";
    const dropboxButton = "[data-testid='dropbox-nesting-item--item']";

    await openExamplesAndWaitFor(
      'nested-side-navigation',
      '[data-custom-icon]',
    );

    const { page } = global;
    await page.hover(settingsButton);

    expect(
      await takeElementScreenShot(global.page, settingsButton),
    ).toMatchProdImageSnapshot();

    await page.hover(dropboxButton);

    expect(
      await takeElementScreenShot(global.page, dropboxButton),
    ).toMatchProdImageSnapshot();
  });

  it('should match the active states', async () => {
    const settingsButton = "[data-testid='settings-nesting-item--item']";
    const dropboxButton = "[data-testid='dropbox-nesting-item--item']";

    await openExamplesAndWaitFor(
      'nested-side-navigation',
      '[data-custom-icon]',
    );

    const { page } = global;

    await page.waitForSelector(settingsButton);
    await page.hover(settingsButton);
    await page.mouse.down();

    expect(
      await takeElementScreenShot(global.page, settingsButton),
    ).toMatchProdImageSnapshot();

    await page.waitForSelector(dropboxButton);
    await page.hover(dropboxButton);
    await page.mouse.down();

    expect(
      await takeElementScreenShot(global.page, dropboxButton),
    ).toMatchProdImageSnapshot();
  });

  it('should match styles for Section', async () => {
    const testId = '[data-testid="navigation-content-for-sections"]';
    await openExamplesAndWaitFor('section', testId, {
      screenSize: {
        width: 400,
        height: 800,
      },
    });

    expect(
      await takeElementScreenShot(global.page, testId),
    ).toMatchProdImageSnapshot();
  });
});
