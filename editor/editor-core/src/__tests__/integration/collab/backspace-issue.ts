import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import WebdriverPage from '@atlaskit/webdriver-runner/wd-wrapper';
import { getExampleUrl as getWDExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { getDocFromElement } from '@atlaskit/editor-test-helpers/integration/helpers';

const pmSelector = '.ProseMirror';

BrowserTestCase(
  // Added in response to ED-14722
  'Should backspace when telepointers are in the same position',
  { skip: ['safari'] },
  async (client: any, testName: string) => {
    const page = new WebdriverPage(client);
    const searchParams = new URLSearchParams();

    searchParams.append(
      'documentId',
      `testing-catchup-error-${page.getBrowserName()}`,
    );

    const url = getWDExampleUrl('editor', 'editor-core', 'collab')
      .concat('&')
      .concat(searchParams.toString());

    await page.goto(url);
    await page.waitForSelector(pmSelector);

    await page.click(`#left ${pmSelector}`);
    await page.keyboard.type('A', ['Mod']);
    await page.keys('Back space');
    await page.type(`#left ${pmSelector}`, '123456789');
    await page.keys(['ArrowLeft']);
    await page.keys(['ArrowRight']);

    await page.click(`#right ${pmSelector}`);
    await page.keys('Back space');
    await page.keys('Back space');
    await page.keys('Back space');

    const doc = await page.$eval(pmSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
