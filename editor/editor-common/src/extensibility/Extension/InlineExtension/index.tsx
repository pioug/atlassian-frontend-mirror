/** @jsx jsx */
import React from 'react';
import { Component } from 'react';

import { jsx } from '@emotion/react';

import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';

import ExtensionLozenge from '../Lozenge';
import { overlay } from '../styles';

import { wrapperStyle } from './styles';

export interface Props {
  node: PmNode;
  children?: React.ReactNode;
  showMacroInteractionDesignUpdates?: boolean;
}

export default class InlineExtension extends Component<Props, any> {
  render() {
    const { node, children } = this.props;

    const hasChildren = !!children;

    const className = hasChildren
      ? 'with-overlay with-children'
      : 'with-overlay';

    return (
      <div
        css={wrapperStyle}
        className={`extension-container inline ${className}`}
      >
        <div css={overlay} className="extension-overlay" />
        {children ? children : <ExtensionLozenge node={node} />}
      </div>
    );
  }
}
