import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { PluginSpec } from '@atlaskit/editor-prosemirror/state';
import { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorProps } from '@atlaskit/editor-prosemirror/view';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { a, doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { insertText } from '@atlaskit/editor-test-helpers/transactions';

import { showLinkToolbar } from '../../../commands';
import { hyperlinkPlugin } from '../../../plugin';
import fakeCursorForToolbarPlugin from '../../fake-cursor-for-toolbar';

const init = (fakeCursorForToolbarPlugin.spec as PluginSpec<any>).state!.init;
const getDecorations = (state: EditorState) =>
  ((fakeCursorForToolbarPlugin.spec as PluginSpec<any>).props as EditorProps)!
    .decorations!(state) as DecorationSet;

describe('hyperlink', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([analyticsPlugin, {}])
        .add(hyperlinkPlugin),
    });
  };

  describe('fake-cursor-for-toolbar plugin', () => {
    it('should render no decorations initially', () => {
      const pluginState = init(
        {},
        EditorState.create({ schema: defaultSchema }),
      );
      expect(pluginState).toBe(DecorationSet.empty);
    });

    it('should render no decorations when hyperlink plugin is not showing insert link toolbar', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, 'text', sel);
      expect(getDecorations(editorView.state)).toBe(DecorationSet.empty);
    });

    it('should render no decorations when cursor inside a link', () => {
      const { editorView } = editor(
        doc(p(a({ href: 'google.com' })('li{<>}nk'))),
      );
      expect(getDecorations(editorView.state)).toBe(DecorationSet.empty);
    });

    it('should render cursor decoration when hyperlink plugin has a cursor selection ', () => {
      const { editorView } = editor(doc(p('{<>}')));
      const newTr = showLinkToolbar(
        INPUT_METHOD.TOOLBAR,
        undefined,
      )({ tr: editorView.state.tr });
      if (newTr) {
        editorView.dispatch(newTr);
      }

      const decorations = getDecorations(editorView.state);
      expect(decorations.find()).toEqual([
        Decoration.widget(1, expect.any(HTMLElement), {
          key: 'hyperlink-text-cursor',
        }),
      ]);
    });

    it('should update cursor decoration when document changed', () => {
      const { editorView } = editor(doc(p('{<>}')));
      const newTr = showLinkToolbar(
        INPUT_METHOD.TOOLBAR,
        undefined,
      )({ tr: editorView.state.tr });
      if (newTr) {
        editorView.dispatch(newTr);
      }
      const oldDecorations = getDecorations(editorView.state);

      const documentChangeTr = editorView.state.tr.insertText('text', 1);
      // Don't use dispatch to mimic collab provider
      editorView.updateState(editorView.state.apply(documentChangeTr));
      const newDecorations = getDecorations(editorView.state);

      expect(newDecorations).toEqual(
        oldDecorations.map(documentChangeTr.mapping, documentChangeTr.doc),
      );
      // Ensure we're not creating a new DOM element for this change
      expect((newDecorations.find()[0] as any).type.toDOM).toBe(
        (oldDecorations.find()[0] as any).type.toDOM,
      );
    });

    it('should render selection decoration when hyperlink plugin has a cursor selection ', () => {
      const { editorView } = editor(doc(p('{<}text{>}')));
      const newTr = showLinkToolbar(
        INPUT_METHOD.TOOLBAR,
        undefined,
      )({ tr: editorView.state.tr });
      if (newTr) {
        editorView.dispatch(newTr);
      }

      const decorations = getDecorations(editorView.state);
      expect(decorations.find()).toEqual([
        Decoration.inline(1, 5, { class: 'ProseMirror-fake-text-selection' }),
      ]);
    });
  });
});
