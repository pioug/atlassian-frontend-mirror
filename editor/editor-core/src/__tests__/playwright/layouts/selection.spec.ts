import {
  EditorNodeContainerModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';

import { layoutAdf } from './selection.spec.ts-fixtures';

test.describe('Layout Selection', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowLayouts: true,
    },
    adf: layoutAdf,
  });

  test("doesn't select layout section node if click and drag before releasing mouse", async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    await nodes.layout.first().hover();
    await editor.page.mouse.down();
    await nodes.layout.first().hover();
    await expect(editor).not.toHaveSelection({
      type: 'node',
      anchor: 0,
    });
  });
});
