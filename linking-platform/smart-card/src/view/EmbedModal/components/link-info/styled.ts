import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
export const containerStyles = css`
  align-items: center;
  display: flex;
  gap: ${token('space.100', '8px')};
  justify-content: space-between;
  // AK ModalBody has 2px padding top and bottom.
  // Using 14px here to create 16px gap between
  // link info and iframe
  padding: ${token('space.300', '24px')} ${token('space.300', '24px')} 14px
    ${token('space.300', '24px')};
`;

const iconSize = '24px';
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

const height = '20px';
export const titleCss = css`
  flex: 1 1 auto;

  h3 {
    flex: 1 1 auto;
    font-size: 16px;
    font-weight: 400;
    line-height: ${height};

    display: -webkit-box;
    margin-bottom: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    // Fallback options
    @supports not (-webkit-line-clamp: 1) {
      max-height: ${height};
    }
  }
`;

export const actionCss = css`
  display: flex;
  flex: 0 0 auto;
  gap: ${token('space.050', '4px')};
  line-height: ${height};
  span {
    line-height: ${height};
  }

  @media only screen and (max-width: 980px) {
    // Hide resize button if the screen is smaller than the min width
    // or too small to have enough impact to matter.
    .smart-link-resize-button {
      display: none;
    }
  }
`;
