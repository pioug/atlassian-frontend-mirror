import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

// Css-selectors
const examples = '#examples';
const menu = "[data-testid='menu']";
const button1 = "[data-testid='button--1']";
const button2 = "[data-testid='button--2']";
const button3 = "[data-testid='button--3']";
const button4 = "[data-testid='button--4']";
const button5 = "[data-testid='button--5']";

describe('Snapshot Test', () => {
  let page: PuppeteerPage;
  let url: string;

  beforeAll(async () => {
    page = global.page;
    url = getExampleUrl(
      'design-system',
      'motion',
      'resizing-height',

      global.__BASEURL__,
    );
    await loadPage(page, url);
  });

  it('Motion example resizing height should match production example when adding 1 element', async () => {
    await page.waitForSelector(examples);
    await page.waitForSelector(button1);
    await page.click(button1);
    await page.waitForSelector(menu);
    // The motionanimation takes 0.2s but due to the rendering it takes more time to load.
    await page.waitForTimeout(500);
    const image = await takeElementScreenShot(page, menu);
    // Threshold is there to avoid false-positive with the fade.
    expect(image).toMatchProdImageSnapshot({
      failureThreshold: '50',
      failureThresholdType: 'pixel',
    });
  });

  it('Motion example resizing height should match production example when adding 2 elements', async () => {
    await page.waitForSelector(examples);
    await page.waitForSelector(button2);
    await page.click(button2);
    await page.waitForSelector(menu);
    // The motionanimation takes 0.2s but due to the rendering it takes more time to load.
    await page.waitForTimeout(500);
    const image = await takeElementScreenShot(page, menu);
    // Threshold is there to avoid false-positive with the fade.
    expect(image).toMatchProdImageSnapshot({
      failureThreshold: '50',
      failureThresholdType: 'pixel',
    });
  });

  it('Motion example resizing height should match production example when adding 3 elements', async () => {
    await page.waitForSelector(examples);
    await page.waitForSelector(button3);
    await page.click(button3);
    await page.waitForSelector(menu);
    // The motionanimation takes 0.2s but due to the rendering it takes more time to load.
    await page.waitForTimeout(500);
    const image = await takeElementScreenShot(page, menu);
    // Threshold is there to avoid false-positive with the fade.
    // It increased with the number of elements in the menu.
    expect(image).toMatchProdImageSnapshot({
      failureThreshold: '250',
      failureThresholdType: 'pixel',
    });
  });

  it('Motion example resizing height should match production example when adding 4 elements', async () => {
    await page.waitForSelector(examples);
    await page.waitForSelector(button4);
    await page.click(button4);
    await page.waitForSelector(menu);
    // The motionanimation takes 0.2s but due to the rendering it takes more time to load more elements.
    await page.waitForTimeout(800);
    const image = await takeElementScreenShot(page, menu);
    // Threshold is there to avoid false-positive with the fade.
    // It increased with the number of elements in the menu.
    expect(image).toMatchProdImageSnapshot({
      failureThreshold: '100',
      failureThresholdType: 'pixel',
    });
  });

  it('Motion example resizing height should match production example when adding 5 elements', async () => {
    await page.waitForSelector(examples);
    await page.waitForSelector(button5);
    await page.click(button5);
    await page.waitForSelector(menu);
    // The motionanimation takes 0.2s but due to the rendering it takes more time to more elements.
    await page.waitForTimeout(800);
    const image = await takeElementScreenShot(page, menu);
    // Threshold is there to avoid false-positive with the fade.
    // It increased with the number of elements in the menu.
    expect(image).toMatchProdImageSnapshot({
      failureThreshold: '100',
      failureThresholdType: 'pixel',
    });
  });
});
