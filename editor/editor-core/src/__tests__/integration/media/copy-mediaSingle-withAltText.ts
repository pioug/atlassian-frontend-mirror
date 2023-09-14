import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  editable,
  getDocFromElement,
  fullpage,
} from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { waitForNumImages } from './_utils';
import adf from './_fixtures_/one-image.adf';
import cloneDeep from 'lodash/cloneDeep';

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

// FIXME: This test was automatically skipped due to failure on 11/07/2023: https://product-fabric.atlassian.net/browse/ED-19053
BrowserTestCase(
  'Copy paste a media single with alt text properly',
  {
    skip: ['*'],
  },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(adf),
      media: {
        allowMediaSingle: true,
        allowAltTextOnImages: true,
      },
    });
    const [image] = await waitForNumImages(page, 1);

    await image.click();
    await page.copy();
    await page.keys(['ArrowDown']);
    await page.paste();

    await waitForNumImages(page, 2);

    const doc = await page.$eval(editable, getDocFromElement);

    expectUniqueGeneratedMediaAttrs(doc);
    expect(removeUniqueGeneratedMediaAttrs(doc)).toMatchCustomDocSnapshot(
      testName,
    );
  },
);
