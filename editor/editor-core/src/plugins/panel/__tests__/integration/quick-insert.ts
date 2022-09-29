import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  editable,
  expectToMatchDocument,
  fullpage,
  quickInsert,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { selectors } from './_utils';

BrowserTestCase(
  'quick-insert.ts: Insert panel via quick insert',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowPanel: true,
    });

    await page.click(fullpage.placeholder);
    await quickInsert(page, 'Info panel');
    await page.waitForSelector(selectors.PANEL_EDITOR_CONTAINER);

    await page.type(editable, 'this text should be in the panel');

    await expectToMatchDocument(page, testName);
  },
);

BrowserTestCase(
  'quick-insert.ts: Insert custom panel via quick insert',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowPanel: { allowCustomPanel: true, allowCustomPanelEdit: true },
    });

    await page.click(fullpage.placeholder);
    await quickInsert(page, 'Custom panel');
    await page.waitForSelector(selectors.PANEL_EDITOR_CONTAINER);

    await page.type(editable, 'this text should be in the panel');

    await expectToMatchDocument(page, testName);
  },
);
