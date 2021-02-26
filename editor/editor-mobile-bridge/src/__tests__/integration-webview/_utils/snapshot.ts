import sharp, { OverlayOptions } from 'sharp';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';

/**
 * Takes a screenshot using Appium takeScreenshot command http://appium.io/docs/en/commands/session/screenshot
 * and adds a black overlay on top of it to cover dynamic values from the mobile statusbar like time and battery
 */
export const mobileSnapshot = async (page: Page) => {
  const screenshot = await page.takeScreenshot();
  const bufferedScreenshot = Buffer.from(screenshot, 'base64');
  const sharpedScreenshot = sharp(bufferedScreenshot);
  const { width } = await sharpedScreenshot.metadata();
  const blackOverlay: OverlayOptions = {
    input: {
      create: {
        background: '#000',
        height: 150,
        width: width || 1080,
        channels: 3,
      },
    },
    gravity: 'northwest',
  };
  const resizedScreenshot = await sharpedScreenshot
    .composite([blackOverlay])
    .png()
    .toBuffer();
  expect(resizedScreenshot).toMatchProdImageSnapshot({
    failureThreshold: `0.001`,
    failureThresholdType: 'percent',
  });
};
