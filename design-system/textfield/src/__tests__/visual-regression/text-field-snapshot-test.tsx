import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
  });

  it('Textfield variations should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'textfield',
      'variations',
      global.__BASEURL__,
    );

    await loadPage(page, url);

    await page.waitForSelector('input[disabled]');
    await page.waitForSelector('input[required]');
    const image = await takeElementScreenShot(page, '#variations');
    expect(image).toMatchProdImageSnapshot();
  });

  it('Textfield elements-before-and-after should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'textfield',
      'elements-before-and-after',
      global.__BASEURL__,
    );

    await loadPage(page, url);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Textfield widths should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'textfield',
      'widths',
      global.__BASEURL__,
    );

    await loadPage(page, url);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Textfield customisation should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'textfield',
      'customisation',
      global.__BASEURL__,
    );

    await loadPage(page, url);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Should display validation based on Textfield validity in production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'textfield',
      'form-validation',
      global.__BASEURL__,
    );

    await loadPage(page, url);
    const selector = '[data-testid="formValidationTest"]';
    await page.waitForSelector(selector);

    const imageBeforeTypingText = await page.screenshot();
    expect(imageBeforeTypingText).toMatchProdImageSnapshot();

    await page.type(selector, 'open');
    const imageAfterTypingPartialInvalidText = await page.screenshot();
    expect(imageAfterTypingPartialInvalidText).toMatchProdImageSnapshot();

    await page.type(selector, ' sesame');
    const imageAfterTypingCompleteValidText = await page.screenshot();
    expect(imageAfterTypingCompleteValidText).toMatchProdImageSnapshot();
  });
});
