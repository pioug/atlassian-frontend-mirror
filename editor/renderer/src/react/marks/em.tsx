import React from 'react';
import { type MarkProps } from '../types';

export default function Em(props: MarkProps) {
  return <em {...props.dataAttributes}>{props.children}</em>;
}
