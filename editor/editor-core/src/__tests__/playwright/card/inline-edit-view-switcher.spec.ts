import {
  editorTestCase as test,
  EditorNodeContainerModel,
  EditorFloatingToolbarModel,
  expect,
  EditorInlineCardModel,
} from '@af/editor-libra';
import { inlineCardAdf } from './inline-edit-view-switcher.spec.ts-fixtures/adf';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { p, doc, blockCard } from '@atlaskit/editor-test-helpers/doc-builder';

test.use({
  adf: inlineCardAdf,
  editorProps: {
    appearance: 'full-page',
    allowTextAlignment: true,
    smartLinks: {
      allowBlockCards: true,
    },
  },
});

test.describe('card', () => {
  test('if user selects "Card" option in link floating toolbar, smart link should change from inline card to block card', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const inlineCardModel = EditorInlineCardModel.from(nodes.inlineCard);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      inlineCardModel,
    );

    await inlineCardModel.waitForStable();
    await inlineCardModel.click();
    await floatingToolbarModel.toBlock();

    await expect(editor).toHaveDocument(
      doc(blockCard({ url: 'https://inlineCardTestUrl' })(), p(' ')),
    );
  });
});
