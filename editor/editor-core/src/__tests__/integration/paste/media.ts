import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { documentWithParagraph } from './__fixtures__/document-with-paragraph';
import { getDocFromElement, fullpage, copyAsHTML } from '../_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import { selectors } from '../../__helpers/page-objects/_editor';

const editorSelector = selectors.editor;

BrowserTestCase(
  'media: when message is not a media image node does nothing',
  { skip: ['edge', 'safari'] },
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
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
