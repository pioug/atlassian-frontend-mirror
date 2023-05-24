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
  getDocFromElement,
  callNativeBridge,
} from '../_utils';

BrowserTestCase(
  `feature-flag.ts: Input Rules should be predictable`,
  {},
  async (client: any) => {
    const page = new Page(client);
    await navigateOrClear(page, editor.path);
    await page.waitForSelector(editable);

    await configureEditor(page, '{}');
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
