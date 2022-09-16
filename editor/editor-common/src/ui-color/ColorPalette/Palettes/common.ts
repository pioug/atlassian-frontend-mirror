import chromatism from 'chromatism';

import { N800 } from '@atlaskit/theme/colors';

/**
 * For a given color set the alpha channel to alpha
 *
 * @param color color string, suppports HEX, RGB, RGBA etc.
 * @param alpha Alpha channel value as fraction of 1
 * @return CSS RGBA string with applied alpha channel
 */
function setAlpha(color: string, alpha: number): string {
  const { r, g, b } = chromatism.convert(color).rgb;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** this is not new usage - old code extracted from editor-core */
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
export const DEFAULT_BORDER_COLOR = setAlpha(N800, 0.12);
/* eslint-enable @atlaskit/design-system/ensure-design-token-usage */
