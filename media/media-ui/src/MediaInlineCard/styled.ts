import styled from 'styled-components';
import { ComponentClass, HTMLAttributes } from 'react';
import { N200 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';

// TODO: Dark mode colors to be added in the future.
export const NoLinkAppearance: ComponentClass<HTMLAttributes<{}>> = styled.span`
  color: ${themed({ light: N200 })};
`;
