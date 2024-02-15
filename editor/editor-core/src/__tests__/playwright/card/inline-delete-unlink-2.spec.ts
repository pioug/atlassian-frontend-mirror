import {
  EditorFloatingToolbarModel,
  EditorInlineCardModel,
  EditorLinkFloatingToolbarModel,
  EditorLinkFloatingToolbarWithNewDesignSystemUIModel,
  EditorNodeContainerModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

test.use({
  editorProps: {
    appearance: 'full-page',
    smartLinks: {
      allowEmbeds: true,
    },
  },
});

const inlineCard = {
  linkPicker: {
    searchText: 'home opt-in',
    itemTitle: 'Home opt-in requests',
  },
  url: 'https://product-fabric.atlassian.net/wiki/display/H/Home+opt-in+requests ',
};

test.describe('card', () => {
  test('If a user creates an inline card using Cmd + K shortcut, and then unlinks the card, the display text (url) should still exist as text after unlinking', async ({
    editor,
  }) => {
    const oldLinkToolbarModel = EditorLinkFloatingToolbarModel.from(editor);

    await oldLinkToolbarModel.openViaKeyboardShortcut();
    await editor.keyboard.type(inlineCard.linkPicker.searchText);
    await editor.page.getByText(inlineCard.linkPicker.itemTitle).click();

    const nodes = EditorNodeContainerModel.from(editor);
    const inlineCardsModel = EditorInlineCardModel.from(nodes.inlineCard);
    const inlineCardModel = inlineCardsModel.card(0);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      inlineCardsModel,
    );

    await inlineCardModel.waitForResolvedStable();
    await inlineCardModel.click();
    await floatingToolbarModel.unlink();

    await expect(editor).toHaveDocument(doc(p(inlineCard.url)));
  });

  test.describe('feature flag: lp-link-picker', () => {
    test.use({
      editorProps: {
        featureFlags: {
          'lp-link-picker': true,
        },
        smartLinks: {
          allowEmbeds: true,
        },
      },
      editorMountOptions: {
        withLinkPickerOptions: true,
      },
    });

    test('If a user creates an inline card using Cmd + K shortcut, and then unlinks the card, the display text (url) should still exist as text after unlinking', async ({
      editor,
    }) => {
      const newLinkToolbarModel =
        EditorLinkFloatingToolbarWithNewDesignSystemUIModel.from(editor);

      await newLinkToolbarModel.openViaKeyboardShortcut();
      await editor.keyboard.type(inlineCard.linkPicker.searchText);
      await editor.page.getByText(inlineCard.linkPicker.itemTitle).click();

      const nodes = EditorNodeContainerModel.from(editor);
      const inlineCardsModel = EditorInlineCardModel.from(nodes.inlineCard);
      const inlineCardModel = inlineCardsModel.card(0);
      const floatingToolbarModel = EditorFloatingToolbarModel.from(
        editor,
        inlineCardsModel,
      );

      await inlineCardModel.waitForResolvedStable();
      await inlineCardModel.click();
      await floatingToolbarModel.unlink();

      await expect(editor).toHaveDocument(doc(p(inlineCard.url)));
    });
  });
});
