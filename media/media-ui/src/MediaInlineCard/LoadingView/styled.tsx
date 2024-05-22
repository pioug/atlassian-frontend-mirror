import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';
import { IconTitleWrapper } from '../IconAndTitleLayout/styled';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const SpinnerWrapper = styled(IconTitleWrapper)({
  verticalAlign: 'baseline',
  marginLeft: token('space.025', '2px'),
});
