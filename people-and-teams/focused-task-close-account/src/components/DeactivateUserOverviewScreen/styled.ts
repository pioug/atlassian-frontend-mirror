import styled from '@emotion/styled';
import { h700 } from '@atlaskit/theme/typography';
import gridSizeTimes from '../../util/gridSizeTimes';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const Screen = styled.div({
	width: '100%',
	maxWidth: '640px',
	marginBottom: `${gridSizeTimes(2)}px`,
	'> p': {
		marginTop: `${gridSizeTimes(3)}px`,
		marginBottom: `${gridSizeTimes(2)}px`,
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const LoadingWrapper = styled.div({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	height: '500px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const Title = styled.div(h700, {
	marginBottom: `${gridSizeTimes(3)}px`,
	marginTop: 0,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const MainInformationList = styled.ul({
	'> li b': {
		fontWeight: 600,
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const AccessibleSitesWrapper = styled.div({
	marginTop: `${gridSizeTimes(1.5)}px`,
});
