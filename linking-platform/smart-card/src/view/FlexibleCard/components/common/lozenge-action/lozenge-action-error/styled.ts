import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { N800 } from '@atlaskit/theme/colors';
import { getTruncateStyles } from '../../../utils';

export const dropdownItemGroupStyles = css`
  button {
    width: 220px;

    &:hover {
      background-color: inherit;
      cursor: default;
    }
  }
`;

const sharedBlockStyles = css`
  display: flex;
  gap: 0.5rem;
  line-height: 1rem;
  min-width: 0;
  overflow: hidden;
  flex-direction: row;
  align-items: center;
`;

export const contentStyles = css`
  ${sharedBlockStyles};

  margin-top: 2px;
  align-items: flex-start;

  > span,
  > div {
    &[data-smart-element-text] {
      font-size: 0.875rem;
      color: ${token('color.text', N800)};
    }
  }
`;

export const textStyles = (maxLines: number) => css`
  line-height: 1rem;
  white-space: normal;
  ${getTruncateStyles(maxLines)};
`;
