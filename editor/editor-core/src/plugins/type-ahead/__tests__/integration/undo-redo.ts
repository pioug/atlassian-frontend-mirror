import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { Node } from 'prosemirror-model';
import sampleSchema from '@atlaskit/editor-test-helpers/schema';

import { doc, p, h1 } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  fullpage,
  quickInsert,
  editable,
  getDocFromElement,
  setProseMirrorTextSelection,
} from '../../../../__tests__/integration/_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../../../__tests__/__helpers/testing-example-helpers';
import { WebDriverPage } from '../../../../__tests__/__helpers/page-objects/_types';
import { spaceAtEnd } from './__fixtures__/base-adfs';

const TYPE_AHEAD_MENU_LIST = `[aria-label="Popup"] [role="listbox"]`;
const TYPE_AHEAD_SEARCH_BOX = '[role="textbox"][data-query-prefix]';
describe('typeahead: undo redo', () => {
  const startEditor = async (client: any, adf: any): Promise<WebDriverPage> => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: adf,
    });

    // Set selection after the space at end
    await setProseMirrorTextSelection(page, { anchor: 2, head: 2 });
    return page;
  };

  describe('when undone after insert an item by space', () => {
    BrowserTestCase(
      'it should add the raw text into the document',
      {},
      async (client: any, testName: string) => {
        const page = await startEditor(client, spaceAtEnd);

        await page.keys('lol '.split(''));

        await page.keys('/Action Item'.split(''));
        await page.waitForVisible(TYPE_AHEAD_MENU_LIST);
        await page.keys(' ');
        await page.waitForInvisible(TYPE_AHEAD_MENU_LIST);

        await page.undo();

        const jsonDocument = await page.$eval(editable, getDocFromElement);
        const pmDocument = Node.fromJSON(sampleSchema, jsonDocument);
        const expectedDocument = doc(p(' lol /Action Item '));
        expect(pmDocument).toEqualDocument(expectedDocument);
      },
    );
  });

  describe('when undone rigth after open the typeahead', () => {
    BrowserTestCase(
      'it should not add the raw trigger in the document',
      // That is sad but I need to skip safari because the 'undo'
      // operaton isn't working inside of the query
      // for browserstack. I tested that locally and it is working fine
      { skip: ['safari'] },
      async (client: any, testName: string) => {
        const page = await startEditor(client, spaceAtEnd);

        await page.keys(['A', 'B', 'C', ' ']);

        const title = '';
        await quickInsert(page, title, false);
        await page.waitForVisible(TYPE_AHEAD_MENU_LIST);

        await page.undo();
        await page.waitForInvisible(TYPE_AHEAD_MENU_LIST);

        const jsonDocument = await page.$eval(editable, getDocFromElement);
        const pmDocument = Node.fromJSON(sampleSchema, jsonDocument);
        const expectedDocument = doc(p(' '));
        expect(pmDocument).toEqualDocument(expectedDocument);
      },
    );
  });

  describe('when undone the query inside of the typeahead', () => {
    BrowserTestCase(
      'it should not add the raw trigger in the document',
      // That is sad but I need to skip safari because the 'undo'
      // operaton isn't working inside of the query
      // for browserstack. I tested that locally and it is working fine
      { skip: ['safari'] },
      async (client: any, testName: string) => {
        const page = await startEditor(client, spaceAtEnd);

        await page.keys(['A', 'B', 'C', ' ']);

        const title = 'Act';
        await quickInsert(page, title, false);
        await page.waitForVisible(TYPE_AHEAD_MENU_LIST);

        // Undo the letter: 't'
        await page.undo();

        // Undo the letter: 'c'
        await page.undo();

        // Undo the letter: 'a'
        await page.undo();

        // Undo the typeahead trigger: '/'
        await page.undo();

        await page.waitForInvisible(TYPE_AHEAD_MENU_LIST);

        const jsonDocument = await page.$eval(editable, getDocFromElement);
        const pmDocument = Node.fromJSON(sampleSchema, jsonDocument);
        const expectedDocument = doc(p(' ABC '));
        expect(pmDocument).toEqualDocument(expectedDocument);
      },
    );
  });

  describe('when undone the item inserted by typeahead', () => {
    BrowserTestCase(
      'it should open the typeahead menu with the old query',
      { skip: [] },
      async (client: any, testName: string) => {
        const page = await startEditor(client, spaceAtEnd);

        const title = 'Act';
        await quickInsert(page, title, false);

        await page.waitForSelector(TYPE_AHEAD_MENU_LIST);

        await page.keys('Enter');
        await page.waitForInvisible(TYPE_AHEAD_MENU_LIST);

        await page.undo();
        await page.waitForVisible(TYPE_AHEAD_MENU_LIST);

        const query = await page.getText(TYPE_AHEAD_SEARCH_BOX);
        expect(query).toEqual(title);
      },
    );

    describe('when a redo operation happens', () => {
      BrowserTestCase(
        'it should add the item back',
        { skip: [] },
        async (client: any, testName: string) => {
          const page = await startEditor(client, spaceAtEnd);

          const title = 'heading1';
          await quickInsert(page, title, false);

          await page.waitForSelector(TYPE_AHEAD_MENU_LIST);

          await page.keys('Enter');
          await page.waitForInvisible(TYPE_AHEAD_MENU_LIST);

          await page.undo();
          await page.waitForVisible(TYPE_AHEAD_MENU_LIST);

          await page.redo();
          await page.waitForInvisible(TYPE_AHEAD_MENU_LIST);

          const jsonDocument = await page.$eval(editable, getDocFromElement);
          const pmDocument = Node.fromJSON(sampleSchema, jsonDocument);
          const expectedDocument = doc(p(' '), h1(''));
          expect(pmDocument).toEqualDocument(expectedDocument);
        },
      );
    });

    describe('when a second undone operation happens', () => {
      BrowserTestCase(
        'it should insert the raw text back',
        { skip: [] },
        async (client: any, testName: string) => {
          const page = await startEditor(client, spaceAtEnd);

          const title = 'Act';
          await quickInsert(page, title, false);

          await page.waitForSelector(TYPE_AHEAD_MENU_LIST);

          await page.keys('Enter');
          await page.waitForInvisible(TYPE_AHEAD_MENU_LIST);

          await page.undo();
          await page.waitForVisible(TYPE_AHEAD_MENU_LIST);

          await page.undo();
          await page.waitForInvisible(TYPE_AHEAD_MENU_LIST);

          const jsonDocument = await page.$eval(editable, getDocFromElement);
          const pmDocument = Node.fromJSON(sampleSchema, jsonDocument);
          const expectedDocument = doc(p(' /Act'));
          expect(pmDocument).toEqualDocument(expectedDocument);
        },
      );
    });

    describe('when a third undone operation happens', () => {
      BrowserTestCase(
        'it should back to the original document',
        { skip: [] },
        async (client: any, testName: string) => {
          const page = await startEditor(client, spaceAtEnd);

          const title = 'Act';
          await quickInsert(page, title, false);

          await page.waitForSelector(TYPE_AHEAD_MENU_LIST);

          await page.keys('Enter');
          await page.waitForInvisible(TYPE_AHEAD_MENU_LIST);

          await page.undo();
          await page.waitForVisible(TYPE_AHEAD_MENU_LIST);

          await page.undo();
          await page.waitForInvisible(TYPE_AHEAD_MENU_LIST);

          await page.undo();

          const jsonDocument = await page.$eval(editable, getDocFromElement);
          const pmDocument = Node.fromJSON(sampleSchema, jsonDocument);
          const expectedDocument = doc(p(' '));
          expect(pmDocument).toEqualDocument(expectedDocument);
        },
      );

      describe('when one redo happens', () => {
        BrowserTestCase(
          'it should add the raw text back the original document',
          { skip: [] },
          async (client: any, testName: string) => {
            const page = await startEditor(client, spaceAtEnd);

            const title = 'Act';
            await quickInsert(page, title, false);

            await page.waitForSelector(TYPE_AHEAD_MENU_LIST);

            await page.keys('Enter');
            await page.waitForInvisible(TYPE_AHEAD_MENU_LIST);

            await page.undo();
            await page.waitForVisible(TYPE_AHEAD_MENU_LIST);

            await page.undo();
            await page.waitForInvisible(TYPE_AHEAD_MENU_LIST);

            await page.undo();
            await page.redo();

            const jsonDocument = await page.$eval(editable, getDocFromElement);
            const pmDocument = Node.fromJSON(sampleSchema, jsonDocument);
            const expectedDocument = doc(p(' /Act'));
            expect(pmDocument).toEqualDocument(expectedDocument);
          },
        );
      });

      describe('when two redo happens', () => {
        BrowserTestCase(
          'it should opens the typeahead menu with the query',
          { skip: [] },
          async (client: any, testName: string) => {
            const page = await startEditor(client, spaceAtEnd);

            const title = 'Act';
            await quickInsert(page, title, false);

            await page.waitForSelector(TYPE_AHEAD_MENU_LIST);

            await page.keys('Enter');
            await page.waitForInvisible(TYPE_AHEAD_MENU_LIST);

            await page.undo();
            await page.waitForVisible(TYPE_AHEAD_MENU_LIST);

            await page.undo();
            await page.waitForInvisible(TYPE_AHEAD_MENU_LIST);

            await page.undo();

            await page.redo();
            await page.redo();

            await page.waitForVisible(TYPE_AHEAD_MENU_LIST);

            const query = await page.getText(TYPE_AHEAD_SEARCH_BOX);
            expect(query).toEqual(title);
          },
        );
      });

      describe('when three redo happens', () => {
        BrowserTestCase(
          'it should add the item back to the document',
          { skip: [] },
          async (client: any, testName: string) => {
            const page = await startEditor(client, spaceAtEnd);

            const title = 'heading1';
            await quickInsert(page, title, false);

            await page.waitForSelector(TYPE_AHEAD_MENU_LIST);

            await page.keys('Enter');
            await page.waitForInvisible(TYPE_AHEAD_MENU_LIST);

            await page.undo();
            await page.waitForVisible(TYPE_AHEAD_MENU_LIST);

            await page.undo();
            await page.waitForInvisible(TYPE_AHEAD_MENU_LIST);

            await page.undo();

            // Adding raw  text back
            await page.redo();

            // Open the typeahead menu
            await page.redo();
            await page.waitForVisible(TYPE_AHEAD_MENU_LIST);

            // Inserting the content back
            await page.redo();
            await page.waitForInvisible(TYPE_AHEAD_MENU_LIST);

            const jsonDocument = await page.$eval(editable, getDocFromElement);
            const pmDocument = Node.fromJSON(sampleSchema, jsonDocument);
            const expectedDocument = doc(p(' '), h1(''));
            expect(pmDocument).toEqualDocument(expectedDocument);
          },
        );
      });
    });
  });
});
