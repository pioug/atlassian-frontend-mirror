/** @jsx jsx */
import { DragEventHandler, forwardRef, Ref } from 'react';

import { CSSObject, jsx } from '@emotion/core';

import { LinkItemProps } from '../types';

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
      cssFn = (currentStyles: CSSObject) => currentStyles,
      description,
      iconAfter,
      iconBefore,
      isDisabled = false,
      isSelected = false,
      onClick,
      testId,
      overrides,
      ...others
    } = rest;

    if (!children) {
      return null;
    }

    const Container = isDisabled ? 'span' : 'a';

    return (
      <Container
        ref={ref as Ref<HTMLAnchorElement>}
        css={cssFn(linkItemCSS(isDisabled, isSelected), {
          isSelected,
          isDisabled,
        })}
        onDragStart={preventEvent}
        draggable={false}
        href={isDisabled ? undefined : href}
        data-testid={testId}
        onClick={isDisabled ? undefined : onClick}
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
