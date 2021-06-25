import sharp, { OverlayOptions } from 'sharp';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import kebabCase from 'lodash/kebabCase';

/**
 * Takes a screenshot using Appium takeScreenshot command http://appium.io/docs/en/commands/session/screenshot
 * and adds a black overlay on top of it to cover dynamic values from the mobile statusbar like time and battery
 */
export const mobileSnapshot = async (page: Page) => {
  const { DISABLE_MOBILE_VR } = process.env;
  if (DISABLE_MOBILE_VR) {
    // ignores the screenshot comparison and adds a dummy assertion
    // to prevent failures with tests with 0 assertions
    expect(1).toEqual(1);
    return;
  }
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
    failureThreshold: `0.01`,
    failureThresholdType: 'percent',
    // Remove file name from vr snapshot identifier to avoid creating duplicate snapshots
    customSnapshotIdentifier: ({ currentTestName }) => {
      const fileName = currentTestName.split(' ')[0];
      const identifier = currentTestName.replace(`${fileName} `, '');
      return kebabCase(identifier);
    },
  });
};
