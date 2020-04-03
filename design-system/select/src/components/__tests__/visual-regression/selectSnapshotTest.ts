import {
  getExampleUrl,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const openModalBtn = "[type='button']";
const modalDialog = "[role='dialog']";

describe('Snapshot Test', () => {
  it('Select in a modal dialog example should match production example', async () => {
    const url = getExampleUrl(
      'core',
      'select',
      'select-in-modal-dialog',
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
