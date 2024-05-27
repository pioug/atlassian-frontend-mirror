import React from 'react';
import { type FragmentAttributes } from '@atlaskit/adf-schema';
import { type MarkProps } from '../types';

export default function FragmentMark(props: MarkProps<FragmentAttributes>) {
  const WrapperElement = props.isInline ? 'span' : 'div';

  return (
    <WrapperElement
      data-localId={props.localId}
      data-name={props.name}
      data-mark-type="fragment"
      {...props.dataAttributes}
    >
      {props.children}
    </WrapperElement>
  );
}
