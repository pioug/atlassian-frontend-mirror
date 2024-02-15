import {
  EditorFloatingToolbarModel,
  EditorInlineCardModel,
  EditorNodeContainerModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { blockCard, doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

import { inlineCardAdf } from './inline-edit-view-switcher.spec.ts-fixtures/adf';

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
    const inlineCardsModel = EditorInlineCardModel.from(nodes.inlineCard);
    const inlineCardModel = inlineCardsModel.card(0);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      inlineCardsModel,
    );

    await inlineCardModel.waitForResolvedStable();
    await inlineCardModel.click();
    await floatingToolbarModel.toBlock();

    await expect(editor).toHaveDocument(
      doc(blockCard({ url: 'https://inlineCardTestUrl' })(), p(' ')),
    );
  });
});
