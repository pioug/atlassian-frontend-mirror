import {
  EditorEmbedCardModel,
  EditorFloatingToolbarModel,
  EditorNodeContainerModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, inlineCard, p } from '@atlaskit/editor-test-helpers/doc-builder';

import { embedCardAdf } from './embed-1.spec.ts-fixtures/adf';

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
