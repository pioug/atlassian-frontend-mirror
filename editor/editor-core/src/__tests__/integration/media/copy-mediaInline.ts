import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  editable,
  getDocFromElement,
  fullpage,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorCopyPasteWDExample,
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { sleep } from '@atlaskit/media-test-helpers';

const baseAdf = {
  type: 'doc',
  version: 1,
  content: [
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'mediaInline',
          attrs: {
            id: 'a3d20d67-14b1-4cfc-8ba8-918bbc8d71e1',
            type: 'file',
            collection: 'MediaServicesSample',
            alt: '',
            __external: false,
          },
        },
      ],
    },
  ],
};

BrowserTestCase(
  'copy-mediaInline.ts: Copies and pastes mediaInline on fullpage',
  { skip: ['safari'] },
  async (
    client: Parameters<typeof goToEditorTestingWDExample>[0],
    testCase: string,
  ) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(baseAdf),
      media: {
        featureFlags: {
          mediaInline: true,
        },
      },
    });

    const mediaInlineLoadedViewSelector =
      '[data-testid="media-inline-card-loaded-view"]';

    await page.waitForSelector(mediaInlineLoadedViewSelector);
    await page.keys(['ArrowDown']);
    await page.click(mediaInlineLoadedViewSelector);
    await page.copy();
    await page.keys(['ArrowDown']);
    await page.paste();
    await sleep(0);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testCase);
  },
);

BrowserTestCase(
  'copy-mediaInline.ts: Copies and pastes mediaInline between different Editor instances',
  { skip: ['safari'] },
  async (
    client: Parameters<typeof goToEditorTestingWDExample>[0],
    testCase: string,
  ) => {
    const page = await goToEditorCopyPasteWDExample(client);
    const mediaInlineLoadedViewSelector =
      '[data-testid="media-inline-card-loaded-view"]';
    const editorMediaServiceSampleSelector =
      '[data-testid="editor-MediaServicesSample"]';
    const editorMediaPickerTestSelector =
      '[data-testid="editor-mediapicker-test"]';

    await page.waitForSelector(editorMediaServiceSampleSelector);
    await page.waitForSelector(editorMediaPickerTestSelector);
    await page.waitForSelector(mediaInlineLoadedViewSelector);

    await page.click(`${editorMediaServiceSampleSelector} p`);
    await page.click(mediaInlineLoadedViewSelector);
    await page.copy();
    await page.keys(['ArrowDown']);

    await page.click(`${editorMediaPickerTestSelector} p`);
    await page.keys(['ArrowDown']);

    await page.paste();
    await sleep(0);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testCase);
  },
);
