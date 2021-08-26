import { CSSObject } from '@emotion/core';

import { N200 } from '@atlaskit/theme/colors';
import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';
import { headingSizes } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

const gridSize = gridSizeFn();

const itemSidePadding = gridSize * 2.5;

const itemHeadingContentHeight = headingSizes.h100.lineHeight;
const itemHeadingFontSize = headingSizes.h100.size;

export const headingItemCSS = {
  textTransform: 'uppercase',
  fontSize: itemHeadingFontSize,
  lineHeight: itemHeadingContentHeight / itemHeadingFontSize,
  fontWeight: 700,
  color: token('color.text.lowEmphasis', N200),
  padding: `0 ${itemSidePadding}px`,
} as CSSObject;
