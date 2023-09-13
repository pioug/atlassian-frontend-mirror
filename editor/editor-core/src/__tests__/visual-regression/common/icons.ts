import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Editor icons', () => {
  it.skip.each(['none', 'light', 'dark'] as const)(
    'should render correctly in %s theme',
    async (theme) => {
      const url = getExampleUrl(
        'editor',
        'editor-core',
        'quick-insert-icons',
        global.__BASEURL__,
        theme,
      );
      const { page } = global;
      await page.setViewport({ width: 600, height: 600 });
      await loadPage(page, url);

      const image = await page.screenshot();
      expect(image).toMatchProdImageSnapshot();
    },
  );
});
