import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  editable,
  getDocFromElement,
  insertMediaFromMediaPicker,
  quickInsert,
  fullpage,
} from '../_helpers';
import {
  mountEditor,
  goToEditorTestingExample,
} from '../../__helpers/testing-example-helpers';
import { selectors } from '../panel/_utils';

[
  {
    skipBrowsers: ['edge', 'ie', 'safari', 'chrome'],
    message: 'Inserts media single before paragraph',
    setup: async (page: Page) => {
      await page.type(editable, 'some text');
      await page.keys(Array(9).fill('ArrowLeft'));
    },
  },
  {
    skipBrowsers: ['edge', 'ie', 'safari', 'firefox'],
    message: 'Inserts media single after paragraph',
    setup: async (page: Page) => {
      await page.type(editable, 'some text ');
    },
  },
  {
    skipBrowsers: ['edge', 'ie', 'safari', 'chrome'],
    message: 'Inserts media single before paragraph nested in a panel',
    setup: async (page: Page) => {
      await quickInsert(page, 'Info panel');
      await page.waitForSelector(selectors.PANEL_EDITOR_CONTAINER);
      await page.type(editable, 'some text');
      await page.keys(Array(9).fill('ArrowLeft'));
    },
  },
  {
    skipBrowsers: ['edge', 'ie', 'safari', 'firefox'],
    message: 'Inserts a media single after paragraph nested in a panel',
    setup: async (page: Page) => {
      await quickInsert(page, 'Info panel');
      await page.waitForSelector(selectors.PANEL_EDITOR_CONTAINER);
      await page.type(editable, 'some text ');
    },
  },
].forEach(({ message, setup, skipBrowsers }) => {
  BrowserTestCase(
    `quick-insert-mediaSingle.ts: ${message}`,
    { skip: skipBrowsers as any },
    async (
      client: Parameters<typeof goToEditorTestingExample>[0],
      testName: string,
    ) => {
      const page = await goToEditorTestingExample(client);
      await mountEditor(page, {
        appearance: fullpage.appearance,
        media: {
          allowMediaSingle: true,
          allowMediaGroup: true,
        },
        allowPanel: true,
        allowNewInsertionBehaviour: true,
      });

      await page.click(editable);
      await setup(page);

      await quickInsert(page, 'Files & images');
      await insertMediaFromMediaPicker(page);

      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );
});
