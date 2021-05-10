import React from 'react';
import AkCode from '@atlaskit/code/inline';
import type { MarkProps } from '../types';

export default function Code(props: MarkProps) {
  return (
    <AkCode className="code" {...props.dataAttributes}>
      {props.children}
    </AkCode>
  );
}
