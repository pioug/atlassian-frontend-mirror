import {
  EditorEmbedCardModel,
  EditorFloatingToolbarModel,
  EditorNodeContainerModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { a, doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

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
  test('changing the link label of an embed link should convert it to a "dumb" link', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const embedCardModel = EditorEmbedCardModel.from(nodes.embedCard);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      embedCardModel,
    );

    // edit link label
    await embedCardModel.waitForStable();
    await embedCardModel.click();

    await floatingToolbarModel.editLink();
    await floatingToolbarModel.clearLabel();
    await editor.keyboard.type('New heading');
    await editor.keyboard.press('Enter');

    await expect(editor).toHaveDocument(
      doc(p(), p(a({ href: 'https://embedCardTestUrl' })('New heading')), p()),
    );
  });
});
