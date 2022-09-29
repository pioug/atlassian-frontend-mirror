import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { Node } from 'prosemirror-model';
import sampleSchema from '@atlaskit/editor-test-helpers/schema';

import {
  fullpage,
  sendKeyNumTimes,
  editable,
  getDocFromElement,
  setProseMirrorTextSelection,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { WebDriverPage } from '@atlaskit/editor-test-helpers/page-objects/types';
import {
  twoPlaceholdersInsideTableCells,
  onePlaceholderInsideTableCells,
} from './__fixtures__/base-adfs';

describe('placeholder-text: arrow navigation', () => {
  const startEditor = async (client: any, adf: any): Promise<WebDriverPage> => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: adf,
      allowTemplatePlaceholders: {
        allowInserting: true,
      },
      allowTables: true,
    });

    return page;
  };

  const sendArrowRightKey = async (
    page: WebDriverPage,
    opts: { numTimes?: number } = {},
  ) => {
    await sendKeyNumTimes(page, 'ArrowRight', opts);
  };

  const sendArrowLeftKey = async (
    page: WebDriverPage,
    opts: { numTimes?: number } = {},
  ) => {
    await sendKeyNumTimes(page, 'ArrowLeft', opts);
  };

  describe('when there are two placeholder inside a table', () => {
    describe('and the arrow navigation is used to change the cursor position', () => {
      const FIRST_PLACEHOLDER_POSITION = 40;
      const AFTER_FIRST_PLACEHOLDER_POSITION = FIRST_PLACEHOLDER_POSITION + 1;

      const SECOND_PLACEHOLDER_POSITION = 45;
      const AFTER_SECOND_PLACEHOLDER_POSITION = SECOND_PLACEHOLDER_POSITION + 1;

      const PARAGRAGH_BELOW_SECOND_PLACEHOLDER_POSITION = 48;

      async function setCursorAfterSecondPlaceholder(page: WebDriverPage) {
        await setProseMirrorTextSelection(page, {
          anchor: PARAGRAGH_BELOW_SECOND_PLACEHOLDER_POSITION,
          head: PARAGRAGH_BELOW_SECOND_PLACEHOLDER_POSITION,
        });
      }

      describe('and the cursor ends after the second placeholder', () => {
        BrowserTestCase(
          'it should add the content after the placeholder',
          { skip: [] },
          async (client: any, testName: string) => {
            const page = await startEditor(
              client,
              twoPlaceholdersInsideTableCells,
            );

            await setCursorAfterSecondPlaceholder(page);

            await sendArrowLeftKey(page, { numTimes: 1 });
            await page.keys('lol'.split(''));

            const jsonDocument = await page.$eval(editable, getDocFromElement);

            const pmDocument = Node.fromJSON(sampleSchema, jsonDocument);
            expect(
              pmDocument.nodeAt(AFTER_SECOND_PLACEHOLDER_POSITION)?.textContent,
            ).toEqual('lol');
          },
        );
      });

      describe('and the cursor ends at the second placeholder', () => {
        BrowserTestCase(
          'it should replace the placeholder to the text content',
          { skip: [] },
          async (client: any, testName: string) => {
            const page = await startEditor(
              client,
              twoPlaceholdersInsideTableCells,
            );

            await setCursorAfterSecondPlaceholder(page);
            await sendArrowLeftKey(page, { numTimes: 2 });
            await page.keys('lol'.split(''));

            const jsonDocument = await page.$eval(editable, getDocFromElement);

            const pmDocument = Node.fromJSON(sampleSchema, jsonDocument);
            expect(
              pmDocument.nodeAt(SECOND_PLACEHOLDER_POSITION)?.textContent,
            ).toEqual('lol');
          },
        );
      });

      describe('and the cursor ends after the first placeholder', () => {
        BrowserTestCase(
          'it should add the content after the placeholder',
          { skip: [] },
          async (client: any, testName: string) => {
            const page = await startEditor(
              client,
              twoPlaceholdersInsideTableCells,
            );

            await setCursorAfterSecondPlaceholder(page);
            await sendArrowLeftKey(page, { numTimes: 3 });
            await page.keys('lol'.split(''));

            const jsonDocument = await page.$eval(editable, getDocFromElement);

            const pmDocument = Node.fromJSON(sampleSchema, jsonDocument);
            expect(
              pmDocument.nodeAt(AFTER_FIRST_PLACEHOLDER_POSITION)?.textContent,
            ).toEqual('lol');
          },
        );
      });

      describe('and the cursor ends at the first placeholder', () => {
        BrowserTestCase(
          'it should replace the placeholder to the text content',
          { skip: [] },
          async (client: any, testName: string) => {
            const page = await startEditor(
              client,
              twoPlaceholdersInsideTableCells,
            );

            await setCursorAfterSecondPlaceholder(page);
            await sendArrowLeftKey(page, { numTimes: 4 });
            await page.keys('lol'.split(''));

            const jsonDocument = await page.$eval(editable, getDocFromElement);

            const pmDocument = Node.fromJSON(sampleSchema, jsonDocument);
            expect(
              pmDocument.nodeAt(FIRST_PLACEHOLDER_POSITION)?.textContent,
            ).toEqual('lol');
          },
        );
      });

      describe('and the cursor moves from after the first placeholder to at the second placeholder', () => {
        BrowserTestCase(
          'it should replace the second placeholder to the text content',
          { skip: [] },
          async (client: any, testName: string) => {
            const page = await startEditor(
              client,
              twoPlaceholdersInsideTableCells,
            );

            await setCursorAfterSecondPlaceholder(page);
            await sendArrowLeftKey(page, { numTimes: 3 });
            await sendArrowRightKey(page, { numTimes: 1 });
            await page.keys('lol'.split(''));

            const jsonDocument = await page.$eval(editable, getDocFromElement);

            const pmDocument = Node.fromJSON(sampleSchema, jsonDocument);
            expect(
              pmDocument.nodeAt(SECOND_PLACEHOLDER_POSITION)?.textContent,
            ).toEqual('lol');
          },
        );
      });
    });
  });

  describe('when there is one placeholder inside a table', () => {
    describe('and the arrow navigation is used to change the cursor position', () => {
      const EMPTY_PARAGRAPH_AT_TABLE_CELL_POSITION = 40;
      const FIRST_PLACEHOLDER_POSITION = 44;
      const PARAGRAGH_BELOW_FIRST_PLACEHOLDER_POSITION = 47;

      async function setCursorAfterSecondPlaceholder(page: WebDriverPage) {
        await setProseMirrorTextSelection(page, {
          anchor: PARAGRAGH_BELOW_FIRST_PLACEHOLDER_POSITION,
          head: PARAGRAGH_BELOW_FIRST_PLACEHOLDER_POSITION,
        });
      }

      describe('and the cursor ends at the empty cell', () => {
        BrowserTestCase(
          'it should add the content in the empty cell',
          { skip: [] },
          async (client: any, testName: string) => {
            const page = await startEditor(
              client,
              onePlaceholderInsideTableCells,
            );

            await setCursorAfterSecondPlaceholder(page);
            await sendArrowLeftKey(page, { numTimes: 3 });
            await page.keys('lol'.split(''));

            const jsonDocument = await page.$eval(editable, getDocFromElement);

            const pmDocument = Node.fromJSON(sampleSchema, jsonDocument);
            expect(
              pmDocument.nodeAt(EMPTY_PARAGRAPH_AT_TABLE_CELL_POSITION)
                ?.textContent,
            ).toEqual('lol');
          },
        );
      });

      describe('and the cursor moves from after the empty cell to at the placeholder', () => {
        BrowserTestCase(
          'it should replace the second placeholder to the text content',
          { skip: [] },
          async (client: any, testName: string) => {
            const page = await startEditor(
              client,
              onePlaceholderInsideTableCells,
            );

            await setCursorAfterSecondPlaceholder(page);
            await sendArrowLeftKey(page, { numTimes: 3 });
            await sendArrowRightKey(page, { numTimes: 1 });
            await page.keys('lol'.split(''));

            const jsonDocument = await page.$eval(editable, getDocFromElement);

            const pmDocument = Node.fromJSON(sampleSchema, jsonDocument);
            expect(
              pmDocument.nodeAt(FIRST_PLACEHOLDER_POSITION)?.textContent,
            ).toEqual('lol');
          },
        );
      });
    });
  });
});
