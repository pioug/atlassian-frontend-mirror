// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';
import { IconTitleWrapper } from '../IconAndTitleLayout/styled-emotion';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const SpinnerWrapper = styled(IconTitleWrapper)({
	verticalAlign: 'baseline',
	marginLeft: token('space.025', '2px'),
});
