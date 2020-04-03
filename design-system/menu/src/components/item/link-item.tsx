/** @jsx jsx */
import { jsx, CSSObject } from '@emotion/core';
import { forwardRef, Ref, DragEventHandler } from 'react';

import { linkItemCSS } from './styles';
import { LinkItemProps } from '../types';
import BaseItem from './base-item';

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
      elemAfter,
      elemBefore,
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
          elemBefore={elemBefore}
          elemAfter={elemAfter}
          description={description}
        >
          {children}
        </BaseItem>
      </Container>
    );
  },
);

export default LinkItem;
