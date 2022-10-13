import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
} from '@atlaskit/visual-regression/helper';

describe('UserPicker VR Snapshot Test', () => {
  const getUserPickerExampleUrl = (exampleName: string) =>
    getExampleUrl('elements', 'user-picker', exampleName, global.__BASEURL__);

  describe('single user picker', () => {
    it('standard', async () => {
      const page: PuppeteerPage = global.page;
      await loadPage(page, getUserPickerExampleUrl('single'));
      const image = await page.screenshot();
      expect(image).toMatchProdImageSnapshot();
    });

    it('compact', async () => {
      const page: PuppeteerPage = global.page;
      await loadPage(page, getUserPickerExampleUrl('single-compact'));
      const image = await page.screenshot();
      expect(image).toMatchProdImageSnapshot();
    });

    it('subtle', async () => {
      const page: PuppeteerPage = global.page;
      await loadPage(page, getUserPickerExampleUrl('single-subtle'));
      const image = await page.screenshot();
      expect(image).toMatchProdImageSnapshot();
    });

    it('subtle and compact', async () => {
      const page: PuppeteerPage = global.page;
      await loadPage(
        page,
        getUserPickerExampleUrl('single-subtle-and-compact'),
      );
      const image = await page.screenshot();
      expect(image).toMatchProdImageSnapshot();
    });
  });

  describe('multi user picker', () => {
    it('standard', async () => {
      const page: PuppeteerPage = global.page;
      await loadPage(page, getUserPickerExampleUrl('multi'));
      const image = await page.screenshot();
      expect(image).toMatchProdImageSnapshot();
    });

    it('compact', async () => {
      const page: PuppeteerPage = global.page;
      await loadPage(page, getUserPickerExampleUrl('multi-compact'));
      const image = await page.screenshot();
      expect(image).toMatchProdImageSnapshot();
    });

    it('with default values', async () => {
      const page: PuppeteerPage = global.page;
      await loadPage(
        page,
        getUserPickerExampleUrl('multi-with-default-values'),
      );
      const image = await page.screenshot();
      expect(image).toMatchProdImageSnapshot();
    });
  });
});
