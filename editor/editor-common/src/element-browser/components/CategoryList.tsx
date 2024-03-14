/** @jsx jsx */
import type { Dispatch, SetStateAction } from 'react';
import React, { Fragment, memo, useCallback } from 'react';

import { css, jsx } from '@emotion/react';

import type { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { withAnalyticsContext } from '@atlaskit/analytics-next';
import Button, {
  type ThemeProps,
  type ThemeTokens,
} from '@atlaskit/button/custom-theme-button';
import { B400, B50, N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  fireAnalyticsEvent,
} from '../../analytics';
import { DEVICE_BREAKPOINT_NUMBERS, GRID_SIZE } from '../constants';
import useFocus from '../hooks/use-focus';
import type { Category } from '../types';

interface Props {
  categories?: Category[];
  onSelectCategory: (category: Category) => void;
  selectedCategory?: string;
}

function CategoryList({
  categories = [],
  ...props
}: Props & WithAnalyticsEventsProps): JSX.Element {
  const [focusedCategoryIndex, setFocusedCategoryIndex] = React.useState<
    number | null
  >(null);
  return (
    <Fragment>
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
    </Fragment>
  );
}

type CategoryListItemProps = {
  category: Category;
  onSelectCategory: (category: Category) => void;
  selectedCategory?: string;
  index: number;
  focus: boolean;
  setFocusedCategoryIndex: Dispatch<SetStateAction<number | null>>;
};

function CategoryListItem({
  category,
  onSelectCategory,
  selectedCategory,
  index,
  focus,
  setFocusedCategoryIndex,
  createAnalyticsEvent,
}: CategoryListItemProps & WithAnalyticsEventsProps) {
  const ref = useFocus(focus);
  const onClick = useCallback(() => {
    onSelectCategory(category);

    /**
     * When user double clicks on same category, focus on first item.
     */
    if (selectedCategory === category.name) {
      setFocusedCategoryIndex(0);
    } else {
      setFocusedCategoryIndex(index);
    }
    fireAnalyticsEvent(createAnalyticsEvent)({
      payload: {
        action: ACTION.CLICKED,
        actionSubject: ACTION_SUBJECT.BUTTON,
        actionSubjectId: ACTION_SUBJECT_ID.BUTTON_CATEGORY,
        eventType: EVENT_TYPE.TRACK,
      },
    });
  }, [
    onSelectCategory,
    category,
    index,
    selectedCategory,
    setFocusedCategoryIndex,
    createAnalyticsEvent,
  ]);

  const onFocus = useCallback(() => {
    if (!focus) {
      setFocusedCategoryIndex(index);
    }
  }, [focus, index, setFocusedCategoryIndex]);
  const getTheme = useCallback(
    (
      currentTheme: (props: ThemeProps) => ThemeTokens,
      themeProps: ThemeProps,
    ): ThemeTokens => {
      const { buttonStyles, ...rest } = currentTheme(themeProps);

      return {
        buttonStyles: {
          ...buttonStyles,
          textAlign: 'start' as const,
          marginLeft: token('space.025', '2px'),
          height: '100%',
          width: '100%',
          color:
            category.name !== selectedCategory
              ? token('color.text', N800)
              : token('color.text.selected', B400),
          ...(category.name === selectedCategory && {
            background: token('color.background.selected', B50),
          }),
        },
        ...rest,
      };
    },
    [category.name, selectedCategory],
  );

  return (
    <div css={buttonWrapper}>
      <Button
        appearance="subtle"
        isSelected={selectedCategory === category.name}
        onClick={onClick}
        onFocus={onFocus}
        theme={getTheme}
        ref={ref}
        testId="element-browser-category-item"
      >
        {category.title}
      </Button>
    </div>
  );
}

const buttonWrapper = css({
  height: `${GRID_SIZE * 4}px`,
  margin: `${token('space.050', '4px')} ${token('space.050', '4px')} ${token(
    'space.050',
    '4px',
  )} 0`,
  [`@media (min-width: ${DEVICE_BREAKPOINT_NUMBERS.medium}px)`]: {
    ':not(:last-child)': {
      marginBottom: 0,
    },
  },
});

const MemoizedCategoryListWithAnalytics = memo(
  withAnalyticsContext({
    component: 'CategoryList',
  })(CategoryList),
);

export default MemoizedCategoryListWithAnalytics;
