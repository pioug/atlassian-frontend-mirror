import {
  getExampleUrl,
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
      'core',
      'onboarding',
      'spotlight-dialog-placement',
      __BASEURL__,
    );
    await page.goto(url);
    await page.waitForSelector(openButtonSelector);

    await page.click(openButtonSelector);
    await page.waitForSelector(spotlightTargetSelector);
    await page.waitForSelector(spotlightDialogSelector);
    // We need to wait for the animation to finish.
    await page.waitFor(1000);

    const image = await takeElementScreenShot(page, 'body');
    expect(image).toMatchProdImageSnapshot();
  });

  it('should move a spotlight after resizing the viewport', async () => {
    const { __BASEURL__, page } = global as any;
    const url = getExampleUrl(
      'core',
      'onboarding',
      'spotlight-dialog-placement',
      __BASEURL__,
    );
    await page.goto(url);
    await page.waitForSelector(openButtonSelector);

    await page.click(openButtonSelector);
    await page.waitForSelector(spotlightTargetSelector);
    await page.waitForSelector(spotlightDialogSelector);
    // We need to wait for the animation to finish.
    await page.waitFor(1000);

    await page.setViewport({
      height: page.viewport().height,
      width: page.viewport().width * 0.8,
    });

    const image = await takeElementScreenShot(page, 'body');
    expect(image).toMatchProdImageSnapshot();
  });
});
