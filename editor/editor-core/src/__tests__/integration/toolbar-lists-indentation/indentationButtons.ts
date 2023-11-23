import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import type { BrowserObject } from '@atlaskit/webdriver-runner/wd-wrapper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  getDocFromElement,
  fullpage,
  editable,
  setProseMirrorTextSelection,
} from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { WebDriverPage } from '@atlaskit/editor-test-helpers/page-objects/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { adfs } from './__fixtures__/indentationButtonADFs';

describe('Editor toolbar indentation buttons: ', () => {
  const buttonSelectors = {
    indent: 'button[data-testid="indent"]',
    outdent: 'button[data-testid="outdent"]',
  };

  const initEditorAndClickButton = async ({
    client,
    adf,
    button,
    selection = { anchor: 1, head: 1 },
  }: {
    client: BrowserObject;
    adf: string;
    button: 'indent' | 'outdent';
    selection?: { anchor: number; head: number };
  }): Promise<WebDriverPage> => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(
      page,
      {
        appearance: fullpage.appearance,
        defaultValue: adf,
        allowTextAlignment: true,
        allowIndentation: true,
        showIndentationButtons: true,
      },
      undefined,
      // Prevent occasionally creating a GapCursor which is incompatible with
      // setProseMirrorTextSelection
      { clickInEditor: false },
    );

    await page.waitForSelector(buttonSelectors[button]);
    await setProseMirrorTextSelection(page, selection);
    await page.click(buttonSelectors[button]);

    return page;
  };

  describe('Indent button click', () => {
    BrowserTestCase(
      'should indent top-level paragraph',
      { skip: [] },
      async (client: any, testName: string) => {
        const page = await initEditorAndClickButton({
          client,
          adf: JSON.stringify(adfs.paragraph),
          button: 'indent',
        });

        expect(
          await page.$eval(editable, getDocFromElement),
        ).toMatchCustomDocSnapshot(testName);
      },
    );

    BrowserTestCase(
      'should indent top-level headings',
      { skip: [] },
      async (client: any, testName: string) => {
        const page = await initEditorAndClickButton({
          client,
          adf: JSON.stringify(adfs.heading),
          button: 'indent',
        });

        expect(
          await page.$eval(editable, getDocFromElement),
        ).toMatchCustomDocSnapshot(testName);
      },
    );

    BrowserTestCase(
      'should indent list item',
      { skip: [] },
      async (client: any, testName: string) => {
        const page = await initEditorAndClickButton({
          client,
          adf: JSON.stringify(adfs.list),
          button: 'indent',
          selection: { anchor: 12, head: 12 },
        });

        expect(
          await page.$eval(editable, getDocFromElement),
        ).toMatchCustomDocSnapshot(testName);
      },
    );

    BrowserTestCase(
      'should indent task list item',
      { skip: [] },
      async (client: any, testName: string) => {
        const page = await initEditorAndClickButton({
          client,
          adf: JSON.stringify(adfs.taskList),
          button: 'indent',
          selection: { anchor: 9, head: 9 },
        });

        expect(
          await page.$eval(editable, getDocFromElement),
        ).toMatchCustomDocSnapshot(testName);
      },
    );
  });

  describe('Outdent button click', () => {
    BrowserTestCase(
      'should outdent top-level paragraph',
      { skip: [] },
      async (client: any, testName: string) => {
        const page = await initEditorAndClickButton({
          client,
          adf: JSON.stringify(adfs.indentedParagraph),
          button: 'outdent',
        });

        expect(
          await page.$eval(editable, getDocFromElement),
        ).toMatchCustomDocSnapshot(testName);
      },
    );

    BrowserTestCase(
      'should outdent top-level heading',
      { skip: [] },
      async (client: any, testName: string) => {
        const page = await initEditorAndClickButton({
          client,
          adf: JSON.stringify(adfs.indentedHeading),
          button: 'outdent',
        });

        expect(
          await page.$eval(editable, getDocFromElement),
        ).toMatchCustomDocSnapshot(testName);
      },
    );

    BrowserTestCase(
      'should outdent list item',
      { skip: [] },
      async (client: any, testName: string) => {
        const page = await initEditorAndClickButton({
          client,
          adf: JSON.stringify(adfs.indentedList),
          button: 'outdent',
          selection: { anchor: 12, head: 12 },
        });

        expect(
          await page.$eval(editable, getDocFromElement),
        ).toMatchCustomDocSnapshot(testName);
      },
    );

    BrowserTestCase(
      'should outdent task list',
      { skip: [] },
      async (client: any, testName: string) => {
        const page = await initEditorAndClickButton({
          client,
          adf: JSON.stringify(adfs.indentedTaskList),
          button: 'outdent',
          selection: { anchor: 10, head: 10 },
        });

        expect(
          await page.$eval(editable, getDocFromElement),
        ).toMatchCustomDocSnapshot(testName);
      },
    );
  });
});
