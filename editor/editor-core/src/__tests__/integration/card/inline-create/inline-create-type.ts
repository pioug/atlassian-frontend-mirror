import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { getDocFromElement, editable } from '../../_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../../__helpers/testing-example-helpers';
import { ConfluenceCardProvider } from '@atlaskit/editor-test-helpers/confluence-card-provider';

BrowserTestCase(
  `card: typing in a supported link and pressing enter should create an inline card`,
  {
    skip: ['edge'],
  },
  async (client: ConstructorParameters<typeof Page>[0], testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    const cardProviderPromise = Promise.resolve(
      new ConfluenceCardProvider('prod'),
    );

    await mountEditor(page, {
      appearance: 'full-page',
      smartLinks: {
        provider: cardProviderPromise,
        allowBlockCards: true,
      },
    });

    await page.type(editable, 'www.atlassian.com');
    await page.keys(['Return']);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
