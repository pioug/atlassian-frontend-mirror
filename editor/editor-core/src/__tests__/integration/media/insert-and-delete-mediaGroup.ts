import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { editable, comment, insertMedia } from '../_helpers';
import {
  mountEditor,
  goToEditorTestingExample,
} from '../../__helpers/testing-example-helpers';

[comment].forEach(editor => {
  BrowserTestCase(
    `insert-and-delete-mediaGroup.ts: Inserts and deletes media group on ${editor.name}`,
    { skip: ['edge', 'ie', 'safari'] },
    async (client: Parameters<typeof goToEditorTestingExample>[0]) => {
      const page = await goToEditorTestingExample(client);
      await mountEditor(page, {
        appearance: editor.appearance,
        media: {
          allowMediaSingle: false,
          allowMediaGroup: true,
        },
      });

      await page.type(editable, 'some text');

      // now we can insert media as necessary
      await insertMedia(page, ['one.svg', 'two.svg']);

      // wait for the nodeview to appear
      await page.waitForSelector('.wrapper .image');
      expect(await page.count('.wrapper .image')).toBe(2);

      // TODO: check ADF

      // okay, delete the first
      await page.click('.wrapper .image');
      await page.click('.image [aria-label="delete"]');

      expect(await page.count('.wrapper .image')).toBe(1);

      // TODO: check ADF

      await page.click('.wrapper .image');
      await page.click('.image [aria-label="delete"]');

      expect(await page.count('.wrapper .image')).toBe(0);

      // TODO: check ADF
    },
  );
});
