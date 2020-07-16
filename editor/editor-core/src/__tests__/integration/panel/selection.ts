import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  editable,
  expectToMatchDocument,
  fullpage,
  quickInsert,
} from '../_helpers';
import {
  goToEditorTestingExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import { selectors } from './_utils';
import { PanelSharedCssClassName } from '@atlaskit/editor-common';

BrowserTestCase(
  'selection.ts: Writing inside the panel, selecting panel and typing should drop text in panel',
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowPanel: true,
    });

    await page.click(fullpage.placeholder);
    await quickInsert(page, 'Info panel');
    await page.waitForSelector(selectors.PANEL_EDITOR_CONTAINER);

    await page.type(editable, 'this text should be in the panel');

    // Select the left margin of the panel, selecting the node
    await page.click(`.${PanelSharedCssClassName.icon}`);

    await page.type(editable, 'this text should be in doc root');

    await expectToMatchDocument(page, testName);
  },
);
