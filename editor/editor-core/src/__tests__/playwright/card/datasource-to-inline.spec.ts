import {
  EditorBlockCardModel,
  EditorFloatingToolbarModel,
  EditorInlineCardModel,
  EditorNodeContainerModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, inlineCard, p } from '@atlaskit/editor-test-helpers/doc-builder';

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

test.describe('blockCard:datasource', () => {
  test('should switch to inline mode', async ({ editor }) => {
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

    const expectedInlineCard = inlineCard({
      url: 'https://inlineCardTestUrl/generic-datasource',
    });

    await expect(editor).toMatchDocument(doc(p(expectedInlineCard())));
  });
});
