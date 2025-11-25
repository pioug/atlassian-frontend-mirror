// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Quiz = styled.div({
	display: 'flex',
	flexDirection: 'column',
	font: token('font.body.large'),
	width: '100%',
	padding: `${token('space.250', '20px')} ${token('space.400')} ${token('space.250', '20px')} 0`,
	border: `${token('border.width')} solid grey`,
	borderRadius: token('radius.xxlarge'),
	minWidth: '300px',
	maxWidth: '380px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const QuizName = styled.div({
	margin: '3px 0',
	font: token('font.heading.large'),
	paddingLeft: token('space.250', '20px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Header = styled.div({
	display: 'flex',
	alignItems: 'start',
	flexDirection: 'column',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const QuizBlock = styled.ul({
	paddingLeft: token('space.200'),
	marginBottom: token('space.200'),
	marginTop: 0,
	minHeight: '105px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Footer = styled.div({
	paddingLeft: token('space.100', '8px'),
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	maxHeight: '32px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Question = styled.div({
	paddingLeft: token('space.075', '6px'),
	marginBottom: token('space.150'),
	font: token('font.body'),
	color: '#707070',
	textAlign: 'left',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const NavQuiz = styled.div({
	display: 'flex',
	alignContent: 'center',
	justifyContent: 'center',
	padding: `0 0 0 ${token('space.050')}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':hover': {
		color: 'grey',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const NavAction = styled.span({
	font: token('font.body'),
	fontWeight: token('font.weight.medium'),
	display: 'flex',
	alignItems: 'center',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Score = styled.div({
	marginTop: token('space.150'),
	paddingLeft: token('space.075', '6px'),
	display: 'flex',
	flexDirection: 'column',
	textAlign: 'start',
	fontWeight: token('font.weight.regular'),
	gap: token('space.075'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Answer = styled.div({
	display: 'flex',
	alignItems: 'flex-end',
	maxHeight: '25px',
});
