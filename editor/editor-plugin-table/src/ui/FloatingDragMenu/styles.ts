import { css } from '@emotion/react';

import { tableBackgroundBorderColor } from '@atlaskit/adf-schema';
import { N60A, N90 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { TableCssClassName as ClassName } from '../../types';
import { dragMenuDropdownWidth } from '../consts';

export const cellColourPreviewStyles = (selectedColor: string) => css`
  &::before {
    background: ${selectedColor};
  }
`;

export const elementBeforeIconStyles = css`
  margin-right: ${token('space.negative.075', '-6px')};
  display: flex;
`;

export const dragMenuBackgroundColorStyles = css`
  .${ClassName.DRAG_SUBMENU} {
    border-radius: ${token('border.radius', '3px')};
    background: ${token('elevation.surface.overlay', 'white')};
    box-shadow: ${token(
      'elevation.shadow.overlay',
      `0 4px 8px -2px ${N60A}, 0 0 1px ${N60A}`,
    )};
    display: block;
    position: absolute;
    top: 0;
    left: ${dragMenuDropdownWidth}px;
    padding: ${token('space.100', '8px')};

    > div {
      padding: 0;
    }
  }

  .${ClassName.DRAG_SUBMENU_ICON} {
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

export const toggleStyles = css`
  display: flex;
  input[type='checkbox'] {
    width: 30px;
    height: 14px;
    pointer-events: initial;
    cursor: pointer;
  }
  > label {
    margin: 0px;
    pointer-events: none;
    > span {
      pointer-events: none;
    }
  }
`;
