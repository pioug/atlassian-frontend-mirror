import type { EditorPageInterface } from '@af/editor-libra';
import {
  EditorBlockCardModel,
  EditorFloatingToolbarModel,
  EditorNodeContainerModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  datasourceBlockCard,
  doc,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { blockCardDatasourceAdf } from './datasource-1.spec.ts-fixtures/datasource-adf';

interface DatasourceBuilderProps {
  url?: string;
  id: string;
  parameters: Record<string, unknown>;
  addColumn?: boolean;
  addPeopleColumn?: boolean;
}
const datasourceBlockCardBuilder = ({
  url,
  id,
  parameters,
  addColumn,
  addPeopleColumn,
}: DatasourceBuilderProps) => {
  const columns = [
    { key: 'key' },
    { key: 'type' },
    { key: 'summary' },
    { key: 'description' },
    { key: 'assignee' },
    { key: 'priority' },
    { key: 'labels' },
    { key: 'status' },
    { key: 'created' },
  ];

  if (addColumn) {
    columns.push({ key: 'due' });
  }
  if (addPeopleColumn) {
    columns.splice(5, 0, { key: 'people' });
  }
  return {
    url,
    datasource: {
      id,
      parameters,
      views: [
        {
          type: 'table',
          properties: {
            columns,
          },
        },
      ],
    },
  };
};

const expectedDatasourceBlockCard = datasourceBlockCard(
  datasourceBlockCardBuilder({
    url: 'https://hello.atlassian.net/issues/?jql=text%20~%20%22something*%22%20or%20summary%20~%20%22something*%22%20ORDER%20BY%20created%20DESC',
    id: 'd8b75300-dfda-4519-b6cd-e49abbd50401',
    parameters: {
      cloudId: '67899',
      jql: 'text ~ "something*" or summary ~ "something*" ORDER BY created DESC',
    },
    addPeopleColumn: true,
  }),
);

const expectedAssetsDatasourceBlockCard = datasourceBlockCard(
  datasourceBlockCardBuilder({
    id: '361d618a-3c04-40ad-9b27-3c8ea6927020',
    parameters: {
      workspaceId: '123',
      schemaId: '1',
      aql: 'Name LIKE A',
    },
    addColumn: true,
  }),
);

const expectedEditedAssetsDatasourceBlockCard = datasourceBlockCard(
  datasourceBlockCardBuilder({
    id: '361d618a-3c04-40ad-9b27-3c8ea6927020',
    parameters: {
      workspaceId: '123',
      schemaId: '2',
      aql: 'Name LIKE A',
    },
  }),
);

const expectedNewQueryDatasourceBlockCard = datasourceBlockCard(
  datasourceBlockCardBuilder({
    url: 'https://hello.atlassian.net/issues/?jql=created%20%3E=%20-30d%20order%20by%20created%20ASC',
    id: 'd8b75300-dfda-4519-b6cd-e49abbd50401',
    parameters: {
      cloudId: '67899',
      jql: 'created >= -30d order by created ASC',
    },
  }),
);

const basicToggleTestId = `mode-toggle-basic`;
const datasourceTestIdPrefix = 'jira-jql-datasource-modal--';
const modalInputTestId = `${datasourceTestIdPrefix}basic-search-input`;
const modalSearchButtonTestId = `${datasourceTestIdPrefix}basic-search-button`;
const modalInsertButtonTestId = `${datasourceTestIdPrefix}insert-button`;

const assetModalTestId = 'asset-datasource-modal';
const assetsDatasourceTestIdPrefix = 'assets-datasource-modal--';
const assetsModalSearchInputTestId = `${assetsDatasourceTestIdPrefix}aql-search-input`;
const assetsValidAQLIconTestId = `${assetsDatasourceTestIdPrefix}aql-valid`;
const assetsModalSearchButtonTestId = `${assetsDatasourceTestIdPrefix}aql-search-button`;
const assetsModalInsertButtonTestId = `${assetsDatasourceTestIdPrefix}insert-button`;

test.describe('blockCard:datasource', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowTextAlignment: true,
      smartLinks: {
        allowBlockCards: true,
        allowDatasource: true,
      },
    },
    editorMountOptions: {
      datasourceMocks: {
        shouldMockAssets: true,
        shouldMockORSBatch: true,
      },
    },
    platformFeatureFlags: {
      'platform.linking-platform.datasource-assets_objects': true,
    },
  });
  test('should insert datasource from the /jira command', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const blockCardModel = EditorBlockCardModel.from(nodes.blockCard);

    await editor.keyboard.type('/jira');
    await editor.keyboard.press('Enter');

    const basicToggle = editor.page.getByTestId(basicToggleTestId);
    await (await basicToggle.elementHandle())?.waitForElementState('stable');
    await basicToggle.click();

    const modalInput = editor.page.getByTestId(modalInputTestId);
    await (await modalInput.elementHandle())?.waitForElementState('stable');
    await modalInput.click();

    await editor.keyboard.type('something');

    const modalSearchButton = editor.page.getByTestId(modalSearchButtonTestId);
    await modalSearchButton.click();

    const modalInsertButton = editor.page.getByTestId(modalInsertButtonTestId);
    await (
      await modalInsertButton.elementHandle()
    )?.waitForElementState('enabled');
    await modalInsertButton.click();

    await blockCardModel.waitForStable();

    await expect(editor).toMatchDocument(
      doc(p(), expectedDatasourceBlockCard()),
    );
  });
  // FIXME: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2257574/steps/%7B7f583bb9-62c8-45f0-9ce4-9dce1a495739%7D/test-report
  test.skip('should insert datasource from the /assets command', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const blockCardModel = EditorBlockCardModel.from(nodes.blockCard);

    await editor.keyboard.type('/assets');
    await editor.keyboard.press('Enter');

    await expect(editor.page.getByTestId(assetModalTestId)).toBeVisible();

    // Find Assets schema select box and select a schema
    const select = editor.page.getByRole('combobox');
    await (await select.elementHandle())?.waitForElementState('stable');
    await editor.keyboard.press('ArrowDown');
    await expect(editor.page.getByText('objSchema1').last()).toBeVisible();
    await editor.keyboard.press('Enter');

    // Find search input and insert a query
    const aql = editor.page.getByTestId(assetsModalSearchInputTestId);
    await (await aql.elementHandle())?.waitForElementState('stable');
    await aql.click();
    await editor.keyboard.type('Name LIKE A');

    // Check to make sure query is valid before clicking search button
    const valid = editor.page.getByTestId(assetsValidAQLIconTestId);
    await (await valid.elementHandle())?.waitForElementState('visible');

    // Find search button and click it
    const searchButton = editor.page.getByTestId(assetsModalSearchButtonTestId);
    await (await searchButton.elementHandle())?.waitForElementState('stable');
    await searchButton.click();

    // Check to see if datasource table has rendered successfully
    const table = editor.page.getByTestId('asset-datasource-table');
    await (await table.elementHandle())?.waitForElementState('stable');

    // Assert columns exist before editing them
    await expect(editor.page.getByTestId('key-column-heading')).toBeVisible();

    // Expect this column not to be visible before adding it in
    await expect(editor.page.getByTestId('due-column-heading')).toBeHidden();

    // Find column picker and select the 'Due Date' column
    const columnsButton = editor.page.getByTestId(
      'column-picker-trigger-button',
    );
    await (await columnsButton.elementHandle())?.waitForElementState('stable');
    await columnsButton.click();
    await editor.keyboard.type('Due Date');
    await editor.keyboard.press('Enter');

    // Assert that new column has been added
    const dueColumn = editor.page.getByTestId('due-column-heading');
    await (await dueColumn.elementHandle())?.waitForElementState('stable');
    await expect(dueColumn).toBeVisible();

    // Find the insert button and click it
    const modalInsertButton = editor.page.getByTestId(
      assetsModalInsertButtonTestId,
    );
    await (
      await modalInsertButton.elementHandle()
    )?.waitForElementState('stable');
    await modalInsertButton.click();

    // Assert that modal has been closed after inserting
    await expect(editor.page.getByTestId(assetModalTestId)).toBeHidden();

    // Assert that inserted ADF is correct
    await blockCardModel.waitForStable();
    await expect(editor).toMatchDocument(
      doc(p(), expectedAssetsDatasourceBlockCard()),
    );

    // Click on table to get edit controls
    const tableFooter = editor.page.getByTestId('table-footer');
    await (await tableFooter.elementHandle())?.waitForElementState('stable');
    await tableFooter.click();

    await expect(
      editor.page.getByTestId('floating-toolbar-items'),
    ).toBeVisible();

    // Click on 'edit' button
    const editButton = editor.page.getByTestId('datasource-edit-button');
    await (await editButton.elementHandle())?.waitForElementState('stable');
    await editButton.focus();
    await editor.keyboard.press('Enter');

    // Wait for drawing of modal to be complete and check if visible
    await expect(editor.page.getByTestId(assetModalTestId)).toBeVisible();

    // Find Assets schema select box and select a different schema
    await (await select.elementHandle())?.waitForElementState('stable');
    await editor.keyboard.press('ArrowDown');
    // select second option
    await editor.keyboard.press('ArrowDown');
    await expect(editor.page.getByText('objSchema2').last()).toBeVisible();
    await editor.keyboard.press('Enter');

    // Click on search button to get new objects
    await (await searchButton.elementHandle())?.waitForElementState('stable');
    await searchButton.click();

    // click on the insert button
    await (
      await modalInsertButton.elementHandle()
    )?.waitForElementState('stable');
    await modalInsertButton.click();

    // Assert that updated ADF is correct
    await editor.waitForEditorStable();
    await blockCardModel.waitForStable();
    await expect(editor).toMatchDocument(
      doc(p(), expectedEditedAssetsDatasourceBlockCard()),
    );
  });

  test('pasting jql link should turn into datasource table with search results', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const blockCardModel = EditorBlockCardModel.from(nodes.blockCard);

    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: 'https://product-fabric.atlassian.net/issues/?jql=created%20%3E%3D%20-30d%20order%20by%20created%20DESC',
    });

    await blockCardModel.waitForStable();

    await expect(editor).toMatchDocument(
      doc(
        p(),
        datasourceBlockCard({
          url: expect.any(String),
          datasource: {
            id: expect.any(String),
            parameters: expect.any(Object),
            views: expect.any(Array),
          },
        })(),
      ),
    );
  });
});

test.describe('blockCard:datasource update table', () => {
  test.use({
    adf: blockCardDatasourceAdf,
    editorProps: {
      appearance: 'full-page',
      allowTextAlignment: true,
      smartLinks: {
        allowBlockCards: true,
        allowDatasource: true,
      },
    },
    editorMountOptions: {
      datasourceMocks: {
        shouldMockAssets: true,
        shouldMockORSBatch: true,
      },
    },
    platformFeatureFlags: {
      'platform.linking-platform.datasource-assets_objects': true,
    },
  });

  const setupQuery = async (editor: EditorPageInterface) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const blockCardModel = EditorBlockCardModel.from(nodes.blockCard);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      blockCardModel,
    );

    await blockCardModel.waitForStable();
    await blockCardModel.click();
    await floatingToolbarModel.waitForStable();
    await editor.page.getByTestId('datasource-edit-button').click();
    await editor.page
      .getByTestId('jira-jql-datasource-modal--site-selector--trigger')
      .locator('span')
      .nth(2)
      .click();
    await editor.page.getByText('hello', { exact: true }).click();
    await editor.page.getByTestId('jql-editor-input').click({ clickCount: 3 });
  };

  // FIXME: Flaky on master
  // Build url: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2449958/steps/%7Bf0946fe8-f257-48e1-aa60-32e90e5e989a%7D
  // Report url: https://statlas.prod.atl-paas.net/integration-tests/atlassian-frontend:2449958:4/index.html
  test.skip('should be able to change my query using the floating toolbar', async ({
    editor,
  }) => {
    await setupQuery(editor);
    await editor.keyboard.type('created >= -30d order by created ASC');
    await editor.page.getByTestId('jql-editor-search').click();
    await editor.page
      .getByTestId('jira-jql-datasource-modal--insert-button')
      .click();
    await expect(editor).toMatchDocument(
      doc(expectedNewQueryDatasourceBlockCard()),
    );
  });

  test('should prevent invalid JQL searches', async ({ editor }) => {
    await setupQuery(editor);
    await editor.keyboard.type('nonsense');
    await editor.page.getByTestId('jql-editor-search').click();

    const errorIcon = editor.page.getByRole('img', { name: 'error' });
    await expect(errorIcon).toBeVisible();

    const insertButton = editor.page.getByTestId(
      'jira-jql-datasource-modal--insert-button',
    );

    await expect(insertButton).toBeDisabled();
  });
});
