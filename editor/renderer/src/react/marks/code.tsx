import React from 'react';
import { MarkProps } from '../types';

export default function Code(props: MarkProps) {
  return (
    <span className="code" {...props.dataAttributes}>
      {props.children}
    </span>
  );
}
