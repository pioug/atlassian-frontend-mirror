/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const searchInputContainerStyles = css({
	order: 0,
	flex: '0 1 auto',
	alignSelf: 'auto',
	width: '100%',
	boxSizing: 'border-box',
});

export const SearchInputContainer = ({ children }: { children: React.ReactNode }) => (
	<div css={searchInputContainerStyles}>{children}</div>
);

const searchInputContainerAiStyles = css({
	width: `calc(100% - ${token('space.300', '24px')} - ${token('space.300', '24px')})`,
	height: token('space.400', '32px'),
	marginLeft: token('space.300', '24px'),
	marginRight: token('space.300', '24px'),
	marginTop: token('space.200', '14px'),
	marginBottom: token('space.200', '14px'),
	order: 0,
	flex: '0 1 auto',
	alignSelf: 'auto',
	boxSizing: 'border-box',
});

export const SearchInputContainerAi = ({ children }: { children: React.ReactNode }) => (
	<div css={searchInputContainerAiStyles}>{children}</div>
);

const searchIconContainerStyles = css({
	width: token('space.300', '24px'),
	height: token('space.300', '24px'),
	paddingLeft: token('space.050', '4px'),
	marginLeft: token('space.negative.025', '-2px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > span': {
		paddingLeft: token('space.050', '4px'),
		height: token('space.300', '24px'),
		width: token('space.300', '24px'),
		boxSizing: 'border-box',
	},
});

export const SearchIconContainer = ({ children }: { children: React.ReactNode }) => (
	<div css={searchIconContainerStyles}>{children}</div>
);

const closeButtonAndSpinnerContainerStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	fontSize: 0,
	paddingRight: token('space.100', '8px'),
	position: 'relative',
	whiteSpace: 'nowrap',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > span': {
		paddingRight: token('space.050', '4px'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > button, & > span': {
		display: 'inline-block',
		verticalAlign: 'middle',
	},
});

export const CloseButtonAndSpinnerContainer = ({ children }: { children: React.ReactNode }) => (
	<div css={closeButtonAndSpinnerContainerStyles}>{children}</div>
);
