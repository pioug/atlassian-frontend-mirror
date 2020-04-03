import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { editable, getDocFromElement, fullpage } from '../_helpers';
import {
  goToEditorTestingExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import { sleep } from '@atlaskit/media-test-helpers';

const baseADF = {
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
            type: 'external',
            url:
              'https://images2.minutemediacdn.com/image/upload/c_crop,h_1193,w_2121,x_0,y_175/f_auto,q_auto,w_1100/v1554921998/shape/mentalfloss/549585-istock-909106260.jpg',
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

BrowserTestCase(
  'upload-external-media.ts: Keeps existing external as is',
  { skip: ['edge', 'ie', 'safari'] },
  async (
    client: Parameters<typeof goToEditorTestingExample>[0],
    testCase: string,
  ) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(baseADF),
      media: {
        allowMediaSingle: true,
      },
    });

    await page.waitForSelector('.ProseMirror .wrapper');
    await sleep(0);
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testCase);
  },
);
