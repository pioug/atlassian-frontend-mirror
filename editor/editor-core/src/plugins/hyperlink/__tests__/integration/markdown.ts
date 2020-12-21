import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../../../__tests__/__helpers/testing-example-helpers';
import {
  fullpage,
  editable,
  getDocFromElement,
} from '../../../../__tests__/integration/_helpers';
import { hyperlinkSelectors } from '../../../../__tests__/__helpers/page-objects/_hyperlink';
import { copyHyperlink } from '../../../../__tests__/__helpers/page-objects/_hyperlink';

BrowserTestCase(
  'can insert hyperlink via markdown',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
    });

    await page.type(editable, '[Atlassian](http://atlassian.com)');
    await page.waitFor(hyperlinkSelectors.hyperlink);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'can insert hyperlink via markdown when pasting URL',
  {},
  async (client: any, testName: string) => {
    const page = new Page(client);
    await copyHyperlink(page, 'http://atlassian.com');

    await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
    });

    await page.type(editable, '[Atlassian](');
    await page.paste();
    await page.type(editable, ')');
    await page.waitFor(hyperlinkSelectors.hyperlink);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
