import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { EditorAppearance } from '../../../types';
import { BrowserObject } from '@atlaskit/webdriver-runner/wd-wrapper';
import * as infoPanelAdf from './__fixtures__/info-panel.adf.json';
import * as listWithCodeBlockAdf from './__fixtures__/list-with-code-block.adf.json';
import { panelSelectors } from '@atlaskit/editor-test-helpers/page-objects/panel';
import { selectors } from '@atlaskit/editor-test-helpers/page-objects/editor';
import { listSelectors } from '@atlaskit/editor-test-helpers/page-objects/list';

import { simulateProsemirrorClick } from '@atlaskit/editor-test-helpers/integration/helpers';

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
        await page.click(pargraphInPanelSelector);
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
