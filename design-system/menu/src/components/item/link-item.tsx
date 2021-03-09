/** @jsx jsx */
import { forwardRef, memo, MouseEventHandler, Ref } from 'react';

import { jsx } from '@emotion/core';

import { LinkItemProps } from '../types';
import { useBlurOnMouseDown } from '../utils/use-blur-on-mouse-down';

import BaseItem from './base-item';
import { linkItemCSS } from './styles';

const preventEvent: MouseEventHandler = e => {
  e.preventDefault();
};

const LinkItem = memo(
  forwardRef<HTMLElement, LinkItemProps>(
    // Type needed on props to extract types with extract react types.
    ({ href, ...rest }: LinkItemProps, ref) => {
      const {
        children,
        cssFn = () => ({}),
        description,
        iconAfter,
        iconBefore,
        isDisabled = false,
        isSelected = false,
        onClick,
        testId,
        overrides,
        onMouseDown,
        ...others
      } = rest;
      const onMouseDownHandler = useBlurOnMouseDown(onMouseDown);

      if (!children) {
        return null;
      }

      return (
        <a
          ref={ref as Ref<HTMLAnchorElement>}
          css={[
            linkItemCSS(isDisabled, isSelected),
            cssFn({
              isSelected,
              isDisabled,
            }),
          ]}
          draggable={false}
          href={isDisabled ? undefined : href}
          data-testid={testId}
          onDragStart={preventEvent}
          onMouseDown={isDisabled ? preventEvent : onMouseDownHandler}
          onClick={isDisabled ? preventEvent : onClick}
          aria-current={isSelected ? 'page' : undefined}
          aria-disabled={isDisabled}
          {...others}
        >
          <BaseItem
            overrides={overrides}
            iconBefore={iconBefore}
            iconAfter={iconAfter}
            description={description}
          >
            {children}
          </BaseItem>
        </a>
      );
    },
  ),
);

export default LinkItem;
