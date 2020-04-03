import React, { PureComponent, ReactNode } from 'react';
import { Span } from './styled';
import { TagColor } from '../types';

interface ChromeProps {
  children: ReactNode;
  isLink: boolean;
  isRemovable: boolean;
  isRemoved?: boolean;
  isRemoving?: boolean;
  isRounded?: boolean;
  markedForRemoval: boolean;
  isFocused: boolean;
  color: TagColor;
}

export default class Chrome extends PureComponent<ChromeProps> {
  chromeRef?: HTMLElement;

  render() {
    const {
      children,
      isLink,
      isRemovable,
      isRemoved,
      isRemoving,
      isRounded,
      isFocused,
      markedForRemoval,
      color,
    } = this.props;

    return (
      <Span
        innerRef={r => {
          this.chromeRef = r;
        }}
        isRemovable={isRemovable}
        isRemoved={isRemoved}
        isRemoving={isRemoving}
        isRounded={isRounded}
        markedForRemoval={markedForRemoval}
        color={color}
        isFocused={isFocused}
        isLink={isLink}
        role={isLink ? 'link' : undefined}
      >
        {children}
      </Span>
    );
  }
}
