import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { EditorAppearance } from '../../../types';
import { BrowserObject } from '@atlaskit/webdriver-runner/wd-wrapper';
import * as infoPanelAdf from './__fixtures__/info-panel.adf.json';
import * as connectedExtensionAdf from './__fixtures__/connected-extensions.adf.json';
import * as listWithCodeBlockAdf from './__fixtures__/list-with-code-block.adf.json';
import { panelSelectors } from '@atlaskit/editor-test-helpers/page-objects/panel';
import { selectors } from '@atlaskit/editor-test-helpers/page-objects/editor';
import { listSelectors } from '@atlaskit/editor-test-helpers/page-objects/list';
import {
  expectToMatchSelection,
  simulateProsemirrorClick,
  setProseMirrorTextSelection,
} from '@atlaskit/editor-test-helpers/integration/helpers';

const gapCursorInnerSelector = `${selectors.gapCursor} span`;

['comment', 'full-page'].forEach((editor) => {
  ['Left', 'Right'].forEach((direction) => {
    BrowserTestCase(
      `gap-cursor: should display to ${direction} of block node after hitting ${direction} key for ${editor} editor`,
      {},
      async (client: any) => {
        const page = await goToEditorTestingWDExample(client);

        await mountEditor(
          page,
          {
            appearance: editor as EditorAppearance,
            allowPanel: true,
            defaultValue: infoPanelAdf,
          },
          undefined,
          { clickInEditor: false },
        );

        const pargraphInPanelSelector = `${panelSelectors.panelContent} p`;
        await page.waitForVisible(pargraphInPanelSelector);
        await setProseMirrorTextSelection(page, { anchor: 2 });
        await page.keys([`Arrow${direction}`, `Arrow${direction}`]);

        const gapCursorVisible = await page.isVisible(gapCursorInnerSelector);
        expect(gapCursorVisible).toBe(true);
      },
    );
  });
});

BrowserTestCase(
  `gap-cursor: should display next to codeblock when clicked list item with a code block`,
  {},
  async (browser: BrowserObject) => {
    const page = await goToEditorTestingWDExample(browser);

    await mountEditor(page, {
      appearance: 'full-page',
      defaultValue: listWithCodeBlockAdf,
    });

    await page.waitForVisible(listSelectors.unorderedlist);
    await simulateProsemirrorClick(browser, listSelectors.unorderedlist);

    const gapCursorVisible = await page.isVisible(gapCursorInnerSelector);
    expect(gapCursorVisible).toBe(true);
  },
);

BrowserTestCase(
  `gap-cursor: should stay where it was after confirmation dialog closed`,
  {},
  async (browser: BrowserObject) => {
    const page = await goToEditorTestingWDExample(browser);

    await mountEditor(page, {
      appearance: 'full-page',
      allowExtension: {
        allowAutoSave: true,
      },
      allowFragmentMark: true,
      defaultValue: connectedExtensionAdf,
    });

    const extensionContainerSelector = '.extension-container';
    const removeButtonSelector = 'button[aria-label="Remove"]';
    const confirmationModalTestId = 'ak-floating-toolbar-confirmation-modal';
    const checkboxSelector = `input[type="checkbox"]`;
    const deleteButtonSelector = `button[data-testid="${confirmationModalTestId}-confirm-button"]`;

    // Click extension
    await page.waitForVisible(extensionContainerSelector);
    await page.click(extensionContainerSelector);

    // Click remove button on the floating toobar of the extension
    await page.isClickable(removeButtonSelector);
    await page.click(removeButtonSelector);

    // Click checkbox on the confirmation dialog
    await page.isClickable(`section[data-testid="${confirmationModalTestId}"]`);
    await page.click(checkboxSelector);

    // Click Delete on the confirmation dialog
    await page.isClickable(deleteButtonSelector);
    await page.click(deleteButtonSelector);

    // Gap cursor should be at position 165
    await expectToMatchSelection(page, {
      type: 'text',
      anchor: 165,
      head: 165,
    });
  },
);
