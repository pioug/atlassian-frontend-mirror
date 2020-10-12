import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

const searchToggle = '#toggle-search';

describe('<AtlassianNavigation />', () => {
  const url = getExampleUrl(
    'navigation',
    'atlassian-navigation',
    'interactive-skeleton-example',
    global.__BASEURL__,
  );

  const openExamplesAndWaitFor = async (selector: string) => {
    const { page } = global;
    await page.setViewport({
      height: 800,
      width: 1200,
    });
    await loadPage(page, url);
    await page.waitForSelector(selector);
  };

  it('should match skeleton snapshot', async () => {
    const { page } = global;
    await openExamplesAndWaitFor(searchToggle);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('should match skeleton snapshot without search', async () => {
    const { page } = global;
    await openExamplesAndWaitFor(searchToggle);

    await page.click(searchToggle);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
