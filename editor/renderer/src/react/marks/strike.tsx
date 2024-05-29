import React from 'react';
import { type MarkProps } from '../types';

export default function Strike(props: MarkProps) {
  return (
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
    <span {...props.dataAttributes} style={{ textDecoration: 'line-through' }}>
      {props.children}
    </span>
  );
}
