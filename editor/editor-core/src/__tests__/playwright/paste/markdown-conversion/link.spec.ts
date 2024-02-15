import {
  EditorFloatingToolbarModel,
  EditorPasteModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';

import { emptyDocument } from '../__fixtures__/adf-document';

test.use({
  editorProps: {
    appearance: 'full-page',
    media: {
      allowMediaSingle: true,
    },
  },
  platformFeatureFlags: {
    'platform.editor.paste-options-toolbar': true,
  },
});

test.describe('link', () => {
  test.use({
    adf: emptyDocument,
  });

  const text = 'https://jira.atlassian.com/browse/JRACLOUD-72631';

  test('toolbar should not show up', async ({ editor }) => {
    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text,
    });

    const editorPasteModel = EditorPasteModel.from(editor);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      editorPasteModel,
    );

    await expect(floatingToolbarModel.toolbar).toBeHidden();
  });
});
