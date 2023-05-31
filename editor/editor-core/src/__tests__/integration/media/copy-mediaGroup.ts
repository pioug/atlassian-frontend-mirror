import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { testMediaGroup } from '@atlaskit/editor-test-helpers/media-mock';
import {
  editable,
  getDocFromElement,
  fullpage,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { waitForNumFileCards } from './_utils';
import cloneDeep from 'lodash/cloneDeep';
import { mediaClickableSelector } from '@atlaskit/editor-test-helpers/page-objects/media';

const expectUniqueGeneratedMediaAttrs = (doc: { [key: string]: any }) => {
  expect(doc.content[1].content[0].attrs).toEqual(
    expect.objectContaining({
      __mediaTraceId: expect.any(String),
    }),
  );
};

const removeUniqueGeneratedMediaAttrs = (doc: { [key: string]: any }) => {
  const copy = cloneDeep(doc);
  delete copy.content[1].content[0].attrs.__mediaTraceId;
  return copy;
};

const baseADF = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'mediaGroup',
      content: [
        {
          type: 'media',
          attrs: {
            id: testMediaGroup.id,
            type: 'file',
            collection: 'MediaServicesSample',
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

// TODO MEX-2426: Skipped FireFox due to being flaky
BrowserTestCase(
  'copy-mediaGroup.ts: Copies and pastes mediaGroup file card on fullpage',
  { skip: ['firefox'] },
  async (client: any, testCase: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(baseADF),
      media: {
        allowMediaSingle: true,
      },
    });

    await waitForNumFileCards(page, 1);

    await page.click(mediaClickableSelector);
    await page.copy();
    await page.keys(['ArrowDown']);
    await page.paste();

    await waitForNumFileCards(page, 2);

    const doc = await page.$eval(editable, getDocFromElement);

    expectUniqueGeneratedMediaAttrs(doc);
    expect(removeUniqueGeneratedMediaAttrs(doc)).toMatchCustomDocSnapshot(
      testCase,
    );
  },
);
