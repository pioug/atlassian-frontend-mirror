import { css } from '@emotion/react';

import { tableBackgroundBorderColor } from '@atlaskit/adf-schema';
import { N60A, N90 } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { TableCssClassName as ClassName } from '../../types';
import { contextualMenuDropdownWidth } from '../consts';

export const cellColourPreviewStyles = (selectedColor: string) => css`
  &::before {
    background: ${selectedColor};
  }
`;

// TODO Delete this comment after verifying space token -> previous value `padding: 8px`
// TODO Delete this comment after verifying space token -> previous value `margin-left: 4px`
export const tablePopupStyles = css`
  .${ClassName.CONTEXTUAL_SUBMENU} {
    border-radius: ${borderRadius()}px;
    background: ${token('elevation.surface.overlay', 'white')};
    box-shadow: ${token(
      'elevation.shadow.overlay',
      `0 4px 8px -2px ${N60A}, 0 0 1px ${N60A}`,
    )};
    display: block;
    position: absolute;
    top: 0;
    left: ${contextualMenuDropdownWidth}px;
    padding: ${token('space.100', '8px')};

    > div {
      padding: 0;
    }
  }

  .${ClassName.CONTEXTUAL_MENU_ICON} {
    display: flex;

    &::before {
      content: '';
      display: block;
      border: 1px solid ${tableBackgroundBorderColor};
      border-radius: ${borderRadius()}px;
      width: 20px;
      height: 20px;
    }

    &::after {
      content: '›';
      margin-left: ${token('space.050', '4px')};
      line-height: 20px;
      color: ${token('color.icon', N90)};
    }
  }
`;
