import React, { DragEventHandler, forwardRef } from 'react';

import { ClassNames, CSSObject } from '@emotion/core';

import { CustomItemComponentProps, CustomItemProps } from '../types';

import BaseItem from './base-item';
import { customItemCSS } from './styles';

const preventEvent: DragEventHandler = e => {
  e.preventDefault();
};

// Dirty hack to get generics working with forward ref [1/2]
interface CustomItemType {
  <TComponentProps extends CustomItemComponentProps>(
    props: CustomItemProps<TComponentProps> & { ref?: any } & Omit<
        TComponentProps,
        keyof CustomItemComponentProps
      >,
  ): JSX.Element | null;
}

const CustomItem: CustomItemType = forwardRef<HTMLElement, CustomItemProps>(
  (
    {
      component: Component,
      cssFn = (currentStyles: CSSObject) => currentStyles,
      isDisabled = false,
      isSelected = false,
      onClick,
      testId,
      children,
      description,
      iconAfter,
      iconBefore,
      overrides,
      ...rest
    }: // Type needed on props to extract types with extract react types.
    CustomItemProps,
    ref,
  ) => {
    if (!Component) {
      return null;
    }

    return (
      <ClassNames>
        {({ css }) => (
          <Component
            ref={ref}
            data-testid={testId}
            onDragStart={preventEvent}
            draggable={false}
            className={css(
              cssFn(customItemCSS(isDisabled, isSelected), {
                isDisabled,
                isSelected,
              }),
            )}
            onClick={isDisabled ? undefined : onClick}
            tabIndex={isDisabled ? -1 : undefined}
            disabled={isDisabled}
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
  // Dirty hack to get generics working with forward ref [2/2]
) as any;

export default CustomItem;
