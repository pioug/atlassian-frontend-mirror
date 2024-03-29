import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

export const MessageContainer = styled.div<{
  isSearch: boolean;
}>`
  padding-left: ${props =>
    props.isSearch ? token('space.100', '8px') : token('space.0', '0px')};
`;

export const MessageList = styled.ul`
  margin: 0;
  padding-left: ${token('space.300', '24px')};
`;
