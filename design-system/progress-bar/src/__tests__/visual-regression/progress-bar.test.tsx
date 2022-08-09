import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const selector = '[data-testid="progress-bar"]';

describe('progress bar snapshots', () => {
  it.each(['none', 'light', 'dark'] as const)(
    'should match the default appearance with %s tokens',
    async (tokens) => {
      const url = getExampleUrl(
        'design-system',
        'progress-bar',
        'basic',
        global.__BASEURL__,
        tokens,
      );
      const { page } = global;

      await loadPage(page, url);
      await page.waitForSelector(selector);
      const image = await takeElementScreenShot(page, selector);

      expect(image).toMatchProdImageSnapshot();
    },
  );

  it.each(['none', 'light', 'dark'] as const)(
    'should match the indeterminate appearance with %s tokens',
    async (tokens) => {
      const url = getExampleUrl(
        'design-system',
        'progress-bar',
        'indeterminate',
        global.__BASEURL__,
        tokens,
      );
      const { page } = global;

      await loadPage(page, url);
      await page.waitForSelector(selector);
      const image = await takeElementScreenShot(page, selector);

      expect(image).toMatchProdImageSnapshot();
    },
  );

  it.each(['none', 'light', 'dark'] as const)(
    'should match the success-progress-bar appearance with %s tokens',
    async (tokens) => {
      const url = getExampleUrl(
        'design-system',
        'progress-bar',
        'success-progress-bar',
        global.__BASEURL__,
        tokens,
      );
      const { page } = global;

      await loadPage(page, url);
      await page.waitForSelector(selector);
      const image = await takeElementScreenShot(page, selector);

      expect(image).toMatchProdImageSnapshot();
    },
  );

  it.each(['none', 'light', 'dark'] as const)(
    'should match the transparent-progress-bar appearance with %s tokens',
    async (tokens) => {
      const url = getExampleUrl(
        'design-system',
        'progress-bar',
        'transparent-progress-bar',
        global.__BASEURL__,
        tokens,
      );
      const { page } = global;

      await loadPage(page, url);
      await page.waitForSelector(selector);
      const image = await takeElementScreenShot(page, selector);

      expect(image).toMatchProdImageSnapshot();
    },
  );
});
