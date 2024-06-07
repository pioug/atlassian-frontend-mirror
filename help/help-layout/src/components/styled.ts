/* eslint-disable @atlaskit/design-system/no-exported-keyframes */
/* eslint-disable @atlaskit/design-system/no-styled-tagged-template-expression */
/** @jsx jsx */

import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const Container = styled.div({
	position: 'absolute',
	top: 0,
	bottom: 0,
	left: 0,
	width: '100%',
	display: 'flex',
	flexDirection: 'column',
	backgroundColor: token('elevation.surface', '#FFFFFF'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const Section = styled.div({
	flexGrow: 1,
	display: 'flex',
	flexDirection: 'column',
	minHeight: 0,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const DividerLine = styled.div({
	backgroundColor: token('color.border', colors.N30A),
	height: token('space.025', '2px'),
	width: '100%',
	padding: `0 ${token('space.200', '16px')}`,
	marginTop: token('space.200', '16px'),
	boxSizing: 'border-box',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const HelpFooter = styled.div({
	padding: `${token('space.100', '8px')} 0`,
	boxSizing: 'border-box',
	backgroundColor: token('color.background.neutral', colors.N10),
	borderTop: `${token('space.025', '2px')} solid ${token('color.border', colors.N30)}`,
	justifyContent: 'space-between',
});

/**
 * Loading
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const LoadingContainer = styled.div({
	padding: token('space.200', '16px'),
	height: '100%',
});

type LoadingRectangleProps = {
	contentWidth?: string;
	contentHeight?: string;
	marginTop?: string;
};

const shimmer = keyframes({
	'0%': {
		backgroundPosition: '-300px 0',
	},
	'100%': {
		backgroundPosition: '1000px 0',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const LoadingRectangle = styled.div<LoadingRectangleProps>`
	position: relative;
	height: ${(props) => (props.contentHeight ? props.contentHeight : token('space.200', '1rem'))};
	margin-top: ${(props) => (props.marginTop ? props.marginTop : token('space.100', '8px'))};
	width: ${(props) => (props.contentWidth ? props.contentWidth : '100%')};
	border-radius: ${token('space.025', '2px')};
	animation-duration: 1.2s;
	animation-fill-mode: forwards;
	animation-iteration-count: infinite;
	animation-name: ${shimmer};
	animation-timing-function: linear;
	background-color: ${token('color.background.neutral', colors.N30)};
	background-image: linear-gradient(
		to right,
		${token('color.background.neutral.subtle', colors.N30)} 10%,
		${token('color.background.neutral', colors.N40)} 20%,
		${token('color.background.neutral.subtle', colors.N30)} 30%
	);
	background-repeat: no-repeat;
`;
