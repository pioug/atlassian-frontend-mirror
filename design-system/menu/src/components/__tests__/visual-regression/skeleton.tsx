import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

declare var global: any;

const toggleButton = "[data-testid='toggle-loading']";
const leftMenu = "[data-testid='left-menu']";

/**
 * The skeleton should match the loaded menu dimensions pixel perfectly.
 * It should not move things around when loading in.
 * If these tests fail - ensure that this behaviour still exists.
 */
describe('<SkeletonMenu />', () => {
  const openExamplesAndWaitFor = async (selector: string) => {
    const url = getExampleUrl(
      'design-system',
      'menu',
      'skeleton-items',
      global.__BASEURL__,
    );
    const { page } = global;

    await loadPage(page, url);
    await page.waitForSelector(selector);
  };

  it('should match the loading skeleton menu', async () => {
    await openExamplesAndWaitFor(leftMenu);

    expect(
      await takeElementScreenShot(global.page, leftMenu),
    ).toMatchProdImageSnapshot();
  });

  it('should match the loaded menu', async () => {
    await openExamplesAndWaitFor(leftMenu);
    const { page } = global;
    await page.click(toggleButton);

    expect(
      await takeElementScreenShot(page, leftMenu),
    ).toMatchProdImageSnapshot();
  });
});
