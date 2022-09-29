import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  editable,
  getDocFromElement,
  insertMedia,
  quickInsert,
  fullpage,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { selectors } from '../../../plugins/panel/__tests__/integration/_utils';

[
  {
    skipBrowsers: [],
    message: 'Inserts media single before paragraph',
    setup: async (page: Page) => {
      await page.type(editable, 'some text');
      await page.keys(Array(9).fill('ArrowLeft'));
    },
  },
  {
    skipBrowsers: ['safari'],
    message: 'Inserts media single after paragraph',
    setup: async (page: Page) => {
      await page.type(editable, 'some text ');
    },
  },
  {
    skipBrowsers: ['safari'],
    message: 'Inserts media single before paragraph nested in a panel',
    setup: async (page: Page) => {
      await quickInsert(page, 'Info panel');
      await page.waitForSelector(selectors.PANEL_EDITOR_CONTAINER);
      await page.type(editable, 'some text');
      await page.keys(Array(9).fill('ArrowLeft'));
    },
  },
  {
    skipBrowsers: ['safari'],
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
      client: Parameters<typeof goToEditorTestingWDExample>[0],
      testName: string,
    ) => {
      const page = await goToEditorTestingWDExample(client);
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
      await insertMedia(page);

      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );
});
