import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import {
  fullpage,
  editable,
  getDocFromElement,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import { copyHyperlink } from '@atlaskit/editor-test-helpers/page-objects/hyperlink';

BrowserTestCase(
  'can paste hyperlink into paragraph',
  {},
  async (client: any, testName: string) => {
    const page = new Page(client);
    await copyHyperlink(page, 'http://atlassian.com/');

    await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
    });
    await page.paste();

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

// FIXME: This test was automatically skipped due to failure on 10/01/2023: https://product-fabric.atlassian.net/browse/ED-16515
BrowserTestCase(
  'can paste hyperlink into list',
  {
    skip: ['*'],
  },
  async (client: any, testName: string) => {
    const page = new Page(client);
    await copyHyperlink(page, 'http://atlassian.com/');

    await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
    });
    await page.type(editable, '* ');
    await page.paste();

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
