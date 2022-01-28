import styled from 'styled-components';

import { DN50A, DN60A, N50A, N60A } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { token } from '@atlaskit/tokens';

const themedBoxShadow = themed({
  light: token(
    'elevation.shadow.overlay',
    `0 4px 8px -2px ${N50A}, 0 0 1px ${N60A}`,
  ),
  dark: token(
    'elevation.shadow.overlay',
    `0 4px 8px -2px ${DN50A}, 0 0 1px ${DN60A}`,
  ),
});

export const CardWrapper = styled.div`
  display: inline-block;
  border-radius: 3px;
  box-shadow: ${themedBoxShadow};
`;
