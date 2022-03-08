import { css } from 'styled-components';
import { tableBackgroundBorderColor } from '@atlaskit/adf-schema';
import { N60A, N90 } from '@atlaskit/theme/colors';
import { contextualMenuDropdownWidth } from '../consts';
import { TableCssClassName as ClassName } from '../../types';
import { borderRadius } from '@atlaskit/theme/constants';

export const tablePopupStyles = css`
  .${ClassName.CONTEXTUAL_SUBMENU} {
    border-radius: ${borderRadius()}px;
    background: white;
    box-shadow: 0 4px 8px -2px ${N60A}, 0 0 1px ${N60A};
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
      color: ${N90};
    }
  }
`;
