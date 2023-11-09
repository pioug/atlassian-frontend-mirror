import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { Node } from '@atlaskit/editor-prosemirror/model';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import sampleSchema from '@atlaskit/editor-test-helpers/schema';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  fullpage,
  sendKeyNumTimes,
  editable,
  getDocFromElement,
  quickInsert,
  setProseMirrorTextSelection,
} from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { WebDriverPage } from '@atlaskit/editor-test-helpers/page-objects/types';
import { twoPlaceholdersInsideTableCells } from './__fixtures__/base-adfs';

describe('placeholder-text: type-ahead', () => {
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

  const sendArrowLeftKey = async (
    page: WebDriverPage,
    opts: { numTimes?: number } = {},
  ) => {
    await sendKeyNumTimes(page, 'ArrowLeft', opts);
  };

  describe('when there are two placeholder inside a table', () => {
    describe('and the arrow navigation is used to change the cursor position', () => {
      const FIRST_PLACEHOLDER_POSITION = 40;
      const SECOND_PLACEHOLDER_POSITION = 45;

      const PARAGRAGH_BELOW_SECOND_PLACEHOLDER_POSITION = 48;

      async function setCursorInParagraphBelowSecondPlaceholder(
        page: WebDriverPage,
      ) {
        await setProseMirrorTextSelection(page, {
          anchor: PARAGRAGH_BELOW_SECOND_PLACEHOLDER_POSITION,
          head: PARAGRAGH_BELOW_SECOND_PLACEHOLDER_POSITION,
        });
      }

      describe('and the cursor is in front of the second placeholder', () => {
        BrowserTestCase(
          'it should replace the placeholder with the type-ahead item',
          { skip: [] },
          async (client: any, testName: string) => {
            const page = await startEditor(
              client,
              twoPlaceholdersInsideTableCells,
            );

            await setCursorInParagraphBelowSecondPlaceholder(page);

            await sendArrowLeftKey(page, { numTimes: 2 });

            await quickInsert(page, 'Action', false);
            await page.keys(['ArrowDown', 'Enter']);

            const jsonDocument = await page.$eval(editable, getDocFromElement);

            const pmDocument = Node.fromJSON(sampleSchema, jsonDocument);
            expect(
              pmDocument.nodeAt(SECOND_PLACEHOLDER_POSITION)?.type.name,
            ).toEqual('taskItem');
          },
        );
      });

      describe('and the cursor is in front of the first placeholder', () => {
        BrowserTestCase(
          'it should replace the placeholder with the type-ahead item',
          { skip: [] },
          async (client: any, testName: string) => {
            const page = await startEditor(
              client,
              twoPlaceholdersInsideTableCells,
            );

            await setCursorInParagraphBelowSecondPlaceholder(page);

            await sendArrowLeftKey(page, { numTimes: 4 });

            await quickInsert(page, 'Action', false);
            await page.keys(['ArrowDown', 'Enter']);

            const jsonDocument = await page.$eval(editable, getDocFromElement);

            const pmDocument = Node.fromJSON(sampleSchema, jsonDocument);
            expect(
              pmDocument.nodeAt(FIRST_PLACEHOLDER_POSITION)?.type.name,
            ).toEqual('taskItem');
          },
        );
      });
    });
  });
});
