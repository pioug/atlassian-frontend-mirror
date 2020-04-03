import {
  getExampleUrl,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

declare var global: any;

const openModalBtn = "[type='button']";
const modalDialog = "[role='dialog']";

describe('Snapshot Test', () => {
  it('Basic example should match production example', async () => {
    const url = getExampleUrl(
      'core',
      'modal-dialog',
      'defaultModal',
      global.__BASEURL__,
    );
    const { page } = global;

    await page.goto(url);
    await page.waitForSelector(openModalBtn);
    await page.click(openModalBtn);
    await page.waitForSelector(modalDialog);
    // We need to wait for the animation to finish.
    await page.waitFor(1000);
    const image = await takeElementScreenShot(page, modalDialog);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Basic example with primary button on right should match production example', async () => {
    const url = getExampleUrl(
      'core',
      'modal-dialog',
      'defaultModal',
      global.__BASEURL__,
    );
    const { page } = global;

    await page.goto(url);
    await page.waitForSelector(openModalBtn);
    await page.click(openModalBtn);
    await page.waitForSelector(modalDialog);
    // We need to wait for the animation to finish.
    await page.waitFor(1000);
    const image = await takeElementScreenShot(page, modalDialog);
    expect(image).toMatchProdImageSnapshot();
  });
});
