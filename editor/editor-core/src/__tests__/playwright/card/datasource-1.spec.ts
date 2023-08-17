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

const datasourceTestIdPrefix = 'jira-jql-datasource-modal--';
const modalInputTestId = `${datasourceTestIdPrefix}basic-search-input`;
const modalSearchButtonTestId = `${datasourceTestIdPrefix}basic-search-button`;
const modalInsertButtonTestId = `${datasourceTestIdPrefix}insert-button`;

const assetModalTestId = 'asset-datasource-modal';

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

  test('should pop modal from the /assets command', async ({ editor }) => {
    await editor.keyboard.type('/assets');
    await editor.keyboard.press('Enter');

    await expect(await editor.page.getByTestId(assetModalTestId)).toBeVisible();
  });
});
