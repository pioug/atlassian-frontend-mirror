import React from 'react';
import Inline from './inline';
import { NodeProps } from '../types';

export default function Paragraph({ children, dataAttributes }: NodeProps) {
  return (
    <p {...dataAttributes}>
      <Inline>{children}</Inline>
    </p>
  );
}
