import React, { memo, useCallback, Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { N800, B400, B50 } from '@atlaskit/theme/colors';
import Button from '@atlaskit/button';
import UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import { withAnalyticsContext } from '@atlaskit/analytics-next';
import { DEVICE_BREAKPOINT_NUMBERS, GRID_SIZE } from '../constants';
import useRefToFocusOrScroll from '../hooks/useRefToFocusOrScroll';
import { Category } from '../types';

interface Props {
  categories?: Category[];
  onSelectCategory: (category: Category) => void;
  selectedCategory?: string;
}

function CategoryList({ categories = [], ...props }: Props): JSX.Element {
  const [focusedCategoryIndex, setFocusedCategoryIndex] = React.useState(0);
  return (
    <>
      {categories.map<JSX.Element>((category, index) => (
        <CategoryListItem
          key={category.title}
          index={index}
          category={category}
          focus={focusedCategoryIndex === index}
          setFocusedCategoryIndex={setFocusedCategoryIndex}
          {...props}
        />
      ))}
    </>
  );
}

type CategoryListItemProps = {
  category: Category;
  onSelectCategory: (category: Category) => void;
  selectedCategory?: string;
  index: number;
  focus: boolean;
  setFocusedCategoryIndex: Dispatch<SetStateAction<number>>;
};

function CategoryListItem({
  category,
  onSelectCategory,
  selectedCategory,
  index,
  focus,
  setFocusedCategoryIndex,
}: CategoryListItemProps) {
  const ref = useRefToFocusOrScroll(focus);

  const onClick = useCallback(
    (e: {}, analyticsEvent: UIAnalyticsEvent) => {
      onSelectCategory(category);

      /**
       * When user double clicks on same category, focus on first item.
       */
      if (selectedCategory === category.name) {
        setFocusedCategoryIndex(0);
      } else {
        setFocusedCategoryIndex(index);
      }
      analyticsEvent.fire();
    },
    [
      onSelectCategory,
      category,
      index,
      selectedCategory,
      setFocusedCategoryIndex,
    ],
  );

  const onFocus = useCallback(() => {
    if (!focus) {
      setFocusedCategoryIndex(index);
    }
  }, [focus, index, setFocusedCategoryIndex]);
  const getTheme = useCallback(
    (currentTheme, themeProps) => {
      const { buttonStyles, ...rest } = currentTheme(themeProps);
      return {
        buttonStyles: {
          ...buttonStyles,
          height: `100%`,
          width: '100%',
          color: category.name !== selectedCategory ? N800 : B400,
          ...(category.name === selectedCategory && {
            background: B50,
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
        onFocus={onFocus}
        theme={getTheme}
        ref={ref}
      >
        {category.title}
      </Button>
    </ButtonWrapper>
  );
}

const ButtonWrapper = styled.div`
  height: ${GRID_SIZE * 4}px;
  margin: ${GRID_SIZE / 2}px;

  @media (min-width: ${DEVICE_BREAKPOINT_NUMBERS.medium}px) {
    margin-bottom: 0;
  }
`;

const MemoizedCategoryListWithAnalytics = memo(
  withAnalyticsContext({
    component: 'category-list',
  })(CategoryList),
);

export default MemoizedCategoryListWithAnalytics;
