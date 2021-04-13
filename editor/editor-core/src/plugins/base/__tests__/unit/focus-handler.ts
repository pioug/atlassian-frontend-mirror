import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import createEvent from '@atlaskit/editor-test-helpers/create-event';
import { createProsemirrorEditorFactory } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { focusStateKey } from '../../pm-plugins/focus-handler';
import { PluginKey } from 'prosemirror-state';

const event = createEvent('event');

describe('isEditorFocused', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder) => {
    return createEditor<boolean, PluginKey>({
      doc,
      pluginKey: focusStateKey,
    });
  };

  it('should set to `true` when a focus event fires', () => {
    const { plugin, editorView } = editor(doc(p('{<>}')));
    plugin.props.handleDOMEvents!.blur(editorView, event);
    plugin.props.handleDOMEvents!.focus(editorView, event);

    const isEditorFocused = focusStateKey.getState(editorView.state);
    expect(isEditorFocused).toBe(true);
  });

  it('should set to `false` when a blur event fires', () => {
    const { plugin, editorView } = editor(doc(p('{<>}')));

    plugin.props.handleDOMEvents!.blur(editorView, event);

    const isEditorFocused = focusStateKey.getState(editorView.state);
    expect(isEditorFocused).toBe(false);
  });

  it('should set to `true` when a click event fires and editor is not focused', () => {
    const { plugin, editorView } = editor(doc(p('{<>}')));

    jest.spyOn(editorView, 'hasFocus').mockReturnValue(true);
    plugin.props.handleDOMEvents!.blur(editorView, event);
    plugin.props.handleDOMEvents!.click(editorView, event);

    const isEditorFocused = focusStateKey.getState(editorView.state);
    expect(isEditorFocused).toBe(true);
  });
});
