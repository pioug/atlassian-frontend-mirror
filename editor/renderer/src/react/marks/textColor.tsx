import React, { useMemo } from 'react';
import { isHex, isRgb, rgbToHex } from '@atlaskit/adf-schema';
import type { TextColorAttributes } from '@atlaskit/adf-schema';
import { hexToEditorTextPaletteColor } from '@atlaskit/editor-palette';
import { useThemeObserver } from '@atlaskit/tokens';

import type { MarkProps } from '../types';

/**
 * This function is duplicated in
 * - @atlaskit/adf-schema
 * - ../nodes/tableCell.tsx
 * it takes a color string, and if the color string is a hex or rgb value
 * it will invert the color and return the inverted color.
 */
function invertCustomColor(customColor: string) {
  let hex: string;

  if (isHex(customColor)) {
    hex = customColor;
  } else if (isRgb(customColor)) {
    hex = rgbToHex(customColor)!;

    if (hex === null) {
      // in some cases the rgb color is invalid, in this case we just return the color
      // See https://product-fabric.atlassian.net/browse/DTR-2003 for a ticket to improve the isRgb function
      // to align with the rgbToHex function
      return customColor;
    }
  } else {
    return customColor;
  }
  const hexWithoutHash = hex!.replace('#', '');

  // This inverts the hex color by
  // 1. converting the hex code to a number
  // 2. XORing it with 0xffffff
  // 3. Converting the result back to hex
  // 4. Removing the leading 1 from the result
  return `#${(Number(`0x1${hexWithoutHash}`) ^ 0xffffff)
    .toString(16)
    .substring(1)
    .toUpperCase()}`;
}

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
      paletteColorValue = invertCustomColor(props.color);
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
      className="fabric-text-color-mark"
      style={style}
    >
      {props.children}
    </span>
  );
}
