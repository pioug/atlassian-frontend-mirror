/** @jsx jsx */
import React, {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { css, jsx } from '@emotion/react';
import { AutoSizer, Size } from 'react-virtualized/dist/commonjs/AutoSizer';
import { Collection } from 'react-virtualized/dist/commonjs/Collection';
import { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import { ButtonItem } from '@atlaskit/menu';
import { B100, N200 } from '@atlaskit/theme/colors';
import Tooltip from '@atlaskit/tooltip';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

import {
  withAnalyticsContext,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  fireAnalyticsEvent,
} from '@atlaskit/editor-common/analytics';

import IconFallback from '../../../../plugins/quick-insert/assets/fallback';
import { itemIcon } from '../../../../plugins/type-ahead/ui/TypeAheadListItem';
import { shortcutStyle } from '../../../styles';
import { ELEMENT_LIST_PADDING, SCROLLBAR_WIDTH } from '../../constants';
import useContainerWidth from '../../hooks/use-container-width';
import useFocus from '../../hooks/use-focus';
import { Modes, SelectedItemProps } from '../../types';
import { EmptyStateHandler } from '../../../../types/empty-state-handler';
import cellSizeAndPositionGetter from './cellSizeAndPositionGetter';
import EmptyState from './EmptyState';
import { getColumnCount, getScrollbarWidth } from './utils';

export interface Props {
  items: QuickInsertItem[];
  mode: keyof typeof Modes;
  onInsertItem: (item: QuickInsertItem) => void;
  setColumnCount: (columnCount: number) => void;
  setFocusedItemIndex: (index: number) => void;
  emptyStateHandler?: EmptyStateHandler;
  selectedCategory?: string;
  searchTerm?: string;
}

function ElementList({
  items,
  mode,
  selectedItemIndex,
  focusedItemIndex,
  setColumnCount,
  createAnalyticsEvent,
  emptyStateHandler,
  selectedCategory,
  searchTerm,
  ...props
}: Props & SelectedItemProps & WithAnalyticsEventsProps) {
  const { containerWidth, ContainerWidthMonitor } = useContainerWidth();
  const [scrollbarWidth, setScrollbarWidth] = useState(SCROLLBAR_WIDTH);

  const fullMode = mode === Modes.full;

  useEffect(() => {
    /**
     * More of an optimization condition.
     * Initially the containerWidths are reported 0 twice.
     **/
    if (fullMode && containerWidth > 0) {
      setColumnCount(getColumnCount(containerWidth));
      const updatedScrollbarWidth = getScrollbarWidth();

      if (updatedScrollbarWidth > 0) {
        setScrollbarWidth(updatedScrollbarWidth);
      }
    }
  }, [fullMode, containerWidth, setColumnCount, scrollbarWidth]);

  const onExternalLinkClick = useCallback(() => {
    fireAnalyticsEvent(createAnalyticsEvent)({
      payload: {
        action: ACTION.VISITED,
        actionSubject: ACTION_SUBJECT.SMART_LINK,
        eventType: EVENT_TYPE.TRACK,
      },
    });
  }, [createAnalyticsEvent]);

  const cellRenderer = useMemo(
    () =>
      ({
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
          <div
            style={style}
            key={key}
            className="element-item-wrapper"
            css={elementItemWrapper}
          >
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
    <Fragment>
      <ContainerWidthMonitor />
      {!items.length ? (
        emptyStateHandler ? (
          emptyStateHandler({
            mode,
            selectedCategory,
            searchTerm,
          })
        ) : (
          <EmptyState onExternalLinkClick={onExternalLinkClick} />
        )
      ) : (
        <div css={elementItemsWrapper} data-testid="element-items">
          <Fragment>
            {containerWidth > 0 && (
              <AutoSizer disableWidth>
                {({ height }: Size) => (
                  <Collection
                    cellCount={items.length}
                    cellRenderer={cellRenderer}
                    cellSizeAndPositionGetter={cellSizeAndPositionGetter(
                      containerWidth - ELEMENT_LIST_PADDING * 2,
                      scrollbarWidth,
                    )}
                    height={height}
                    width={containerWidth - ELEMENT_LIST_PADDING * 2} // containerWidth - padding on Left/Right (for focus outline)
                    /**
                     * Refresh Collection on WidthObserver value change.
                     * Length of the items used to force re-render to solve Firefox bug with react-virtualized retaining
                     * scroll position after updating the data. If new data has different number of cells, a re-render
                     * is forced to prevent the scroll position render bug.
                     */
                    key={containerWidth + items.length}
                    scrollToCell={selectedItemIndex}
                  />
                )}
              </AutoSizer>
            )}
          </Fragment>
        </div>
      )}
    </Fragment>
  );
}

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

export function ElementItem({
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
    (
      e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>,
    ) => {
      e.preventDefault();
      e.stopPropagation();
      setFocusedItemIndex(index);

      switch (e.nativeEvent.detail) {
        case 0:
          onInsertItem(item);
          break;
        case 1:
          if (inlineMode) {
            onInsertItem(item);
          }
          break;
        case 2:
          if (!inlineMode) {
            onInsertItem(item);
          }
          break;
        default:
          return;
      }
    },
    [index, inlineMode, item, onInsertItem, setFocusedItemIndex],
  );

  const { icon, title, description, keyshortcut } = item;
  return (
    <Tooltip content={description} testId={`element-item-tooltip-${index}`}>
      <ButtonItem
        onClick={onClick}
        iconBefore={<ElementBefore icon={icon} title={title} />}
        isSelected={selected}
        aria-describedby={title}
        ref={ref}
        testId={`element-item-${index}`}
      >
        <ItemContent
          style={inlineMode ? null : itemStyleOverrides}
          tabIndex={0}
          title={title}
          description={description}
          keyshortcut={keyshortcut}
        />
      </ButtonItem>
    </Tooltip>
  );
}

/**
 * Inline mode should use the existing Align-items:center value.
 */
const itemStyleOverrides = {
  alignItems: 'flex-start',
};

const ElementBefore = memo(({ icon, title }: Partial<QuickInsertItem>) => (
  <div css={[itemIcon, itemIconStyle]}>{icon ? icon() : <IconFallback />}</div>
));

const ItemContent = memo(
  ({ title, description, keyshortcut }: Partial<QuickInsertItem>) => (
    <div css={itemBody} className="item-body">
      <div css={itemText}>
        <div css={itemTitleWrapper}>
          <p css={itemTitle}>{title}</p>
          <div css={itemAfter}>
            {keyshortcut && <div css={shortcutStyle}>{keyshortcut}</div>}
          </div>
        </div>
        {description && <p css={itemDescription}>{description}</p>}
      </div>
    </div>
  ),
);

const elementItemsWrapper = css`
  flex: 1;
  flex-flow: row wrap;
  align-items: flex-start;
  justify-content: flex-start;
  overflow: hidden;
  padding: ${ELEMENT_LIST_PADDING}px; // For Focus outline

  .ReactVirtualized__Collection {
    border-radius: 3px; // Standard border-radius across other components like Search or Item.
    outline: none;

    :focus {
      box-shadow: 0 0 0 ${ELEMENT_LIST_PADDING}px
        ${token('color.border.focused', B100)};
    }
  }
  .ReactVirtualized__Collection__innerScrollContainer {
    div[class='element-item-wrapper']:last-child {
      padding-bottom: 4px;
    }
  }
`;

const elementItemWrapper = css`
  div {
    button {
      height: 75px;
      align-items: flex-start;
      padding: 12px 12px 11px;
    }
  }
`;

const itemBody = css`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  line-height: 1.4;
  width: 100%;

  margin-top: -2px; // Fixes the Item Icon and text's alignment issue
`;

/*
 * -webkit-line-clamp is also supported by firefox 🎉
 * https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/68#CSS
 */
const multilineStyle = css`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const itemDescription = css`
  ${multilineStyle};

  overflow: hidden;
  font-size: ${relativeFontSizeToBase16(11.67)};
  color: ${token('color.text.subtle', N200)};
  margin-top: 2px;
`;

const itemText = css`
  width: inherit;
  white-space: initial;
`;

const itemTitleWrapper = css`
  display: flex;
  justify-content: space-between; // Title and keyboardshortcut are rendered in the same block
`;

const itemTitle = css`
  width: 100%;
  overflow: hidden;

  white-space: nowrap;
  text-overflow: ellipsis;
`;

const itemAfter = css`
  flex: 0 0 auto;
`;

const itemIconStyle = css`
  img {
    height: 40px;
    width: 40px;
    object-fit: cover;
  }
`;

const MemoizedElementListWithAnalytics = memo(
  withAnalyticsContext({ component: 'ElementList' })(ElementList),
);

export default MemoizedElementListWithAnalytics;
