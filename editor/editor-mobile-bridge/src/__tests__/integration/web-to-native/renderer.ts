import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { renderer, getBridgeOutput } from '../_utils';

// Skipped Firefox because it inconsistently gives different test results
// FIXME: This test was automatically skipped for safari due to failure on Works when manually tested but sometimes flaky
// FIXME: This test was automatically skipped due to failure on 06/08/2023: https://product-fabric.atlassian.net/browse/ED-19367
BrowserTestCase(
  `renderer.ts: call onContentRendered() on native bridge.`,
  {
    // skip: ['firefox', 'safari'],
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
