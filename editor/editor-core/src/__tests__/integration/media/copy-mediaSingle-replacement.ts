import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  editable,
  getDocFromElement,
  fullpage,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { waitForNumImages } from './_utils';
import adf from './_fixtures_/three-images.adf';
import cloneDeep from 'lodash/cloneDeep';

const expectUniqueGeneratedMediaAttrs = (doc: { [key: string]: any }) => {
  expect(doc.content[2].content[0].attrs).toEqual(
    expect.objectContaining({
      __mediaTraceId: expect.any(String),
    }),
  );
};

const removeUniqueGeneratedMediaAttrs = (doc: { [key: string]: any }) => {
  const copy = cloneDeep(doc);
  delete copy.content[2].content[0].attrs.__mediaTraceId;
  return copy;
};

BrowserTestCase(
  'copy-mediaSingle-replacement.ts: Copies and pastes mediaSingle on fullpage',
  {},
  async (
    client: Parameters<typeof goToEditorTestingWDExample>[0],
    testCase: string,
  ) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(adf),
      media: {
        allowMediaSingle: true,
      },
    });
    const images = await waitForNumImages(page, 3);

    // select the middle one and copy it
    await images[1].click();
    await page.copy();

    // select the last one and replace it
    await images[2].click();
    await page.paste();

    const doc = await page.$eval(editable, getDocFromElement);
    expectUniqueGeneratedMediaAttrs(doc);
    expect(removeUniqueGeneratedMediaAttrs(doc)).toMatchCustomDocSnapshot(
      testCase,
    );
  },
);
