import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import { EditorView } from 'prosemirror-view';
import { TextSelection } from 'prosemirror-state';
import { focusStateKey } from '../../../base/pm-plugins/focus-handler';
import createEvent from '@atlaskit/editor-test-helpers/create-event';
import placeholderPlugin, { placeholderTestId } from '../../';
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
const bracketPlaceholder = "Did you mean to use '/' to insert content?";
const event = createEvent('event');

describe('placeholder', () => {
  const createProsemirrorEditor = createProsemirrorEditorFactory();

  describe('Empty placeholder', () => {
    const emptyPlaceholderEditor = (doc: DocBuilder) =>
      createProsemirrorEditor({
        doc,
        preset: new Preset<LightEditorPlugin>()
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

  describe('Bracket placeholder', () => {
    const emptyPlaceholderEditor = (doc: DocBuilder) =>
      createProsemirrorEditor({
        doc,
        preset: new Preset<LightEditorPlugin>().add([
          placeholderPlugin,
          { placeholderBracketHint: bracketPlaceholder },
        ]),
      });

    it('renders placeholder when bracket typed in an empty line', async () => {
      const { editorView } = await emptyPlaceholderEditor(doc(p()));
      expectNoPlaceholder(editorView);

      insertText(editorView, '{', 1);
      const placeholderShown = '  ' + bracketPlaceholder;

      expectPlaceHolderWithText(editorView, placeholderShown);
    });

    it('placeholder disappears when content is added to line', async () => {
      const { editorView } = await emptyPlaceholderEditor(doc(p('{')));
      const placeholderShown = '  ' + bracketPlaceholder;

      expectPlaceHolderWithText(editorView, placeholderShown);

      insertText(editorView, 'Hello World', 2);
      expectNoPlaceholder(editorView);
    });

    it('placeholder disappears after changing selection to another line', async () => {
      const { editorView, refs } = await emptyPlaceholderEditor(
        doc(p('Hello World{noEmptyLine}'), p('{')),
      );
      const placeholderShown = '  ' + bracketPlaceholder;
      expectPlaceHolderWithText(editorView, placeholderShown);

      editorView.dispatch(
        editorView.state.tr.setSelection(
          TextSelection.create(editorView.state.doc, refs!['noEmptyLine']),
        ),
      );
      expectNoPlaceholder(editorView);
    });
  });
  describe('Default and Hint placeholder', () => {
    const fullPlaceholderEditor = (doc: DocBuilder) =>
      createProsemirrorEditor({
        doc,
        preset: new Preset<LightEditorPlugin>().add([
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

  describe('Editor out of focus', () => {
    const fullPlaceholderEditor = (doc: DocBuilder) =>
      createProsemirrorEditor({
        doc,
        preset: new Preset<LightEditorPlugin>().add([
          placeholderPlugin,
          {
            placeholderBracketHint: bracketPlaceholder,
          },
        ]),
        pluginKey: focusStateKey,
      });

    it('bracket placeholder disappears', async () => {
      const { plugin, editorView } = await fullPlaceholderEditor(doc(p('{')));
      const placeholderShown = '  ' + bracketPlaceholder;

      expectPlaceHolderWithText(editorView, placeholderShown);

      plugin!.props.handleDOMEvents!.blur(editorView, event);
      expectNoPlaceholder(editorView);
    });
  });
});
