import React, { useMemo } from 'react';
import { getDarkModeLCHColor } from '@atlaskit/adf-schema';
import type { TextColorAttributes } from '@atlaskit/adf-schema';
import { hexToEditorTextPaletteColor } from '@atlaskit/editor-palette';
import { useThemeObserver } from '@atlaskit/tokens';

import type { MarkProps } from '../types';

export default function TextColor(props: MarkProps<TextColorAttributes>) {
  const { colorMode } = useThemeObserver();
  // Note -- while there is no way to create custom colors using default tooling
  // the editor does supported ad hoc color values -- and there may be content
  // which has been migrated or created via apis which use such values.
  let paletteColorValue: string;

  /**
   * The Editor persists custom text colors when content has been migrated from the old editor, or created via
   * apis.
   *
   * This behaviour predates the introduction of dark mode.
   *
   * Without the inversion logic below, text with custom colors, can be hard to read when the user loads the page in dark mode.
   *
   * This introduces inversion of the presentation of the custom text colors when the user is in dark mode.
   *
   * This can be done without additional changes to account for users copying and pasting content inside the Editor, because of
   * how we detect text colors copied from external editor sources. Where we load the background color from a
   * seperate attribute (data-text-custom-color), instead of the inline style.
   *
   * See the following document for more details on this behaviour
   * https://hello.atlassian.net/wiki/spaces/CCECO/pages/2908658046/Unsupported+custom+text+colors+in+dark+theme+Editor+Job+Story
   */
  const tokenColor = hexToEditorTextPaletteColor(props.color);
  if (tokenColor) {
    paletteColorValue = hexToEditorTextPaletteColor(props.color) || props.color;
  } else {
    if (colorMode === 'dark') {
      // if we have a custom color, we need to check if we are in dark mode
      paletteColorValue = getDarkModeLCHColor(props.color);
    } else {
      // if we are in light mode, we can just set the color
      paletteColorValue = props.color;
    }
  }

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
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
      className="fabric-text-color-mark"
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
      style={style}
    >
      {props.children}
    </span>
  );
}
