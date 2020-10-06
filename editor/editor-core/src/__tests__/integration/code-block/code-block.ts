import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getDocFromElement, editable } from '../_helpers';
import { EditorAppearance } from '../../../types';
import {
  mountEditor,
  goToEditorTestingExample,
} from '../../__helpers/testing-example-helpers';
import { messages } from '../../../plugins/block-type/messages';
import { codeBlockSelectors } from '../../__helpers/page-objects/_code-block';

const floatingToolbarLanguageSelector = 'div[aria-label="Floating Toolbar"]';

['comment', 'full-page'].forEach(editor => {
  // https://product-fabric.atlassian.net/browse/ED-5564
  // Fix wrong ADF for code block when language is selected
  BrowserTestCase(
    `code-block: produces correct ADF after language change for ${editor}`,
    { skip: ['safari', 'edge'] },
    async (client: any, testName: string) => {
      const page = await goToEditorTestingExample(client);

      await mountEditor(page, {
        appearance: editor as EditorAppearance,
      });

      await page.click(`[aria-label="${messages.codeblock.defaultMessage}"]`);
      await page.waitForSelector(codeBlockSelectors.languageSelectInput);
      await page.type(codeBlockSelectors.languageSelectInput, ['javascript']);
      await page.keys('Return');

      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );

  BrowserTestCase(
    `code-block: code block language is preserved after floating toolbar loses and gains focus for ${editor}`,
    { skip: ['safari', 'edge'] },
    async (client: any) => {
      const page = await goToEditorTestingExample(client);

      await mountEditor(page, {
        appearance: editor as EditorAppearance,
      });

      // Insert code block
      await page.click(`[aria-label="${messages.codeblock.defaultMessage}"]`);
      await page.waitForSelector(codeBlockSelectors.languageSelectInput);
      // Change code block language
      await page.type(codeBlockSelectors.languageSelectInput, ['javascript']);
      await page.keys('Return');
      await page.click(editable);
      // Unfocus code block (so floating toolbar hides)
      await page.keys(['ArrowRight', 'ArrowRight']);
      await page.type(editable, 'test paragraph');
      // Focus code block again
      await page.click('pre');
      // Check that the language is still selected
      await page.waitForSelector(floatingToolbarLanguageSelector);
      const language = await page.getText(floatingToolbarLanguageSelector);
      expect(language.trim()).toEqual('JavaScript');
    },
  );

  BrowserTestCase(
    `code-block: code block selected language correctly changes when moving selection directly from one code block to another for ${editor}`,
    { skip: ['safari', 'edge'] },
    async (client: any) => {
      const page = await goToEditorTestingExample(client);

      await mountEditor(page, {
        appearance: editor as EditorAppearance,
      });

      // Insert code block
      await page.click(`[aria-label="${messages.codeblock.defaultMessage}"]`);
      await page.waitForSelector(codeBlockSelectors.languageSelectInput);

      // Change code block language
      await page.type(codeBlockSelectors.languageSelectInput, ['javascript']);
      await page.keys('Return');
      await page.click(editable);
      // Move out of code block
      await page.keys('ArrowRight');
      await page.keys('Return');
      // Insert a second code block
      await page.click(`[aria-label="${messages.codeblock.defaultMessage}"]`);

      // Make sure the second code block doesn't have a language set.
      await page.waitForSelector(codeBlockSelectors.languageSelectInput);
      const secondCodeblockInitialLanguage = await page.getText(
        floatingToolbarLanguageSelector,
      );
      expect(secondCodeblockInitialLanguage.trim()).toEqual('Select language');
      // Set a language on the second code block
      await page.type(codeBlockSelectors.languageSelectInput, ['Arduino']);
      await page.keys('Return');

      // Check that the language on the first code block is still the same
      await page.click('code[data-language="javascript"]');
      await page.waitForSelector(floatingToolbarLanguageSelector);
      const firstCodeBlock = await page.getText(
        floatingToolbarLanguageSelector,
      );
      expect(firstCodeBlock.trim()).toEqual('JavaScript');

      // Check that the language on the second code block is still the same
      // not sure if this is working 100%
      await page.click('code[data-language="arduino"]');
      await page.waitForSelector(floatingToolbarLanguageSelector);
      const secondCodeBlock = await page.getText(
        floatingToolbarLanguageSelector,
      );
      expect(secondCodeBlock.trim()).toEqual('Arduino');
    },
  );

  BrowserTestCase(
    `code-block: code block content is copied to clipboard after clicking on the copy button for ${editor}`,
    { skip: ['safari', 'firefox', 'edge'] },
    async (client: any, testName: string) => {
      const page = await goToEditorTestingExample(client);

      await mountEditor(page, {
        appearance: editor as EditorAppearance,
        codeBlock: { allowCopyToClipboard: true },
      });

      // Insert code block
      await page.click(`[aria-label="${messages.codeblock.defaultMessage}"]`);

      //Type
      page.pause(100);
      await page.waitForSelector(codeBlockSelectors.content);
      await page.type(codeBlockSelectors.content, 'Some code here');

      // Click on Copy button
      await page.waitForSelector(codeBlockSelectors.copyToClipboardButton);
      await page.click(codeBlockSelectors.copyToClipboardButton);

      // Navigate outside the code block and paste
      await page.keys(['ArrowDown']);

      await page.paste();

      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );

  // This bug isn't fixed. See ticket for details.
  // https://product-fabric.atlassian.net/browse/ED-7545
  /*
  BrowserTestCase(
    'code-block: code block selected language correctly changes when moving selection directly from one code block to another where one blocks selected is undefined',
    { skip: ['edge', 'safari'] },
    async (client: any, testName: string) => {
      const page = new Page(client);
      await page.goto(editor.path);
      await page.waitForSelector(editor.placeholder);
      await page.click(editor.placeholder);
      // Insert code block
      await insertBlockMenuItem(page, messages.codeblock.defaultMessage);
      await page.waitForSelector(codeBlockSelectors.languageSelectInput);
      // Move out of code block
      await page.keys(['ArrowDown']);
      // Insert a second code block
      await insertBlockMenuItem(page, messages.codeblock.defaultMessage);
      // Make sure the second code block doesn't have a language set.
      await page.waitForSelector(codeBlockSelectors.languageSelectInput);
      const secondCodeblockInitialLanguage = await page.getText(
        floatingToolbarLanguageSelector,
      );
      expect(secondCodeblockInitialLanguage.trim()).toEqual('Select language');
      // Set a language on the second code block
      await page.type(codeBlockSelectors.languageSelectInput, ['C'])
      await page.keys(['Return']);

      // Check that the language on the first code block is still the same
      await page.click('code');
      await page.waitForSelector(floatingToolbarLanguageSelector);
      const firstBlockLanguage = await page.getText(
        floatingToolbarLanguageSelector,
      );
      expect(firstBlockLanguage.trim()).toEqual('Select language');
    },
  );
  */
});
