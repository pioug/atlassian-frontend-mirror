import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  editable,
  getDocFromElement,
  fullpage,
  copyToClipboard,
} from '../_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import { sleep } from '@atlaskit/media-test-helpers';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { toBeOneOfMatchers } from './_matchers';
import cloneDeep from 'lodash/cloneDeep';

expect.extend(toBeOneOfMatchers);

const expectFuzzyMediaAttrs = (doc: { [key: string]: any }) => {
  expect(doc.content[0].content[0].attrs).toEqual(
    expect.objectContaining({
      __fileMimeType: expect.stringMatching(/image\/(webp|jpeg)/),
      __fileSize: expect.toBeOneOf([8410, 9894]),
    }),
  );
};

const removeFuzzyMediaAttrs = (doc: { [key: string]: any }) => {
  const copy = cloneDeep(doc);
  delete copy.content[0].content[0].attrs.__fileMimeType;
  delete copy.content[0].content[0].attrs.__fileSize;
  return copy;
};

BrowserTestCase(
  'upload-external-media.ts: Uploads external media when pasted',
  { skip: ['edge', 'safari'] },
  async (client: ConstructorParameters<typeof Page>[0], testCase: string) => {
    const sample = new Page(client);
    await copyToClipboard(
      sample,
      `<meta charset='utf-8'><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Domestic_Cat_Face_Shot.jpg/220px-Domestic_Cat_Face_Shot.jpg"/>`,
      'html',
    );

    const page = await goToEditorTestingWDExample(client);
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
    let doc = await page.$eval(editable, getDocFromElement);
    // ED-9896: The Accept request header field is modified by
    // by the user-agent when webp support is detected in-browser
    // to proactively set content negotiation preferences. However,
    // we cannot rely on these preferences being consistently honoured
    // by the origin server, so we add separate assertions for these
    // "fuzzier" document results.
    expectFuzzyMediaAttrs(doc);
    expect(removeFuzzyMediaAttrs(doc)).toMatchCustomDocSnapshot(testCase);
  },
);
