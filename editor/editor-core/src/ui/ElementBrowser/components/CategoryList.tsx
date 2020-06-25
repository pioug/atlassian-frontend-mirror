import React, { memo } from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import { withAnalyticsContext } from '@atlaskit/analytics-next';
import { GRID_SIZE } from '../constants';
import { CategoryType } from '../types';

interface Props {
  categories: Partial<CategoryType>[];
  onSelect: (category: Partial<CategoryType>) => void;
}

const CategoryList = ({
  categories = [],
  onSelect = () => {},
}: Props): JSX.Element => (
  <>
    {categories.map((category: Partial<CategoryType>) => {
      const onClick = (e: {}, analyticsEvent: UIAnalyticsEvent) => {
        onSelect(category);
        analyticsEvent.fire();
      };
      return (
        <ButtonWrapper>
          <Button
            isSelected={category.selected}
            onClick={onClick}
            appearance="subtle"
            style={{ height: '100%', width: '100%' }}
          >
            {category.title}
          </Button>
        </ButtonWrapper>
      );
    })}
  </>
);

const ButtonWrapper = styled.div`
  height: ${GRID_SIZE * 5}px;
  margin: ${GRID_SIZE / 2}px;
`;

const MemoizedCategoryListWithAnalytics = memo(
  withAnalyticsContext({
    component: 'category-list',
  })(CategoryList),
);

export default MemoizedCategoryListWithAnalytics;
