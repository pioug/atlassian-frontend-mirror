import {
  EditorNodeContainerModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

import {
  unsupportedBlockAdf,
  unsupportedInlineAdf,
} from './unsupported-content.fixtures';

test.describe('Unsupported block content', () => {
  test.use({
    adf: unsupportedBlockAdf,
  });
  test('deletes selected node', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);

    await nodes.unsupportedBlock.click();
    await editor.keyboard.press('Backspace');

    await expect(editor).toHaveDocument(doc(p('')));
  });
  test('types over selected node', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);

    await nodes.unsupportedBlock.click();
    await editor.keyboard.type('A');

    await expect(editor).toHaveDocument(doc(p('A')));
  });
});

test.describe('Unsupported inline content', () => {
  test.use({
    adf: unsupportedInlineAdf,
  });
  test('deletes selected node', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);

    await nodes.unsupportedInline.click();
    await editor.keyboard.press('Backspace');

    await expect(editor).toHaveDocument(doc(p('')));
  });
  test('types over selected node', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    await nodes.unsupportedInline.click();

    await editor.keyboard.type('A');

    await expect(editor).toHaveDocument(doc(p('A')));
  });
});
