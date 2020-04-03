import React, {
  Component,
  ReactNode,
  ComponentType,
  FocusEventHandler,
} from 'react';
import styled from 'styled-components';
import { Link, Text, linkStyles } from './styled';
import { TagColor } from '../types';

export interface Props {
  children: ReactNode;
  href?: string;
  isFocused?: boolean;
  isRemovable?: boolean;
  markedForRemoval?: boolean;
  color: TagColor;
  linkComponent?: ComponentType<any>;
  onFocus?: FocusEventHandler;
  onBlur?: FocusEventHandler;
}

export default class Content extends Component<Props> {
  getLinkComponent = () => {
    const { linkComponent, href } = this.props;

    if (!href) return null;

    if (linkComponent)
      return styled(linkComponent)`
        ${linkStyles};
      `;
    return Link;
  };

  render() {
    const {
      children,
      href,
      isFocused,
      isRemovable,
      markedForRemoval,
      color,
      onFocus,
      onBlur,
    } = this.props;

    const styledProps = {
      isFocused,
      isRemovable,
      markedForRemoval,
      color,
    };

    const LinkComponent = this.getLinkComponent();

    return href && LinkComponent ? (
      <LinkComponent
        {...styledProps}
        href={href}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {children}
      </LinkComponent>
    ) : (
      <Text {...styledProps}>{children}</Text>
    );
  }
}
