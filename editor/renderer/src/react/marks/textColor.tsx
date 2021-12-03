import React, { useMemo } from 'react';
import { TextColorAttributes } from '@atlaskit/adf-schema';
import { MarkProps } from '../types';

export default function TextColor(props: MarkProps<TextColorAttributes>) {
  const style = useMemo(
    () =>
      ({
        ['--custom-text-color']: props.color,
      } as React.CSSProperties),
    [props.color],
  );

  return (
    <span
      {...props.dataAttributes}
      data-text-custom-color={props.color}
      className="fabric-text-color-mark"
      style={style}
    >
      {props.children}
    </span>
  );
}
