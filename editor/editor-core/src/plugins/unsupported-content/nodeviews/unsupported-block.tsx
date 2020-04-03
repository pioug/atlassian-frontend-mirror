import React from 'react';
import styled from 'styled-components';
import { borderRadius, colors } from '@atlaskit/theme';
import { fontSize } from '@atlaskit/theme';

const BlockNode = styled.div`
  align-items: center;
  background: ${colors.N30};
  border: 1px dashed ${colors.N50};
  border-radius: ${borderRadius()}px;
  box-sizing: border-box;
  cursor: default;
  display: block;
  font-size: ${fontSize()}px;
  margin: 10px 0;
  min-height: 24px;
  padding: 10px;
  text-align: center;
  user-select: all;
  min-width: 120px;

  &.ProseMirror-selectednode {
    background: ${colors.N50};
    outline: none;
  }
`;

export default function UnsupportedBlockNode() {
  return <BlockNode>Unsupported content</BlockNode>;
}
