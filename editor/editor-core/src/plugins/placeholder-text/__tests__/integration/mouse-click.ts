import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { Node } from 'prosemirror-model';
import sampleSchema from '@atlaskit/editor-test-helpers/schema';

import {
  fullpage,
  editable,
  getDocFromElement,
  setProseMirrorTextSelection,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { WebDriverPage } from '@atlaskit/editor-test-helpers/page-objects/types';
import { onePlaceholderInsideTableCells } from './__fixtures__/base-adfs';

describe('placeholder-text: mouse click', () => {
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

  describe('when there is one placeholder inside a table', () => {
    const FIRST_PLACEHOLDER_POSITION = 44;

    const PARAGRAGH_BELOW_FIRST_PLACEHOLDER_POSITION = 47;

    async function setCursorAfterSecondPlaceholder(page: WebDriverPage) {
      await setProseMirrorTextSelection(page, {
        anchor: PARAGRAGH_BELOW_FIRST_PLACEHOLDER_POSITION,
        head: PARAGRAGH_BELOW_FIRST_PLACEHOLDER_POSITION,
      });
    }

    describe('and the user clicks at the second placeholder', () => {
      BrowserTestCase(
        'it should select the placeholder',
        { skip: ['chrome', 'firefox'] },
        async (client: any, testName: string) => {
          const page = await startEditor(
            client,
            onePlaceholderInsideTableCells,
          );

          await setCursorAfterSecondPlaceholder(page);

          await page.click('.pm-placeholder__text');

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
