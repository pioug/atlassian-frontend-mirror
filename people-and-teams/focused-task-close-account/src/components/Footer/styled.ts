import styled from '@emotion/styled';
import gridSizeTimes from '../../util/gridSizeTimes';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const FooterOuter = styled.div({
	display: 'flex',
	width: '100%',
	maxWidth: '640px',
	'@media screen and (max-width: 640px)': {
		justifyContent: 'space-evenly',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		paddingBottom: `${gridSizeTimes(3)}px`,
		alignItems: 'center',
	},
	justifyContent: 'space-between',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	marginTop: `${gridSizeTimes(4)}px`,
});
