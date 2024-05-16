import React, { useMemo } from 'react';
import { getDarkModeLCHColor } from '@atlaskit/adf-schema';
import type { TextColorAttributes } from '@atlaskit/adf-schema';
import { hexToEditorTextBackgroundPaletteColor } from '@atlaskit/editor-palette';
import { useThemeObserver } from '@atlaskit/tokens';

import type { MarkProps } from '../types';

export default function BackgroundColor(props: MarkProps<TextColorAttributes>) {
  const { colorMode } = useThemeObserver();
  let paletteColorValue: string;

  /**
   * Documents can contain custom colors when content has been migrated from the old editor, or created via APIs.
   *
   * This behaviour predates the introduction of dark mode.
   *
   * Without the inversion logic below, text with custom colors, can be hard to read when the user loads the page in dark mode.
   *
   * This introduces inversion of the presentation of the custom text background colors when the user is in dark mode.
   *
   * This can be done without additional changes to account for users copying and pasting content inside the Editor, because of
   * how we detect text background colors copied from external editor sources. Where we load the background color from a
   * separate attribute (data-background-custom-color), instead of the inline style.
   *
   * See the following document for more details on this behaviour
   * https://hello.atlassian.net/wiki/spaces/CCECO/pages/2908658046/Unsupported+custom+text+colors+in+dark+theme+Editor+Job+Story
   */
  const tokenColor = hexToEditorTextBackgroundPaletteColor(props.color);
  if (tokenColor) {
    paletteColorValue = tokenColor;
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
      }) as React.CSSProperties,
    [paletteColorValue],
  );

  return (
    <span
      {...props.dataAttributes}
      data-background-custom-color={props.color}
      className="fabric-background-color-mark"
      style={style}
    >
      {props.children}
    </span>
  );
}
