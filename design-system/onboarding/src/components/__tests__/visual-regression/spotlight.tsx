import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const openButtonSelector = '[data-testid="open-spotlight"]';
const spotlightTargetSelector = '[data-testid="spotlight--target"]';
const spotlightDialogSelector = '[data-testid="spotlight--dialog"]';
// https://ecosystem.atlassian.net/browse/DS-7006
describe.skip('onboarding spotlight visual regression', () => {
  it('should render a spotlight next to a target', async () => {
    const { __BASEURL__, page } = global as any;
    const url = getExampleUrl(
      'design-system',
      'onboarding',
      'spotlight-dialog-placement',
      __BASEURL__,
    );
    await loadPage(page, url, true);
    await page.waitForSelector(openButtonSelector);

    await page.click(openButtonSelector);
    await page.waitForSelector(spotlightTargetSelector);
    await page.waitForSelector(spotlightDialogSelector);

    const image = await takeElementScreenShot(page, 'body');
    expect(image).toMatchProdImageSnapshot();
  });

  it('should move a spotlight after resizing the viewport', async () => {
    const { __BASEURL__, page } = global as any;
    const url = getExampleUrl(
      'design-system',
      'onboarding',
      'spotlight-dialog-placement',
      __BASEURL__,
    );
    await loadPage(page, url, true);
    await page.waitForSelector(openButtonSelector);

    await page.click(openButtonSelector);
    await page.waitForSelector(spotlightTargetSelector);
    await page.waitForSelector(spotlightDialogSelector);

    await page.setViewport({
      height: page.viewport().height,
      width: page.viewport().width * 0.8,
    });

    const image = await takeElementScreenShot(page, 'body');
    expect(image).toMatchProdImageSnapshot();
  });
});
