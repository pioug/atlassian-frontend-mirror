import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  editable,
  getDocFromElement,
  comment,
  insertMedia,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { Node } from 'prosemirror-model';
import sampleSchema from '@atlaskit/editor-test-helpers/schema';

[comment].forEach((editor) => {
  // FIXME: This test was automatically skipped due to failure on 21/04/2023: https://product-fabric.atlassian.net/browse/ED-17580
  BrowserTestCase(
    `insert-mediaGroup.ts: Inserts a media group on ${editor.name}`,
    {
      skip: ['*'],
    },
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

      expect(await page.isVisible('[data-testid="media-file-card-view"]')).toBe(
        true,
      );

      const jsonDocument = await page.$eval(editable, getDocFromElement);
      const pmDocument = Node.fromJSON(sampleSchema, jsonDocument);

      const maybeMediaGroupNode = pmDocument.nodeAt(11);
      expect(maybeMediaGroupNode?.type.name).toEqual('mediaGroup');
    },
  );

  BrowserTestCase(
    `Initialises correctly with a single media group on ${editor.name}`,
    {},
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

BrowserTestCase(
  'insert-mediaGroup.ts: Inserts multiple media group with non-image files',
  { skip: [] },
  async (
    client: Parameters<typeof goToEditorTestingWDExample>[0],
    testName: string,
  ) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: comment.appearance,
      media: {
        allowMediaGroup: true,
      },
    });

    // type some text
    await page.click(editable);
    await page.type(editable, 'some text');

    // now we can insert media as necessary
    await insertMedia(page, ['test.pdf', 'test.txt', 'test.xls']);

    expect(await page.isVisible('[data-testid="media-file-card-view"]')).toBe(
      true,
    );

    const doc = await page.$eval(editable, getDocFromElement);

    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'insert-mediaGroup.ts: Inserts one media group with non-image files',
  { skip: [] },
  async (
    client: Parameters<typeof goToEditorTestingWDExample>[0],
    testName: string,
  ) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: comment.appearance,
      media: {
        allowMediaGroup: true,
      },
    });

    // type some text
    await page.click(editable);
    await page.type(editable, 'some text');

    // now we can insert media as necessary
    await insertMedia(page, ['test.pdf']);

    expect(await page.isVisible('[data-testid="media-file-card-view"]')).toBe(
      true,
    );

    const doc = await page.$eval(editable, getDocFromElement);

    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
