import React from 'react';
import { type StyledBarProps } from './types';
import { StyledBar as CompiledStyledBar } from './styledBar-compiled';

export const StyledBar = (props: StyledBarProps) => (
  <CompiledStyledBar {...props} />
);
