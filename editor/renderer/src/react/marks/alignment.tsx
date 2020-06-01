import React from 'react';
import styled, { css } from 'styled-components';
import {
  alignmentPositionMap,
  AlignmentAttributes,
} from '@atlaskit/adf-schema';
import { MarkProps } from '../types';

const MarkWrapper = styled.div`
  ${(props: { 'data-align': 'end' | 'right' | 'center' }) =>
    props['data-align'] &&
    css`
      text-align: ${alignmentPositionMap[props['data-align']]};
    `};
`;

export default function Alignment(props: MarkProps<AlignmentAttributes>) {
  return (
    <MarkWrapper className="fabric-editor-block-mark" data-align={props.align}>
      {props.children}
    </MarkWrapper>
  );
}
