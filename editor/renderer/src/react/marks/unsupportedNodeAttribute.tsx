import React from 'react';
import { type MarkProps } from '../types';

export default function UnsupportedNodeAttribute(props: MarkProps) {
  return <span {...props.dataAttributes}>{props.children}</span>;
}
