import React from 'react';

import { Node as PMNode } from 'prosemirror-model';
import styled from 'styled-components';

import { N30, N50 } from '@atlaskit/theme/colors';
import { borderRadius, fontSize } from '@atlaskit/theme/constants';

import { useNodeData } from '../hooks';

const BlockNode = styled.div`
  align-items: center;
  background: ${N30};
  border: 1px dashed ${N50};
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
  vertical-align: text-bottom;
  min-width: 120px;
`;

export interface Props {
  node?: PMNode;
  children?: React.ReactNode;
}

export default function UnsupportedBlockNode(props: Props) {
  let node;
  if (props) {
    node = props.node;
  }
  const text = useNodeData(node);
  return <BlockNode>{text}</BlockNode>;
}
