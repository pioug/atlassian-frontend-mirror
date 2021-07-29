import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const button = '#popup-trigger';
const spinner = '#spinner';
const popup = '#popup-content';
const button0 = '[name="Button 0"]';
const popupPositionButton = '[data-testid="popup-position"]';
const container = '#container';

describe('Snapshot Test', () => {
  it('it should match visual snapshot for popup', async () => {
    const url = getExampleUrl(
      'design-system',
      'popup',
      'popup',
      global.__BASEURL__,
    );

    const { page } = global;

    await loadPage(page, url);
    await page.waitForSelector(button);

    await page.click(button);

    const popupImage = await takeElementScreenShot(page, popup);
    expect(popupImage).toMatchProdImageSnapshot();
  });

  it('should reposition the popup', async () => {
    const url = getExampleUrl(
      'design-system',
      'popup',
      'popup',
      global.__BASEURL__,
    );

    const { page } = global;

    await loadPage(page, url);
    await page.waitForSelector(button);
    await page.click(button);
    await page.click(popupPositionButton);

    const popupImage = await page.screenshot();
    expect(popupImage).toMatchProdImageSnapshot();
  });

  it('it should match visual snapshot for async popup', async () => {
    const url = getExampleUrl(
      'design-system',
      'popup',
      'asynchronous-popup',
      global.__BASEURL__,
    );

    const { page } = global;

    await loadPage(page, url);
    await page.waitForSelector(button);

    await page.click(button);

    const spinnerImage = await takeElementScreenShot(page, spinner);
    expect(spinnerImage).toMatchProdImageSnapshot();

    await page.waitForSelector(popup);

    const popupImage = await takeElementScreenShot(page, popup);
    expect(popupImage).toMatchProdImageSnapshot();
  });

  it('it should match visual snapshot for setting focus', async () => {
    const url = getExampleUrl(
      'design-system',
      'popup',
      'setting-focus',
      global.__BASEURL__,
    );

    const { page } = global;

    await loadPage(page, url);
    await page.waitForSelector(button);

    await page.click(button);
    await page.waitForSelector(popup);

    const popupImage = await takeElementScreenShot(page, popup);
    expect(popupImage).toMatchProdImageSnapshot();

    await page.click(button);
    await page.click(button0);
    await page.click(button);
    await page.waitForSelector(popup);

    const popupImageWithFocus = await takeElementScreenShot(page, popup);
    expect(popupImageWithFocus).toMatchProdImageSnapshot();
  });

  it('it should match visual snapshot for setting focus when autoFocus = false', async () => {
    const url = getExampleUrl(
      'design-system',
      'popup',
      'popup-disable-autofocus',
      global.__BASEURL__,
    );

    const { page } = global;

    await loadPage(page, url);

    await page.waitForSelector(container);

    const popupInputeWithFocus = await page.screenshot();
    expect(popupInputeWithFocus).toMatchProdImageSnapshot();

    await page.click(button);
    await page.waitForSelector(popup);

    const inputShouldStillHaveFocus = await page.screenshot();
    expect(inputShouldStillHaveFocus).toMatchProdImageSnapshot();
  });
});
