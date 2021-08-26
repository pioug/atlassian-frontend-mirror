import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const modalDialog = "[data-testid='modal']";

const url = getExampleUrl(
  'design-system',
  'modal-dialog',
  'with-hidden-blanket',
  global.__BASEURL__,
);

describe('Modal dialog with hidden blanket', () => {
  it('should not have a visible blanket behind it', async () => {
    const { page } = global;
    await loadPage(page, url);

    await page.waitForSelector(modalDialog);

    const image = await takeElementScreenShot(page, 'body');
    expect(image).toMatchProdImageSnapshot();
  });
});
