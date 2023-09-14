import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import type { EditorAppearance } from '../../../types';
import type { BrowserObject } from '@atlaskit/webdriver-runner/wd-wrapper';
import * as infoPanelAdf from './__fixtures__/info-panel.adf.json';
import * as listWithCodeBlockAdf from './__fixtures__/list-with-code-block.adf.json';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { panelSelectors } from '@atlaskit/editor-test-helpers/page-objects/panel';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { selectors } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { listSelectors } from '@atlaskit/editor-test-helpers/page-objects/list';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
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
