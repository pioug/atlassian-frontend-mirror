import React from 'react';
import { MarkProps } from '../types';

export default function UnsupportedNodeAttribute(props: MarkProps) {
  return <span {...props.dataAttributes}>{props.children}</span>;
}
