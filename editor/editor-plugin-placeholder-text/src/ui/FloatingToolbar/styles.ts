import { css } from '@emotion/react';

import { N0, N50A, N60A } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

export const container = (height?: number) =>
  css({
    borderRadius: `${borderRadius()}px`,
    boxShadow: token(
      'elevation.shadow.overlay',
      `0 12px 24px -6px ${N50A}, 0 0 1px ${N60A}`,
    ),
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    padding: `${token('space.050', '4px')} ${token('space.100', '8px')}`,
    backgroundColor: token('color.background.input', N0),
    height: height ? `${height}px` : undefined,
  });
