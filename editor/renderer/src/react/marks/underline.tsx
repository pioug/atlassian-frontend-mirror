import React from 'react';
import { MarkProps } from '../types';

export default function Underline(props: MarkProps) {
  return <u {...props.dataAttributes}>{props.children}</u>;
}
