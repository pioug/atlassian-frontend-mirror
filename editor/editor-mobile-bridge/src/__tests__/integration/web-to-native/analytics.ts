import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

import {
  editor,
  renderer,
  skipBrowsers as skip,
  getBridgeOutput,
} from '../_utils';

BrowserTestCase(
  'editor: calls analyticsBridge.trackEvent when analytics events are captured',
  { skip },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(editor.path);
    await browser.waitForSelector(editor.placeholder);

    // just loading the editor will fire three events:
    // editor started, editor mounted, editor proseMirrorRendered

    // insert a bullet list to fire a user generated event
    await browser.type(editor.placeholder, '* ');

    // both editor mounted and editor proseMirrorRendered events include timings
    // which will change each time so we exclude them
    const [editorStartedEvent, , , actionInsertedEvent] = await getBridgeOutput(
      browser,
      'analyticsBridge',
      'trackEvent',
    );

    expect([editorStartedEvent, actionInsertedEvent]).toMatchCustomSnapshot(
      testName,
    );
  },
);

BrowserTestCase(
  'renderer: calls analyticsBridge.trackEvent when analytics events are captured',
  { skip },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(renderer.path);
    await browser.waitForSelector(renderer.placeholder);

    // just loading the renderer will fire two events:
    // renderer started, renderer rendered
    // renderer rendered includes timings which will change each time so we exclude it
    const [rendererStartedEvent] = await getBridgeOutput(
      browser,
      'analyticsBridge',
      'trackEvent',
    );

    expect(rendererStartedEvent).toMatchCustomSnapshot(testName);
  },
);
