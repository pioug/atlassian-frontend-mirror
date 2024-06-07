import styled from '@emotion/styled';
import { B500, B200 } from '@atlaskit/theme/colors';
import { h700 } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';
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
export const SectionMessageOuter = styled.div({
	margin: `${gridSizeTimes(3)}px 0`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const MainInformationList = styled.ul({
	'> li b': {
		fontWeight: 600,
	},
	'p + ul': {
		marginTop: `${gridSizeTimes(1.5)}px`,
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const IconHoverWrapper = styled.span({
	color: token('color.background.information.bold', B500),
	paddingLeft: `${gridSizeTimes(0.5)}px`,
	'&:hover': {
		color: token('color.background.information.bold.hovered', B200),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const InlineDialogContent = styled.div({
	li: {
		marginLeft: `${gridSizeTimes(3)}px`,
		marginTop: `${gridSizeTimes(1)}px`,
		paddingLeft: `${gridSizeTimes(1)}px`,
	},
});
