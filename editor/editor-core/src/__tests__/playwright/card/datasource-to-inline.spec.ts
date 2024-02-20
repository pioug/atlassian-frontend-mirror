import {
  EditorBlockCardModel,
  EditorFloatingToolbarModel,
  EditorInlineCardModel,
  EditorNodeContainerModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  datasourceBlockCard,
  doc,
  inlineCard,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { blockCardGenericDatasourceAdf } from './datasource-1.spec.ts-fixtures/datasource-adf';

test.use({
  adf: blockCardGenericDatasourceAdf,
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
    'platform.linking-platform.enable-datasource-appearance-toolbar': true,
  },
});

const expectedInlineCard = inlineCard({
  url: 'https://inlineCardTestUrl/generic-datasource',
});

const blockCardDatasourceAdfWithAdditionalViews = {
  ...blockCardGenericDatasourceAdf,
  content: [
    {
      ...blockCardGenericDatasourceAdf.content[0],
      attrs: {
        ...blockCardGenericDatasourceAdf.content[0].attrs,
        datasource: {
          ...blockCardGenericDatasourceAdf.content[0].attrs.datasource,
          views: [
            {
              type: 'table',
              properties: {
                columns: [{ key: 'type' }, { key: 'summary' }],
              },
            },
          ],
        },
      },
    },
  ],
};

test.describe('blockCard:datasource', () => {
  // FIXME: Flaky on master
  // Build url: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2449958/steps/%7Bf0946fe8-f257-48e1-aa60-32e90e5e989a%7D
  // Report url: https://statlas.prod.atl-paas.net/integration-tests/atlassian-frontend:2449958:4/index.html
  test.skip('should switch to inline mode', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const blockCardModel = EditorBlockCardModel.from(nodes.datasource);
    const inlineCardsModel = EditorInlineCardModel.from(nodes.inlineCard);
    const inlineCardModel = inlineCardsModel.card(0);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      blockCardModel,
    );

    // convert to inline card
    await blockCardModel.waitForStable();
    await blockCardModel.click();
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toInline();
    await inlineCardModel.waitForResolvedStable();

    await expect(editor).toMatchDocument(doc(p(expectedInlineCard())));
  });
});

test.describe('datasource config persistence', () => {
  test('should preserve datasource config when switching between datasource and inline', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const inlineCardsModel = EditorInlineCardModel.from(nodes.inlineCard);
    const inlineCardModel = inlineCardsModel.card(0);
    const datasourceModel = EditorBlockCardModel.from(nodes.datasource);
    const floatingToolbarModelDatasource = EditorFloatingToolbarModel.from(
      editor,
      datasourceModel,
    );
    const floatingToolbarModelInline = EditorFloatingToolbarModel.from(
      editor,
      inlineCardsModel,
    );

    // check rendering of single key column
    await expect(editor.page.getByTestId('key-column-heading')).toBeVisible();
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

    // convert to inline card
    await datasourceModel.waitForStable();
    await datasourceModel.click();
    await floatingToolbarModelDatasource.waitForStable();
    await floatingToolbarModelDatasource.toInline();
    await inlineCardModel.waitForStable();

    // convert to datasource
    await inlineCardModel.click();
    await floatingToolbarModelInline.waitForStable();
    await floatingToolbarModelInline.toDatasource();
    await datasourceModel.waitForStable();

    await expect(editor).toMatchDocument(
      doc(
        p(),
        datasourceBlockCard({
          datasource: {
            id: 'generic',
            parameters: {
              foo: 'bar',
            },
            views: [
              {
                type: 'table',
                properties: {
                  columns: [{ key: 'key' }, { key: 'due' }],
                },
              },
            ],
          },
          url: 'https://inlineCardTestUrl/generic-datasource',
        })(),
      ),
    );
  });

  test.describe('copy-paste multiple datasource', () => {
    test.use({
      adf: {
        ...blockCardGenericDatasourceAdf,
        content: [
          blockCardGenericDatasourceAdf.content[0],
          blockCardDatasourceAdfWithAdditionalViews.content[0],
        ],
      },
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
        'platform.linking-platform.enable-datasource-appearance-toolbar': true,
      },
    });
    test('should only preserve last datasource config when switching between datasource and inline for two same url datasources', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const inlineCardsModel = EditorInlineCardModel.from(nodes.inlineCard);
      const inlineCardsModel2 = EditorInlineCardModel.from(
        nodes.inlineCard.last(),
      );
      const inlineCardModel = inlineCardsModel.card(0);
      const inlineCardModel2 = inlineCardsModel2.card(0);
      const datasourceModel1 = EditorBlockCardModel.from(
        nodes.datasource.first(),
      );
      const datasourceModel2 = EditorBlockCardModel.from(
        nodes.datasource.last(),
      );
      const floatingToolbarModelDatasource = EditorFloatingToolbarModel.from(
        editor,
        datasourceModel1,
      );
      const floatingToolbarModelInline = EditorFloatingToolbarModel.from(
        editor,
        inlineCardsModel,
      );

      // check rendering of single key column for first datasource
      await expect(
        editor.page.getByTestId('key-column-heading').first(),
      ).toBeVisible();

      // convert first datasource to inline card
      await floatingToolbarModelDatasource.waitForStable();
      await floatingToolbarModelDatasource.toInline();

      // check rendering of type and summary columns for second datasource
      await expect(
        editor.page.getByTestId('type-column-heading'),
      ).toBeVisible();
      await expect(
        editor.page.getByTestId('summary-column-heading'),
      ).toBeVisible();

      // convert second datasource to inline card
      await datasourceModel2.click();
      await floatingToolbarModelDatasource.waitForStable();
      await floatingToolbarModelDatasource.toInline();

      // convert first inline card to datasource
      await inlineCardModel.click();
      await floatingToolbarModelInline.toDatasource();
      await datasourceModel1.waitForStable();

      // convert second inline card to datasource
      await inlineCardModel2.click();
      await floatingToolbarModelInline.waitForStable();
      await floatingToolbarModelInline.toDatasource();
      await datasourceModel2.waitForStable();

      // check rendering of both datasources
      await expect(editor).toMatchDocument(
        doc(
          p(),
          datasourceBlockCard({
            datasource: {
              id: 'generic',
              parameters: {
                foo: 'bar',
              },
              views: [
                {
                  type: 'table',
                  properties: {
                    columns: [{ key: 'type' }, { key: 'summary' }],
                  },
                },
              ],
            },
            url: 'https://inlineCardTestUrl/generic-datasource',
          })(),
          p(),
          datasourceBlockCard({
            datasource: {
              id: 'generic',
              parameters: {
                foo: 'bar',
              },
              views: [
                {
                  type: 'table',
                  properties: {
                    columns: [
                      { key: 'key' },
                      { key: 'type' },
                      { key: 'summary' },
                      { key: 'description' },
                      { key: 'assignee' },
                      { key: 'people' },
                      { key: 'priority' },
                      { key: 'labels' },
                      { key: 'status' },
                      { key: 'created' },
                    ],
                  },
                },
              ],
            },
            url: 'https://inlineCardTestUrl/generic-datasource',
          })(),
        ),
      );
    });
  });
});
