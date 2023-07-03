import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { N800 } from '@atlaskit/theme/colors';
import { getTruncateStyles } from '../../../../utils';

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

  margin-top: ${token('space.025', '2px')};
  align-items: flex-start;

  > span,
  > div {
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: ${token('color.text', N800)};
  }
`;

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const linkStyles = css`
  ${sharedBlockStyles};

  cursor: pointer;
  font-size: 0.875rem;
  margin-top: 10px;
  margin-left: ${token('space.400', '32px')};
  margin-bottom: ${token('space.025', '2px')};
`;

export const textStyles = (maxLines: number) => css`
  line-height: 1rem;
  white-space: normal;
  ${getTruncateStyles(maxLines)};
`;
