import React from 'react';
import { MarkProps } from '../types';

export default function UnsupportedMark(props: MarkProps) {
  return <span {...props.dataAttributes}>{props.children}</span>;
}
