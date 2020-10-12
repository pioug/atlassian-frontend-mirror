import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const openPickerBtn = 'button';
const colorPalette = "[role='grid']";

describe('Snapshot Test', () => {
  it('Color Palette should match production example', async () => {
    const url = getExampleUrl(
      'jira',
      'color-picker',
      'multi-columns-color-picker',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector(openPickerBtn);
    await page.click(openPickerBtn);
    await page.waitForSelector(colorPalette);

    const image = await takeElementScreenShot(page, colorPalette);
    expect(image).toMatchProdImageSnapshot();
  });
});
