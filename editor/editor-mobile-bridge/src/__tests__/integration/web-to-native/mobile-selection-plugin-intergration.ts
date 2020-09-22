import { SelectionDataState } from '@atlaskit/editor-core';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  selectionPluginHelper,
  editable,
  skipBrowsers as skip,
} from '../_utils';

BrowserTestCase(
  `mobile-selection-plugin-intergration: Test dom mobile selection`,
  { skip },
  async (client: any, testName: string) => {
    const browser = new Page(client);

    await browser.goto(selectionPluginHelper.path);
    await browser.waitForSelector(editable);

    await browser.type(editable, 'test data');

    const calls = await browser.execute(() => {
      // @ts-ignore
      const callsFromDummy = window.callsFromDummyBridge;
      return callsFromDummy.get('submitPromise');
    });

    const expected: SelectionDataState = {
      markTypes: [],
      nodeTypes: ['paragraph'],
      rect: { top: 32, left: 16 },
      selection: { type: 'text', anchor: 2, head: 2 },
    };

    const result = JSON.parse(calls[2][2]);

    expect(expected).toMatchObject(result);
  },
);
