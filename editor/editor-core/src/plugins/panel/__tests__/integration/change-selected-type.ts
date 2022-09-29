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
import {
  PanelSharedCssClassName,
  PanelSharedSelectors,
} from '@atlaskit/editor-common/panel';

BrowserTestCase(
  'change-selected-type.ts: Select panel and then change type',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowPanel: true,
      allowCustomPanelEdit: true,
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
  'change-selected-type.ts: Select panel and then change background color when allowCustomPanelEdit is true',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowPanel: { allowCustomPanel: true, allowCustomPanelEdit: true },
    });

    await page.click(fullpage.placeholder);
    await quickInsert(page, 'Info panel');
    await page.waitForSelector(selectors.PANEL_EDITOR_CONTAINER);

    await page.type(editable, 'this text should be in the panel');

    // Select the left margin of the panel, selecting the node
    await page.click(`.${PanelSharedCssClassName.icon}`);

    // Change panel background
    const colorPaletteSelector = PanelSharedSelectors.colorPalette;
    await page.click(colorPaletteSelector);
    const colorSelector = PanelSharedSelectors.selectedColor;
    await page.click(colorSelector);

    await expectToMatchDocument(page, testName);
  },
);

BrowserTestCase(
  'change-selected-type.ts: Select panel and then change Icon when allowCustomPanelEdit is true',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowPanel: { allowCustomPanel: true, allowCustomPanelEdit: true },
    });

    await page.click(fullpage.placeholder);
    await quickInsert(page, 'Info panel');
    await page.waitForSelector(selectors.PANEL_EDITOR_CONTAINER);

    await page.type(editable, 'this text should be in the panel');

    // Select the left margin of the panel, selecting the node
    await page.click(`.${PanelSharedCssClassName.icon}`);

    // Change panel Icon
    const emojiSelector = PanelSharedSelectors.emojiIcon;
    await page.click(emojiSelector);
    const selectedEmoji = PanelSharedSelectors.selectedEmoji;
    await page.click(selectedEmoji);

    await expectToMatchDocument(page, testName);
  },
);

BrowserTestCase(
  'Should be able to undo the emoji icon using keyboard shortcut',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowPanel: { allowCustomPanel: true, allowCustomPanelEdit: true },
    });

    await page.click(fullpage.placeholder);
    await quickInsert(page, 'Info panel');
    await page.waitForSelector(selectors.PANEL_EDITOR_CONTAINER);

    await page.type(editable, 'this text should be in the panel');

    // selecting the node
    await page.click(`.${PanelSharedCssClassName.icon}`);

    // select emoji icon
    const emojiSelector = PanelSharedSelectors.emojiIcon;
    await page.click(emojiSelector);
    const selectedEmoji = PanelSharedSelectors.selectedEmoji;
    await page.click(selectedEmoji);

    //press keyboard shortcut
    await page.undo();

    await expectToMatchDocument(page, testName);
  },
);

BrowserTestCase(
  'should render panel with icon using fallback text when icon short name is incorrect when allowCustomPanelEdit is true',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowPanel: {
        allowCustomPanel: true,
        allowCustomPanelEdit: true,
      },
      defaultValue: {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'panel',
            attrs: {
              panelType: 'custom',
              panelIcon: ':winkk:',
              panelIconText: '😉',
            },
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'custom - only emoji',
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    const selector = `span[data-emoji-text="😉"]`;
    expect(await page.isExisting(selector)).toBe(true);
    await expectToMatchDocument(page, testName);
  },
);
