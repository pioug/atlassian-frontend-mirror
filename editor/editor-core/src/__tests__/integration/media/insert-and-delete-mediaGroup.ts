import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  editable,
  comment,
  insertMedia,
} from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '@atlaskit/editor-test-helpers/testing-example-page';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { mediaSelector } from '@atlaskit/editor-test-helpers/page-objects/media';
import { waitForNumFileCards } from './_utils';

[comment].forEach((editor) => {
  BrowserTestCase(
    `insert-and-delete-mediaGroup.ts: Inserts and deletes media group on ${editor.name}`,
    {},
    async (client: Parameters<typeof goToEditorTestingWDExample>[0]) => {
      const page = await goToEditorTestingWDExample(client);
      await mountEditor(page, {
        appearance: editor.appearance,
        media: {
          allowMediaSingle: false,
          allowMediaGroup: true,
        },
      });

      await page.type(editable, 'some text');

      // now we can insert media as necessary
      await insertMedia(page, ['one.jpg', 'one.jpg']);

      // wait for the nodeview to appear
      let cards = await waitForNumFileCards(page, 2);

      // TODO: check ADF

      // okay, delete the first
      await cards[0].click();
      await page.click('[aria-label="delete"]');

      cards = await waitForNumFileCards(page, 1);

      // TODO: check ADF

      await cards[0].click();
      await page.click('[aria-label="delete"]');

      expect(await page.count(mediaSelector)).toBe(0);

      // TODO: check ADF
    },
  );
});
