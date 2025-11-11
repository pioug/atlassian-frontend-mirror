import React from 'react';
import { type IconMessageWrapperProps } from './types';
import { IconMessageWrapper as CompiledIconMessageWrapper } from './iconMessageWrapper-compiled';

export const IconMessageWrapper = (props: IconMessageWrapperProps) => (
  <CompiledIconMessageWrapper {...props} />
);
