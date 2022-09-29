import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import {
  fullpage,
  editable,
  getDocFromElement,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import superScriptAdf from './__fixtures__/super-script.adf.json';

BrowserTestCase(
  'Text formatting: It can load a document with super script on first line',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: superScriptAdf,
    });

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
