import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const urlBanner = getExampleUrl('core', 'banner', 'Testing');

/* Css selectors used for the test */
const myBannerTestId = "[data-testid='myBannerTestId']";

BrowserTestCase(
  'Banner should be identified and visible by data-testid',
  {} as any,
  async (client: any) => {
    const bannerTest = new Page(client);
    await bannerTest.goto(urlBanner);
    await bannerTest.waitFor(myBannerTestId, 5000);
    expect(await bannerTest.isVisible(myBannerTestId)).toBe(true);
    expect(await bannerTest.getText(myBannerTestId)).toContain(
      'Your Banner is rendered with a [data-testid="myBannerTestId"].',
    );
  },
);
