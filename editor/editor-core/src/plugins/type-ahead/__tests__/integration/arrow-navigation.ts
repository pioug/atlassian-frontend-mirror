import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { Node } from 'prosemirror-model';
import sampleSchema from '@atlaskit/editor-test-helpers/schema';

import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  fullpage,
  quickInsert,
  sendKeyNumTimes,
  editable,
  getDocFromElement,
  setProseMirrorTextSelection,
} from '../../../../__tests__/integration/_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../../../__tests__/__helpers/testing-example-helpers';
import { WebDriverPage } from '../../../../__tests__/__helpers/page-objects/_types';
import {
  spaceAtEnd,
  spaceBeforeText,
  onlyOneChar,
} from './__fixtures__/base-adfs';

describe('typeahead: arrow navigation', () => {
  const startEditor = async (client: any, adf: any): Promise<WebDriverPage> => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: adf,
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
  BrowserTestCase(
    'it should open the typeahead quick insert and search Action',
    { skip: [] },
    async (client: any, testName: string) => {
      const page = await startEditor(client, spaceAtEnd);

      const title = 'Act';
      await quickInsert(page, title, false);

      const result = await page.waitForSelector(
        `[aria-label="Popup"] [role="listbox"]`,
      );

      expect(result).toBe(true);
    },
  );

  describe('when Escape is pressed', () => {
    BrowserTestCase(
      'it should insert the raw query with the trigger handler',
      { skip: [] },
      async (client: any, testName: string) => {
        const page = await startEditor(client, onlyOneChar);
        await setProseMirrorTextSelection(page, { anchor: 2, head: 2 });

        await page.keys('Enter');

        const title = 'Act';
        await quickInsert(page, title, false);
        await sendArrowLeftKey(page, { numTimes: 3 });

        await page.keys('Escape');

        const jsonDocument = await page.$eval(editable, getDocFromElement);
        const pmDocument = Node.fromJSON(sampleSchema, jsonDocument);
        const expectedDocument = doc(p('C'), p('/Act'));
        expect(pmDocument).toEqualDocument(expectedDocument);
      },
    );
  });

  describe('when backspace is pressed before the trigger char', () => {
    describe('and the query is not empty', () => {
      BrowserTestCase(
        'it should insert the raw query without the trigger handler',
        { skip: [] },
        async (client: any, testName: string) => {
          const page = await startEditor(client, onlyOneChar);
          await setProseMirrorTextSelection(page, { anchor: 2, head: 2 });

          await page.keys('Enter');

          const title = 'Act';
          await quickInsert(page, title, false);
          await sendArrowLeftKey(page, { numTimes: 3 });

          await page.keys('Backspace');

          const jsonDocument = await page.$eval(editable, getDocFromElement);
          const pmDocument = Node.fromJSON(sampleSchema, jsonDocument);
          const expectedDocument = doc(p('C'), p('Act'));
          expect(pmDocument).toEqualDocument(expectedDocument);
        },
      );
    });

    describe('and the query is empty', () => {
      BrowserTestCase(
        'it not should insert the query at the document',
        { skip: [] },
        async (client: any, testName: string) => {
          const page = await startEditor(client, onlyOneChar);
          await setProseMirrorTextSelection(page, { anchor: 2, head: 2 });

          await page.keys('Enter');

          const title = 'Act';
          await quickInsert(page, title, false);

          await page.keys('Backspace');
          await page.keys('Backspace');
          await page.keys('Backspace');
          await page.keys('Backspace');

          const jsonDocument = await page.$eval(editable, getDocFromElement);
          const pmDocument = Node.fromJSON(sampleSchema, jsonDocument);
          const expectedDocument = doc(p('C'), p());
          expect(pmDocument).toEqualDocument(expectedDocument);
        },
      );
    });
  });

  describe('when typeahead is add as first element in a new paragraph and user leaves the query', () => {
    describe('using the arrow left key', () => {
      BrowserTestCase(
        'it should insert the typeahead query content inside of the document',
        { skip: [] },
        async (client: any, testName: string) => {
          const page = await startEditor(client, onlyOneChar);
          await setProseMirrorTextSelection(page, { anchor: 2, head: 2 });

          await page.keys('Enter');

          const title = 'Act';
          await quickInsert(page, title, false);
          await sendArrowLeftKey(page, { numTimes: 4 });

          const jsonDocument = await page.$eval(editable, getDocFromElement);

          const pmDocument = Node.fromJSON(sampleSchema, jsonDocument);
          const expectedDocument = doc(p('C'), p('/Act'));
          expect(pmDocument).toEqualDocument(expectedDocument);
        },
      );
    });
    describe('using the arrow right key', () => {
      BrowserTestCase(
        'it should insert the typeahead query content inside of the document',
        { skip: [] },
        async (client: any, testName: string) => {
          const page = await startEditor(client, onlyOneChar);
          await setProseMirrorTextSelection(page, { anchor: 2, head: 2 });

          await page.keys('Enter');

          const title = 'Act';
          await quickInsert(page, title, false);
          await sendArrowRightKey(page, { numTimes: 1 });

          const jsonDocument = await page.$eval(editable, getDocFromElement);

          const pmDocument = Node.fromJSON(sampleSchema, jsonDocument);
          const expectedDocument = doc(p('C'), p('/Act'));
          expect(pmDocument).toEqualDocument(expectedDocument);
        },
      );
    });
  });

  describe('when typeahead is actived and user leaves the query', () => {
    describe('using the arrow left key', () => {
      BrowserTestCase(
        'it should close the popup',
        { skip: [] },
        async (client: any, testName: string) => {
          const page = await startEditor(client, spaceBeforeText);
          // Set cursor position right before the 'b' char
          await setProseMirrorTextSelection(page, { anchor: 3, head: 3 });

          const title = 'Act';
          await quickInsert(page, title, false);
          await sendArrowLeftKey(page, { numTimes: 4 });

          let isPopupInvisible = await page.waitForInvisible(
            `[aria-label="Popup"] [role="listbox"]`,
          );
          expect(isPopupInvisible).toBe(true);
        },
      );

      BrowserTestCase(
        'it should insert the typeahead query content inside of the document',
        { skip: [] },
        async (client: any, testName: string) => {
          const page = await startEditor(client, spaceBeforeText);
          // Set cursor position right before the 'b' char
          await setProseMirrorTextSelection(page, { anchor: 3, head: 3 });

          const title = 'Act';
          await quickInsert(page, title, false);
          await sendArrowLeftKey(page, { numTimes: 4 });

          const jsonDocument = await page.$eval(editable, getDocFromElement);

          const pmDocument = Node.fromJSON(sampleSchema, jsonDocument);
          const expectedDocument = doc(p('a /Actb'));
          expect(pmDocument).toEqualDocument(expectedDocument);
        },
      );
    });

    describe('using the arrow right key', () => {
      BrowserTestCase(
        'it should close the popup',
        { skip: [] },
        async (client: any, testName: string) => {
          const page = await startEditor(client, spaceBeforeText);
          // Set cursor position right before the 'b' char
          await setProseMirrorTextSelection(page, { anchor: 3, head: 3 });

          const title = 'Act';
          await quickInsert(page, title, false);
          await sendArrowRightKey(page, { numTimes: 1 });

          let isPopupInvisible = await page.waitForInvisible(
            `[aria-label="Popup"] [role="listbox"]`,
          );
          expect(isPopupInvisible).toBe(true);
        },
      );

      BrowserTestCase(
        'it should insert the typeahead query content inside of the document',
        { skip: [] },
        async (client: any, testName: string) => {
          const page = await startEditor(client, spaceBeforeText);
          // Set cursor position right before the 'b' char
          await setProseMirrorTextSelection(page, { anchor: 3, head: 3 });

          const title = 'Act';
          await quickInsert(page, title, false);
          await sendArrowRightKey(page, { numTimes: 1 });

          const jsonDocument = await page.$eval(editable, getDocFromElement);

          const pmDocument = Node.fromJSON(sampleSchema, jsonDocument);
          const expectedDocument = doc(p('a /Actb'));
          expect(pmDocument).toEqualDocument(expectedDocument);
        },
      );
    });
  });
});
