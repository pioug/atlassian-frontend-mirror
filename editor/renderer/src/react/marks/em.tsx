import React from 'react';
import { MarkProps } from '../types';

export default function Em(props: MarkProps) {
  return <em {...props.dataAttributes}>{props.children}</em>;
}
