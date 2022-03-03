import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const themedSkeleton0 = "[data-testid='themed-skeleton-0']";
const themedSkeleton5 = "[data-testid='themed-skeleton-5']";

describe('<AtlassianNavigation />', () => {
  const url = getExampleUrl(
    'navigation',
    'atlassian-navigation',
    'themed-skeleton-example',
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

  it('should render the first themed skeleton example', async () => {
    const { page } = global;
    await openExamplesAndWaitFor(themedSkeleton0);

    expect(
      await takeElementScreenShot(page, themedSkeleton0),
    ).toMatchProdImageSnapshot();
  });

  it('should render the last themed skeleton example', async () => {
    const { page } = global;
    await openExamplesAndWaitFor(themedSkeleton5);

    expect(
      await takeElementScreenShot(page, themedSkeleton5),
    ).toMatchProdImageSnapshot();
  });
});
