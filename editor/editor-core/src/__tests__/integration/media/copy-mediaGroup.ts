import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { testMediaGroup } from '@atlaskit/editor-test-helpers/media-mock';
import { sleep } from '@atlaskit/media-test-helpers';
import { editable, getDocFromElement, fullpage } from '../_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import { waitForAtLeastNumFileCards } from './_utils';

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

BrowserTestCase(
  'copy-mediaGroup.ts: Copies and pastes mediaGroup file card on fullpage',
  { skip: ['edge'] },
  async (client: any, testCase: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(baseADF),
      media: {
        allowMediaSingle: true,
      },
    });

    const fileCardSelector =
      '[data-testid="media-file-card-view"][data-test-status="complete"]';

    await page.waitForSelector(fileCardSelector);
    await page.keys(['ArrowDown']);
    await page.click(fileCardSelector);
    await page.copy();
    await page.keys(['ArrowDown']);
    await page.paste();
    await sleep(0);
    await waitForAtLeastNumFileCards(page, 2);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testCase);
  },
);
