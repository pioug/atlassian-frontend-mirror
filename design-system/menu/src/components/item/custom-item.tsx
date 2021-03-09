import React, { forwardRef, memo, MouseEventHandler } from 'react';

import { ClassNames } from '@emotion/core';

import { CustomItemComponentProps, CustomItemProps } from '../types';
import { useBlurOnMouseDown } from '../utils/use-blur-on-mouse-down';

import BaseItem from './base-item';
import { customItemCSS } from './styles';

const preventEvent: MouseEventHandler = e => {
  e.preventDefault();
};

// Dirty hack to get generics working with forward ref [1/2]
interface CustomItemType {
  <TComponentProps>(
    props: CustomItemProps<TComponentProps> & { ref?: any } & Omit<
        TComponentProps,
        keyof CustomItemComponentProps
      >,
  ): JSX.Element | null;
}

const CustomItem = memo(
  forwardRef<HTMLElement, CustomItemProps>(
    (
      {
        component: Component,
        cssFn = () => ({}),
        isDisabled = false,
        isSelected = false,
        onClick,
        testId,
        children,
        description,
        iconAfter,
        iconBefore,
        overrides,
        onMouseDown,
        ...rest
      }: // Type needed on props to extract types with extract react types.
      CustomItemProps,
      ref,
    ) => {
      const onMouseDownHandler = useBlurOnMouseDown(onMouseDown);

      if (!Component) {
        return null;
      }

      return (
        <ClassNames>
          {({ css }) => (
            <Component
              ref={ref}
              data-testid={testId}
              draggable={false}
              className={css([
                customItemCSS(isDisabled, isSelected),
                cssFn({
                  isDisabled,
                  isSelected,
                }),
              ])}
              onDragStart={preventEvent}
              onMouseDown={isDisabled ? preventEvent : onMouseDownHandler}
              onClick={isDisabled ? preventEvent : onClick}
              tabIndex={isDisabled ? -1 : undefined}
              aria-disabled={isDisabled}
              {...rest}
            >
              <BaseItem
                overrides={overrides}
                children={children}
                description={description}
                iconAfter={iconAfter}
                iconBefore={iconBefore}
              />
            </Component>
          )}
        </ClassNames>
      );
    },
  ),
  // Dirty hack to get generics working with forward ref [2/2]
) as CustomItemType;

export default CustomItem;
