import React from 'react';
import { type MarkProps } from '../types';

export default function UnsupportedMark(props: MarkProps) {
  return <span {...props.dataAttributes}>{props.children}</span>;
}
