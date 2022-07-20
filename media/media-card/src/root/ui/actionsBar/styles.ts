import { css } from '@emotion/react';

import { transition } from '../../../styles';

export const actionsBarClassName = 'media-card-actions-bar';

export const fixedActionBarStyles = `opacity: 1;`;

export const wrapperStyles = (isFixed?: boolean) => css`
  ${isFixed ? fixedActionBarStyles : 'opacity: 0;'}
  ${transition()}
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
`;

wrapperStyles.displayName = 'ActionsBarWrapper';
