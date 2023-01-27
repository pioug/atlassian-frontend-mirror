import styled from '@emotion/styled';

import { N50A, N60A } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

const themedBoxShadow = token(
  'elevation.shadow.overlay',
  `0 4px 8px -2px ${N50A}, 0 0 1px ${N60A}`,
);

export const CardWrapper = styled.div`
  display: inline-block;
  border-radius: ${borderRadius()}px;
  box-shadow: ${themedBoxShadow};
`;
