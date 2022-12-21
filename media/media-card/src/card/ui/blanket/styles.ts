import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';
import { transition } from '../../styles';
import { N90A } from '@atlaskit/theme/colors';

export const blanketClassName = 'media-card-blanket';

export const fixedBlanketStyles = `background-color: ${token(
  'color.blanket',
  N90A,
)};`;

export const blanketStyles = (isFixed?: boolean) => css`
  ${transition()}
  position: absolute;
  width: 100%;
  height: 100%;
  max-height: 100%;
  max-width: 100%;
  left: 0;
  top: 0;
  ${isFixed ? fixedBlanketStyles : ''}
`;

blanketStyles.displayName = 'Blanket';
