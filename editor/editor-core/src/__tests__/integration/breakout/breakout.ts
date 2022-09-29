import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import {
  getDocFromElement,
  editable,
} from '@atlaskit/editor-test-helpers/integration/helpers';

import commonMessages from '../../../messages';
import adf from './__fixtures__/breakout-columns-with-iframe.adf.json';
import { messages } from '../../../plugins/block-type/messages';

const wideBreakoutButtonQuery = `div[aria-label="${commonMessages.layoutWide.defaultMessage}"]`;
const fullWidthBreakoutButtonQuery = `div[aria-label="${commonMessages.layoutFullWidth.defaultMessage}"]`;
const centerBreakoutButtonQuery = `div[aria-label="${commonMessages.layoutFixedWidth.defaultMessage}"]`;
const wideBreakoutColumn = 'div[data-layout-column="true"]:first-child p';

BrowserTestCase(
  'breakout: should be able to switch to wide mode',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: 'full-page',
      allowBreakout: true,
    });

    await page.click(`[aria-label="${messages.codeblock.defaultMessage}"]`);

    // Switch to wide breakout mode
    await page.waitForSelector(wideBreakoutButtonQuery);
    await page.click(wideBreakoutButtonQuery);
    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'breakout: should be able to switch to full-width mode',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: 'full-page',
      allowBreakout: true,
    });

    await page.click(`[aria-label="${messages.codeblock.defaultMessage}"]`);

    // Switch to full-width breakout mode
    await page.waitForSelector(wideBreakoutButtonQuery);
    await page.click(wideBreakoutButtonQuery);
    await page.waitForSelector(fullWidthBreakoutButtonQuery);
    await page.click(fullWidthBreakoutButtonQuery);
    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'breakout: should be able to switch to center mode back',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: 'full-page',
      allowBreakout: true,
    });

    await page.click(`[aria-label="${messages.codeblock.defaultMessage}"]`);

    // Switch to wide breakout mode
    await page.waitForSelector(wideBreakoutButtonQuery);
    await page.click(wideBreakoutButtonQuery);

    await page.waitForSelector(fullWidthBreakoutButtonQuery);
    await page.click(fullWidthBreakoutButtonQuery);

    await page.waitForSelector(centerBreakoutButtonQuery);
    await page.click(centerBreakoutButtonQuery);
    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'breakout: should be able to delete last character inside a "wide" codeBlock preserving the node',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: 'full-page',
      allowBreakout: true,
    });

    await page.click(`[aria-label="${messages.codeblock.defaultMessage}"]`);

    // Switch to wide breakout mode
    await page.waitForSelector(wideBreakoutButtonQuery);
    await page.click(wideBreakoutButtonQuery);

    await page.type(editable, 'a');
    await page.keys('Backspace');
    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);

// @see ED-8293
BrowserTestCase(
  'breakout: should be able to delete last character inside a "wide" layoutSection in Safari',
  { skip: ['firefox', 'chrome'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(
      page,
      {
        appearance: 'full-page',
        defaultValue: adf,
        allowBreakout: true,
        allowLayouts: true,
        allowExtension: true,
        extensionHandlers: extensionHandlers,
      },
      undefined,
      { clickInEditor: false },
    );

    await page.waitForSelector(wideBreakoutColumn);
    await page.click(wideBreakoutColumn);

    await page.type(editable, 'a');
    await page.keys('Backspace');
    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);
