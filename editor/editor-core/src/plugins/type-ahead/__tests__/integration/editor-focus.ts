import { BrowserTestCase, Browser } from '@atlaskit/webdriver-runner/runner';

import { Node as PMNode } from 'prosemirror-model';
import sampleSchema from '@atlaskit/editor-test-helpers/schema';

import { doc, p, status } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  editable,
  fullpage,
  quickInsert,
  setProseMirrorTextSelection,
  getDocFromElement,
} from '../../../../__tests__/integration/_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../../../__tests__/__helpers/testing-example-helpers';
import { WebDriverPage } from '../../../../__tests__/__helpers/page-objects/_types';
import { clickFirstParagraph } from '../../../../__tests__/__helpers/page-objects/_editor';
import {
  textAndStatusAtFirstParagraph,
  onlyOneChar,
} from './__fixtures__/base-adfs';

describe('typeahead: editor focus', () => {
  const startEditor = async (client: any, adf: any): Promise<WebDriverPage> => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: adf,
      allowStatus: true,
    });

    return page;
  };

  BrowserTestCase(
    'it should insert the raw query text in the current selection before the user changes the selection',
    {},
    async (client: any, testName: string) => {
      const page = await startEditor(client, textAndStatusAtFirstParagraph);

      // Set selection at the last paragraph
      await setProseMirrorTextSelection(page, { anchor: 9, head: 9 });

      // Open the search
      await quickInsert(page, 'heading', false);

      await clickFirstParagraph(page);

      const jsonDocument = await page.$eval(editable, getDocFromElement);
      const pmDocument = PMNode.fromJSON(sampleSchema, jsonDocument);
      const expectedDocument = doc(
        p(
          'AAA ',
          status({ text: 'CLICK ME', color: 'neutral', localId: 'local-id' }),
          ' ',
        ),
        p('/heading '),
      );
      expect(pmDocument).toEqualDocument(expectedDocument);
    },
  );

  BrowserTestCase(
    'it should change the selection with only one click',
    {},
    async (client: any, testName: string) => {
      const page = await startEditor(client, textAndStatusAtFirstParagraph);

      // Set selection at the last paragraph
      await setProseMirrorTextSelection(page, { anchor: 9, head: 9 });

      // Open the search
      await quickInsert(page, 'heading', false);

      await clickFirstParagraph(page);

      await page.keys('some text'.split(''));

      const jsonDocument = await page.$eval(editable, getDocFromElement);
      const pmDocument = PMNode.fromJSON(sampleSchema, jsonDocument);
      const expectedDocument = doc(
        p(
          'AAA ',
          status({ text: 'CLICK ME', color: 'neutral', localId: 'local-id' }),
          ' some text',
        ),
        p('/heading '),
      );
      expect(pmDocument).toEqualDocument(expectedDocument);
    },
  );

  BrowserTestCase(
    'it should focus on Editor when space is typed right after the trigger',
    {},
    async (client: any, testName: string) => {
      const page = await startEditor(client, onlyOneChar);

      await setProseMirrorTextSelection(page, { anchor: 2, head: 2 });

      await page.keys(' ');
      await quickInsert(page, '', false);
      await page.keys(' lol'.split(''));

      const jsonDocument = await page.$eval(editable, getDocFromElement);
      const pmDocument = PMNode.fromJSON(sampleSchema, jsonDocument);
      const expectedDocument = doc(p('C / lol'));
      expect(pmDocument).toEqualDocument(expectedDocument);
    },
  );

  BrowserTestCase(
    'it should focus on Editor when Backspace is typed right after the trigger',
    {},
    async (client: any, testName: string) => {
      const page = await startEditor(client, onlyOneChar);

      await setProseMirrorTextSelection(page, { anchor: 2, head: 2 });

      await page.keys(' ');
      await quickInsert(page, '', false);
      await page.keys(['Backspace', 'l', 'o', 'l']);

      const jsonDocument = await page.$eval(editable, getDocFromElement);
      const pmDocument = PMNode.fromJSON(sampleSchema, jsonDocument);
      const expectedDocument = doc(p('C lol'));
      expect(pmDocument).toEqualDocument(expectedDocument);
    },
  );
  describe('when access from Safari and using keyboard selection shortcuts', () => {
    const allButSafari: Browser[] = ['chrome', 'firefox', 'edge'];
    describe('when select using COMMAND+SHIFT+ARROW_LEFT', () => {
      BrowserTestCase(
        'it should not delete any content',
        { skip: allButSafari },
        async (client: any, testName: string) => {
          const page = await startEditor(client, onlyOneChar);

          // Set selection at the last paragraph
          await setProseMirrorTextSelection(page, { anchor: 2, head: 2 });

          await page.keys(' ');

          // Open the search
          await quickInsert(page, 'act', false);

          await page.keys(['Shift', 'Meta', 'ArrowLeft'], true);

          const jsonDocument = await page.$eval(editable, getDocFromElement);
          const pmDocument = PMNode.fromJSON(sampleSchema, jsonDocument);
          const expectedDocument = doc(p('C /act'));
          expect(pmDocument).toEqualDocument(expectedDocument);
        },
      );
    });

    describe('when select using COMMAND+A', () => {
      BrowserTestCase(
        'it should not delete any content',
        { skip: allButSafari },
        async (client: any, testName: string) => {
          const page = await startEditor(client, onlyOneChar);

          // Set selection at the last paragraph
          await setProseMirrorTextSelection(page, { anchor: 2, head: 2 });

          await page.keys(' ');

          // Open the search
          await quickInsert(page, 'act', false);

          await page.keys(['Meta', 'a'], true);

          const jsonDocument = await page.$eval(editable, getDocFromElement);
          const pmDocument = PMNode.fromJSON(sampleSchema, jsonDocument);
          const expectedDocument = doc(p('C /act'));
          expect(pmDocument).toEqualDocument(expectedDocument);
        },
      );
    });
  });
});
