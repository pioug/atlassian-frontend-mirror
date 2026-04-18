/* eslint-disable @atlaskit/ui-styling-standard/use-compiled -- legacy @emotion in quiz-widget; migrate go/DSP-18766 */
/* eslint-disable @atlaskit/ui-styling-standard/no-styled -- legacy @emotion in quiz-widget; migrate go/DSP-18766 */
import styled, { type StyledComponent } from '@emotion/styled';
import { token } from '@atlaskit/tokens';
import type { Theme } from '@emotion/react';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Quiz: StyledComponent<
	{
		as?: React.ElementType;
		theme?: Theme;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	{}
> = styled.div({
	display: 'flex',
	flexDirection: 'column',
	font: token('font.body.large'),
	width: '100%',
	padding: `${token('space.250')} ${token('space.400')} ${token('space.250')} 0`,
	border: `${token('border.width')} solid grey`,
	borderRadius: token('radius.xxlarge'),
	minWidth: '300px',
	maxWidth: '380px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const QuizName: StyledComponent<
	{
		as?: React.ElementType;
		theme?: Theme;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	{}
> = styled.div({
	margin: '3px 0',
	font: token('font.heading.large'),
	paddingLeft: token('space.250'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Header: StyledComponent<
	{
		as?: React.ElementType;
		theme?: Theme;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	{}
> = styled.div({
	display: 'flex',
	alignItems: 'start',
	flexDirection: 'column',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const QuizBlock: StyledComponent<
	{
		as?: React.ElementType;
		theme?: Theme;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>,
	{}
> = styled.ul({
	paddingLeft: token('space.200'),
	marginBottom: token('space.200'),
	marginTop: 0,
	minHeight: '105px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Footer: StyledComponent<
	{
		as?: React.ElementType;
		theme?: Theme;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	{}
> = styled.div({
	paddingLeft: token('space.100'),
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	maxHeight: '32px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Question: StyledComponent<
	{
		as?: React.ElementType;
		theme?: Theme;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	{}
> = styled.div({
	paddingLeft: token('space.075'),
	marginBottom: token('space.150'),
	font: token('font.body'),
	color: '#707070',
	textAlign: 'left',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const NavQuiz: StyledComponent<
	{
		as?: React.ElementType;
		theme?: Theme;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	{}
> = styled.div({
	display: 'flex',
	alignContent: 'center',
	justifyContent: 'center',
	padding: `0 0 0 ${token('space.050')}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':hover': {
		color: 'grey',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const NavAction: StyledComponent<
	{
		as?: React.ElementType;
		theme?: Theme;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
	{}
> = styled.span({
	font: token('font.body'),
	fontWeight: token('font.weight.medium'),
	display: 'flex',
	alignItems: 'center',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Score: StyledComponent<
	{
		as?: React.ElementType;
		theme?: Theme;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	{}
> = styled.div({
	marginTop: token('space.150'),
	paddingLeft: token('space.075'),
	display: 'flex',
	flexDirection: 'column',
	textAlign: 'start',
	fontWeight: token('font.weight.regular'),
	gap: token('space.075'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Answer: StyledComponent<
	{
		as?: React.ElementType;
		theme?: Theme;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	{}
> = styled.div({
	display: 'flex',
	alignItems: 'flex-end',
	maxHeight: '25px',
});
