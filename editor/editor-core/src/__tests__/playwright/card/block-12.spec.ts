import {
  editorTestCase as test,
  EditorNodeContainerModel,
  EditorInlineCardModel,
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
    const inlineCardModel = EditorInlineCardModel.from(nodes.inlineCard);

    await inlineCardModel.waitForStable();

    const expectedBlockCard = datasourceBlockCard(
      blockCardDatasourceWithUrlAdf.content[0].attrs,
    );
    await expect(editor).toMatchDocument(doc(expectedBlockCard()));
    await expect(
      editor.page.getByTestId('inline-card-resolved-view'),
    ).toHaveText('0 Issues');
    await expect(
      editor.page.getByTestId('inline-card-resolved-view'),
    ).toHaveAttribute(
      'href',
      blockCardDatasourceWithUrlAdf.content[0].attrs.url,
    );
  });
});
