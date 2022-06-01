import { css } from '@emotion/react';
import { tableBackgroundBorderColor } from '@atlaskit/adf-schema';
import { N60A, N90 } from '@atlaskit/theme/colors';
import { contextualMenuDropdownWidth } from '../consts';
import { TableCssClassName as ClassName } from '../../types';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

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
    padding: 8px;

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
      margin-left: 4px;
      line-height: 20px;
      color: ${token('color.icon', N90)};
    }
  }
`;
