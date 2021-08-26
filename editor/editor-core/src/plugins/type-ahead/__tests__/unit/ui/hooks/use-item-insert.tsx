import React from 'react';
import { render } from 'react-dom';
import { EditorState } from 'prosemirror-state';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  SelectItemMode,
  TypeAheadAvailableNodes,
} from '@atlaskit/editor-common/type-ahead';
import type { OnInsertSelectedItem, OnTextInsert } from '../../../../types';
import { useItemInsert } from '../../../../ui/hooks/use-item-insert';
import { CloseSelectionOptions } from '../../../../constants';
import typeAheadPlugin from '../../../../';
import type { TypeAheadHandler } from '../../../../types';
import type { TypeAheadItem } from '@atlaskit/editor-common/provider-factory';
import type { QuickInsertActionInsert } from '../../../../../quick-insert/types';

let container: HTMLElement | null;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});
afterEach(() => {
  document.body.removeChild(container!);
  container = null;
});

describe('Hooks: useItemInsert', () => {
  const createEditor = createProsemirrorEditorFactory();
  const preset = new Preset<LightEditorPlugin>().add(typeAheadPlugin);

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset,
    });
  let onTextInsert: OnTextInsert;
  let onItemInsert: OnInsertSelectedItem;

  const TestComponent: React.FC<{
    triggerHandler: any;
    editorView: any;
    items: any;
  }> = ({ triggerHandler, editorView, items }) => {
    [onItemInsert, onTextInsert] = useItemInsert(
      triggerHandler,
      editorView,
      items,
    );
    return null;
  };

  it('when onTextInsert is called, inserts raw text before', () => {
    const triggerHandler = jest.fn();
    const { editorView } = editor(doc(p('Hello {<>}')));

    render(
      <TestComponent
        triggerHandler={triggerHandler}
        editorView={editorView}
        items={[]}
      />,
      container,
    );

    onTextInsert({
      setSelectionAt: CloseSelectionOptions.BEFORE_TEXT_INSERTED,
      text: 'xyz',
      forceFocusOnEditor: false,
    });

    expect(editorView.state).toEqualDocumentAndSelection(
      doc(p('Hello {<>}xyz')),
    );
  });

  it('when onTextInsert is called, inserts raw text after', () => {
    const triggerHandler = jest.fn();
    const { editorView } = editor(doc(p('Hello {<>}')));

    render(
      <TestComponent
        triggerHandler={triggerHandler}
        editorView={editorView}
        items={[]}
      />,
      container,
    );

    onTextInsert({
      setSelectionAt: CloseSelectionOptions.AFTER_TEXT_INSERTED,
      text: 'xyz',
      forceFocusOnEditor: false,
    });

    expect(editorView.state).toEqualDocumentAndSelection(
      doc(p('Hello xyz{<>}')),
    );
  });

  it('when onItemInsert is called, inserts typeahead item', () => {
    const items: TypeAheadItem[] = [
      {
        title: 'Earth',
        action(insert: QuickInsertActionInsert, state: EditorState) {
          const newText = state.schema.text('Earth');
          const tr = insert(newText);
          return tr;
        },
      },
    ];
    const triggerHandler: TypeAheadHandler = {
      id: TypeAheadAvailableNodes.QUICK_INSERT,
      trigger: '/',
      getItems: jest.fn(),
      selectItem: (state, item, insert) => {
        return item.action(insert, state);
      },
    };
    const { editorView } = editor(doc(p('Hello {<>}')));

    render(
      <TestComponent
        triggerHandler={triggerHandler}
        editorView={editorView}
        items={items}
      />,
      container,
    );

    onItemInsert({ query: '', mode: SelectItemMode.ENTER, index: 0 });

    expect(editorView.state).toEqualDocumentAndSelection(
      doc(p('Hello Earth{<>}')),
    );
  });

  describe('when onTextInsert is called', () => {
    let editorViewFocusSpy: jest.SpyInstance;
    beforeEach(() => {
      const triggerHandler = jest.fn();
      const { editorView } = editor(doc(p('Hello {<>}')));

      editorViewFocusSpy = jest.spyOn(editorView, 'focus');

      render(
        <TestComponent
          triggerHandler={triggerHandler}
          editorView={editorView}
          items={[]}
        />,
        container,
      );
    });

    describe('and forceFocusOnEditor is true', () => {
      it('should call the editorView.focus function', () => {
        onTextInsert({
          setSelectionAt: CloseSelectionOptions.AFTER_TEXT_INSERTED,
          text: 'xyz',
          forceFocusOnEditor: true,
        });

        expect(editorViewFocusSpy).toHaveBeenCalled();
      });
    });

    describe('and forceFocusOnEditor is false', () => {
      it('should not call the editorView.focus function', () => {
        onTextInsert({
          setSelectionAt: CloseSelectionOptions.AFTER_TEXT_INSERTED,
          text: 'xyz',
          forceFocusOnEditor: false,
        });

        expect(editorViewFocusSpy).not.toHaveBeenCalled();
      });
    });
  });
});
