import React, { useMemo } from 'react';
import { TextColorAttributes } from '@atlaskit/adf-schema';
import { hexToEditorTextPaletteColor } from '@atlaskit/editor-palette';

import { MarkProps } from '../types';

export default function TextColor(props: MarkProps<TextColorAttributes>) {
  // Note -- while there is no way to create custom colors using default tooling
  // the editor does supported ad hoc color values -- and there may be content
  // which has been migrated or created via apis which use such values.
  const paletteColorValue =
    hexToEditorTextPaletteColor(props.color) || props.color;

  const style = useMemo(
    () =>
      ({
        ['--custom-palette-color']: paletteColorValue,
      } as React.CSSProperties),
    [paletteColorValue],
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
