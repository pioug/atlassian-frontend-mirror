import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  editable,
  getDocFromElement,
  fullpage,
  copyToClipboard,
} from '../_helpers';
import {
  goToEditorTestingExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import { sleep } from '@atlaskit/media-test-helpers';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

BrowserTestCase(
  'upload-external-media.ts: Uploads external media when pasted',
  { skip: ['edge', 'ie', 'safari', 'chrome', 'firefox'] },
  async (client: ConstructorParameters<typeof Page>[0], testCase: string) => {
    const sample = new Page(client);
    await copyToClipboard(
      sample,
      `<meta charset='utf-8'><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Domestic_Cat_Face_Shot.jpg/220px-Domestic_Cat_Face_Shot.jpg"/>`,
      'html',
    );

    const page = await goToEditorTestingExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      media: {
        allowMediaSingle: true,
      },
    });
    await page.paste();
    await sleep(0);
    //waits until blob is available
    await page.waitForSelector('.ProseMirror img[src^="blob"]');
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testCase);
  },
);
