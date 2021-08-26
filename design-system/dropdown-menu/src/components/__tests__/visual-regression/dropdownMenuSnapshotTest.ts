import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

const dropdown = '[data-testid="dropdown--trigger"]';
const dropdownItem = '[data-testid="dropdown--content"]';
const dialogBox = '[data-testid="dialogBox"]';

describe('Snapshot Test', () => {
  it('Dropdown-menu modal should match snapshot when open with keyboard', async () => {
    const url = getExampleUrl(
      'design-system',
      'dropdown-menu',
      'with-keyboard-interaction',
      global.__BASEURL__,
    );

    const { page } = global;
    await loadPage(page, url);

    await page.waitForSelector(dropdown);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    await page.waitForSelector(dropdownItem);

    await page.keyboard.press('Enter');

    await page.waitForSelector(dialogBox);
    const selectedImg = await page.screenshot();
    expect(selectedImg).toMatchProdImageSnapshot();
  });
});
