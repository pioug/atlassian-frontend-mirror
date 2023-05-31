import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  p,
  panel,
  DocBuilder,
  placeholder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import typeAheadPlugin from '../../../';
import placeholderTextPlugin from '../../../../placeholder-text';
import panelPlugin from '../../../../panel';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';

import { openTypeAheadAtCursor } from '../../../transforms/open-typeahead-at-cursor';
import { INPUT_METHOD } from '../../../../analytics/types/enums';
import { TypeAheadHandler } from '../../../types';
import { Transaction } from 'prosemirror-state';

describe('typeahead -> transforms -> openTypeAheadAtCursor', () => {
  const fakeTriggerHandler: TypeAheadHandler = {
    id: TypeAheadAvailableNodes.QUICK_INSERT,
    trigger: '/',
    getItems: () => Promise.resolve([]),
    selectItem: () => false,
  };

  let editor: (
    doc: DocBuilder,
  ) => ReturnType<ReturnType<typeof createProsemirrorEditorFactory>>;

  let openTypeAhead: (tr: Transaction) => Transaction | null;
  beforeAll(() => {
    const createEditor = createProsemirrorEditorFactory();
    const preset = new Preset<LightEditorPlugin>()
      .add(decorationsPlugin)
      .add([placeholderTextPlugin, {}])
      .add(typeAheadPlugin)
      .add(panelPlugin);

    editor = (doc: DocBuilder) =>
      createEditor({
        doc,
        preset,
      });

    openTypeAhead = openTypeAheadAtCursor({
      triggerHandler: fakeTriggerHandler,
      inputMethod: INPUT_METHOD.KEYBOARD,
    });
  });

  describe('when typeahead opens at a placeholder', () => {
    it('should delete the placeholder', () => {
      const { editorView } = editor(
        // prettier-ignore
        doc(
          p('{<>}', placeholder({ text: 'Type something' })),
        ),
      );

      const tr = editorView.state.tr;

      openTypeAhead(tr);

      expect(tr).toEqualDocumentAndSelection(
        // prettier-ignore
        doc(
          p('{<>}'),
        ),
      );
    });
  });

  describe('when typeahead opens at a right-side gap cursor after a block node', () => {
    it('should insert an empty text block after the gap cursor position and move cursor into it', () => {
      const { editorView } = editor(
        doc(panel({ panelType: 'info' })(p('12345')), '{<|gap>}'),
      );

      const tr = editorView.state.tr;
      openTypeAhead(tr);

      expect(tr).toEqualDocumentAndSelection(
        doc(panel({ panelType: 'info' })(p('12345')), p('{<>}')),
      );
    });
  });

  describe('when typeahead opens at a left-side gap cursor before a block node', () => {
    it('should insert an empty text block before the gap cursor position and move cursor into it', () => {
      const { editorView } = editor(
        doc('{<|gap>}', panel({ panelType: 'info' })(p('12345'))),
      );

      const tr = editorView.state.tr;
      openTypeAhead(tr);

      expect(tr).toEqualDocumentAndSelection(
        doc(p('{<>}'), panel({ panelType: 'info' })(p('12345'))),
      );
    });
  });
});
