import {
  getExampleUrl,
  takeScreenShot,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const checkbox = "[data-testid='cb-basic--checkbox-label']";
const invalidCheckbox = "[data-testid='cb-invalid--checkbox-label']";

describe('Snapshot Test', () => {
  it('Basic usage example should match production example', async () => {
    const url = getExampleUrl(
      'core',
      'checkbox',
      'basic-usage',
      global.__BASEURL__,
    );
    const image = await takeScreenShot(global.page, url);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Default checkbox should render correctly under all interactions', async () => {
    const { __BASEURL__, page } = global;
    const url = getExampleUrl('core', 'checkbox', 'basic-usage', __BASEURL__);
    await page.goto(url);

    await page.waitForSelector(checkbox);
    await page.waitForSelector(invalidCheckbox);
    const defaultImg = await takeElementScreenShot(page, checkbox);
    expect(defaultImg).toMatchProdImageSnapshot();

    await page.focus(checkbox);
    await page.waitFor(500);
    const focusedImg = await takeElementScreenShot(page, checkbox);
    expect(focusedImg).toMatchProdImageSnapshot();

    await page.click(checkbox);
    await page.waitFor(500);
    const focusedAndSelectedImg = await takeElementScreenShot(page, checkbox);
    expect(focusedAndSelectedImg).toMatchProdImageSnapshot();

    await page.click(invalidCheckbox); //blur the default checkbox
    await page.waitFor(500);
    const selectedImg = await takeElementScreenShot(page, checkbox);
    expect(selectedImg).toMatchProdImageSnapshot();
  });

  it('Invalid checkbox should render correctly under all interactions', async () => {
    const { __BASEURL__, page } = global;
    const url = getExampleUrl('core', 'checkbox', 'basic-usage', __BASEURL__);
    await page.goto(url);

    await page.waitForSelector(checkbox);
    await page.waitForSelector(invalidCheckbox);
    const defaultImg = await takeElementScreenShot(page, invalidCheckbox);
    expect(defaultImg).toMatchProdImageSnapshot();

    await page.focus(invalidCheckbox);
    await page.waitFor(500);
    const focusedImg = await takeElementScreenShot(page, invalidCheckbox);
    expect(focusedImg).toMatchProdImageSnapshot();

    await page.click(invalidCheckbox);
    await page.waitFor(500);
    const focusedAndSelectedImg = await takeElementScreenShot(
      page,
      invalidCheckbox,
    );
    expect(focusedAndSelectedImg).toMatchProdImageSnapshot();

    await page.click(checkbox); //blur the default invalidCheckbox
    await page.waitFor(500);
    const selectedImg = await takeElementScreenShot(page, invalidCheckbox);
    expect(selectedImg).toMatchProdImageSnapshot();
  });
});
