import React from 'react';
import { Wrapper } from './styled';
import TickIcon from '@atlaskit/icon/glyph/check';

export type TickBoxProps = {
  selected?: boolean;
};

export const TickBox = ({ selected }: TickBoxProps) => (
  <Wrapper selected={selected}>
    <TickIcon label="tick" />
  </Wrapper>
);
