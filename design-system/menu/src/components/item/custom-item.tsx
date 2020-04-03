import React, { forwardRef, DragEventHandler } from 'react';
import { CSSObject, ClassNames } from '@emotion/core';

import { customItemCSS } from './styles';
import { CustomItemProps } from '../types';
import BaseItem from './base-item';

const preventEvent: DragEventHandler = e => {
  e.preventDefault();
};

const CustomItem = forwardRef<HTMLElement, CustomItemProps>(
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
      elemAfter,
      elemBefore,
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
            wrapperClass={css(
              cssFn(customItemCSS(isDisabled, isSelected), {
                isDisabled,
                isSelected,
              }),
            )}
            onClick={isDisabled ? undefined : onClick}
            {...rest}
          >
            <BaseItem
              overrides={overrides}
              children={children}
              description={description}
              elemAfter={elemAfter}
              elemBefore={elemBefore}
            />
          </Component>
        )}
      </ClassNames>
    );
  },
);

export default CustomItem;
