import { css } from '@emotion/react';

const blockGap = '0.5rem';
const iconGap = '0.5rem';
const titleFontWeight = '500';

export const connectButtonStyles = css`
  justify-content: flex-end;
  margin-top: ${blockGap};
`;

export const titleBlockStyles = css`
  gap: ${blockGap} ${iconGap};
  a {
    font-weight: ${titleFontWeight};
  }
`;

export const mainTextStyles = css`
  margin-top: ${blockGap};
  font-size: 0.75rem;
`;
