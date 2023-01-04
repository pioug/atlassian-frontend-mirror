/** @jsx jsx */
import React, {
  useMemo,
  useRef,
  useCallback,
  useLayoutEffect,
  useState,
} from 'react';
import { jsx, css } from '@emotion/react';

import { MenuGroup } from '@atlaskit/menu';
import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import {
  CellMeasurer,
  CellMeasurerCache,
} from 'react-virtualized/dist/commonjs/CellMeasurer';
import { List } from 'react-virtualized/dist/commonjs/List';

import {
  ICON_HEIGHT,
  ITEM_PADDING,
  TypeAheadListItem,
} from './TypeAheadListItem';
import { WrappedComponentProps, injectIntl, useIntl } from 'react-intl-next';
import { typeAheadListMessages } from '../messages';
import type { TypeAheadHandler, TypeAheadItem } from '../types';
import { getTypeAheadListAriaLabels, moveSelectedIndex } from '../utils';
import { updateSelectedIndex } from '../commands/update-selected-index';
import { EditorView } from 'prosemirror-view';
import { AssistiveText } from './AssistiveText';
import { TYPE_AHEAD_DECORATION_ELEMENT_ID } from '../constants';

const LIST_ITEM_ESTIMATED_HEIGHT = ICON_HEIGHT + ITEM_PADDING * 2;
const LIST_WIDTH = 320;

type TypeAheadListProps = {
  items: Array<TypeAheadItem>;
  selectedIndex: number;
  editorView: EditorView;
  onItemClick: (mode: SelectItemMode, index: number) => void;
  fitHeight: number;
  decorationElement: HTMLElement;
  triggerHandler?: TypeAheadHandler;
} & WrappedComponentProps;

const TypeaheadAssistiveTextPureComponent = React.memo(
  ({ numberOfResults }: { numberOfResults: string }) => {
    const intl = useIntl();
    return (
      <AssistiveText
        assistiveText={intl.formatMessage(
          typeAheadListMessages.searchResultsLabel,
          { itemsLength: numberOfResults },
        )}
        // when the popup is open its always in focus
        isInFocus={true}
        id={TYPE_AHEAD_DECORATION_ELEMENT_ID + '__popup'}
      />
    );
  },
);

const TypeAheadListComponent = React.memo(
  ({
    items,
    selectedIndex,
    editorView,
    onItemClick,
    intl,
    fitHeight,
    decorationElement,
    triggerHandler,
  }: TypeAheadListProps) => {
    const listRef = useRef<List>() as React.MutableRefObject<List>;
    const listContainerRef = useRef<HTMLDivElement>(null);
    const lastVisibleIndexes = useRef({
      overscanStartIndex: 0,
      overscanStopIndex: 0,
      startIndex: 0,
      stopIndex: 0,
    });

    const estimatedHeight = items.length * LIST_ITEM_ESTIMATED_HEIGHT;

    const [height, setHeight] = useState(Math.min(estimatedHeight, fitHeight));

    const [cache, setCache] = useState(
      new CellMeasurerCache({
        fixedWidth: true,
        defaultHeight: LIST_ITEM_ESTIMATED_HEIGHT,
      }),
    );

    const onItemsRendered = useCallback((props) => {
      lastVisibleIndexes.current = props;
    }, []);

    const actions = useMemo(() => ({ onItemClick }), [onItemClick]);

    const isNavigationKey = (event: KeyboardEvent): boolean => {
      return ['ArrowDown', 'ArrowUp', 'Tab', 'Enter'].includes(event.key);
    };

    const focusTargetElement = useCallback(() => {
      //To reset the selected index
      updateSelectedIndex(-1)(editorView.state, editorView.dispatch);
      listRef.current.scrollToRow(0);
      decorationElement
        ?.querySelector<HTMLSpanElement>(`[role='combobox']`)
        ?.focus();
    }, [editorView, listRef, decorationElement]);

    const selectNextItem = useMemo(
      () =>
        moveSelectedIndex({
          editorView,
          direction: 'next',
        }),
      [editorView],
    );

    const selectPreviousItem = useMemo(
      () =>
        moveSelectedIndex({
          editorView,
          direction: 'previous',
        }),
      [editorView],
    );

    const lastVisibleStartIndex = lastVisibleIndexes.current.startIndex;
    const lastVisibleStopIndex = lastVisibleIndexes.current.stopIndex;
    const onScroll = useCallback(
      ({ scrollUpdateWasRequested }) => {
        if (!scrollUpdateWasRequested) {
          return;
        }

        // In case the user scroll to a non-visible item like press ArrowUp from the first index
        // We will force the scroll calling the scrollToItem in the useEffect hook
        // When the scroll happens and we render the elements,
        // we still need calculate the items height and re-draw the List.
        // It is possible the item selected became invisible again (because the items height changed)
        // So, we need to wait for height to be calculated. Then we need to check
        // if the selected item is visible or not. If it isn't visible we call the scrollToItem again.
        //
        // We can't do this check in the first frame because that frame is being used by the resetScreenThrottled
        // to calculate each height. THen, we can schedule a new frame when this one finishs.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const isSelectedItemVisible =
              selectedIndex >= lastVisibleStartIndex &&
              selectedIndex <= lastVisibleStopIndex;

            //Should scroll to the list item only when the selectedIndex >= 0 and item is not visible
            if (!isSelectedItemVisible && selectedIndex !== -1) {
              listRef.current.scrollToRow(selectedIndex);
            } else if (selectedIndex === -1) {
              listRef.current.scrollToRow(0);
            }
          });
        });
      },
      [selectedIndex, lastVisibleStartIndex, lastVisibleStopIndex],
    );

    useLayoutEffect(() => {
      if (!listRef.current) {
        return;
      }
      const isSelectedItemVisible =
        selectedIndex >= lastVisibleStartIndex &&
        selectedIndex <= lastVisibleStopIndex;

      //Should scroll to the list item only when the selectedIndex >= 0 and item is not visible
      if (!isSelectedItemVisible && selectedIndex !== -1) {
        listRef.current.scrollToRow(selectedIndex);
      } else if (selectedIndex === -1) {
        listRef.current.scrollToRow(0);
      }
    }, [selectedIndex, lastVisibleStartIndex, lastVisibleStopIndex]);

    useLayoutEffect(() => {
      setCache(
        new CellMeasurerCache({
          fixedWidth: true,
          defaultHeight: LIST_ITEM_ESTIMATED_HEIGHT,
        }),
      );
      // When query is updated, sometimes the scroll position of the menu is not at the top
      // Scrolling back to top for consistency
      requestAnimationFrame(() => {
        if (listContainerRef.current?.firstChild) {
          (listContainerRef.current.firstChild as HTMLElement).scrollTo(0, 0);
        }
      });
    }, [items]);

    useLayoutEffect(() => {
      const height = Math.min(
        items.reduce((prevValue, currentValue, index) => {
          return prevValue + cache.rowHeight({ index: index });
        }, 0),
        fitHeight,
      );
      setHeight(height);
    }, [items, cache, fitHeight]);

    useLayoutEffect(() => {
      if (!listContainerRef.current) {
        return;
      }
      const { current: element } = listContainerRef;
      /**
       * To handle the key events on the list
       * @param event
       */
      const handleKeyDown = (event: KeyboardEvent): void => {
        if (isNavigationKey(event)) {
          switch (event.key) {
            case 'ArrowDown':
              selectNextItem();
              event.preventDefault();
              break;

            case 'ArrowUp':
              selectPreviousItem();
              event.preventDefault();
              break;

            case 'Tab':
              //Tab key quick inserts the selected item.
              onItemClick(SelectItemMode.TAB, selectedIndex);
              event.preventDefault();
              break;

            case 'Enter':
              //Enter key quick inserts the selected item.
              if (
                !event.isComposing ||
                (event.which !== 229 && event.keyCode !== 229)
              ) {
                onItemClick(
                  event.shiftKey
                    ? SelectItemMode.SHIFT_ENTER
                    : SelectItemMode.ENTER,
                  selectedIndex,
                );
                event.preventDefault();
              }
              break;

            default:
              event.preventDefault();
          }
        } else {
          //All the remaining keys sets focus on the typeahead query(inputQuery.tsx))
          focusTargetElement();
        }
      };
      element?.addEventListener('keydown', handleKeyDown);
      return () => {
        element?.removeEventListener('keydown', handleKeyDown);
      };
    }, [
      editorView.state,
      focusTargetElement,
      selectNextItem,
      selectPreviousItem,
      selectedIndex,
      onItemClick,
      items.length,
    ]);

    const renderRow = ({ index, key, style, parent }: any) => {
      const currentItem = items[index];
      return (
        <CellMeasurer
          key={key}
          cache={cache}
          parent={parent}
          columnIndex={0}
          rowIndex={index}
        >
          <div style={style} data-index={index}>
            <div data-testid={`list-item-height-observed-${index}`}>
              <TypeAheadListItem
                key={items[index].title}
                item={currentItem}
                itemsLength={items.length}
                itemIndex={index}
                selectedIndex={selectedIndex}
                onItemClick={actions.onItemClick}
                ariaLabel={
                  getTypeAheadListAriaLabels(
                    triggerHandler?.trigger,
                    intl,
                    currentItem,
                  ).listItemAriaLabel
                }
              />
            </div>
          </div>
        </CellMeasurer>
      );
    };

    const popupAriaLabel = getTypeAheadListAriaLabels(
      triggerHandler?.trigger,
      intl,
    ).popupAriaLabel;

    if (!Array.isArray(items)) {
      return null;
    }

    const menuGroupId =
      decorationElement
        .querySelector<HTMLInputElement>(`[role='combobox']`)
        ?.getAttribute('aria-controls') || TYPE_AHEAD_DECORATION_ELEMENT_ID;

    return (
      <MenuGroup aria-label={popupAriaLabel} aria-relevant="additions removals">
        <div id={menuGroupId} ref={listContainerRef}>
          <List
            rowRenderer={renderRow}
            ref={listRef}
            rowCount={items.length}
            rowHeight={cache.rowHeight}
            onRowsRendered={onItemsRendered}
            width={LIST_WIDTH}
            onScroll={onScroll}
            height={height}
            overscanRowCount={3}
            containerRole="presentation"
            role="listbox"
            css={css`
              button {
                padding: 12px 12px 11px;
                span:last-child span:last-child {
                  white-space: normal;
                }
              }
            `}
          />
          <TypeaheadAssistiveTextPureComponent
            numberOfResults={items.length.toString()}
          />
        </div>
      </MenuGroup>
    );
  },
);

export const TypeAheadList = injectIntl(TypeAheadListComponent);

TypeAheadList.displayName = 'TypeAheadList';
