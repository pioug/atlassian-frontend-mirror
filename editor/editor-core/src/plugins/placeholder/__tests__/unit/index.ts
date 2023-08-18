import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import type { DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { focusPlugin } from '@atlaskit/editor-plugin-focus';
import placeholderPlugin, { placeholderTestId } from '../../';
import { compositionPlugin } from '@atlaskit/editor-plugin-composition';
import typeAheadPlugin from '../../../type-ahead';

function expectNoPlaceholder(editorView: EditorView) {
  const placeholder = editorView.dom.querySelector(
    `[data-testid=${placeholderTestId}]`,
  );

  expect(placeholder).toBe(null);
}

function expectPlaceHolderWithText(editorView: EditorView, text: string) {
  editorView.focus();
  const placeholder = editorView.dom.querySelector(
    `[data-testid=${placeholderTestId}]`,
  );

  expect(placeholder).toBeDefined();
  expect(placeholder!.textContent).toEqual(text);
}

const defaultPlaceholder = 'defaultPlaceholder';

describe('placeholder', () => {
  const createProsemirrorEditor = createProsemirrorEditorFactory();

  describe('Empty placeholder', () => {
    const emptyPlaceholderEditor = (doc: DocBuilder) =>
      createProsemirrorEditor({
        doc,
        preset: new Preset<LightEditorPlugin>()
          .add(focusPlugin)
          .add(compositionPlugin)
          .add([placeholderPlugin, { placeholder: defaultPlaceholder }])
          .add(typeAheadPlugin),
      });

    it('renders a placeholder on a blank document', async () => {
      const { editorView } = await emptyPlaceholderEditor(doc(p()));

      expectPlaceHolderWithText(editorView, defaultPlaceholder);
    });

    it('disappears when content is added to document', async () => {
      const { editorView } = await emptyPlaceholderEditor(doc(p()));
      expectPlaceHolderWithText(editorView, defaultPlaceholder);

      insertText(editorView, 'a', 0);

      expectNoPlaceholder(editorView);
    });
  });

  describe('Default and Hint placeholder', () => {
    const fullPlaceholderEditor = (doc: DocBuilder) =>
      createProsemirrorEditor({
        doc,
        preset: new Preset<LightEditorPlugin>()
          .add(focusPlugin)
          .add(compositionPlugin)
          .add([
            placeholderPlugin,
            {
              placeholder: defaultPlaceholder,
            },
          ]),
      });
    it('renders the default placeholder on a blank content', async () => {
      const { editorView } = await fullPlaceholderEditor(doc(p()));

      expectPlaceHolderWithText(editorView, defaultPlaceholder);
    });
  });
});
