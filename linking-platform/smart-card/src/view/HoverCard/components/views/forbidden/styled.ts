import { css } from '@emotion/react';

const blockGap = '0rem';
const titleFontWeight = '600';

export const titleBlockStyles = css`
  justify-content: center;
  font-weight: ${titleFontWeight};
`;

export const mainTextStyles = css`
  display: inline;
  justify-content: center;
  margin-top: ${blockGap};
  font-size: 0.75rem;
  text-align: center;
`;

export const connectButtonStyles = css`
  justify-content: center;
  margin-top: ${blockGap};
`;
