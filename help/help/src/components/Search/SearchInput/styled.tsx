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

export const SearchInputContainer = ({ children }: { children: React.ReactNode }): JSX.Element => (
	<div css={searchInputContainerStyles}>{children}</div>
);

const searchInputContainerAiStyles = css({
	width: `calc(100% - ${token('space.300')} - ${token('space.300')})`,
	height: token('space.400'),
	marginLeft: token('space.300'),
	marginRight: token('space.300'),
	marginTop: token('space.200'),
	marginBottom: token('space.200'),
	order: 0,
	flex: '0 1 auto',
	alignSelf: 'auto',
	boxSizing: 'border-box',
});

export const SearchInputContainerAi = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => <div css={searchInputContainerAiStyles}>{children}</div>;

const searchIconContainerStyles = css({
	width: token('space.300'),
	height: token('space.300'),
	paddingLeft: token('space.050'),
	marginLeft: token('space.negative.025'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > span': {
		paddingLeft: token('space.050'),
		height: token('space.300'),
		width: token('space.300'),
		boxSizing: 'border-box',
	},
});

export const SearchIconContainer = ({ children }: { children: React.ReactNode }): JSX.Element => (
	<div css={searchIconContainerStyles}>{children}</div>
);

const closeButtonAndSpinnerContainerStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	fontSize: 0,
	paddingRight: token('space.100'),
	position: 'relative',
	whiteSpace: 'nowrap',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > span': {
		paddingRight: token('space.050'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > button, & > span': {
		display: 'inline-block',
		verticalAlign: 'middle',
	},
});

export const CloseButtonAndSpinnerContainer = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => <div css={closeButtonAndSpinnerContainerStyles}>{children}</div>;
