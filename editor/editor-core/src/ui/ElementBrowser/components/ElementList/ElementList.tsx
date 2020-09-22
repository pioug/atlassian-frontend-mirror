import React, { memo, useCallback, useEffect, useMemo } from 'react';
import memoizeOne from 'memoize-one';
import styled, { ThemeProvider, css } from 'styled-components';
import { AutoSizer, Size } from 'react-virtualized/dist/commonjs/AutoSizer';
import { Collection } from 'react-virtualized/dist/commonjs/Collection';
import { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import Item from '@atlaskit/item';
import { N20, N200 } from '@atlaskit/theme/colors';
import Tooltip from '@atlaskit/tooltip';

import {
  withAnalyticsContext,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  fireAnalyticsEvent,
} from '../../../../plugins/analytics';

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
import cellSizeAndPositionGetter from './cellSizeAndPositionGetter';
import EmptyState from './EmptyState';
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
  createAnalyticsEvent,
  ...props
}: Props & SelectedItemProps & WithAnalyticsEventsProps) {
  const { containerWidth, ContainerWidthMonitor } = useContainerWidth();

  const fullMode = mode === Modes.full;

  useEffect(() => {
    /**
     * More of an optimization condition.
     * Initially the containerWidths are reported 0 twice.
     **/
    if (fullMode && containerWidth > 0) {
      setColumnCount(getColumnCount(containerWidth));
    }
    removeCollectionTabIndex();
  }, [fullMode, containerWidth, setColumnCount]);

  const onExternalLinkClick = useCallback(() => {
    fireAnalyticsEvent(createAnalyticsEvent)({
      payload: {
        action: ACTION.VISITED,
        actionSubject: ACTION_SUBJECT.SMART_LINK,
        eventType: EVENT_TYPE.TRACK,
      },
    });
  }, [createAnalyticsEvent]);

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
        <div style={style} key={key} className="element-item-wrapper">
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
        <EmptyState onExternalLinkClick={onExternalLinkClick} />
      ) : (
        <ElementItemsWrapper tabIndex={-1} data-testid="ElementItems">
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
                      key={containerWidth} // Refresh Collection on WidthObserver value change.
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
    selected: {
      background: N20,
    },
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
      data-testid={`element-item-${index}`}
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

  .ReactVirtualized__Collection {
    ${scrollbarStyle};
  }
  .ReactVirtualized__Collection__innerScrollContainer {
    div[class='element-item-wrapper']:last-child {
      padding-bottom: 4px;
    }
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

/**
 *
 * Internally, the Collection component has a tabIndex of 0 and we don't wanna focus on the entire Collection area,
 * so manually removing it until the below PR has been approved/merged.
 * https://product-fabric.atlassian.net/browse/ED-9919
 * https://github.com/bvaughn/react-virtualized/pull/1555
 */
const removeCollectionTabIndex = () => {
  const element = document.getElementsByClassName(
    'ReactVirtualized__Collection',
  )[0] as HTMLElement;
  if (element && element.tabIndex !== -1) {
    element.tabIndex = -1;
  }
};

const MemoizedElementListWithAnalytics = memo(
  withAnalyticsContext({ component: 'ElementList' })(ElementList),
);

export default MemoizedElementListWithAnalytics;
