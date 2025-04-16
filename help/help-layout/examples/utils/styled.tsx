/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { gridSize } from '@atlaskit/theme/constants';
import { N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const exampleWrapperStyles = css({
	display: 'flex',
	position: 'relative',
	width: '100%',
	height: '100%',
});

export const ExampleWrapper = ({ children }: { children: React.ReactNode }) => (
	<div css={exampleWrapperStyles}>{children}</div>
);

const exampleDefaultContentStyles = css({
	paddingTop: token('space.200', '16px'),
	paddingRight: token('space.200', '16px'),
	paddingBottom: token('space.200', '16px'),
	paddingLeft: token('space.200', '16px'),
});

export const ExampleDefaultContent = ({ children }: { children: React.ReactNode }) => (
	// eslint-disable-next-line @atlaskit/design-system/use-primitives
	<div css={exampleDefaultContentStyles}>{children}</div>
);

const footerContentStyles = css({
	textAlign: 'center',
	fontSize: '11px',
	color: token('color.text.subtlest', N200),
});

export const FooterContent = ({ children }: { children: React.ReactNode }) => (
	<div css={footerContentStyles}>{children}</div>
);

const helpWrapperStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	width: `${gridSize() * 46}px`,
	height: '100%',
	position: 'relative',
	overflowX: 'hidden',
});

export const HelpWrapper = ({ children }: { children: React.ReactNode }) => (
	<div css={helpWrapperStyles}>{children}</div>
);
