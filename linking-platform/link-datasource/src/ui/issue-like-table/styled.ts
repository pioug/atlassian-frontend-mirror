import styled from '@emotion/styled';

import { N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const Table = styled.table`
  width: 100%;
`;

export const TableHeading = styled.th`
  cursor: grab;
  position: relative;
  padding-block: ${token('space.100', '8px')};
  line-height: ${token('font.lineHeight.300', '24px')};
  border-bottom: 2px solid ${token('color.background.accent.gray.subtler', N40)};
  & [data-testid='datasource-header-content--container'] {
    margin-top: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: ${token('font.lineHeight.300', '24px')};
  }
`;

export const EmptyStateTableHeading = styled(TableHeading)`
  &:first-child {
    padding-left: ${token('space.100', '8px')};
  }
`;
