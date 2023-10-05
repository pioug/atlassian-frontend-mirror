import { css } from '@emotion/react';
import { transition } from '../styles';
import { B200, N0, N100 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const tickBoxClassName = 'media-card-tickbox';

export const tickboxFixedStyles = `
  background-color: ${token('color.background.input', N0)};
  color: ${token('color.icon.subtle', N100)};
`;

export const getSelectedStyles = (selected?: boolean) =>
  selected
    ? `background-color: ${token('color.icon.information', B200)};
      color: ${token('color.icon.inverse', 'white')};`
    : ``;

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const wrapperStyles = (selected?: boolean) => css`
  ${transition && transition()}
  font-size: 14px;
  width: 14px;
  height: 14px;
  position: absolute;
  top: 7px;
  left: 7px;
  border-radius: 20px;
  color: transparent;
  /* Enforce dimensions and position of "tick" icon */
  span {
    display: block;
    svg {
      height: 14px;
    }
  }
  ${getSelectedStyles(selected)}
`;

wrapperStyles.displayName = 'TickBoxWrapper';
