import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { getDocFromElement, editable, gotoEditor } from '../../_helpers';

BrowserTestCase(
  `card: typing in a supported link and pressing enter should create an inline card`,
  {
    skip: ['edge'],
  },
  async (client: ConstructorParameters<typeof Page>[0], testName: string) => {
    const page = new Page(client);

    await gotoEditor(page);

    await page.type(editable, 'www.atlassian.com');
    await page.keys(['Return']);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
