import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { N0, N40, N50, N500, R400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const UserContainer = styled.span<{ selected: boolean; error: boolean }>`
  display: inline-flex;
  align-items: center;
  height: ${token('space.200', '16px')};
  padding: 1px;
  border-radius: 10px;
  cursor: pointer;
  user-select: none;

  ${({ selected, error }) => {
    if (selected) {
      if (error) {
        return css`
          color: ${token('color.text.inverse', N0)};
          background-color: ${token('color.background.danger.bold', R400)};
          text-decoration: wavy underline;
          text-decoration-thickness: 1px;
          text-decoration-skip-ink: none;
          text-decoration-color: ${token('color.text.inverse', N0)};
        `;
      } else {
        return css`
          color: ${token('color.text', N0)};
          background-color: ${token('color.background.selected', N500)};
          box-shadow: 0 0 0 1px ${token('color.border.selected', 'transparent')};
        `;
      }
    } else {
      if (error) {
        return css`
          color: ${token('color.text.subtle', N500)};
          background-color: ${token('color.background.neutral', N40)};
          text-decoration: wavy underline;
          text-decoration-thickness: 1px;
          text-decoration-skip-ink: none;
          text-decoration-color: ${token('color.text.danger', R400)};

          &:hover {
            background-color: ${token('color.background.neutral.hovered', N50)};
          }
        `;
      } else {
        return css`
          color: ${token('color.text.subtle', N500)};
          background-color: ${token('color.background.neutral', N40)};

          &:hover {
            background-color: ${token('color.background.neutral.hovered', N50)};
          }
        `;
      }
    }
  }}
`;

export const NameContainer = styled.span`
  margin-left: ${token('space.075', '6px')};
  margin-right: ${token('space.100', '8px')};
`;

/* Override Avatar styles to match design spec */
// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const AvatarWrapper = styled.span`
  > div {
    top: 3px;

    > span {
      margin: 0;
    }
  }
`;
