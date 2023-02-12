import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { renderer, getBridgeOutput } from '../_utils';

// FIXME: This test was automatically skipped due to failure on 11/02/2023: https://product-fabric.atlassian.net/browse/ED-16855
BrowserTestCase(
  `renderer.ts: call onContentRendered() on native bridge.`,
  {
    skip: ['*'],
  },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(renderer.path);

    const onContentRendererOutput = await getBridgeOutput(
      browser,
      'renderBridge',
      'onContentRendered',
    );

    expect(onContentRendererOutput).toMatchCustomSnapshot(testName);
  },
);
