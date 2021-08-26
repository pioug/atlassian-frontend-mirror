import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  doc,
  p,
  taskItem,
  taskList,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  fullpage,
  quickInsert,
  setProseMirrorTextSelection,
  getProseMirrorDocument,
} from '../../../../__tests__/integration/_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../../../__tests__/__helpers/testing-example-helpers';
import { WebDriverPage } from '../../../../__tests__/__helpers/page-objects/_types';
import { selectors } from '../../../../__tests__/__helpers/page-objects/_editor';
import { spaceAtEnd } from './__fixtures__/base-adfs';

describe('typeahead: undo redo', () => {
  const startEditor = async (client: any, adf: any): Promise<WebDriverPage> => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: adf,
      allowTasksAndDecisions: true,
      UNSAFE_allowUndoRedoButtons: true,
    });

    // Set selection after the space at end
    await setProseMirrorTextSelection(page, { anchor: 2, head: 2 });
    return page;
  };

  describe('when undone twice after insert an item with the typeahead', () => {
    BrowserTestCase(
      'it should keep the focus in the editor',
      {},
      async (client: any, testName: string) => {
        const page = await startEditor(client, spaceAtEnd);

        await page.keys('lol '.split(''));

        await quickInsert(page, 'Action', false);

        await page.keys('Enter');

        // undo the action item
        await page.click(selectors.undoButton);

        // undo the typeahead
        await page.click(selectors.undoButton);

        // try type inside of the editor
        await page.keys('More'.split(''));

        const pmDocument = await getProseMirrorDocument(page);
        const expectedDocument = doc(p(' lol /ActionMore'));
        expect(pmDocument).toEqualDocument(expectedDocument);
      },
    );
  });

  describe('when redone after insert an item with the typeahead', () => {
    BrowserTestCase(
      'it should keep the focus in the editor',
      {},
      async (client: any, testName: string) => {
        const page = await startEditor(client, spaceAtEnd);

        await page.keys('lol '.split(''));

        await quickInsert(page, 'Action', false);

        await page.keys('Enter');

        // undo the action item
        await page.click(selectors.undoButton);

        // redo the action item
        await page.click(selectors.redoButton);

        // try type inside of the editor
        await page.keys('More'.split(''));

        const pmDocument = await getProseMirrorDocument(page);

        const expectedDocument = doc(
          p(' lol '),
          taskList({ localId: '' })(taskItem({ localId: '' })('More')),
        );
        expect(pmDocument).toEqualDocument(expectedDocument);
      },
    );
  });

  describe('when the undo button is click when typeahead is opened', () => {
    BrowserTestCase(
      'it should undo and close the typeahead without adding the rawtext into the document',
      {},
      async (client: any, testName: string) => {
        const page = await startEditor(client, spaceAtEnd);

        await page.keys('lol '.split(''));

        await quickInsert(page, 'Action', false);

        await page.click(selectors.undoButton);

        const pmDocument = await getProseMirrorDocument(page);

        const expectedDocument = doc(p(' '));
        expect(pmDocument).toEqualDocument(expectedDocument);
      },
    );
  });
});
