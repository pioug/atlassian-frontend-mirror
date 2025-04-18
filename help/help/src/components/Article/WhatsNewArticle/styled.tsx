/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
import { fontFallback } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';
import { N300, N800 } from '@atlaskit/theme/colors';

const { body } = fontFallback;

const whatsNewTypeTitleStyles = css({
	textDecoration: 'none',
	color: token('color.text.subtlest', N300),
	font: token('font.body', body.medium),
	verticalAlign: 'middle',
	paddingLeft: token('space.050', '4px'),
	whiteSpace: 'normal',
	overflowX: 'hidden',
});

export const WhatsNewTypeTitle = ({ children }: { children: React.ReactNode }) => (
	<span css={whatsNewTypeTitleStyles}>{children}</span>
);

const whatsNewIconContainerStyles = css({
	display: 'block',
	paddingBottom: token('space.100', '8px'),
});

export const WhatsNewIconContainer = ({ children }: { children: React.ReactNode }) => (
	<div css={whatsNewIconContainerStyles}>{children}</div>
);

const whatsNewTitleText = css({
	textDecoration: 'none',
	color: token('color.text', N800),
	font: token('font.body'),
	fontWeight: token('font.weight.semibold'),
	whiteSpace: 'normal',
	overflowX: 'hidden',
	paddingBottom: token('space.100', '8px'),
	display: 'block',
});

export const WhatsNewTitleText = ({ children }: { children: React.ReactNode }) => (
	<span css={whatsNewTitleText}>{children}</span>
);

const relatedLinkContainerStyles = css({
	marginBottom: token('space.100', '8px'),
});

export const RelatedLinkContainer = ({ children }: { children: React.ReactNode }) => (
	// eslint-disable-next-line @atlaskit/design-system/use-primitives
	<div css={relatedLinkContainerStyles}>{children}</div>
);

const externalLinkIconContainerStyles = css({
	display: 'inline-block',
	verticalAlign: 'middle',
	paddingLeft: token('space.050', '4px'),
});

export const ExternalLinkIconContainer = ({ children }: { children: React.ReactNode }) => (
	<div css={externalLinkIconContainerStyles}>{children}</div>
);
