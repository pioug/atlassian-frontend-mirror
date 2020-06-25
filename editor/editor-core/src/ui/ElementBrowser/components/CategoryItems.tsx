import React, { memo } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import { colors } from '@atlaskit/theme';
import Item from '@atlaskit/item';
import { withAnalyticsContext } from '@atlaskit/analytics-next';
import { Shortcut } from '../../styles';
import { ItemIcon } from '../../../plugins/type-ahead/ui/TypeAheadItemsList';
import IconFallback from '../../../plugins/quick-insert/assets/fallback';
import { GRID_SIZE, CATEGORY_ITEM_WIDTH } from '../constants';
import { Modes } from '../types';

interface Props {
  items: Partial<QuickInsertItem>[];
  mode: keyof typeof Modes;
}

const CategoryItems = ({ items, mode }: Props) => {
  const itemTheme = {
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
    <CategoryItemsContainer mode={mode}>
      {items.map(
        (item: Partial<QuickInsertItem>): JSX.Element => {
          return (
            <ThemeProvider theme={{ '@atlaskit-shared-theme/item': itemTheme }}>
              <Item
                onClick={item.action}
                elemBefore={
                  <ItemIcon>
                    {item.icon ? (
                      item.icon()
                    ) : (
                      <IconFallback label={item.title} />
                    )}
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
                    {item.keyshortcut && (
                      <Shortcut>{item.keyshortcut}</Shortcut>
                    )}
                  </ItemAfter>
                </ItemBody>
              </Item>
            </ThemeProvider>
          );
        },
      )}
    </CategoryItemsContainer>
  );
};

interface ContainerProps {
  mode: keyof typeof Modes;
}

const gridTemplateColumns = ({ mode }: ContainerProps) =>
  `repeat(${
    mode === Modes.full ? 'auto-fill' : '1'
  }, minmax(${CATEGORY_ITEM_WIDTH}, 1fr))`;

const CategoryItemsContainer = styled.div`
  display: grid;
  grid-template-columns: ${gridTemplateColumns};
  grid-gap: ${GRID_SIZE}px;
  max-height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
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
