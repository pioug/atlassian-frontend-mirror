import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  getDocFromElement,
  fullpage,
  editable,
  quickInsert,
} from '../_helpers';
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '../../__helpers/testing-example-helpers';
import { messages } from '../../../plugins/insert-block/ui/ToolbarInsertBlock/messages';

BrowserTestCase(
  `quick-insert.ts: Extension: Quick Insert`,
  { skip: ['edge', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: 'full-page',
      allowExtension: {
        allowBreakout: true,
      },
      quickInsert: true,
    });
    await page.click(fullpage.placeholder);

    await quickInsert(page, 'Bodied extension');
    await page.click('.extension-content p');
    await quickInsert(page, messages.action.defaultMessage);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
