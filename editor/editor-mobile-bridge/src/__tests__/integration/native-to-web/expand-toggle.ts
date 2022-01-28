import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  editable,
  editor,
  callNativeBridge,
  skipBrowsers as skip,
} from '../_utils';

BrowserTestCase(
  `Full editor - ClickArea min-height should always be set`,
  { skip },
  async (client: any, testName: string) => {
    const browser = new Page(client);

    await browser.goto(editor.path);
    await browser.waitForSelector(editable);

    const minHeight = await browser.getCSSProperty(
      '.editor-click-wrapper',
      'min-height',
    );
    expect(minHeight).toBeDefined();
    expect(parseFloat(minHeight.value)).toBeGreaterThan(0);

    await callNativeBridge(browser, 'setClickAreaExpanded', 'false');

    const newMinHeight = await browser.getCSSProperty(
      '.editor-click-wrapper',
      'min-height',
    );

    expect(newMinHeight).toBeDefined();
    expect(parseFloat(newMinHeight.value)).toBeGreaterThan(0);
  },
);

BrowserTestCase(
  `Compact editor - ClickArea min-height should be set when setClickAreaExpanded received true`,
  { skip },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(editor.path);
    await browser.waitForSelector(editable);

    await browser.execute(() => {
      window.bridge?.configure('{"editorAppearance": "compact"}');
    });

    const minHeight = await browser.getCSSProperty(
      '.editor-click-wrapper',
      'min-height',
    );

    expect(minHeight).toBeDefined();
    // When we don't set min-height, browser.getCSSProperty()
    // returns browser default min-height, which is set to 0px.
    expect(minHeight.value).toEqual('0px');

    await browser.execute(() => {
      window.bridge?.setClickAreaExpanded(true);
    });

    const newMinHeight = await browser.getCSSProperty(
      '.editor-click-wrapper',
      'min-height',
    );

    expect(newMinHeight).toBeDefined();
    expect(parseFloat(newMinHeight.value)).toBeGreaterThan(0);
  },
);
