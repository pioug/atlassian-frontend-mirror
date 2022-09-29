import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  getDocFromElement,
  comment,
  fullpage,
  editable,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import { toolbarMessages } from '../../../plugins/text-formatting/ui/Toolbar/toolbar-messages';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { messages as blockTypeMessages } from '../../../plugins/block-type/messages';
import colorPaletteMessages from '../../../ui/ColorPalette/Palettes/paletteMessages';
import {
  toolbarMenuItemsSelectors,
  ToolbarMenuItem,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';

const more = `[aria-label="${toolbarMessages.moreFormatting.defaultMessage}"]`;
const textColor = toolbarMenuItemsSelectors[ToolbarMenuItem.textColor];
const purple = `[aria-label="${colorPaletteMessages.purple.defaultMessage}"]`;
const underline = `span=${toolbarMessages.underline.defaultMessage}`;
const clear = `span=${toolbarMessages.clearFormatting.defaultMessage}`;

// https://product-fabric.atlassian.net/browse/ED-4531
[comment, fullpage].forEach((editor) => {
  BrowserTestCase(
    `toolbar-3.ts: should be able to select Clear Formatting on toolbar for ${editor.name} editor for mark-based formatting`,
    { skip: [] },
    async (client: any, testName: string) => {
      const page = await goToEditorTestingWDExample(client);
      await mountEditor(page, {
        appearance: editor.appearance,
        allowTextColor: true,
      });

      // add formatted (underlined) and then non-formatted text (using clear formatting toolbar button)
      await page.click(editable);
      await page.waitForSelector(more);
      await page.click(more);
      await page.waitForSelector(underline);
      await page.click(underline);
      await page.type(editable, 'test');
      await page.click(more);
      await page.click(clear);
      await page.type(editable, 'cleared');

      // add formatted (colored) and then non-formatted text (using clear formatting toolbar button)
      await page.click(textColor);
      await page.click(purple);
      await page.type(editable, 'purple');
      await page.click(more);
      await page.click(clear);
      await page.type(editable, 'cleared');

      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );
});

[comment, fullpage].forEach((editor) => {
  BrowserTestCase(
    `toolbar-3.ts: should be able to select Clear Formatting on toolbar for ${editor.name} editor for node-based formatting`,
    { skip: [] },
    async (client: any, testName: string) => {
      const page = await goToEditorTestingWDExample(client);
      await mountEditor(page, {
        appearance: editor.appearance,
      });

      // add text and codeblock with text
      await page.click(editable);
      await page.type(editable, 'hello');
      await page.keys('Return');
      await page.click(
        `[aria-label="${blockTypeMessages.codeblock.defaultMessage}"]`,
      );
      await page.type(editable, 'insidecode');
      await page.keys('ArrowRight');
      await page.keys('ArrowRight');
      await page.type(editable, 'world');
      await page.keys('Return');

      // select all and clear formatting via toolbar
      await page.keyboard.type('a', ['Mod']);
      await page.click(more);
      await page.click(clear);

      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );
});
