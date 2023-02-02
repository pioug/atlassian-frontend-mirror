import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  getDocFromElement,
  editable,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { Appearance } from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import { testMediaSingle } from '@atlaskit/editor-test-helpers/media-mock';
import cloneDeep from 'lodash/cloneDeep';

const expectUniqueGeneratedMediaAttrs = (doc: { [key: string]: any }) => {
  expect(doc.content[0].content[0].content[0].content[0].attrs).toEqual(
    expect.objectContaining({
      __mediaTraceId: expect.any(String),
    }),
  );
};

const removeUniqueGeneratedMediaAttrs = (doc: { [key: string]: any }) => {
  const copy = cloneDeep(doc);
  delete copy.content[0].content[0].content[0].content[0].attrs.__mediaTraceId;
  return copy;
};

const getMediaListAdf = (type: 'bulletList' | 'orderedList') => {
  return {
    version: 1,
    type: 'doc',
    content: [
      {
        type: 'mediaSingle',
        attrs: {
          layout: 'center',
        },
        content: [
          {
            type: 'media',
            attrs: {
              id: testMediaSingle.id,
              type: 'file',
              collection: 'MediaServicesSample',
              width: 2378,
              height: 628,
            },
          },
        ],
      },
      {
        type: type,
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [],
              },
            ],
          },
        ],
      },
      {
        type: 'paragraph',
        content: [],
      },
    ],
  };
};

BrowserTestCase(
  `list: insert a media single inside a bullet list`,
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: Appearance.fullPage,
      defaultValue: JSON.stringify(getMediaListAdf('bulletList')),
      media: {
        allowMediaSingle: true,
      },
    });

    const image = await page.$('.ProseMirror [data-testid="media-image"]');
    await image.click();
    await page.copy();

    await page.waitForSelector('[data-testid="Bullet list"]');
    await page.click('[data-testid="Bullet list"]');
    await page.paste();

    const doc = await page.$eval(editable, getDocFromElement);
    expectUniqueGeneratedMediaAttrs(doc);
    expect(removeUniqueGeneratedMediaAttrs(doc)).toMatchCustomDocSnapshot(
      testName,
    );
  },
);

BrowserTestCase(
  `list: insert a media single inside a numbered list`,
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: Appearance.fullPage,
      defaultValue: JSON.stringify(getMediaListAdf('orderedList')),
      media: {
        allowMediaSingle: true,
      },
    });

    const image = await page.$('.ProseMirror [data-testid="media-image"]');
    await image.click();
    await page.copy();

    await page.waitForSelector('[aria-label*="Numbered list"]');
    await page.click('[aria-label*="Numbered list"]');
    await page.paste();

    const doc = await page.$eval(editable, getDocFromElement);
    expectUniqueGeneratedMediaAttrs(doc);
    expect(removeUniqueGeneratedMediaAttrs(doc)).toMatchCustomDocSnapshot(
      testName,
    );
  },
);

BrowserTestCase(
  `list: insert a media single inside a numbered list with restartNumberedLists`,
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: Appearance.fullPage,
      defaultValue: JSON.stringify(getMediaListAdf('orderedList')),
      media: {
        allowMediaSingle: true,
      },
      featureFlags: {
        restartNumberedLists: true,
      },
    });

    const image = await page.$('.ProseMirror [data-testid="media-image"]');
    await image.click();
    await page.copy();

    await page.waitForSelector('[aria-label*="Numbered list"');
    await page.click('[aria-label*="Numbered list"');
    await page.paste();

    const doc = await page.$eval(editable, getDocFromElement);
    expectUniqueGeneratedMediaAttrs(doc);
    expect(removeUniqueGeneratedMediaAttrs(doc)).toMatchCustomDocSnapshot(
      testName,
    );
  },
);
