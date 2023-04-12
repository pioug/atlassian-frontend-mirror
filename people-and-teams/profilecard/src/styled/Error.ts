import styled from '@emotion/styled';

import { N200 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';
import { h400 } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import { errorIconColor, errorTextColor, errorTitleColor } from './constants';

export const ErrorWrapper = styled.div`
  text-align: center;
  padding: ${token('space.300', '24px')};
  color: ${errorIconColor};
`;

export const ErrorTitle = styled.p`
  color: ${errorTitleColor};
  line-height: ${gridSize() * 3}px;
  margin: ${token('space.100', '8px')} 0;
`;

export const ErrorText = styled.span`
  color: ${errorTextColor};
`;

export const TeamErrorTitle = styled.p`
  ${h400};
`;

export const TeamErrorText = styled.p`
  color: ${token('color.text.subtlest', N200)};
  margin-top: ${token('space.100', '8px')};
`;
