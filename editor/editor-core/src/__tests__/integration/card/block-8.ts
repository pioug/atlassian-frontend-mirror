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
  'card: block card with datasource on column add should render new column in table',
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

    await page.pause(2000);

    await page.click('[data-testid="column-picker-trigger-button"]');

    await page.pause(1000);

    await page.click('[id="react-select-2-option-0"]');

    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);
