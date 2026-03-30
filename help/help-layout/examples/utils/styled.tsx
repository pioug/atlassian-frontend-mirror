/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';

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
	paddingTop: token('space.200'),
	paddingRight: token('space.200'),
	paddingBottom: token('space.200'),
	paddingLeft: token('space.200'),
});

export const ExampleDefaultContent = ({ children }: { children: React.ReactNode }): JSX.Element => (
	// eslint-disable-next-line @atlaskit/design-system/use-primitives
	<div css={exampleDefaultContentStyles}>{children}</div>
);

const footerContentStyles = css({
	textAlign: 'center',
	fontSize: '11px',
	color: token('color.text.subtlest'),
});

export const FooterContent = ({ children }: { children: React.ReactNode }): JSX.Element => (
	<div css={footerContentStyles}>{children}</div>
);

const helpWrapperStyles = css({
	width: '368px',
	height: '100%',
	position: 'relative',
	overflowX: 'hidden',
});

export const HelpWrapper = ({ children }: { children: React.ReactNode }): JSX.Element => (
	<div css={helpWrapperStyles}>{children}</div>
);
