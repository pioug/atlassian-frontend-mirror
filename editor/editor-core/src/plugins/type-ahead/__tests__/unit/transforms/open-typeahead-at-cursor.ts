import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  p,
  DocBuilder,
  placeholder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import typeAheadPlugin from '../../../';
import placeholderTextPlugin from '../../../../placeholder-text';
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

  let editor: any;
  let openTypeAhead: (tr: Transaction) => Transaction | null;
  beforeAll(() => {
    const createEditor = createProsemirrorEditorFactory();
    const preset = new Preset<LightEditorPlugin>()
      .add([placeholderTextPlugin, {}])
      .add(typeAheadPlugin);

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
});
