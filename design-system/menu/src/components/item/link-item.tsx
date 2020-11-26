/** @jsx jsx */
import { DragEventHandler, forwardRef, Ref } from 'react';

import { jsx } from '@emotion/core';

import { LinkItemProps } from '../types';
import { useBlurOnMouseDown } from '../utils/use-blur-on-mouse-down';

import BaseItem from './base-item';
import { linkItemCSS } from './styles';

const preventEvent: DragEventHandler = e => {
  e.preventDefault();
};

const LinkItem = forwardRef<HTMLElement, LinkItemProps>(
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

    const Container = isDisabled ? 'span' : 'a';

    return (
      <Container
        ref={ref as Ref<HTMLAnchorElement>}
        css={[
          linkItemCSS(isDisabled, isSelected),
          cssFn({
            isSelected,
            isDisabled,
          }),
        ]}
        onDragStart={preventEvent}
        draggable={false}
        href={isDisabled ? undefined : href}
        data-testid={testId}
        onMouseDown={onMouseDownHandler}
        onClick={isDisabled ? undefined : onClick}
        aria-current={isSelected ? 'page' : undefined}
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
      </Container>
    );
  },
);

export default LinkItem;
