import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { N40 } from '@atlaskit/theme/colors';

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const optionsWrapperStyles = css`
  border-bottom: 1px solid ${token('color.border', N40)};
  padding: 10px;
  margin: 10px auto;
`;

export const mediaImageWrapperStyles = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;
