import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  editable,
  getDocFromElement,
  comment,
  insertMedia,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import { waitForAtLeastNumFileCards } from './_utils';
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '@atlaskit/editor-test-helpers/testing-example-page';

[comment].forEach((editor) => {
  BrowserTestCase(
    `type-over-mediaGroup.ts: Typeover the selected media item in a media group`,
    {},
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
      await insertMedia(page, ['one.jpg', 'one.jpg', 'one.jpg']);

      const fileCards = await waitForAtLeastNumFileCards(page, 2);
      await fileCards[0].click();

      await page.type(editable, 'replace first file card');

      expect(await page.isVisible('.wrapper')).toBe(true);

      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );
});
