import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const viewport = { width: 465, height: 3500 };

describe('Snapshot Test', () => {
  it('should display config panels with fields correctly', async () => {
    const url = getExampleUrl(
      'editor',
      'editor-core',
      'config-panel-with-parameters',
    );
    const { page } = global;
    await loadPage(page, url);
    await page.setViewport(viewport);
    await page.waitForSelector('[data-testid="extension-config-panel"]');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('should display select options with icons correctly', async () => {
    const url = getExampleUrl(
      'editor',
      'editor-core',
      'config-panel-with-parameters',
    );
    const iconSelectSelector = 'div[id^="enum-select-icon"]';
    const { page } = global;
    await loadPage(page, url);
    await page.setViewport(viewport);
    await page.waitForSelector('[data-testid="extension-config-panel"]');

    await page.click(iconSelectSelector);
    const iconSelectDropDownSelector =
      'div[id^="enum-select-icon"] div[class*="MenuList"]';
    const image = await takeElementScreenShot(page, iconSelectDropDownSelector);
    expect(image).toMatchProdImageSnapshot();
  });
});
