/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { N200 } from '@atlaskit/theme/colors';

const exampleWrapperStyles = css({
	display: 'flex',
	position: 'relative',
	width: '100%',
	height: '100%',
});

export const ExampleWrapper = ({ children }: { children: React.ReactNode }): JSX.Element => (
	<div css={exampleWrapperStyles}>{children}</div>
);

const exampleDefaultContentStyles = css({
	paddingTop: token('space.200', '16px'),
	paddingRight: token('space.200', '16px'),
	paddingBottom: token('space.200', '16px'),
	paddingLeft: token('space.200', '16px'),
});

export const ExampleDefaultContent = ({ children }: { children: React.ReactNode }): JSX.Element => (
	// eslint-disable-next-line @atlaskit/design-system/use-primitives
	<div css={exampleDefaultContentStyles}>{children}</div>
);

const footerContentStyles = css({
	textAlign: 'center',
	fontSize: '11px',
	color: token('color.text.subtlest', N200),
});

export const FooterContent = ({ children }: { children: React.ReactNode }): JSX.Element => (
	<div css={footerContentStyles}>{children}</div>
);

const buttonsWrapperStyles = css({
	paddingTop: token('space.200', '16px'),
	paddingRight: token('space.200', '16px'),
	paddingBottom: token('space.200', '16px'),
	paddingLeft: token('space.200', '16px'),
	boxSizing: 'border-box',
	display: 'inline-block',
	width: '100%',
});

export const ButtonsWrapper = ({ children }: { children: React.ReactNode }): JSX.Element => (
	<div css={buttonsWrapperStyles}>{children}</div>
);

const controlsWrapperStyles = css({
	paddingTop: token('space.200', '16px'),
	paddingRight: token('space.200', '16px'),
	paddingBottom: token('space.200', '16px'),
	paddingLeft: token('space.200', '16px'),
	boxSizing: 'border-box',
	display: 'inline-block',
	width: '50%',
});

export const ControlsWrapper = ({
	width,
	children,
}: {
	children: React.ReactNode;
	width?: string;
}): JSX.Element => (
	<div
		css={controlsWrapperStyles}
		style={{
			width,
		}}
	>
		{children}
	</div>
);

const helpWrapperStyles = css({
	width: '368px',
	height: '100%',
	position: 'relative',
	overflowX: 'hidden',
	backgroundColor: token('elevation.surface', N200),
});

export const HelpWrapper = ({ children }: { children: React.ReactNode }): JSX.Element => (
	<div css={helpWrapperStyles}>{children}</div>
);

const helpContainerStyles = css({
	display: 'inline-block',
	height: '100%',
	verticalAlign: 'top',
	paddingTop: token('space.200', '16px'),
	paddingRight: token('space.200', '16px'),
	paddingBottom: token('space.200', '16px'),
	paddingLeft: token('space.200', '16px'),
	boxSizing: 'border-box',
	backgroundColor: token('color.background.neutral.bold', N200),
});

export const HelpContainer = ({ children }: { children: React.ReactNode }): JSX.Element => (
	<div css={helpContainerStyles}>{children}</div>
);
