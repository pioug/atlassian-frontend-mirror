import { insertTypeAheadItem } from '../../../commands/insert-type-ahead-item';
import { Transaction } from 'prosemirror-state';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import type { TypeAheadItem } from '@atlaskit/editor-common/provider-factory';
import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import typeAheadPlugin from '../../../';
import { EditorView } from 'prosemirror-view';
import { TypeAheadHandler } from '../../../types';

describe('typeahead plugin -> commands -> insert-type-ahead-item', () => {
  let editor: any;
  beforeAll(() => {
    const createEditor = createProsemirrorEditorFactory();
    const preset = new Preset<LightEditorPlugin>().add(typeAheadPlugin);

    editor = (doc: DocBuilder) =>
      createEditor({
        doc,
        preset,
      });
  });

  let editorView: EditorView;
  const item: TypeAheadItem = {
    title: 'Earth',
  };
  const trigger = '#';
  const query = 'XX';
  beforeEach(() => {
    ({ editorView } = editor(doc(p('Hello {<>}'))));
  });

  describe('when the insert mode is not space', () => {
    describe('and before the item is add at the document', () => {
      it('should not insert a space after the raw query', () => {
        let tr: Transaction;
        const handler: TypeAheadHandler = {
          id: 'aa' as any,
          trigger,
          getItems: () => Promise.resolve([]),
          selectItem: (_state, _item, insert) => {
            tr = insert(item.title);
            return tr;
          },
        };

        insertTypeAheadItem(editorView)({
          item,
          handler,
          mode: SelectItemMode.ENTER,
          sourceListItem: [],
          query,
        });

        expect(tr!).toEqualDocumentAndSelection(doc(p(`Hello Earth`)));
      });
    });
  });

  describe('when the insert mode is space', () => {
    describe('and when the insert callback is called with an invalid node', () => {
      it('should delete the raw text from the document', () => {
        const handler: TypeAheadHandler = {
          id: 'aa' as any,
          trigger,
          getItems: () => Promise.resolve([]),
          selectItem: (_state, _item, insert) => {
            return insert(''); //invalid node
          },
        };
        insertTypeAheadItem(editorView)({
          item,
          handler,
          mode: SelectItemMode.SPACE,
          sourceListItem: [],
          query,
        });

        expect(editorView.state).toEqualDocumentAndSelection(
          doc(p(`Hello {<>}`)),
        );
      });
    });

    describe('and when the insert callback is not called', () => {
      it('should keep the raw text in the document', () => {
        const handler: TypeAheadHandler = {
          id: 'aa' as any,
          trigger,
          getItems: () => Promise.resolve([]),
          selectItem: (_state, _item, insert) => {
            return _state.tr;
          },
        };
        insertTypeAheadItem(editorView)({
          item,
          handler,
          mode: SelectItemMode.SPACE,
          sourceListItem: [],
          query,
        });

        expect(editorView.state).toEqualDocumentAndSelection(
          doc(p(`Hello ${trigger}${query} {<>}`)),
        );
      });
    });

    describe('and before the item is add at the document', () => {
      it('should insert a space after the raw query', () => {
        const handler: TypeAheadHandler = {
          id: 'aa' as any,
          trigger,
          getItems: () => Promise.resolve([]),
          selectItem: (_state, _item, insert) => {
            return insert('lol');
          },
        };
        const dispatchSpy = jest.spyOn(editorView, 'dispatch');
        insertTypeAheadItem(editorView)({
          item,
          handler,
          mode: SelectItemMode.SPACE,
          sourceListItem: [],
          query,
        });

        const firstTrDispatched = dispatchSpy.mock.calls[0][0];
        expect(firstTrDispatched).toEqualDocumentAndSelection(
          doc(p(`Hello ${trigger}${query} `)),
        );
      });
    });
  });
});
