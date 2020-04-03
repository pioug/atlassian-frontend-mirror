import React from 'react';
import { Wrapper } from './styled';

export interface LazyContentProps {
  placeholder?: JSX.Element;
  children?: React.ReactNode;
  onRender?: () => void;
}

export interface LazyContentState {}

export class LazyContent extends React.Component<
  LazyContentProps,
  LazyContentState
> {
  render() {
    const { children, placeholder, onRender } = this.props;
    return (
      <Wrapper
        offset={300}
        onRender={onRender}
        placeholder={placeholder}
        content={children}
      />
    );
  }
}
