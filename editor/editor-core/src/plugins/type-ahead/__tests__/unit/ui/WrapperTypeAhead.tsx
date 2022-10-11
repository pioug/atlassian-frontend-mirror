import React from 'react';
import { render, act, fireEvent, cleanup } from '@testing-library/react';
import { EditorState } from 'prosemirror-state';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import type { TypeAheadItem } from '@atlaskit/editor-common/provider-factory';
import type { QuickInsertActionInsert } from '../../../../quick-insert/types';

import type { TypeAheadHandler } from '../../../types';
import { WrapperTypeAhead } from '../../../ui/WrapperTypeAhead';
import { getPluginState } from '../../../utils';
import typeAheadPlugin from '../../../';
import { redo, undo } from 'prosemirror-history';
import { EditorView } from 'prosemirror-view';
import { IntlProvider } from 'react-intl-next';

let _queueMicrotask: any;
let editor: any;

interface DebounceFunction {
  cancel: jest.Mock;
}

jest.mock('lodash/debounce', () => (fn: DebounceFunction) => {
  fn.cancel = jest.fn();
  return fn;
});

beforeAll(() => {
  _queueMicrotask = window.queueMicrotask;
  window.queueMicrotask = (fn: Function) => {
    fn();
  };

  const createEditor = createProsemirrorEditorFactory();
  const preset = new Preset<LightEditorPlugin>().add(typeAheadPlugin);

  editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset,
    });
});
afterAll(() => {
  window.queueMicrotask = _queueMicrotask;
});

let container: HTMLElement | null;
let editorView: EditorView;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  ({ editorView } = editor(doc(p('Hello {<>}'))));
});
afterEach(() => {
  document.body.removeChild(container!);
  container = null;
  cleanup();
});

type Props = Partial<React.ComponentProps<typeof WrapperTypeAhead>>;
const renderWrapperTypeAhead = ({
  triggerHandler,
  editorView,
  anchorElement,
  shouldFocusCursorInsideQuery,
}: Props) => {
  return render(
    <IntlProvider locale="en">
      <WrapperTypeAhead
        triggerHandler={triggerHandler!}
        editorView={editorView!}
        anchorElement={anchorElement!}
        getDecorationPosition={jest.fn()}
        shouldFocusCursorInsideQuery={true!}
      />
    </IntlProvider>,
  );
};

const createTriggerHandlerFromItems = async (
  items: TypeAheadItem[],
  override?: Partial<TypeAheadHandler>,
) => {
  const resolvedItems = Promise.resolve(items);
  const defaultHandler: TypeAheadHandler = {
    id: TypeAheadAvailableNodes.QUICK_INSERT,
    trigger: '/',
    getItems() {
      return resolvedItems;
    },
    selectItem: (state, item, insert) => {
      return item.action(insert, state);
    },
  };
  const triggerHandler: TypeAheadHandler = !override
    ? defaultHandler
    : {
        ...defaultHandler,
        ...override,
      };
  return { triggerHandler, resolvedItems };
};

const fireKeyDown = (element: HTMLElement, keys: string[]) => {
  keys.forEach((key) => {
    act(() => {
      fireEvent.keyDown(element, { key, code: key });
    });
  });
};
const items: TypeAheadItem[] = [
  {
    title: 'Earth',
    action(insert: QuickInsertActionInsert, state: EditorState) {
      const newText = state.schema.text('Earth');
      const tr = insert(newText);
      return tr;
    },
  },
  {
    title: 'Mars',
    action(insert: QuickInsertActionInsert, state: EditorState) {
      const newText = state.schema.text('Mars');
      const tr = insert(newText);
      return tr;
    },
  },
  {
    title: 'Jupiter',
    action(insert: QuickInsertActionInsert, state: EditorState) {
      const newText = state.schema.text('Jupiter');
      const tr = insert(newText);
      return tr;
    },
  },
];

describe('WrapperTypeAhead', () => {
  it('when popup is open, input query field should exist', async () => {
    const { triggerHandler } = await createTriggerHandlerFromItems(items);

    const { getByRole } = renderWrapperTypeAhead({
      triggerHandler,
      editorView,
      anchorElement: container!,
    });

    const inputQuery = getByRole('combobox');
    expect(inputQuery).not.toBeNull();
  });

  it('Enter should close the popup and insert item into the document', async () => {
    const {
      triggerHandler,
      resolvedItems,
    } = await createTriggerHandlerFromItems(items);

    const { getByRole, queryByRole } = renderWrapperTypeAhead({
      triggerHandler,
      editorView,
      anchorElement: container!,
    });

    await resolvedItems;
    const inputQuery = getByRole('combobox');

    fireKeyDown(inputQuery, ['ArrowDown', 'Enter']);

    expect(queryByRole('combobox')).toBeNull();
    expect(editorView.state).toEqualDocumentAndSelection(
      doc(p('Hello Earth{<>}')),
    );
  });

  it('Enter should insert selected item into the document after navigating using Up and Down', async () => {
    const {
      triggerHandler,
      resolvedItems,
    } = await createTriggerHandlerFromItems(items);

    const { getByRole } = renderWrapperTypeAhead({
      triggerHandler,
      editorView,
      anchorElement: container!,
    });

    await resolvedItems;
    const inputQuery = getByRole('combobox');

    fireKeyDown(inputQuery, ['ArrowDown', 'ArrowDown', 'ArrowUp', 'Enter']);

    expect(editorView.state).toEqualDocumentAndSelection(
      doc(p('Hello Earth{<>}')),
    );
  });

  it('Esc should close the popup and insert raw text', async () => {
    const { triggerHandler } = await createTriggerHandlerFromItems(items);

    const { getByRole, queryByRole } = renderWrapperTypeAhead({
      triggerHandler,
      editorView,
      anchorElement: container!,
    });

    const inputQuery = getByRole('combobox');

    fireKeyDown(inputQuery, ['Esc']);

    expect(queryByRole('combobox')).toBeNull();
    expect(editorView.state).toEqualDocumentAndSelection(doc(p('Hello /{<>}')));
  });

  describe('#forceSelect', () => {
    describe('when the query changes', () => {
      it('should call the forceSelect API', async () => {
        const forceSelect = jest.fn();
        const { triggerHandler } = await createTriggerHandlerFromItems(items, {
          forceSelect,
        });

        const { getByRole } = renderWrapperTypeAhead({
          triggerHandler,
          editorView,
          anchorElement: container!,
        });

        const inputQuery = getByRole('combobox');
        act(() => {
          // There is no way to test a true contenteditable event with jsdom
          // so we are faking it
          fireEvent.change(inputQuery, {
            target: { innerHTML: 'l' },
          });
          fireEvent.keyUp(inputQuery, { key: 'l' });
        });

        expect(forceSelect).toHaveBeenCalledTimes(1);
      });
    });

    describe('when forceSelect returns a item', () => {
      it('should insert the item', async () => {
        const forceSelect = jest.fn().mockReturnValue(items[1]);
        const { triggerHandler } = await createTriggerHandlerFromItems(items, {
          forceSelect,
        });

        const { getByRole } = renderWrapperTypeAhead({
          triggerHandler,
          editorView,
          anchorElement: container!,
        });

        const inputQuery = getByRole('combobox');
        act(() => {
          // There is no way to test a true contenteditable event with jsdom
          // so we are faking it
          fireEvent.change(inputQuery, {
            target: { innerHTML: 'l' },
          });
          fireEvent.keyUp(inputQuery, { key: 'l' });
        });

        expect(editorView.state).toEqualDocumentAndSelection(
          doc(p('Hello Mars{<>}')),
        );
      });
    });
  });

  describe('when an undo/redo operation happens after the insert item', () => {
    beforeEach(async () => {
      const {
        triggerHandler,
        resolvedItems,
      } = await createTriggerHandlerFromItems(items);

      const { getByRole } = renderWrapperTypeAhead({
        triggerHandler,
        editorView,
        anchorElement: container!,
      });

      await resolvedItems;

      const inputQuery = getByRole('combobox');
      act(() => {
        // There is no way to test a true contenteditable event with jsdom
        // so we are faking it
        fireEvent.change(inputQuery, {
          target: { innerHTML: 'Ea' },
        });
        fireEvent.keyUp(inputQuery, { key: 'Ea' });
      });

      act(() => {
        fireKeyDown(inputQuery, ['ArrowDown', 'Enter']);
      });
    });

    describe('on undo', () => {
      it('should delete the content to add the typeahead back', async () => {
        undo(editorView.state, editorView.dispatch);
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(p('Hello {<>}')),
        );
      });
    });

    describe('on redo', () => {
      it('should back the inserted item', async () => {
        undo(editorView.state, editorView.dispatch);
        redo(editorView.state, editorView.dispatch);
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(p('Hello Earth{<>}')),
        );
      });
    });
  });

  describe('selectedIndex and arrow navigation', () => {
    let inputQuery: HTMLElement;
    beforeEach(async () => {
      const {
        triggerHandler,
        resolvedItems,
      } = await createTriggerHandlerFromItems(items);

      const { getByRole } = renderWrapperTypeAhead({
        triggerHandler,
        editorView,
        anchorElement: container!,
      });

      await resolvedItems;

      inputQuery = getByRole('combobox');
      act(() => {
        inputQuery.click();
      });
    });

    describe('when the component is mounted for the first time', () => {
      it('should set the selectedIndex to -1', async () => {
        const pluginState = getPluginState(editorView.state);
        expect(pluginState.selectedIndex).toBe(-1);
      });
    });

    describe('when arrow up is pressed at the index  -1', () => {
      it('should set the selectedIndex to the last item', async () => {
        fireKeyDown(inputQuery, ['ArrowUp']);

        const pluginState = getPluginState(editorView.state);
        expect(pluginState.selectedIndex).toBe(-1);
      });
    });

    describe('when arrow down is pressed at the last item', () => {
      it('should set the selectedIndex to the first item', async () => {
        fireKeyDown(inputQuery, ['ArrowDown', 'ArrowDown', 'ArrowDown']);

        const pluginState = getPluginState(editorView.state);
        expect(pluginState.selectedIndex).toBe(0);
      });
    });

    describe('when multiple keys happens', () => {
      it('Up and Down should change the selected index in the plugin state', async () => {
        fireKeyDown(inputQuery, ['ArrowDown', 'ArrowDown', 'ArrowUp']);

        const pluginState = getPluginState(editorView.state);
        expect(pluginState.selectedIndex).toBe(0);
      });
    });
  });

  describe('editor focus', () => {
    let inputQuery: HTMLElement;
    let editorViewFocusSpy: jest.SpyInstance;
    beforeEach(async () => {
      const {
        triggerHandler,
        resolvedItems,
      } = await createTriggerHandlerFromItems(items);

      const { getByRole } = renderWrapperTypeAhead({
        triggerHandler,
        editorView,
        anchorElement: container!,
      });

      editorViewFocusSpy = jest.spyOn(editorView, 'focus');

      await resolvedItems;

      inputQuery = getByRole('combobox');
      act(() => {
        inputQuery.click();
      });
    });

    describe.each<string>(['Backspace', ' ', 'Escape'])(
      'when %s is press',
      (keyToPress) => {
        it('should call the editorView.focus function', async () => {
          fireKeyDown(inputQuery, [keyToPress]);

          expect(editorViewFocusSpy).toHaveBeenCalled();
        });
      },
    );

    describe('when the input lost focus', () => {
      it('should not call the editorView.focus function', async () => {
        fireEvent.blur(inputQuery);

        expect(editorViewFocusSpy).not.toHaveBeenCalled();
      });
    });
  });
});
