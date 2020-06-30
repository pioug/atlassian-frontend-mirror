import React, { memo, useCallback } from 'react';
import styled, { css, ThemeProvider } from 'styled-components';
import { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import { colors } from '@atlaskit/theme';
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
import { Modes } from '../types';
import useContainerWidth from '../hooks/useContainerWidth';

interface Props {
  items: QuickInsertItem[];
  mode: keyof typeof Modes;
  onSelectItem: (item: QuickInsertItem) => void;
  onEnterKeyPress: (item: QuickInsertItem) => void;
}

function CategoryItems({ items, mode, ...props }: Props) {
  const { containerWidth, ContainerWidthMonitor } = useContainerWidth();

  const itemTheme = {
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
  return (
    <>
      <ContainerWidthMonitor />
      <CategoryItemsWrapper mode={mode}>
        <ThemeProvider theme={{ '@atlaskit-shared-theme/item': itemTheme }}>
          <>
            {items.map<JSX.Element>(
              (item, index): JSX.Element => (
                <CategoryItem key={index} item={item} {...props} />
              ),
            )}
          </>
        </ThemeProvider>
      </CategoryItemsWrapper>
    </>
  );
}

const getItemWidthForContainer = (clientWidth?: number) => {
  if (clientWidth == null) return '33%';
  if (clientWidth < FLEX_ITEMS_CONTAINER_BREAKPOINT_NUMBERS.small)
    return '100%';
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
  if (clientWidth >= FLEX_ITEMS_CONTAINER_BREAKPOINT_NUMBERS.large)
    return '25%';
};

type CategoryItemType = {
  item: QuickInsertItem;
  onSelectItem: (item: QuickInsertItem) => void;
  onEnterKeyPress: (item: QuickInsertItem) => void;
};

function CategoryItem({
  item,
  onSelectItem,
  onEnterKeyPress,
}: CategoryItemType) {
  const onClick = useCallback(() => onSelectItem(item), [item, onSelectItem]);
  const onKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return;
      onEnterKeyPress(item);
    },
    [item, onEnterKeyPress],
  );
  return (
    <Item
      onClick={onClick}
      onKeyPress={onKeyPress}
      elemBefore={
        <ItemIcon>
          {item.icon ? item.icon() : <IconFallback label={item.title} />}
        </ItemIcon>
      }
      isSelected={item.selected}
      aria-describedby={item.title}
    >
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

const CategoryItemsWrapper = styled.div`
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
  color: ${colors.N200};
  margin-top: ${GRID_SIZE / 2}px;
`;

const ItemText = styled.div`
  width: inherit;
  white-space: initial;
`;

const ItemAfter = styled.div`
  flex: 0 0 auto;
`;

const MemoizedCategoryItemsWithAnalytics = memo(
  withAnalyticsContext({ component: 'category-item' })(CategoryItems),
);

export default MemoizedCategoryItemsWithAnalytics;
