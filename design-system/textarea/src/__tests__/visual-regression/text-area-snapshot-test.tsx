import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const docsText =
  'The default export of @atlaskit/textarea is a hybrid uncontrolled/controlled component; it is uncontrolled by default, but can be optionally controlled by setting the value prop. To set a default value for TextArea while leaving component uncontrolled, specify a defaultValue prop.';

describe('TextArea', () => {
  let page: PuppeteerPage;
  let url: string;

  describe('Basic', () => {
    beforeAll(async () => {
      page = global.page;
      url = getExampleUrl(
        'design-system',
        'textarea',
        'basic',
        global.__BASEURL__,
      );
      await loadPage(page, url);
      await page.waitForSelector('#smart textarea');
    });

    it('example should match production', async () => {
      const image = await page.screenshot();
      expect(image).toMatchProdImageSnapshot();
    });

    it('should become blue and white onFocus & grey on blur', async () => {
      await page.waitForSelector('button');

      const imageBeforeFocus = await takeElementScreenShot(page, 'div#smart');
      expect(imageBeforeFocus).toMatchProdImageSnapshot();

      await page.click('button');

      const imageOnFocus = await takeElementScreenShot(page, 'div#smart');
      expect(imageOnFocus).toMatchProdImageSnapshot();

      await page.click('#smart');

      const imageOnBlur = await takeElementScreenShot(page, 'div#smart');
      expect(imageOnBlur).toMatchProdImageSnapshot();
    });
  });

  describe('Appearance', () => {
    beforeAll(async () => {
      page = global.page;
      url = getExampleUrl(
        'design-system',
        'textarea',
        'appearance',
        global.__BASEURL__,
      );
      await loadPage(page, url);
      await page.waitForSelector('#appearance textarea');
    });

    it('example should match production', async () => {
      const image = await page.screenshot();
      expect(image).toMatchProdImageSnapshot();
    });
  });

  describe('Resize', () => {
    beforeAll(async () => {
      page = global.page;
      url = getExampleUrl(
        'design-system',
        'textarea',
        'resize',
        global.__BASEURL__,
      );
      await loadPage(page, url);
      await page.waitForSelector('#resize textarea');
    });

    it('example should match production', async () => {
      const image = await page.screenshot();
      expect(image).toMatchProdImageSnapshot();
    });

    // FIXME: This test was automatically skipped due to failure on 31/08/2022: https://product-fabric.atlassian.net/browse/DSP-6599
    it.skip('should auto increase/decrease height of resize:smart(default) textarea based on content', async () => {
      const selector = '[data-testid="smartResizeTextArea"]';
      const clearTextSelector = '[data-testid="clearTextButton"]';
      const insertTextSelector = '[data-testid="insertTextButton"]';

      await page.waitForSelector(selector);
      await page.waitForSelector(clearTextSelector);
      await page.waitForSelector(insertTextSelector);

      // Manual input
      const imageBeforeTypingLongText = await takeElementScreenShot(
        page,
        selector,
      );
      expect(imageBeforeTypingLongText).toMatchProdImageSnapshot();

      await page.type(selector, docsText);
      const imageAfterTypingLongText = await takeElementScreenShot(
        page,
        selector,
      );
      expect(imageAfterTypingLongText).toMatchProdImageSnapshot();

      await page.click(selector, { clickCount: 3 });
      await page.type(selector, ' ');

      const imageHeightReduceOnRemovingText = await takeElementScreenShot(
        page,
        selector,
      );
      expect(imageHeightReduceOnRemovingText).toMatchProdImageSnapshot();

      // ---- Value prop change
      // Insert text
      await page.click(insertTextSelector);
      const imageAfterValuePropSet = await takeElementScreenShot(
        page,
        selector,
      );
      expect(imageAfterValuePropSet).toMatchProdImageSnapshot();

      // Clear text
      await page.click(clearTextSelector);
      const imageAfterValuePropCleared = await takeElementScreenShot(
        page,
        selector,
      );
      expect(imageAfterValuePropCleared).toMatchProdImageSnapshot();
    });

    it('should not auto increase/decrease height of resize:auto textarea based on content', async () => {
      const selector = '[data-testid="autoResizeTextArea"]';
      await page.waitForSelector(selector);

      const imageBeforeTypingLongText = await takeElementScreenShot(
        page,
        selector,
      );
      expect(imageBeforeTypingLongText).toMatchProdImageSnapshot();

      await page.type(selector, docsText);
      const imageAfterTypingLongText = await takeElementScreenShot(
        page,
        selector,
      );
      expect(imageAfterTypingLongText).toMatchProdImageSnapshot();

      await page.click(selector, { clickCount: 3 });
      await page.type(selector, ' ');

      const imageHeightReduceOnRemovingText = await takeElementScreenShot(
        page,
        selector,
      );
      expect(imageHeightReduceOnRemovingText).toMatchProdImageSnapshot();
    });
  });
});
