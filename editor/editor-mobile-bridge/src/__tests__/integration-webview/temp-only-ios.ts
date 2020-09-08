import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';

MobileTestCase(
  'Skip Logic: Only run on iOS devices',
  { skipPlatform: ['android'] },
  async (client: any, testName: string) => {
    const page = new Page(client);
    expect(page.isIOS()).toBe(true);
  },
);
