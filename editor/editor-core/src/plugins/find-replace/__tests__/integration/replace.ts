import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  fullpage,
  editable,
  getDocFromElement,
} from '../../../../__tests__/integration/_helpers';
import {
  goToEditorTestingExample,
  mountEditor,
} from '../../../../__tests__/__helpers/testing-example-helpers';
import replaceAdf from './__fixtures__/replace-adf.json';
import { findReplaceSelectors } from '../../../../__tests__/__helpers/page-objects/_find-replace';

BrowserTestCase(
  'replace.ts: modifying find text before replace should not restore stale pluginState replace text',
  { skip: ['safari', 'edge'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: replaceAdf,
      allowFindReplace: true,
    });

    await page.click(findReplaceSelectors.toolbarButton);

    await page.clear(findReplaceSelectors.findInput);
    await page.type(findReplaceSelectors.findInput, 'one');
    await page.keys('Enter');

    await page.type(findReplaceSelectors.replaceInput, 'HI');
    await page.click(findReplaceSelectors.replaceButton);

    await page.clear(findReplaceSelectors.replaceInput);
    await page.type(findReplaceSelectors.replaceInput, 'HO');
    await page.clear(findReplaceSelectors.findInput);
    await page.type(findReplaceSelectors.findInput, 'two');
    await page.click(findReplaceSelectors.replaceButton);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
