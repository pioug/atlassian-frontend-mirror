import React from 'react';
import { Component } from 'react';
import styled from 'styled-components';
import { borderRadius, colors } from '@atlaskit/theme';

const BlockNode = styled.div`
  align-items: center;
  background: ${colors.N30};
  border: 1px dashed ${colors.N50};
  border-radius: ${borderRadius()}px;
  box-sizing: border-box;
  cursor: default;
  display: block;
  font-size: 13px;
  margin: 10px 0;
  min-height: 24px;
  padding: 10px;
  text-align: center;
  user-select: all;
  vertical-align: text-bottom;
  white-space: nowrap;

  '&.ProseMirror-selectednode' {
    background: ${colors.N50};
    outline: none;
  }
`;

export default class UnsupportedBlockNode extends Component<{}, {}> {
  render() {
    return <BlockNode>Unsupported content</BlockNode>;
  }
}
