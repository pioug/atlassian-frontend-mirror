import styled from '@emotion/styled';
import { N100 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const DescriptionBylineStyle = styled.span`
  color: ${token('color.text.subtlest', N100)};
  font-size: 12px;

  margin-top: ${token('space.025', '2px')};

  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
