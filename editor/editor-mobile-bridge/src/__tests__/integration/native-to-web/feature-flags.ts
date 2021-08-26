import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { Node as PMNode } from 'prosemirror-model';
import sampleSchema from '@atlaskit/editor-test-helpers/schema';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  editor,
  editable,
  configureEditor,
  navigateOrClear,
  skipBrowsers as skip,
  getDocFromElement,
  callNativeBridge,
  USE_UNPREDICTABLE_INPUT_RULE,
  USE_PREDICTABLE_INPUT_RULE,
} from '../_utils';

BrowserTestCase(
  `feature-flag.ts: Input Rules should be predictable when 'useUnpredictableInputRules FF is set to false`,
  { skip },
  async (client: any) => {
    const page = new Page(client);
    await navigateOrClear(page, editor.path);
    await page.waitForSelector(editable);

    await configureEditor(page, USE_PREDICTABLE_INPUT_RULE); // sets FF to false (improved feature)
    await page.click(editable);
    await page.keys('`code`');
    await callNativeBridge(page, 'undo');

    // Make sure `code` is fully returned to plain text
    const jsonDocument = await page.$eval(editable, getDocFromElement);
    const pmDocument = PMNode.fromJSON(sampleSchema, jsonDocument);
    const expectedDocument = doc(p('`code`'));

    expect(pmDocument).toEqualDocument(expectedDocument);
  },
);

BrowserTestCase(
  `feature-flag.ts: Input Rules should be unpredictable when 'useUnpredictableInputRules FF is set to true`,
  { skip },
  async (client: any) => {
    const page = new Page(client);
    await navigateOrClear(page, editor.path);
    await page.waitForSelector(editable);

    await configureEditor(page, USE_UNPREDICTABLE_INPUT_RULE); // sets FF to true (legacy feature)
    await page.click(editable);
    await page.keys('`code`');
    await callNativeBridge(page, 'undo');

    // Make sure `code` is NOT fully returned to plain text
    const jsonDocument = await page.$eval(editable, getDocFromElement);
    const pmDocument = PMNode.fromJSON(sampleSchema, jsonDocument);
    const expectedDocument = doc(p('`code'));

    expect(pmDocument).toEqualDocument(expectedDocument);
  },
);
