import {
  editable,
  fullpage,
  getDocFromElement,
  quickInsert,
} from '@atlaskit/editor-test-helpers/integration/helpers';

import { selectors } from '@atlaskit/editor-test-helpers/page-objects/editor';
import { emojiSelectors } from '@atlaskit/editor-test-helpers/page-objects/emoji';
import { panelSelectors } from '@atlaskit/editor-test-helpers/page-objects/panel';
import { selectionSelectors } from '@atlaskit/editor-test-helpers/page-objects/selection';
import { WebDriverPage } from '@atlaskit/editor-test-helpers/page-objects/types';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { infoPanel } from './__fixtures__/base-adfs';

const startEditor = async (client: any, adf: any): Promise<WebDriverPage> => {
  const page = await goToEditorTestingWDExample(client);

  await mountEditor(
    page,
    {
      appearance: fullpage.appearance,
      allowPanel: true,
      defaultValue: adf,
    },
    undefined,
    { clickInEditor: false },
  );

  return page;
};

['Left', 'Right'].forEach((direction) => {
  // FIXME: This test was automatically skipped due to failure on 27/02/2023: https://product-fabric.atlassian.net/browse/ED-17006
  BrowserTestCase(
    `gap-cursor-typeahead.ts: opens a quick insert menu from a ${direction}-side gap cursor and inserts an emoji ${
      direction === 'Left' ? 'before' : 'after'
    } the panel`,
    {
      skip: ['*'],
    },
    async (client: any, testName: string) => {
      const page = await startEditor(client, infoPanel);

      const pargraphInPanelSelector = `${panelSelectors.panelContent} p`;
      await page.waitForVisible(pargraphInPanelSelector);

      // Position the selection inside agap cursor
      await page.click(pargraphInPanelSelector);
      await page.keys([`Arrow${direction}`, `Arrow${direction}`]);
      await expect(
        page.isVisible(selectionSelectors.gapCursorInner),
      ).resolves.toBe(true);

      // Type a quick insert trigger key and expect a quick insert pop-up to show up
      await quickInsert(page, 'Emoji', true);
      await expect(page.waitForVisible(selectors.typeaheadPopup)).resolves.toBe(
        true,
      );

      // Select an emoji and insert it into the document.
      // Expect an emoji to be inserted in a new block before (for a left-side)
      // or after (for a right side gap dursor) the panel.
      await page.keys(['Return']);
      await expect(page.isVisible(emojiSelectors.standard)).resolves.toBe(true);
      expect(
        await page.$eval(editable, getDocFromElement),
      ).toMatchCustomDocSnapshot(testName);
    },
  );
});
