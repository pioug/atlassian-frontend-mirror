import React from 'react';
import { SubSupAttributes } from '@atlaskit/adf-schema';
import { MarkProps } from '../types';

const isSub = (type: SubSupAttributes['type']): type is 'sub' => {
  return type === 'sub';
};

export default function SubSup(props: MarkProps<SubSupAttributes>) {
  if (isSub(props.type)) {
    return <sub {...props.dataAttributes}>{props.children}</sub>;
  }

  return <sup {...props.dataAttributes}>{props.children}</sup>;
}
