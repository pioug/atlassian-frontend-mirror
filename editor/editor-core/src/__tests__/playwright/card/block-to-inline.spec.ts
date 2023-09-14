import {
  editorTestCase as test,
  EditorNodeContainerModel,
  EditorBlockCardModel,
  EditorInlineCardModel,
  EditorFloatingToolbarModel,
  expect,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { p, inlineCard, doc } from '@atlaskit/editor-test-helpers/doc-builder';
import { blockCardAdf } from './block-to-inline.spec.ts-fixtures/adf';

test.use({
  adf: blockCardAdf,
  editorProps: {
    appearance: 'full-page',
    allowTextAlignment: true,
    smartLinks: {
      allowBlockCards: true,
    },
  },
});

test.describe('blockCard', () => {
  test('should switch to inline mode', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const blockCardModel = EditorBlockCardModel.from(nodes.blockCard);
    const inlineCardModel = EditorInlineCardModel.from(nodes.inlineCard);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      blockCardModel,
    );

    // convert to inline card
    await blockCardModel.waitForStable();
    await blockCardModel.click();
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toInline();
    await inlineCardModel.waitForStable();

    const expectedInlineCard = inlineCard({
      data: {
        '@context': 'https://www.w3.org/ns/activitystreams',
        '@type': 'Document',
        generator: {
          icon: 'https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png',
        },
        name: 'Welcome to Atlassian!',
        url: 'http://www.atlassian.com',
      },
    });

    await expect(editor).toMatchDocument(
      doc(p(' '), p(expectedInlineCard()), p(' '), p(' ')),
    );
  });

  test('should have correct selection after switch to inline mode', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const blockCardModel = EditorBlockCardModel.from(nodes.blockCard);
    const inlineCardModel = EditorInlineCardModel.from(nodes.inlineCard);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      blockCardModel,
    );

    // convert to inline card
    await blockCardModel.waitForStable();
    await blockCardModel.click();
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.toInline();
    await inlineCardModel.waitForStable();

    await expect(editor).toHaveSelection({
      anchor: 5,
      head: 5,
      type: 'text',
    });
  });
});
