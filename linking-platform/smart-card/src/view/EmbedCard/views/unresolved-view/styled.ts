import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';
import { gs } from '../../../common/utils';

export const containerStyles = css`
  display: grid;
  height: inherit;
`;

export const contentStyles = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
  padding: ${token('space.200', '16px')};
  gap: ${token('space.250', '20px')};
  max-width: ${gs(50)};
`;

export const imageStyles = css`
  height: 120px;
  width: 180px;
  object-fit: contain;
  object-position: center center;
`;

export const titleStyles = css`
  text-align: center;
  margin: 0;
  padding: 0;
`;

export const descriptionStyles = css`
  font-size: 1em;
  text-align: center;
`;
