import { css } from '@emotion/react';

import { tableBackgroundBorderColor } from '@atlaskit/adf-schema';
import { N60A, N90 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { TableCssClassName as ClassName } from '../../types';
import {
  contextualMenuDropdownWidth,
  contextualMenuDropdownWidthDnD,
} from '../consts';

export const cellColourPreviewStyles = (selectedColor: string) => css`
  &::before {
    background: ${selectedColor};
  }
`;

export const elementBeforeIconStyles = css`
  margin-right: ${token('space.negative.075', '-6px')};
  display: flex;
`;

// TODO Delete this comment after verifying space token -> previous value `padding: 8px`
// TODO Delete this comment after verifying space token -> previous value `margin-left: 4px`
export const tablePopupStyles = (
  isDragAndDropEnabled: boolean | undefined,
) => css`
  .${ClassName.CONTEXTUAL_SUBMENU} {
    border-radius: ${token('border.radius', '3px')};
    background: ${token('elevation.surface.overlay', 'white')};
    box-shadow: ${token(
      'elevation.shadow.overlay',
      `0 4px 8px -2px ${N60A}, 0 0 1px ${N60A}`,
    )};
    display: block;
    position: absolute;
    top: 0;
    left: ${isDragAndDropEnabled
      ? contextualMenuDropdownWidthDnD
      : contextualMenuDropdownWidth}px;
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
      border-radius: ${token('border.radius', '3px')};
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

  .${ClassName.CONTEXTUAL_MENU_ICON_SMALL} {
    display: flex;

    &::before {
      content: '';
      display: block;
      border: 1px solid ${tableBackgroundBorderColor};
      border-radius: ${token('border.radius', '3px')};
      width: 14px;
      height: 14px;
    }

    &::after {
      content: '›';
      margin-left: ${token('space.050', '4px')};
      line-height: 14px;
      color: ${token('color.icon', N90)};
    }
  }
`;
