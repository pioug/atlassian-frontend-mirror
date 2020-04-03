import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  editable,
  getDocFromElement,
  fullpage,
  quickInsert,
  clipboardInput,
  copyAsPlaintextButton,
} from '../_helpers';
import {
  goToEditorTestingExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import { selectors } from './_utils';

BrowserTestCase(
  'paste-plain-text.ts: Paste plain text into panel',
  { skip: ['ie', 'edge', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    await page.type(
      clipboardInput,
      'this is a link http://www.google.com more elements with some **format** some addition *formatting*',
    );
    await page.click(copyAsPlaintextButton);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowPanel: true,
    });

    await page.click(editable);
    await quickInsert(page, 'Info panel');
    await page.waitForSelector(selectors.PANEL_EDITOR_CONTAINER);

    await page.paste();
    const doc = await page.$eval(editable, getDocFromElement);
    await new Promise(resolve => setTimeout(resolve, 2000));

    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
