import React from 'react';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import { EditorView, DecorationSet } from 'prosemirror-view';
import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import type { TypeAheadItem } from '@atlaskit/editor-common/provider-factory';
import { render, act, cleanup } from '@testing-library/react';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../../../../analytics';
import { TypeAheadPopup } from '../../../ui/TypeAheadPopup';
import type { TypeAheadHandler } from '../../../types';

let container: HTMLElement | null;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});
afterEach(() => {
  document.body.removeChild(container!);
  container = null;
  cleanup();
});

describe('TypeAheadPopup', () => {
  const editor = (doc: DocBuilder) => {
    const createEditor = createProsemirrorEditorFactory();
    const preset = new Preset<LightEditorPlugin>();

    return createEditor({
      doc,
      preset,
    });
  };
  const EMPTY_LIST: never[] = [];
  const fireAnalyticsCallback = jest.fn();
  const setSelectedItem = jest.fn();
  const onItemInsert = jest.fn();
  const triggerHandler: TypeAheadHandler = {
    id: TypeAheadAvailableNodes.QUICK_INSERT,
    trigger: '/',
    getItems() {
      return Promise.resolve(EMPTY_LIST);
    },
    selectItem: (state, item, insert) => {
      return item.action(insert, state);
    },
  };

  let editorView: EditorView;
  beforeEach(() => {
    fireAnalyticsCallback.mockClear();
    setSelectedItem.mockClear();
    onItemInsert.mockClear();
    ({ editorView } = editor(doc(p('Hello {<>}'))));
  });

  type Props = Partial<React.ComponentProps<typeof TypeAheadPopup>>;
  const renderPopup = ({ isEmptyQuery, selectedIndex, items }: Props) => {
    return render(
      <TypeAheadPopup
        triggerHandler={triggerHandler}
        editorView={editorView}
        fireAnalyticsCallback={fireAnalyticsCallback}
        items={items || EMPTY_LIST}
        selectedIndex={selectedIndex || 0}
        setSelectedItem={setSelectedItem}
        decorationSet={DecorationSet.empty}
        isEmptyQuery={Boolean(isEmptyQuery)}
        onItemInsert={onItemInsert}
      />,
    );
  };

  describe('when it renders', () => {
    it('should fire the RENDERED analytics event', () => {
      const isEmptyQuery = true;
      const items: TypeAheadItem[] = [{ title: 'lol1' }];
      renderPopup({ isEmptyQuery, items });

      expect(fireAnalyticsCallback).toHaveBeenCalledWith({
        payload: {
          action: ACTION.RENDERED,
          actionSubject: ACTION_SUBJECT.TYPEAHEAD,
          eventType: EVENT_TYPE.OPERATIONAL,
          attributes: {
            time: expect.any(Number),
            items: items.length,
            initial: isEmptyQuery,
          },
        },
      });
    });

    it('should fire the VIEWED analytics event', () => {
      const isEmptyQuery = true;
      const items: TypeAheadItem[] = [{ title: 'lol1' }];
      renderPopup({ isEmptyQuery, items });

      expect(fireAnalyticsCallback).toHaveBeenCalledWith({
        payload: {
          action: ACTION.VIEWED,
          actionSubject: ACTION_SUBJECT.TYPEAHEAD_ITEM,
          eventType: EVENT_TYPE.OPERATIONAL,
          attributes: {
            items: items.length,
            index: 0,
          },
        },
      });
    });

    describe('when its re-renders', () => {
      describe('and when the triggerHandler changes', () => {
        it('should fire analytics events again', () => {
          const isEmptyQuery = true;
          const items: TypeAheadItem[] = [{ title: 'lol1' }, { title: 'lol2' }];
          const { rerender } = renderPopup({ isEmptyQuery, items });

          fireAnalyticsCallback.mockClear();

          const nextTriggerHandler: TypeAheadHandler = {
            id: TypeAheadAvailableNodes.QUICK_INSERT,
            trigger: 'X',
            getItems() {
              return Promise.resolve(EMPTY_LIST);
            },
            selectItem: (state, item, insert) => {
              return item.action(insert, state);
            },
          };
          act(() => {
            rerender(
              <TypeAheadPopup
                triggerHandler={nextTriggerHandler}
                editorView={editorView}
                fireAnalyticsCallback={fireAnalyticsCallback}
                items={items}
                selectedIndex={0}
                setSelectedItem={setSelectedItem}
                decorationSet={DecorationSet.empty}
                isEmptyQuery={isEmptyQuery}
                onItemInsert={onItemInsert}
              />,
            );
          });
          expect(fireAnalyticsCallback).toHaveBeenCalledTimes(2);
        });
      });

      describe('and when the selectIndex changes', () => {
        it('should fire the VIEWED analytics event', () => {
          const isEmptyQuery = true;
          const items: TypeAheadItem[] = [{ title: 'lol1' }, { title: 'lol2' }];
          const { rerender } = renderPopup({ isEmptyQuery, items });

          fireAnalyticsCallback.mockClear();

          const selectedIndex = 1;
          act(() => {
            rerender(
              <TypeAheadPopup
                triggerHandler={triggerHandler}
                editorView={editorView}
                fireAnalyticsCallback={fireAnalyticsCallback}
                items={items}
                selectedIndex={selectedIndex}
                setSelectedItem={setSelectedItem}
                decorationSet={DecorationSet.empty}
                isEmptyQuery={isEmptyQuery}
                onItemInsert={onItemInsert}
              />,
            );
          });
          expect(fireAnalyticsCallback).toHaveBeenCalledWith({
            payload: {
              action: ACTION.VIEWED,
              actionSubject: ACTION_SUBJECT.TYPEAHEAD_ITEM,
              eventType: EVENT_TYPE.OPERATIONAL,
              attributes: {
                items: items.length,
                index: selectedIndex,
              },
            },
          });
        });
      });

      it('should not fire the any analytics event', () => {
        const items: TypeAheadItem[] = [{ title: 'lol1' }];
        const isEmptyQuery = true;
        const { rerender } = renderPopup({ isEmptyQuery, items });

        fireAnalyticsCallback.mockClear();

        act(() => {
          rerender(
            <TypeAheadPopup
              triggerHandler={triggerHandler}
              editorView={editorView}
              fireAnalyticsCallback={fireAnalyticsCallback}
              items={items}
              selectedIndex={0}
              setSelectedItem={setSelectedItem}
              decorationSet={DecorationSet.empty}
              isEmptyQuery={isEmptyQuery}
              onItemInsert={onItemInsert}
            />,
          );
        });

        expect(fireAnalyticsCallback).not.toHaveBeenCalled();
      });
    });
  });
});
