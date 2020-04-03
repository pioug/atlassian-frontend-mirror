import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  editable,
  getDocFromElement,
  insertMedia,
  fullpage,
} from '../_helpers';
import {
  mountEditor,
  goToEditorTestingExample,
} from '../../__helpers/testing-example-helpers';

BrowserTestCase(
  'insert-mediaSingle.ts: Inserts a media single on fullpage',
  { skip: ['edge', 'ie', 'safari'] },
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
    });

    // type some text
    await page.click(editable);
    await page.type(editable, 'some text');

    // now we can insert media as necessary
    await insertMedia(page);

    expect(await page.isVisible('.media-single')).toBe(true);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
