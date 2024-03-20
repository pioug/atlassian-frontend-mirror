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
import type { Size } from 'react-virtualized/dist/commonjs/AutoSizer';
import { AutoSizer } from 'react-virtualized/dist/commonjs/AutoSizer';
import { Collection } from 'react-virtualized/dist/commonjs/Collection';

import type { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { withAnalyticsContext } from '@atlaskit/analytics-next';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { shortcutStyle } from '@atlaskit/editor-shared-styles/shortcut';
import { ButtonItem } from '@atlaskit/menu';
import { B100, N200 } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  fireAnalyticsEvent,
} from '../../../analytics';
import type { QuickInsertItem } from '../../../provider-factory';
import { IconFallback } from '../../../quick-insert';
import type { EmptyStateHandler } from '../../../types';
import { ELEMENT_LIST_PADDING, SCROLLBAR_WIDTH } from '../../constants';
import useContainerWidth from '../../hooks/use-container-width';
import useFocus from '../../hooks/use-focus';
import type { SelectedItemProps } from '../../types';
import { Modes } from '../../types';

import cellSizeAndPositionGetter from './cellSizeAndPositionGetter';
import EmptyState from './EmptyState';
import { getColumnCount, getScrollbarWidth } from './utils';

export const ICON_HEIGHT = 40;
export const ICON_WIDTH = 40;

export const itemIcon = css({
  width: `${ICON_WIDTH}px`,
  height: `${ICON_HEIGHT}px`,
  overflow: 'hidden',
  border: `1px solid ${token('color.border', 'rgba(223, 225, 229, 0.5)')}`,
  borderRadius: `${borderRadius()}px`,
  boxSizing: 'border-box',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  div: {
    width: `${ICON_WIDTH}px`,
    height: `${ICON_HEIGHT}px`,
  },
});

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
      <div
        css={elementItemsWrapper}
        data-testid="element-items"
        id={
          selectedCategory
            ? `browse-category-${selectedCategory}-tab`
            : 'browse-category-tab'
        }
        aria-labelledby={
          selectedCategory
            ? `browse-category--${selectedCategory}-button`
            : 'browse-category-button'
        }
        role="tabpanel"
        tabIndex={items.length === 0 ? 0 : undefined}
      >
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
        )}
      </div>
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
        id={`searched-item-${index}`}
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

const elementItemsWrapper = css({
  flex: 1,
  flexFlow: 'row wrap',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  overflow: 'hidden',
  padding: token('space.025', '2px'),
  '.ReactVirtualized__Collection': {
    borderRadius: '3px',
    outline: 'none',
    ':focus': {
      boxShadow: `0 0 0 ${ELEMENT_LIST_PADDING}px ${token(
        'color.border.focused',
        B100,
      )}`,
    },
  },
  '.ReactVirtualized__Collection__innerScrollContainer': {
    "div[class='element-item-wrapper']:last-child": {
      paddingBottom: token('space.050', '4px'),
    },
  },
});

const elementItemWrapper = css({
  div: {
    button: {
      height: '75px',
      alignItems: 'flex-start',
      padding: `${token('space.150', '12px')} ${token(
        'space.150',
        '12px',
      )} 11px`,
    },
  },
});

const itemBody = css({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  justifyContent: 'space-between',
  lineHeight: 1.4,
  width: '100%',
  marginTop: token('space.negative.025', '-2px'),
});

/*
 * -webkit-line-clamp is also supported by firefox 🎉
 * https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/68#CSS
 */
const multilineStyle = css({
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
});

const itemDescription = css(multilineStyle, {
  overflow: 'hidden',
  fontSize: relativeFontSizeToBase16(11.67),
  color: token('color.text.subtle', N200),
  marginTop: token('space.025', '2px'),
});

const itemText = css({
  width: 'inherit',
  whiteSpace: 'initial',
});

const itemTitleWrapper = css({
  display: 'flex',
  justifyContent: 'space-between',
});

const itemTitle = css({
  width: '100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

const itemAfter = css({
  flex: '0 0 auto',
  paddingTop: token('space.025', '2px'),
  marginBottom: token('space.negative.025', '-2px'),
});

const itemIconStyle = css({
  img: {
    height: '40px',
    width: '40px',
    objectFit: 'cover',
  },
});

const MemoizedElementListWithAnalytics = memo(
  withAnalyticsContext({ component: 'ElementList' })(ElementList),
);

export default MemoizedElementListWithAnalytics;
