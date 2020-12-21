import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  editable,
  getDocFromElement,
  insertMedia,
  fullpage,
  comment,
} from '../_helpers';
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '../../__helpers/testing-example-helpers';

BrowserTestCase(
  'insert-mediaSingle.ts: Inserts a media single on fullpage',
  { skip: ['edge', 'safari'] },
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
    });

    // type some text
    await page.click(editable);
    await page.type(editable, 'some text');

    // now we can insert media as necessary
    await insertMedia(page);

    expect(await page.isVisible('[data-testid="media-file-card-view"]')).toBe(
      true,
    );

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'insert-mediaSingle.ts: Inserts media single on left when the alignLeftOnInsert prop is true',
  { skip: ['edge', 'safari'] },
  async (
    client: Parameters<typeof goToEditorTestingWDExample>[0],
    testName: string,
  ) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: comment.appearance,
      media: {
        alignLeftOnInsert: true,
        allowMediaSingle: true,
        allowMediaGroup: true,
      },
    });

    // type some text
    await page.click(editable);
    await page.type(editable, 'some text');

    // now we can insert media as necessary
    await insertMedia(page);

    expect(await page.isVisible('[data-testid="media-file-card-view"]')).toBe(
      true,
    );

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'insert-mediaSingle.ts: Inserts media single on left in comment editor',
  { skip: ['edge', 'safari'] },
  async (
    client: Parameters<typeof goToEditorTestingWDExample>[0],
    testName: string,
  ) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: comment.appearance,
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

    expect(await page.isVisible('[data-testid="media-file-card-view"]')).toBe(
      true,
    );

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
