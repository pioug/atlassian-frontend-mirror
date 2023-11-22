import {
  editorTestCase as test,
  EditorNodeContainerModel,
  EditorBlockCardModel,
  expect,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  datasourceBlockCard,
  doc,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { blockCardDatasourceWithUrlAdf } from './block-12.spec.ts-fixtures/adf-blockCard-datasource-with-url';

test.use({
  adf: blockCardDatasourceWithUrlAdf,
  editorProps: {
    appearance: 'mobile',
    allowTextAlignment: true,
    smartLinks: {
      allowBlockCards: true,
    },
  },
});

test.describe('blockCard', () => {
  test('block card with datasource should display as an inline smartlink on mobile', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const blockCardModel = EditorBlockCardModel.from(nodes.blockCard);

    await blockCardModel.waitForStable();

    const expectedBlockCard = datasourceBlockCard(
      blockCardDatasourceWithUrlAdf.content[0].attrs,
    );
    await expect(editor).toMatchDocument(doc(expectedBlockCard()));
    await expect(blockCardModel.inlineCard).toHaveText('0 Issues');
    await expect(blockCardModel.inlineCard).toHaveAttribute(
      'href',
      blockCardDatasourceWithUrlAdf.content[0].attrs.url,
    );
  });
});
