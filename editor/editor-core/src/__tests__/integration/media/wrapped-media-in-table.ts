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
import adf from './_fixtures_/wrapped-media-in-table.adf.json';

// FIXME: This test was automatically skipped due to failure on 28/05/2023: https://product-fabric.atlassian.net/browse/ED-18112
BrowserTestCase(
  'wrapped-media-in-table.ts: Allows clicking next to wrapped media in table',
  {
    // skip: ['safari', 'firefox'],
    skip: ['*'],
  },
  async (
    client: Parameters<typeof goToEditorTestingWDExample>[0],
    testCase: string,
  ) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(adf),
      allowTables: true,
      media: {
        allowMediaSingle: true,
      },
    });
    await waitForNumImages(page, 2);
    await page.moveTo('.mediaSingleView-content-wrap:first-of-type', 180, 30);
    await page.click();
    await page.type(editable, 'hello');
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testCase);
  },
);
