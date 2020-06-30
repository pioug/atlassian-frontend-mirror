import React, { memo, useCallback } from 'react';
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';
import Button from '@atlaskit/button';
import UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import { withAnalyticsContext } from '@atlaskit/analytics-next';
import { GRID_SIZE } from '../constants';
import { Category } from '../types';

interface Props {
  categories: Category[];
  onSelectCategory: (category: Category) => void;
  selectedCategory?: string;
}

function CategoryList({ categories = [], ...props }: Props): JSX.Element {
  return (
    <>
      {categories.map<JSX.Element>((category, index) => (
        <CategoryListItem key={index} category={category} {...props} />
      ))}
    </>
  );
}

type CategoryListItemProps = {
  category: Category;
  onSelectCategory: (category: Category) => void;
  selectedCategory?: string;
};

function CategoryListItem({
  category,
  onSelectCategory,
  selectedCategory,
}: CategoryListItemProps) {
  const onClick = useCallback(
    (e: {}, analyticsEvent: UIAnalyticsEvent) => {
      onSelectCategory(category);
      analyticsEvent.fire();
    },
    [category, onSelectCategory],
  );
  const getTheme = useCallback(
    (currentTheme, themeProps) => {
      const { buttonStyles, ...rest } = currentTheme(themeProps);
      return {
        buttonStyles: {
          ...buttonStyles,
          height: `100%`,
          width: '100%',
          color: category.name !== selectedCategory ? colors.N800 : colors.B400,
          ...(category.name === selectedCategory && {
            background: colors.B50,
          }),
        },
        ...rest,
      };
    },
    [category.name, selectedCategory],
  );
  return (
    <ButtonWrapper>
      <Button
        appearance="subtle"
        isSelected={selectedCategory === category.name}
        onClick={onClick}
        theme={getTheme}
      >
        {category.title}
      </Button>
    </ButtonWrapper>
  );
}

const ButtonWrapper = styled.div`
  height: ${GRID_SIZE * 4}px;
  margin: ${GRID_SIZE / 2}px;
  margin-bottom: 0;
`;

const MemoizedCategoryListWithAnalytics = memo(
  withAnalyticsContext({
    component: 'category-list',
  })(CategoryList),
);

export default MemoizedCategoryListWithAnalytics;
