import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

declare var global: any;

const withAdjacentSections = "[data-testid='with-adjacent-sections']";
const mockStarredMenu = "[data-testid='mock-starred-menu']";

describe('<PopupMenuGroup />', () => {
  const openExamplesAndWaitFor = async (selector: string) => {
    const url = getExampleUrl(
      'design-system',
      'menu',
      'menu-group',
      global.__BASEURL__,
    );
    const { page } = global;

    await loadPage(page, url);
    await page.setViewport({ width: 1920, height: 1080 });
    await page.waitForSelector(selector);
  };

  it('should match the MenuGroup with adjecent sections', async () => {
    await openExamplesAndWaitFor(withAdjacentSections);

    expect(
      await takeElementScreenShot(global.page, withAdjacentSections),
    ).toMatchProdImageSnapshot();
  });

  it('should match the PopupMenuGroup', async () => {
    await openExamplesAndWaitFor(withAdjacentSections);

    await global.page.hover(mockStarredMenu);

    expect(
      await takeElementScreenShot(global.page, mockStarredMenu),
    ).toMatchProdImageSnapshot();
  });

  it('should match the adjacent sections menu when Favourite articles scrolled down', async () => {
    await openExamplesAndWaitFor(withAdjacentSections);

    await global.page.focus(
      '[aria-label="Favourite articles"] > button:last-child',
    );

    expect(
      await takeElementScreenShot(global.page, withAdjacentSections),
    ).toMatchProdImageSnapshot();
  });
});
