import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const checkbox = "[data-testid='cb-basic--checkbox-label']";
const invalidCheckbox = "[data-testid='cb-invalid--checkbox-label']";

async function waitForCheckboxes(page: any) {
  await page.waitForSelector(checkbox);
  await page.waitForSelector(invalidCheckbox);
}

describe('Snapshot Test', () => {
  it('Basic usage example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'checkbox',
      'basic-usage',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await waitForCheckboxes(page);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Default checkbox should render correctly under all interactions', async () => {
    const { __BASEURL__, page } = global;
    const url = getExampleUrl(
      'design-system',
      'checkbox',
      'basic-usage',
      __BASEURL__,
    );
    await loadPage(page, url);
    await waitForCheckboxes(page);

    const defaultImg = await takeElementScreenShot(page, checkbox);
    expect(defaultImg).toMatchProdImageSnapshot();

    await page.focus(checkbox);
    const focusedImg = await takeElementScreenShot(page, checkbox);
    expect(focusedImg).toMatchProdImageSnapshot();

    await page.click(checkbox);
    const focusedAndSelectedImg = await takeElementScreenShot(page, checkbox);
    expect(focusedAndSelectedImg).toMatchProdImageSnapshot();

    await page.click(invalidCheckbox); //blur the default checkbox
    const selectedImg = await takeElementScreenShot(page, checkbox);
    expect(selectedImg).toMatchProdImageSnapshot();
  });

  it('Invalid checkbox should render correctly under all interactions', async () => {
    const { __BASEURL__, page } = global;
    const url = getExampleUrl(
      'design-system',
      'checkbox',
      'basic-usage',
      __BASEURL__,
    );
    await loadPage(page, url);
    await waitForCheckboxes(page);

    const defaultImg = await takeElementScreenShot(page, invalidCheckbox);
    expect(defaultImg).toMatchProdImageSnapshot();

    await page.focus(invalidCheckbox);
    const focusedImg = await takeElementScreenShot(page, invalidCheckbox);
    expect(focusedImg).toMatchProdImageSnapshot();

    await page.click(invalidCheckbox);
    const focusedAndSelectedImg = await takeElementScreenShot(
      page,
      invalidCheckbox,
    );
    expect(focusedAndSelectedImg).toMatchProdImageSnapshot();

    await page.click(checkbox); //blur the default invalidCheckbox
    const selectedImg = await takeElementScreenShot(page, invalidCheckbox);
    expect(selectedImg).toMatchProdImageSnapshot();
  });
});
