import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import memoizeOne from 'memoize-one';
import styled, { css, ThemeProvider } from 'styled-components';
import Tooltip from '@atlaskit/tooltip';
import { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import { N200 } from '@atlaskit/theme/colors';
import Item from '@atlaskit/item';
import { withAnalyticsContext } from '@atlaskit/analytics-next';
import { Shortcut } from '../../styles';
import { ItemIcon } from '../../../plugins/type-ahead/ui/TypeAheadItemsList';
import IconFallback from '../../../plugins/quick-insert/assets/fallback';
import {
  GRID_SIZE,
  SCROLLBAR_THUMB_COLOR,
  SCROLLBAR_TRACK_COLOR,
  FLEX_ITEMS_CONTAINER_BREAKPOINT_NUMBERS,
} from '../constants';
import useRefToFocusOrScroll from '../hooks/useRefToFocusOrScroll';
import { Modes, SelectedItemProps } from '../types';
import useContainerWidth from '../hooks/useContainerWidth';
import EmptyState from './EmptyState';

interface Props {
  items: QuickInsertItem[];
  mode: keyof typeof Modes;
  onSelectItem: (item: QuickInsertItem) => void;
  setItemsContainerWidth?: (width: number) => void;
  setFocusedItemIndex: (index: number) => void;
}

function ElementList({
  items,
  mode,
  selectedItemIndex,
  focusedItemIndex,
  setItemsContainerWidth,
  ...props
}: Props & SelectedItemProps) {
  const { containerWidth, ContainerWidthMonitor } = useContainerWidth();

  useEffect(() => {
    if (setItemsContainerWidth) {
      setItemsContainerWidth(containerWidth);
    }
  }, [containerWidth, setItemsContainerWidth]);

  const theme = useMemo(
    () => ({
      '@atlaskit-shared-theme/item': getStyles(mode, containerWidth),
    }),
    [mode, containerWidth],
  );
  return (
    <>
      <ContainerWidthMonitor />
      <ElementItemsWrapper mode={mode} tabIndex={-1}>
        <ThemeProvider theme={theme}>
          <>
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
              items.map<JSX.Element>(
                (item, index): JSX.Element => (
                  <MemoizedElementItem
                    key={`${item.title}-${item.description}`}
                    index={index}
                    item={item}
                    selected={selectedItemIndex === index}
                    focus={focusedItemIndex === index}
                    {...props}
                  />
                ),
              )
            )}
          </>
        </ThemeProvider>
      </ElementItemsWrapper>
    </>
  );
}

const getStyles = memoizeOne((mode, containerWidth) => {
  return {
    ...(mode === Modes.full && {
      width: {
        default: getItemWidthForContainer(containerWidth),
      },
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

const getItemWidthForContainer = (clientWidth?: number) => {
  if (clientWidth == null) {
    return '33%';
  }
  if (clientWidth < FLEX_ITEMS_CONTAINER_BREAKPOINT_NUMBERS.small) {
    return '100%';
  }
  if (
    clientWidth >= FLEX_ITEMS_CONTAINER_BREAKPOINT_NUMBERS.small &&
    clientWidth < FLEX_ITEMS_CONTAINER_BREAKPOINT_NUMBERS.medium
  ) {
    return '50%';
  }
  if (
    clientWidth >= FLEX_ITEMS_CONTAINER_BREAKPOINT_NUMBERS.medium &&
    clientWidth < FLEX_ITEMS_CONTAINER_BREAKPOINT_NUMBERS.large
  ) {
    return '33%';
  }
  if (clientWidth >= FLEX_ITEMS_CONTAINER_BREAKPOINT_NUMBERS.large) {
    return '25%';
  }
};

export const itemStepCounter = (clientWidth: number): number => {
  if (clientWidth < FLEX_ITEMS_CONTAINER_BREAKPOINT_NUMBERS.small) {
    return 1;
  }
  if (
    clientWidth >= FLEX_ITEMS_CONTAINER_BREAKPOINT_NUMBERS.small &&
    clientWidth < FLEX_ITEMS_CONTAINER_BREAKPOINT_NUMBERS.medium
  ) {
    return 2;
  }
  if (
    clientWidth >= FLEX_ITEMS_CONTAINER_BREAKPOINT_NUMBERS.medium &&
    clientWidth < FLEX_ITEMS_CONTAINER_BREAKPOINT_NUMBERS.large
  ) {
    return 3;
  }
  if (clientWidth >= FLEX_ITEMS_CONTAINER_BREAKPOINT_NUMBERS.large) {
    return 4;
  }
  return 1;
};

type ElementItemType = {
  item: QuickInsertItem;
  onSelectItem: (item: QuickInsertItem) => void;
  selected: boolean;
  focus: boolean;
  setFocusedItemIndex: (index: number) => void;
  index: number;
};

const MemoizedElementItem = memo(ElementItem);
MemoizedElementItem.displayName = 'MemoizedElementItem';

function ElementItem({
  selected,
  item,
  index,
  onSelectItem,
  focus,
  setFocusedItemIndex,
}: ElementItemType) {
  const ref = useRefToFocusOrScroll(focus, selected);

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setFocusedItemIndex(index);
      onSelectItem(item);
    },
    [index, item, onSelectItem, setFocusedItemIndex],
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
        onSelectItem(item);
      }
    },
    [index, item, onSelectItem, setFocusedItemIndex],
  );

  return (
    <Item
      onClick={onClick}
      elemBefore={
        <StyledItemIcon>
          {item.icon ? item.icon() : <IconFallback label={item.title} />}
        </StyledItemIcon>
      }
      isSelected={selected}
      aria-describedby={item.title}
      innerRef={ref}
      onKeyPress={onKeyPress}
    >
      <Tooltip content={item.description}>
        <ItemBody>
          <ItemText>
            <div>{item.title}</div>
            {item.description && (
              <ItemDescription>{item.description}</ItemDescription>
            )}
          </ItemText>
          <ItemAfter>
            {item.keyshortcut && <Shortcut>{item.keyshortcut}</Shortcut>}
          </ItemAfter>
        </ItemBody>
      </Tooltip>
    </Item>
  );
}

interface ContainerProps {
  mode: keyof typeof Modes;
}

const scrollbarStyle = css`
  ::-webkit-scrollbar {
    width: ${GRID_SIZE}px;
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
  display: ${({ mode }: ContainerProps) =>
    mode === Modes.full ? 'flex' : 'block'};
  flex-flow: row wrap;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-x: hidden;
  overflow-y: scroll;
  ${scrollbarStyle};
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
  height: 100%;
  width: 100%;
`;

const MemoizedElementListWithAnalytics = memo(
  withAnalyticsContext({ component: 'ElementList' })(ElementList),
);

export default MemoizedElementListWithAnalytics;
