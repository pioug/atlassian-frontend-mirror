import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  editable,
  expectToMatchDocument,
  fullpage,
  quickInsert,
} from '../_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import { selectors } from './_utils';
import { PanelSharedCssClassName } from '@atlaskit/editor-common';

BrowserTestCase(
  'change-selected-type.ts: Select panel and then change type',
  { skip: ['edge'] },
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

    // Select the left margin of the panel, selecting the node
    await page.click(`.${PanelSharedCssClassName.icon}`);

    // Change panel type to Error
    const selector = `[aria-label="Error"]`;
    await page.click(selector);

    await expectToMatchDocument(page, testName);
  },
);

BrowserTestCase(
  'change-selected-type.ts: Select panel and then change background color when allowCustomPanel is true',
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowPanel: { UNSAFE_allowCustomPanel: true },
    });

    await page.click(fullpage.placeholder);
    await quickInsert(page, 'Info panel');
    await page.waitForSelector(selectors.PANEL_EDITOR_CONTAINER);

    await page.type(editable, 'this text should be in the panel');

    // Select the left margin of the panel, selecting the node
    await page.click(`.${PanelSharedCssClassName.icon}`);

    // Change panel background
    const colorPaletSelector = `[aria-label="Background color"]`;
    await page.click(colorPaletSelector);
    const colorSelector = `[aria-label="The smell"]`;
    await page.click(colorSelector);

    await expectToMatchDocument(page, testName);
  },
);

BrowserTestCase(
  'change-selected-type.ts: Select panel and then change Icon when allowCustomPanel is true',
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowPanel: { UNSAFE_allowCustomPanel: true },
    });

    await page.click(fullpage.placeholder);
    await quickInsert(page, 'Info panel');
    await page.waitForSelector(selectors.PANEL_EDITOR_CONTAINER);

    await page.type(editable, 'this text should be in the panel');

    // Select the left margin of the panel, selecting the node
    await page.click(`.${PanelSharedCssClassName.icon}`);

    // Change panel Icon
    const emojiSelector = `[aria-label="editor-add-emoji"]`;
    await page.click(emojiSelector);
    const selectedEmoji = `[aria-label=":smiley:"]`;
    await page.click(selectedEmoji);

    await expectToMatchDocument(page, testName);
  },
);
