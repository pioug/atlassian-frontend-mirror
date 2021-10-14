import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { Node } from 'prosemirror-model';
import sampleSchema from '@atlaskit/editor-test-helpers/schema';

import {
  doc,
  p,
  table,
  td,
  tr,
  th,
  mention,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  fullpage,
  quickInsert,
  editable,
  getDocFromElement,
  setProseMirrorTextSelection,
  insertMenuItem,
} from '../../../../__tests__/integration/_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../../../__tests__/__helpers/testing-example-helpers';
import { WebDriverPage } from '../../../../__tests__/__helpers/page-objects/_types';
import { onlyOneChar, tableWithPlaceholders } from './__fixtures__/base-adfs';
import { selectors } from '../../../../__tests__/__helpers/page-objects/_editor';

describe('typeahead: content', () => {
  const startEditor = async (client: any, adf: any): Promise<WebDriverPage> => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTables: true,
      allowTemplatePlaceholders: {
        allowInserting: true,
      },
      defaultValue: adf,
    });

    return page;
  };

  describe('when there is no query and space is pressed', () => {
    BrowserTestCase(
      'it should insert the trigger into the document',
      { skip: [] },
      async (client: any, testName: string) => {
        const page = await startEditor(client, onlyOneChar);
        await setProseMirrorTextSelection(page, { anchor: 2, head: 2 });

        await page.keys('Enter');

        await quickInsert(page, '', false);

        await page.keys(' ');

        const jsonDocument = await page.$eval(editable, getDocFromElement);
        const pmDocument = Node.fromJSON(sampleSchema, jsonDocument);
        const expectedDocument = doc(p('C'), p('/ '));
        expect(pmDocument).toEqualDocument(expectedDocument);
      },
    );
  });

  describe('when a typeahead is inserted at a placeholder', () => {
    BrowserTestCase(
      'it should delete the placeholder',
      { skip: [] },
      async (client: any, testName: string) => {
        const page = await startEditor(client, tableWithPlaceholders);

        await page.waitForSelector('.pm-table-container [data-placeholder]');
        await page.click('.pm-table-container [data-placeholder]');

        await insertMenuItem(page, 'Mention');
        await page.waitForSelector(selectors.mentionQuery);

        await page.keys('Carolyn'.split(''));
        await page.keys('Return');

        const jsonDocument = await page.$eval(editable, getDocFromElement);
        const pmDocument = Node.fromJSON(sampleSchema, jsonDocument);

        const expectedDocument = doc(
          // prettier-ignore
          table({ localId: 'local-id' })(
            tr(
              th()(
                p('LOL'),
              ),
              td()(
                p(
                  mention({
                    id: '0',
                    text: '@Carolyn',
                    accessLevel: '',
                  })(),
                  ' ',
                ),
              ),
            ),
          ),
        );
        expect(pmDocument).toEqualDocument(expectedDocument);
      },
    );
  });
});
