// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const FooterOuter = styled.div({
	display: 'flex',
	width: '100%',
	maxWidth: '640px',
	'@media screen and (max-width: 640px)': {
		justifyContent: 'space-evenly',
		paddingBottom: token('space.300'),
		alignItems: 'center',
	},
	justifyContent: 'space-between',
	marginTop: token('space.400'),
});
