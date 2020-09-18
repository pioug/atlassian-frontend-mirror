import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import {
  loadEditor,
  getADFContent,
  SELECTORS_WEB,
} from './_utils/afe-app-helpers';

MobileTestCase(
  'Insert Text: Foo Bar',
  // FIXME: ED-10399 Doesn't insert text into the DOM for iOS
  { skipPlatform: ['ios'] },
  async (client: any, testName: string) => {
    const page = await Page.create(client);
    await loadEditor(page);

    await page.insertText(SELECTORS_WEB.EDITOR, 'Foo Bar');
    const adfContent = await getADFContent(page);

    expect(adfContent).toMatchCustomDocSnapshot(
      `${testName} - ${page.platform()}.`,
    );
  },
);

MobileTestCase(
  'Insert Text: Hello World',
  // FIXME: ED-10399 Doesn't insert text into the DOM for iOS
  { skipPlatform: ['ios'] },
  async (client: any, testName: string) => {
    const page = await Page.create(client);
    await loadEditor(page);

    await page.insertText(SELECTORS_WEB.EDITOR, 'Hello World');
    const adfContent = await getADFContent(page);

    expect(adfContent).toMatchCustomDocSnapshot(
      `${testName} - ${page.platform()}.`,
    );
  },
);
