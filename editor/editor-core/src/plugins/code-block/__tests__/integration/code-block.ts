import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  getDocFromElement,
  editable,
} from '../../../../__tests__/integration/_helpers';
import { EditorAppearance } from '../../../../types';
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '../../../../__tests__/__helpers/testing-example-helpers';
import { messages } from '../../../block-type/messages';
import { codeBlockSelectors } from '../__helpers__/code-block-selectors';

const floatingToolbarLanguageSelector = 'div[aria-label="Floating Toolbar"]';

['comment', 'full-page'].forEach((editor) => {
  BrowserTestCase(
    `code-block: produces correct ADF after language change for ${editor}`,
    { skip: ['safari', 'edge'] },
    async (client: any, testName: string) => {
      const page = await goToEditorTestingWDExample(client);

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
      const page = await goToEditorTestingWDExample(client);

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
      await page.click(codeBlockSelectors.code);
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
      const page = await goToEditorTestingWDExample(client);

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

// https://product-fabric.atlassian.net/browse/ED-12780
BrowserTestCase(
  `code-block: code-highlighting layer is empty for plain text`,
  { skip: ['safari', 'edge'] },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: 'full-page',
      featureFlags: {
        'code-block-syntax-highlighting': true,
      },
    });

    await page.click(`[aria-label="${messages.codeblock.defaultMessage}"]`);
    await page.click('.code-content code');
    await page.keyboard.type('.', []);

    const highlightedCode = await page.$eval(
      '.code-highlighting',
      (el) => el?.innerText,
    );
    expect(highlightedCode).toBe('');
  },
);
