import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

export const Table = styled.table`
  width: 100%;
`;

export const TableHeading = styled.th`
  position: relative;
  padding-block: ${token('space.100', '8px')};
  line-height: ${token('font.lineHeight.300', '24px')};
`;
