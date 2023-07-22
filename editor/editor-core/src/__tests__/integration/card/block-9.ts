import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  getDocFromElement,
  editable,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { ConfluenceCardProvider } from '@atlaskit/editor-test-helpers/confluence-card-provider';
import blockCardDatasourceAdf from './_fixtures_/block-card-datasource.adf.json';

type ClientType = Parameters<typeof goToEditorTestingWDExample>[0];

BrowserTestCase(
  'card: block card with datasource should copy and paste multiple datasource tables',
  {},
  async (client: ClientType, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    const cardProviderPromise = Promise.resolve(
      new ConfluenceCardProvider('prod'),
    );

    await mountEditor(
      page,
      {
        appearance: 'full-page',
        allowTextAlignment: true,
        defaultValue: JSON.stringify(blockCardDatasourceAdf),
        smartLinks: {
          provider: cardProviderPromise,
          allowBlockCards: true,
          allowDatasource: true,
        },
      },
      undefined,
      { clickInEditor: false },
    );

    await page.click('.datasourceView-content-wrap');

    await page.keys(['ArrowDown', 'Enter']);

    await page.selectAll();

    await page.copy();

    await page.click('p');

    await page.paste();

    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);
