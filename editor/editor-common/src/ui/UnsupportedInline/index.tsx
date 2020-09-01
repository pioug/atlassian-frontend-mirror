import React from 'react';

import { Node as PMNode } from 'prosemirror-model';
import styled from 'styled-components';

import { N30, N50 } from '@atlaskit/theme/colors';
import { borderRadius, fontSize } from '@atlaskit/theme/constants';

import { ZERO_WIDTH_SPACE } from '../../utils';
import { useNodeData } from '../hooks';

const InlineNode = styled.span`
  align-items: center;
  background: ${N30};
  border: 1px dashed ${N50};
  border-radius: ${borderRadius()}px;
  box-sizing: border-box;
  cursor: default;
  display: inline-flex;
  font-size: ${fontSize()}px;
  margin: 0 2px;
  min-height: 24px;
  padding: 0 10px;
  user-select: all;
  vertical-align: middle;
  white-space: nowrap;

  &.ProseMirror-selectednode {
    background: ${N50};
    outline: none;
  }
`;

export interface Props {
  node?: PMNode;
  children?: React.ReactNode;
}

export default function UnsupportedInlineNode(props: Props) {
  let node;
  if (props) {
    node = props.node;
  }
  const text = useNodeData(node);
  return (
    <span>
      <InlineNode>{text}</InlineNode>
      {ZERO_WIDTH_SPACE}
    </span>
  );
}
