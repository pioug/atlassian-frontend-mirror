import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { documentWithParagraph } from './__fixtures__/document-with-paragraph';
import {
  getDocFromElement,
  fullpage,
  copyAsHTML,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { selectors } from '@atlaskit/editor-test-helpers/page-objects/editor';
import cloneDeep from 'lodash/cloneDeep';

const editorSelector = selectors.editor;

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

BrowserTestCase(
  'media: when message is not a media image node does nothing',
  { skip: [] },
  async (client: WebdriverIO.BrowserObject, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    const data = `
    <div
    data-id="af9310df-fee5-459a-a968-99062ecbb756"
    data-node-type="media" data-type="file"
    data-collection="MediaServicesSample"
    title="Attachment"
    data-file-mime-type="pdf"></div>`;
    await copyAsHTML(page, data);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(documentWithParagraph),
      media: {
        allowMediaSingle: true,
      },
    });

    await page.waitForSelector(fullpage.placeholder);
    await page.paste();

    const doc = await page.$eval(editorSelector, getDocFromElement);

    expectUniqueGeneratedMediaAttrs(doc);
    expect(removeUniqueGeneratedMediaAttrs(doc)).toMatchCustomDocSnapshot(
      testName,
    );
  },
);
