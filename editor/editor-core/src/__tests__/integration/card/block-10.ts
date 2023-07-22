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

BrowserTestCase(
  'card: block card with datasource on resize should change the layout',
  {},
  async (client: ClientType, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    const layoutButtonSelector =
      '[data-testid="datasource-table-layout-button"]';

    const cardProviderPromise = Promise.resolve(
      new ConfluenceCardProvider('prod'),
    );

    await mountEditor(
      page,
      {
        appearance: 'full-page',
        allowTextAlignment: true,
        autoScrollIntoView: true,
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

    await waitForDatasourceSelection(page);

    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(`${testName}-center`);

    // to make layout wide
    await page.click(layoutButtonSelector);

    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(`${testName}-layout-wide`);

    // to make layout full width
    await page.click(layoutButtonSelector);

    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(`${testName}-layout-full-width`);

    // to make layout back to center
    await page.click(layoutButtonSelector);

    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(`${testName}-back-to-center`);
  },
);
