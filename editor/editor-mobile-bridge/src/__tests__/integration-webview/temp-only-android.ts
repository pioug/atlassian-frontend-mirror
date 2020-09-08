import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';

MobileTestCase(
  'Skip Logic: Only run on select Android devices',
  {
    skipPlatform: ['ios'],
    skipVersion: [
      { platform: 'android', version: '10.0' },
      { platform: 'android', version: '6' },
    ],
  },
  async (client: any, testName: string) => {
    const page = new Page(client);
    expect(page.isAndroid()).toBe(true);
  },
);
