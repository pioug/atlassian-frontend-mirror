import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { editable, getDocFromElement, comment, insertMedia } from '../_helpers';
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '../../__helpers/testing-example-helpers';

[comment].forEach((editor) => {
  BrowserTestCase(
    `insert-mediaGroup.ts: Inserts a media group on ${editor.name}`,
    { skip: ['edge'] },
    async (
      client: Parameters<typeof goToEditorTestingWDExample>[0],
      testName: string,
    ) => {
      const page = await goToEditorTestingWDExample(client);
      await mountEditor(page, {
        appearance: editor.appearance,
        media: {
          allowMediaSingle: false,
          allowMediaGroup: true,
        },
      });

      await page.click(editable);
      await page.type(editable, 'some text');

      // now we can insert media as necessary
      await insertMedia(page);

      expect(await page.isVisible('.wrapper')).toBe(true);

      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );

  BrowserTestCase(
    `Initialises correctly with a single media group on ${editor.name}`,
    { skip: ['edge'] },
    async (
      client: Parameters<typeof goToEditorTestingWDExample>[0],
      testName: string,
    ) => {
      const page = await goToEditorTestingWDExample(client);
      await mountEditor(page, {
        appearance: editor.appearance,
        defaultValue: JSON.stringify({
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'mediaGroup',
              content: [
                {
                  type: 'media',
                  attrs: {
                    id: 'ced01e6d-e1a3-4b88-96c9-c5d042188e70',
                    type: 'file',
                    collection: 'jira-13085-field-description',
                    occurrenceKey: '8d6e3a67-1d21-4da7-9c2a-15610b79e40a',
                  },
                },
              ],
            },
          ],
        }),
        media: {
          allowMediaSingle: false,
          allowMediaGroup: true,
        },
      });

      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );
});
