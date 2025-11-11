import React from 'react';
import { type TickBoxProps } from './types';
import { TickBoxWrapper as CompiledTickBoxWrapper } from './tickBoxWrapper-compiled';

export const TickBoxWrapper = (props: TickBoxProps) => (
  <CompiledTickBoxWrapper {...props} />
);

TickBoxWrapper.displayName = 'TickBoxWrapper';
