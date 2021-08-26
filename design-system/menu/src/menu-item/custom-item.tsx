import React, { forwardRef, memo, MouseEventHandler } from 'react';

import { ClassNames } from '@emotion/core';

import BaseItem from '../internal/components/base-item';
import { useBlurOnMouseDown } from '../internal/hooks/use-blur-on-mouse-down';
import { customItemCSS } from '../internal/styles/menu-item/custom-item';
import type { CustomItemComponentProps, CustomItemProps } from '../types';

const preventEvent: MouseEventHandler = (e) => {
  e.preventDefault();
};

// Dirty hack to get generics working with forward ref [1/2]
interface CustomItemTypeGenericHackProps {
  <TComponentProps>(
    props: CustomItemProps<TComponentProps> & { ref?: any } & Omit<
        TComponentProps,
        keyof CustomItemComponentProps
      >,
  ): JSX.Element | null;
}

/**
 * __Custom item__
 *
 * A custom item is used to populate a menu with items that need to be a custom element.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/menu/docs/custom-item)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/menu)
 */
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
        shouldTitleWrap,
        shouldDescriptionWrap,
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
                // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
                overrides={overrides}
                children={children}
                description={description}
                iconAfter={iconAfter}
                iconBefore={iconBefore}
                shouldTitleWrap={shouldTitleWrap}
                shouldDescriptionWrap={shouldDescriptionWrap}
              />
            </Component>
          )}
        </ClassNames>
      );
    },
  ),
  // Dirty hack to get generics working with forward ref [2/2]
) as CustomItemTypeGenericHackProps;

export default CustomItem;
