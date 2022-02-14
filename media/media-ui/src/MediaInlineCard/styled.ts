import styled from '@emotion/styled';
import { N200 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';

// TODO: Dark mode colors to be added in the future.
export const NoLinkAppearance = styled.span`
  color: ${themed({ light: N200 })};
`;
