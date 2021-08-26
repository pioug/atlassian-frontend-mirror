import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { Node } from 'prosemirror-model';
import sampleSchema from '@atlaskit/editor-test-helpers/schema';

import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
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
import { onlyOneChar } from './__fixtures__/base-adfs';

describe('typeahead: content', () => {
  const startEditor = async (client: any, adf: any): Promise<WebDriverPage> => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
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
});
