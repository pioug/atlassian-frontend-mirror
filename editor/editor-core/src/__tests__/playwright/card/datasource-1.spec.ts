import {
  editorTestCase as test,
  expect,
  EditorNodeContainerModel,
  EditorBlockCardModel,
} from '@af/editor-libra';
import {
  datasourceBlockCard,
  doc,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

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

const expectedDatasourceBlockCard = datasourceBlockCard({
  url: 'https://test1.atlassian.net/issues/?jql=(text%20~%20%22something*%22%20OR%20summary%20~%20%22something*%22)%20order%20by%20created%20DESC',
  datasource: {
    id: 'd8b75300-dfda-4519-b6cd-e49abbd50401',
    parameters: {
      cloudId: '12345',
      jql: '(text ~ "something*" OR summary ~ "something*") order by created DESC',
    },
    views: [
      {
        type: 'table',
        properties: {
          columns: [
            {
              key: 'key',
            },
            {
              key: 'type',
            },
            {
              key: 'summary',
            },
            {
              key: 'description',
            },
            {
              key: 'assignee',
            },
            {
              key: 'priority',
            },
            {
              key: 'labels',
            },
            {
              key: 'status',
            },
            {
              key: 'created',
            },
          ],
        },
      },
    ],
  },
});

const expectedAssetsDatasourceBlockCard = datasourceBlockCard({
  datasource: {
    id: '361d618a-3c04-40ad-9b27-3c8ea6927020',
    parameters: {
      workspaceId: '123',
      schemaId: '1',
      aql: 'Name LIKE A',
    },
    views: [
      {
        type: 'table',
        properties: {
          columns: [
            {
              key: 'key',
            },
            {
              key: 'type',
            },
            {
              key: 'summary',
            },
            {
              key: 'description',
            },
            {
              key: 'assignee',
            },
            {
              key: 'priority',
            },
            {
              key: 'labels',
            },
            {
              key: 'status',
            },
            {
              key: 'created',
            },
            {
              key: 'due',
            },
          ],
        },
      },
    ],
  },
});

const expectedEditedAssetsDatasourceBlockCard = datasourceBlockCard({
  datasource: {
    id: '361d618a-3c04-40ad-9b27-3c8ea6927020',
    parameters: {
      workspaceId: '123',
      schemaId: '2',
      aql: 'Name LIKE A',
    },
    views: [
      {
        type: 'table',
        properties: {
          columns: [
            {
              key: 'id',
            },
            {
              key: 'type',
            },
            {
              key: 'key',
            },
            {
              key: 'description',
            },
            {
              key: 'summary',
            },
            {
              key: 'assignee',
            },
            {
              key: 'priority',
            },
            {
              key: 'status',
            },
            {
              key: 'created',
            },
            {
              key: 'due',
            },
            {
              key: 'labels',
            },
          ],
        },
      },
    ],
  },
});

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
  test('should insert datasource from the /jira command', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const blockCardModel = EditorBlockCardModel.from(nodes.blockCard);

    await editor.keyboard.type('/jira');
    await editor.keyboard.press('Enter');

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

  test('should insert datasource from the /assets command', async ({
    editor,
  }) => {
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
});
