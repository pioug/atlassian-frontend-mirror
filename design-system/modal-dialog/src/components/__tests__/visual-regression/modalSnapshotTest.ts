import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

declare var global: any;

const openModalBtn = "[type='button']";
const modalDialog = "[role='dialog']";
const scrollBehaviorGroup = "[role='group']";

describe('Snapshot Test', () => {
  it('Basic example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'modal-dialog',
      'defaultModal',
      global.__BASEURL__,
    );
    const { page } = global;

    await loadPage(page, url, true);
    await page.waitForSelector(openModalBtn);
    await page.click(openModalBtn);
    await page.waitForSelector(modalDialog);
    const image = await takeElementScreenShot(page, modalDialog);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Basic example with primary button on right should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'modal-dialog',
      'defaultModal',
      global.__BASEURL__,
    );
    const { page } = global;

    await loadPage(page, url, true);
    await page.waitForSelector(openModalBtn);
    await page.click(openModalBtn);
    await page.waitForSelector(modalDialog);
    const image = await takeElementScreenShot(page, modalDialog);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Scroll behaviour inside should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'modal-dialog',
      'scroll',
      global.__BASEURL__,
    );
    const { page } = global;

    await loadPage(page, url, true);
    await page.waitForSelector(openModalBtn);
    await page.click(openModalBtn);
    await page.waitForSelector(modalDialog);
    const image = await takeElementScreenShot(page, 'body');
    expect(image).toMatchProdImageSnapshot();
  });

  it('Scroll behaviour outside should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'modal-dialog',
      'scroll',
      global.__BASEURL__,
    );
    const { page } = global;

    await loadPage(page, url, true);
    await page.waitForSelector(openModalBtn);
    const radioSelector = scrollBehaviorGroup + ' input[value="outside"]';
    await page.waitForSelector(radioSelector);
    await page.click(radioSelector);
    await page.click(openModalBtn);
    await page.waitForSelector(modalDialog);

    const image = await takeElementScreenShot(page, 'body');
    expect(image).toMatchProdImageSnapshot();
  });

  it('Scroll behaviour inside-wide should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'modal-dialog',
      'scroll',
      global.__BASEURL__,
    );
    const { page } = global;

    await loadPage(page, url, true);
    await page.waitForSelector(openModalBtn);
    const radioSelector = scrollBehaviorGroup + ' input[value="inside-wide"]';
    await page.waitForSelector(radioSelector);
    // Clicking the inside-wide radio button sets the body to 3000px
    // which causes a page reflow. Rather than using an arbitrary wait
    // time to let the content shifting settle, we resize the viewport
    // to the same size before clicking it to lessen the effect.
    await page.setViewport({ width: 3000, height: 600 });
    await page.click(radioSelector);
    await page.click(openModalBtn);
    await page.waitForSelector(modalDialog);

    const image = await takeElementScreenShot(page, 'body');
    expect(image).toMatchProdImageSnapshot();
  });
});
