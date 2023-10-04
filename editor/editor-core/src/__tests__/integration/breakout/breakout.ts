import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  getDocFromElement,
  editable,
} from '@atlaskit/editor-test-helpers/integration/helpers';

import commonMessages from '../../../messages';
import adf from './__fixtures__/breakout-columns-with-iframe.adf.json';
import { blockTypeMessages as messages } from '@atlaskit/editor-common/messages';

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
  'breakout: width button should appear next to selected component',
  // Don't need to test cross browser for this
  { skip: ['safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: 'full-page',
      allowBreakout: true,
    });

    // Add three code blocks
    // check the position of width button and move down to the next
    await page.click(`[aria-label="${messages.codeblock.defaultMessage}"]`);
    await page.click(`[aria-label="${messages.codeblock.defaultMessage}"]`);
    await page.click(`[aria-label="${messages.codeblock.defaultMessage}"]`);

    let breakoutButtonPosition = '';

    await page.click('[data-testid="code-block--code"]');

    for (let i = 0; i < 3; i += 1) {
      await page.waitForSelector(wideBreakoutButtonQuery);

      // Check the position of the width button
      const top = await page.evaluate((selector) => {
        const el = document.querySelector(selector);

        return el ? window.getComputedStyle(el).top : '0';
      }, wideBreakoutButtonQuery);

      expect(top).not.toBe(breakoutButtonPosition);

      breakoutButtonPosition = top;

      await page.keys('ArrowDown');
    }
  },
);

// FIXME: This test was automatically skipped due to failure on 24/08/2023: https://product-fabric.atlassian.net/browse/ED-19726
BrowserTestCase(
  'breakout: should be able to delete last character inside a "wide" codeBlock preserving the node',
  {
    skip: ['*'],
  },
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
