import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import memoizeOne from 'memoize-one';
import { FormattedMessage } from 'react-intl';
import styled, { css, ThemeProvider } from 'styled-components';
import { AutoSizer, Size } from 'react-virtualized/dist/commonjs/AutoSizer';
import { Collection } from 'react-virtualized/dist/commonjs/Collection';
import { withAnalyticsContext } from '@atlaskit/analytics-next';
import { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import Item from '@atlaskit/item';
import { N200 } from '@atlaskit/theme/colors';
import Tooltip from '@atlaskit/tooltip';
import IconFallback from '../../../../plugins/quick-insert/assets/fallback';
import { ItemIcon } from '../../../../plugins/type-ahead/ui/TypeAheadItemsList';
import { Shortcut } from '../../../styles';
import {
  GRID_SIZE,
  SCROLLBAR_THUMB_COLOR,
  SCROLLBAR_TRACK_COLOR,
  SCROLLBAR_WIDTH,
} from '../../constants';
import useContainerWidth from '../../hooks/use-container-width';
import useFocus from '../../hooks/use-focus';
import { Modes, SelectedItemProps } from '../../types';
import EmptyState from '../EmptyState';
import cellSizeAndPositionGetter from './cellSizeAndPositionGetter';
import { getColumnCount } from './utils';

export interface Props {
  items: QuickInsertItem[];
  mode: keyof typeof Modes;
  onInsertItem: (item: QuickInsertItem) => void;
  setColumnCount: (columnCount: number) => void;
  setFocusedItemIndex: (index: number) => void;
}

function ElementList({
  items,
  mode,
  selectedItemIndex,
  focusedItemIndex,
  setColumnCount,
  ...props
}: Props & SelectedItemProps) {
  const { containerWidth, ContainerWidthMonitor } = useContainerWidth();

  const collectionRef = useRef<null | Collection>(null);

  const recomputeCollection = useCallback(() => {
    const { current } = collectionRef;
    if (current && current.recomputeCellSizesAndPositions) {
      current.recomputeCellSizesAndPositions!();
    }
  }, [collectionRef]);

  const fullMode = mode === Modes.full;

  useEffect(() => {
    /**
     * More of an optimization condition.
     * Initially the containerWidths are reported 0 twice.
     **/
    if (fullMode && containerWidth > 0) {
      setColumnCount(getColumnCount(containerWidth));
      recomputeCollection();
    }
  }, [fullMode, containerWidth, setColumnCount, recomputeCollection]);

  const theme = useMemo(
    () => ({
      '@atlaskit-shared-theme/item': getStyles(mode),
    }),
    [mode],
  );

  const cellRenderer = useMemo(
    () => ({
      index,
      key,
      style,
    }: {
      index: number;
      key: string | number;
      style: object;
    }) => {
      if (items[index] == null) {
        return;
      }

      return (
        <div style={style} key={key}>
          <MemoizedElementItem
            inlineMode={!fullMode}
            index={index}
            item={items[index]}
            selected={selectedItemIndex === index}
            focus={focusedItemIndex === index}
            {...props}
          />
        </div>
      );
    },
    [items, fullMode, selectedItemIndex, focusedItemIndex, props],
  );
  return (
    <>
      <ContainerWidthMonitor />
      {!items.length ? (
        <EmptyStateWrapper>
          <EmptyState />
          <EmptyStateHeading>
            <FormattedMessage
              id="fabric.editor.elementbrowser.search.empty-state.heading"
              defaultMessage="Nothing matches your search"
              description="Empty state heading"
            />
          </EmptyStateHeading>
          <EmptyStateSubHeading>
            <FormattedMessage
              id="fabric.editor.elementbrowser.search.empty-state.sub-heading"
              defaultMessage="Remove any filters, or search for something less specific."
              description="Empty state sub-heading"
            />
          </EmptyStateSubHeading>
        </EmptyStateWrapper>
      ) : (
        <ElementItemsWrapper tabIndex={-1}>
          <ThemeProvider theme={theme}>
            <>
              {containerWidth > 0 && (
                <AutoSizer disableWidth>
                  {({ height }: Size) => (
                    <Collection
                      cellCount={items.length}
                      cellRenderer={cellRenderer}
                      cellSizeAndPositionGetter={cellSizeAndPositionGetter(
                        containerWidth,
                      )}
                      height={height}
                      width={containerWidth}
                      ref={collectionRef}
                      scrollToCell={selectedItemIndex}
                    />
                  )}
                </AutoSizer>
              )}
            </>
          </ThemeProvider>
        </ElementItemsWrapper>
      )}
    </>
  );
}

const getStyles = memoizeOne(mode => {
  return {
    ...(mode === Modes.full && {
      '-ms-flex': 'auto',
      position: 'relative',
      boxSizing: 'border-box',
    }),
    height: {
      default: GRID_SIZE * GRID_SIZE,
    },
    padding: {
      default: {
        top: GRID_SIZE * 1.5,
        right: GRID_SIZE * 1.5,
        bottom: GRID_SIZE * 1.5,
        left: GRID_SIZE * 1.5,
      },
    },
    borderRadius: GRID_SIZE / 2,
    hover: {
      background: 'rgb(244, 245, 247)',
    },
    beforeItemSpacing: {
      default: GRID_SIZE * 1.5,
    },
  };
});

type ElementItemType = {
  inlineMode: boolean;
  item: QuickInsertItem;
  onInsertItem: (item: QuickInsertItem) => void;
  selected: boolean;
  focus: boolean;
  setFocusedItemIndex: (index: number) => void;
  index: number;
};

const MemoizedElementItem = memo(ElementItem);
MemoizedElementItem.displayName = 'MemoizedElementItem';

function ElementItem({
  inlineMode,
  selected,
  item,
  index,
  onInsertItem,
  focus,
  setFocusedItemIndex,
}: ElementItemType) {
  const ref = useFocus(focus);

  /**
   * Note: props.onSelectItem(item) is not called here as the StatelessElementBrowser's
   * useEffect would trigger it on selectedItemIndex change. (Line 106-110)
   * This implementation was changed for keyboard/click selection to work with `onInsertItem`.
   */
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setFocusedItemIndex(index);
      if (inlineMode) {
        onInsertItem(item);
      }
    },
    [index, inlineMode, item, onInsertItem, setFocusedItemIndex],
  );

  const onDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if (inlineMode) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      setFocusedItemIndex(index);
      onInsertItem(item);
    },
    [inlineMode, setFocusedItemIndex, index, onInsertItem, item],
  );

  // After tabbing we wanna select the item on enter/space key press from item level,
  // preventing the default top level component behavior.
  const onKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      const SPACE_KEY = 32;
      const ENTER_KEY = 13;

      if (e.which === ENTER_KEY || e.which === SPACE_KEY) {
        e.preventDefault();
        e.stopPropagation();
        setFocusedItemIndex(index);
        onInsertItem(item);
      }
    },
    [index, item, onInsertItem, setFocusedItemIndex],
  );

  const { icon, title, description, keyshortcut } = item;
  return (
    <Item
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      elemBefore={<ElementBefore icon={icon} title={title} />}
      isSelected={selected}
      aria-describedby={title}
      innerRef={ref}
      onKeyPress={onKeyPress}
    >
      <ItemContent
        title={title}
        description={description}
        keyshortcut={keyshortcut}
      />
    </Item>
  );
}

const ElementBefore = memo(({ icon, title }: Partial<QuickInsertItem>) => (
  <StyledItemIcon>
    {icon ? icon() : <IconFallback label={title} />}
  </StyledItemIcon>
));

const ItemContent = memo(
  ({ title, description, keyshortcut }: Partial<QuickInsertItem>) => (
    <Tooltip content={description}>
      <ItemBody>
        <ItemText>
          <div>{title}</div>
          {description && <ItemDescription>{description}</ItemDescription>}
        </ItemText>
        <ItemAfter>
          {keyshortcut && <Shortcut>{keyshortcut}</Shortcut>}
        </ItemAfter>
      </ItemBody>
    </Tooltip>
  ),
);

const scrollbarStyle = css`
  ::-webkit-scrollbar {
    width: ${SCROLLBAR_WIDTH}px;
  }
  ::-webkit-scrollbar-track-piece {
    background: ${SCROLLBAR_TRACK_COLOR};
  }
  ::-webkit-scrollbar-thumb {
    background: ${SCROLLBAR_THUMB_COLOR};
  }

  /** Firefox **/
  scrollbar-color: ${SCROLLBAR_THUMB_COLOR} ${SCROLLBAR_TRACK_COLOR};

  -ms-overflow-style: -ms-autohiding-scrollbar;
`;

const ElementItemsWrapper = styled.div`
  flex: 1;
  flex-flow: row wrap;
  align-items: flex-start;
  justify-content: flex-start;
  overflow: hidden;

  /**
   * Styling the scrollbar and removing outline from Collection and List components.
   *
   * Internally, the Collection component has a tabIndex of 0 and we don't wanna focus on the entire Collection area,
   * so removing outline for now until the proposed solution has been approved/merged.
   * https://product-fabric.atlassian.net/browse/ED-9919
   * https://github.com/bvaughn/react-virtualized/pull/1555
   */
  .ReactVirtualized__Collection,
  .ReactVirtualized__List {
    user-focus: ignore;
    outline: none;
    ${scrollbarStyle};
  }
`;

const ItemBody = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  line-height: 1.4;
  width: 100%;
`;

const ItemDescription = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 11.67px;
  color: ${N200};
  margin-top: ${GRID_SIZE / 2}px;
`;

const ItemText = styled.div`
  width: inherit;
  white-space: initial;
`;

const ItemAfter = styled.div`
  flex: 0 0 auto;
`;

const StyledItemIcon = styled(ItemIcon)`
  img {
    height: 40px;
    width: 40px;
    object-fit: cover;
  }
`;

const EmptyStateHeading = styled.div`
  font-size: 1.42857em;
  line-height: 1.2;
  color: rgb(23, 43, 77);
  font-weight: 500;
  letter-spacing: -0.008em;
  margin-top: 28px;
`;

const EmptyStateSubHeading = styled.p`
  max-width: 400px;
  text-align: center;
`;

const EmptyStateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const MemoizedElementListWithAnalytics = memo(
  withAnalyticsContext({ component: 'ElementList' })(ElementList),
);

export default MemoizedElementListWithAnalytics;
