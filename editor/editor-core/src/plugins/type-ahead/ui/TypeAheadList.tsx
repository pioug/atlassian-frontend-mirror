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

import type { TypeAheadItem, OnSelectItem } from '../types';
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
import { WrappedComponentProps, injectIntl } from 'react-intl-next';
import { typeAheadListMessages } from '../messages';

const LIST_ITEM_ESTIMATED_HEIGHT = ICON_HEIGHT + ITEM_PADDING * 2;
const LIST_WIDTH = 320;

type TypeAheadListProps = {
  items: Array<TypeAheadItem>;
  selectedIndex: number;
  onItemHover: OnSelectItem;
  onItemClick: (mode: SelectItemMode, index: number) => void;
  fitHeight: number;
} & WrappedComponentProps;

const TypeAheadListComponent = React.memo(
  ({
    items,
    selectedIndex,
    onItemHover,
    onItemClick,
    intl,
    fitHeight,
  }: TypeAheadListProps) => {
    const listRef = useRef<List>() as React.MutableRefObject<List>;
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

    const actions = useMemo(() => ({ onItemClick, onItemHover }), [
      onItemClick,
      onItemHover,
    ]);

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
            const { current: indexes } = lastVisibleIndexes;
            const isSelectedItemVisible =
              selectedIndex >= indexes.startIndex &&
              selectedIndex <= indexes.stopIndex;

            if (!isSelectedItemVisible) {
              listRef.current.scrollToRow(selectedIndex);
            }
          });
        });
      },
      [selectedIndex, lastVisibleIndexes],
    );

    useLayoutEffect(() => {
      if (!listRef.current) {
        return;
      }
      const { current: indexes } = lastVisibleIndexes;
      const isSelectedItemVisible =
        selectedIndex >= indexes.startIndex &&
        selectedIndex <= indexes.stopIndex;

      if (!isSelectedItemVisible) {
        listRef.current.scrollToRow(selectedIndex);
      }
    }, [selectedIndex, lastVisibleIndexes]);

    useLayoutEffect(() => {
      setCache(
        new CellMeasurerCache({
          fixedWidth: true,
          defaultHeight: LIST_ITEM_ESTIMATED_HEIGHT,
        }),
      );
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

    const renderRow = ({ index, key, style, parent }: any) => {
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
                item={items[index]}
                itemIndex={index}
                selectedIndex={selectedIndex}
                onItemClick={actions.onItemClick}
                onItemHover={actions.onItemHover}
              />
            </div>
          </div>
        </CellMeasurer>
      );
    };

    if (!Array.isArray(items)) {
      return null;
    }

    return (
      <MenuGroup
        role="listbox"
        aria-live="polite"
        aria-label={intl.formatMessage(
          typeAheadListMessages.typeAheadResultLabel,
        )}
        aria-relevant="additions removals"
      >
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
          css={css`
            button {
              padding: 12px 12px 11px;
              span:last-child span:last-child {
                white-space: normal;
              }
            }
          `}
        />
      </MenuGroup>
    );
  },
);

export const TypeAheadList = injectIntl(TypeAheadListComponent);

TypeAheadList.displayName = 'TypeAheadList';
