import React from 'react';
import { TextColorAttributes } from '@atlaskit/adf-schema';
import { MarkProps } from '../types';

export default function TextColor(props: MarkProps<TextColorAttributes>) {
  return (
    <span {...props.dataAttributes} style={{ color: props.color }}>
      {props.children}
    </span>
  );
}
