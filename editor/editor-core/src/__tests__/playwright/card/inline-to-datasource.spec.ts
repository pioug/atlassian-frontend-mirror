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
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { inlineCardWithDatasourceUrlAdf } from './inline-with-datasource-url.spec.ts-fixtures/adf';

test.use({
  adf: inlineCardWithDatasourceUrlAdf,
  editorProps: {
    appearance: 'full-page',
    allowTextAlignment: true,
    smartLinks: {
      allowBlockCards: true,
      allowDatasource: true,
    },
  },
  platformFeatureFlags: {
    'platform.linking-platform.enable-datasource-appearance-toolbar': true,
  },
});

test.describe('inlineCard', () => {
  test.skip('should switch to datasource mode', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const datasourceModel = EditorBlockCardModel.from(nodes.datasource);

    const inlineCardsModel = EditorInlineCardModel.from(nodes.inlineCard);
    const inlineCardModel = inlineCardsModel.card(0);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      inlineCardsModel,
    );

    // convert to inline card
    await inlineCardModel.waitForResolvedStable();
    await inlineCardModel.click();

    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toDatasource();

    await datasourceModel.waitForStable();

    await expect(editor).toMatchDocument(
      doc(
        p(),
        datasourceBlockCard({
          datasource: {
            id: 'd8b75300-dfda-4519-b6cd-e49abbd50401',
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
          url: 'https://inlineCardTestUrl/datasource',
        })(),
      ),
    );
  });
});
