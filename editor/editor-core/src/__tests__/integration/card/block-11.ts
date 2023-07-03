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
import { waitForDatasourceSelection } from '@atlaskit/media-integration-test-helpers';

type ClientType = Parameters<typeof goToEditorTestingWDExample>[0];

blockCardDatasourceAdf.content[2] = blockCardDatasourceAdf.content[1];
const multipleBlockCardDatasourceAdf = blockCardDatasourceAdf;

BrowserTestCase(
  'card: block card with multiple datasources on resize should change the layout of only the selected table',
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
        autoScrollIntoView: true,
        defaultValue: JSON.stringify(multipleBlockCardDatasourceAdf),
        smartLinks: {
          provider: cardProviderPromise,
          allowBlockCards: true,
        },
      },
      undefined,
      { clickInEditor: false },
    );

    const firstDatasourceSelector =
      '.datasourceView-content-wrap:first-of-type';
    const lastDatasourceSelector = '.datasourceView-content-wrap:last-of-type';
    const layoutButtonSelector =
      '[data-testid="datasource-table-layout-button"]';

    await waitForDatasourceSelection(page);

    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(`${testName}-initial-state`);

    // to make layout wide for first table
    await page.click(firstDatasourceSelector);
    await page.click(layoutButtonSelector);

    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(`${testName}-first-table-layout-wide`);

    // to make layout full width for first table
    await page.click(firstDatasourceSelector);
    await page.click(layoutButtonSelector);

    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(`${testName}-first-table-layout-full-width`);

    (await page.$(lastDatasourceSelector)).scrollIntoView();

    // to make layout wide for second table
    await page.click(lastDatasourceSelector);
    await page.click(layoutButtonSelector);

    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(`${testName}-second-table-layout-wide`);

    // to make layout full width for second table
    await page.click(lastDatasourceSelector);
    await page.click(layoutButtonSelector);

    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(`${testName}-second-table-layout-full width`);
  },
);
