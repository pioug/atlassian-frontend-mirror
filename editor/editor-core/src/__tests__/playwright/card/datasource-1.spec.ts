import {
  editorTestCase as test,
  expect,
  EditorNodeContainerModel,
  EditorBlockCardModel,
  fixTest,
  EditorFloatingToolbarModel,
  BROWSERS,
} from '@af/editor-libra';
import type { EditorPageInterface } from '@af/editor-libra';
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
}
const datasourceBlockCardBuilder = ({
  url,
  id,
  parameters,
  addColumn,
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
      schemaId: '1',
      aql: 'Name LIKE A',
    },
  }),
);

const expectedQueryDatasourceBlockCard = datasourceBlockCard(
  datasourceBlockCardBuilder({
    url: 'https://hello.atlassian.net/issues/?jql=created%20%3E=%20-30d%20order%20by%20created%20DESC',
    id: 'd8b75300-dfda-4519-b6cd-e49abbd50401',
    parameters: {
      cloudId: '67899',
      jql: 'created >= -30d order by created DESC',
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
      'platform.linking-platform.datasource-jira_issues': true,
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
    basicToggle.click();

    const modalInput = editor.page.getByTestId(modalInputTestId);
    await (await modalInput.elementHandle())?.waitForElementState('stable');
    modalInput.click();

    await editor.keyboard.type('something');

    const modalSearchButton = editor.page.getByTestId(modalSearchButtonTestId);
    modalSearchButton.click();

    const modalInsertButton = editor.page.getByTestId(modalInsertButtonTestId);
    await (
      await modalInsertButton.elementHandle()
    )?.waitForElementState('enabled');
    modalInsertButton.click();

    await blockCardModel.waitForStable();

    await expect(editor).toMatchDocument(
      doc(p(), expectedDatasourceBlockCard()),
    );
  });

  // skipped on due to pipeline, DTR-1949
  test('should insert datasource from the /assets command', async ({
    editor,
  }) => {
    fixTest({
      jiraIssueId: 'DTR-1949',
      reason:
        'FIXME: This test was skipped due to pipeline failure on 06/07/2023: https://product-fabric.atlassian.net/jira/servicedesk/projects/DTR/queues/issue/DTR-1949',
    });

    const nodes = EditorNodeContainerModel.from(editor);
    const blockCardModel = EditorBlockCardModel.from(nodes.blockCard);

    await editor.keyboard.type('/assets');
    await editor.keyboard.press('Enter');

    await expect(await editor.page.getByTestId(assetModalTestId)).toBeVisible();

    // Find Assets schema select box and select a schema
    const select = editor.page.getByRole('combobox');
    await (await select.elementHandle())?.waitForElementState('stable');
    editor.keyboard.press('ArrowDown');
    await expect(
      await editor.page.getByText('objSchema1').last(),
    ).toBeVisible();
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
    await expect(
      await editor.page.getByTestId('key-column-heading'),
    ).toBeVisible();

    // Expect this column not to be visible before adding it in
    await expect(
      await editor.page.getByTestId('due-column-heading'),
    ).toBeHidden();

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
    await expect(await editor.page.getByTestId(assetModalTestId)).toBeHidden();

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
      await editor.page.getByTestId('floating-toolbar-items'),
    ).toBeVisible();

    // Click on 'edit' button
    const editButton = editor.page.getByTestId('datasource-edit-button');
    await (await editButton.elementHandle())?.waitForElementState('stable');
    await editButton.focus();
    await editor.keyboard.press('Enter');

    // Wait for drawing of modal to be complete and check if visible
    await expect(await editor.page.getByTestId(assetModalTestId)).toBeVisible();

    // Find Assets schema select box and select a different schema
    await (await select.elementHandle())?.waitForElementState('stable');
    await editor.keyboard.press('ArrowDown');
    // select second option
    await editor.keyboard.press('ArrowDown');
    await expect(
      await editor.page.getByText('objSchema2').last(),
    ).toBeVisible();
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
      'platform.linking-platform.datasource-jira_issues': true,
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

  test('should be able to change my query using the floating toolbar', async ({
    editor,
  }) => {
    fixTest({
      jiraIssueId: 'ED-20649',
      reason:
        'FIXME: This test was automatically skipped due to failure on 25/10/2023: https://product-fabric.atlassian.net/browse/ED-20649',
    });
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
    fixTest({
      jiraIssueId: 'ED-20649',
      reason:
        'FIXME: This test was automatically skipped due to failure on 25/10/2023: https://product-fabric.atlassian.net/browse/ED-20649',
      browsers: [BROWSERS.firefox],
    });

    await setupQuery(editor);
    await editor.keyboard.type('nonsense');
    await editor.page.getByTestId('jql-editor-search').click();

    const errorIcon = await editor.page.getByRole('img', { name: 'error' });
    await expect(errorIcon).toBeVisible();

    await editor.page
      .getByTestId('jira-jql-datasource-modal--insert-button')
      .click();

    await expect(editor).toMatchDocument(
      doc(expectedQueryDatasourceBlockCard()),
    );
  });
});
