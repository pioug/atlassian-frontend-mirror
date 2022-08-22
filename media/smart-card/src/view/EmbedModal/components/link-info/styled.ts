import { css } from '@emotion/core';
import { gs } from '../../../common/utils';
import { token } from '@atlaskit/tokens';
import { N100 } from '@atlaskit/theme/colors';

export const containerStyles = css`
  align-items: center;
  display: flex;
  gap: ${gs(2)};
  justify-content: space-between;
  padding: ${gs(2)} ${gs(3)};
`;

const iconSize = '32px';
export const iconCss = css`
  img,
  span,
  svg {
    height: ${iconSize};
    min-height: ${iconSize};
    max-height: ${iconSize};
    width: ${iconSize};
    min-width: ${iconSize};
    max-width: ${iconSize};
  }
`;

export const titleCss = css`
  flex: 1 1 auto;

  h3 {
    flex: 1 1 auto;

    // EDM-42336: UX is not finalised yet.
    font-size: 20px;
    font-weight: 400;
    line-height: 24px;

    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    // Fallback options
    @supports not (-webkit-line-clamp: 1) {
      max-height: 24px;
    }
  }
`;

export const subtitleCss = css`
  color: ${token('color.text.subtlest', N100)};

  // EDM-42336: UX is not finalised yet.
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
`;

export const actionCss = css`
  flex: 0 0 auto;
`;
