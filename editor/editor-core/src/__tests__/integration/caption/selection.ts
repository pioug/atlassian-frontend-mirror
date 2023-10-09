import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { waitForNumImages } from '@atlaskit/editor-test-helpers/integration/media';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  editable,
  getDocFromElement,
} from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import * as adf from './__fixtures__/image-with-caption.adf.json';

BrowserTestCase(
  'selection.ts: Press up below a caption will place cursor inside caption',
  { skip: [] },
  async (
    client: Parameters<typeof goToEditorTestingWDExample>[0],
    _testName: string,
  ) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      defaultValue: JSON.stringify(adf),
      media: {
        allowMediaSingle: true,
        allowCaptions: true,
      },
    });

    await waitForNumImages(page, 1);
    await page.keys(['ArrowUp']); //
    await page.click('.ProseMirror > p:nth-of-type(2)');
    await page.keys(['ArrowUp']);
    await page.keys(['h', 'e', 'l', 'l', 'o', ' ']);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc.content[1].content[1].content[0].text).toEqual('hello world');
  },
);
