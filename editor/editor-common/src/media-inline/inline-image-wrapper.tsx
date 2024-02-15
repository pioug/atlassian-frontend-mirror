/** @jsx jsx */
import type { CSSProperties, FC, ReactElement } from 'react';

import { css, jsx } from '@emotion/react';

import { hexToEditorBorderPaletteColor } from '@atlaskit/editor-palette';

import {
  borderStyle,
  INLINE_IMAGE_ASPECT_RATIO_CSS_VAR_KEY,
  INLINE_IMAGE_BORDER_COLOR_CSS_VAR_KEY,
  INLINE_IMAGE_BORDER_SIZE_CSS_VAR_KEY,
  INLINE_IMAGE_WRAPPER_CLASS_NAME,
  selectedStyle,
  wrapperStyle,
} from './styles';

// The MediaImage component needs to obtain its parent's dimensions.
// To achieve this, we have added an additional wrapper that allows
// for better interaction with the parent element. This is necessary
//  because the parent size changes its box-sizing with the node border.
const sizeWrapperStyle = css({
  display: 'inline-flex',
  width: '100%',
  height: '100%',
});

type Props = {
  children: ReactElement;
  isSelected?: boolean;
  aspectRatio?: number | string;
  borderSize?: number;
  borderColor?: string;
  htmlAttrs?: { [key: string]: string | number | undefined };
};

export const InlineImageWrapper: FC<Props> = ({
  children,
  isSelected,
  aspectRatio,
  borderSize,
  borderColor,
  htmlAttrs = {},
}) => {
  const borderStyleVars =
    borderSize && borderColor
      ? ({
          [INLINE_IMAGE_BORDER_SIZE_CSS_VAR_KEY]: borderSize,
          [INLINE_IMAGE_BORDER_COLOR_CSS_VAR_KEY]:
            hexToEditorBorderPaletteColor(borderColor) || borderColor,
        } as CSSProperties)
      : {};

  const aspectStyleVars = aspectRatio
    ? ({
        [INLINE_IMAGE_ASPECT_RATIO_CSS_VAR_KEY]: aspectRatio,
      } as CSSProperties)
    : {};

  return (
    // eslint-disable-next-line @atlaskit/design-system/prefer-primitives
    <span
      style={{ ...borderStyleVars, ...aspectStyleVars }}
      className={INLINE_IMAGE_WRAPPER_CLASS_NAME}
      css={[
        wrapperStyle,
        borderSize && borderColor && borderStyle,
        isSelected && selectedStyle,
      ]}
      data-testid="inline-image-wrapper"
      {...htmlAttrs}
    >
      <span css={sizeWrapperStyle}>{children}</span>
    </span>
  );
};
