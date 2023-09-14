import {
  editorTestCase as test,
  EditorNodeContainerModel,
  EditorFloatingToolbarModel,
  EditorEmbedCardModel,
  expect,
} from '@af/editor-libra';
import { embedCardAdf } from './embed-1.spec.ts-fixtures/adf';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { p, doc, inlineCard } from '@atlaskit/editor-test-helpers/doc-builder';

test.use({
  adf: embedCardAdf,
  editorProps: {
    appearance: 'full-page',
    allowTextAlignment: true,
    smartLinks: {
      allowBlockCards: true,
      allowEmbeds: true,
    },
  },
});

test.describe('card', () => {
  test('changing the link label of an embed link should convert it to an inline card', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const embedCardModel = EditorEmbedCardModel.from(nodes.embedCard);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      embedCardModel,
    );

    // wait for embed card to be ready in doc
    await embedCardModel.waitForStable();
    await embedCardModel.click();

    // edit the links url
    await floatingToolbarModel.editLink();
    await floatingToolbarModel.clearLink();
    await editor.keyboard.type(
      'https://product-fabric.atlassian.net/wiki/spaces/E/overview',
    );
    await editor.keyboard.press('Enter');

    const expectedInlineCard = inlineCard({
      data: {
        '@context': 'https://www.w3.org/ns/activitystreams',
        '@type': 'Document',
        name: 'https://product-fabric.atlassian.net/wiki/spaces/E/overview',
        url: 'https://product-fabric.atlassian.net/wiki/spaces/E/overview',
      },
    });

    await expect(editor).toHaveDocument(
      doc(p(), p(expectedInlineCard(), ' '), p()),
    );
  });
});
