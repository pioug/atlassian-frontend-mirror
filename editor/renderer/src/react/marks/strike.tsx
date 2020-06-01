import React from 'react';
import { MarkProps } from '../types';

export default function Strike(props: MarkProps) {
  return (
    <span {...props.dataAttributes} style={{ textDecoration: 'line-through' }}>
      {props.children}
    </span>
  );
}
