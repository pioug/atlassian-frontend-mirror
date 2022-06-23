import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  getDocFromElement,
  fullpage,
  editable,
  quickInsert,
} from '../../../../__tests__/integration/_helpers';
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '../../../../__tests__/__helpers/testing-example-helpers';
import { messages } from '../../../../plugins/insert-block/ui/ToolbarInsertBlock/messages';

BrowserTestCase(
  `quick-insert.ts: Extension: Quick Insert`,
  { skip: [] },
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
