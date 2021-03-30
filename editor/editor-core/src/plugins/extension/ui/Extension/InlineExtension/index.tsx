import React from 'react';
import { Component } from 'react';
import { Node as PmNode } from 'prosemirror-model';
import { Overlay } from '../styles';
import ExtensionLozenge from '../Lozenge';
import { Wrapper } from './styles';

export interface Props {
  node: PmNode;
  children?: React.ReactNode;
}

export default class InlineExtension extends Component<Props, any> {
  render() {
    const { node, children } = this.props;

    const hasChildren = !!children;

    const className = hasChildren
      ? 'with-overlay with-children'
      : 'with-overlay';

    return (
      <Wrapper className={`extension-container inline ${className}`}>
        <Overlay className="extension-overlay" />
        {children ? children : <ExtensionLozenge node={node} />}
      </Wrapper>
    );
  }
}
