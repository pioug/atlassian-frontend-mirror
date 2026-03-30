/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
import Heading from '@atlaskit/heading';
import { token } from '@atlaskit/tokens';

const articlesListItemWrapperStyles = css({
	position: 'relative',
	boxSizing: 'border-box',
	paddingTop: token('space.100'),
	paddingRight: token('space.100'),
	paddingBottom: token('space.100'),
	paddingLeft: token('space.100'),
	display: 'block',
	textDecoration: 'none',
	cursor: 'pointer',
	color: token('color.text.subtlest'),
	// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
	borderRadius: token('radius.small', '3px'),
	backgroundColor: token('color.background.neutral.subtle'),
	'&:hover, &:focus, &:visited, &:active': {
		textDecoration: 'none',
		outline: 'none',
		outlineOffset: 'none',
	},
	'&:focus': {
		boxShadow: `${token('color.border.focused')} 0px 0px 0px 2px inset`,
	},
	'&:hover': {
		backgroundColor: token('color.background.neutral.subtle.hovered'),
	},
	'&:active': {
		backgroundColor: token('color.background.neutral.subtle.pressed'),
	},
});

export const ArticlesListItemWrapper: React.ForwardRefExoticComponent<
	Omit<
		{
			[rest: string]: any;
			children: React.ReactNode;
			styles?: React.CSSProperties;
		},
		'ref'
	> &
		React.RefAttributes<HTMLAnchorElement>
> = React.forwardRef<
	HTMLAnchorElement,
	{
		[rest: string]: any;
		children: React.ReactNode;
		styles?: React.CSSProperties;
	}
>(
	({ styles, children, ...rest }, ref): JSX.Element => (
		// eslint-disable-next-line @atlaskit/design-system/no-html-anchor, @atlaskit/ui-styling-standard/enforce-style-prop
		<a ref={ref} css={articlesListItemWrapperStyles} style={styles} {...rest}>
			{children}
		</a>
	),
);

const articlesListItemContainerStyles = css({
	width: '100%',
	whiteSpace: 'nowrap',
	display: 'flex',
});

export const ArticlesListItemContainer = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => (
	// eslint-disable-next-line @atlaskit/design-system/use-primitives
	<div css={articlesListItemContainerStyles}>{children}</div>
);

const articlesListItemTitleSectionStyles = css({
	display: 'flex',
	flexDirection: 'column',
	flexGrow: 1,
});

export const ArticlesListItemTitleSection = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => <div css={articlesListItemTitleSectionStyles}>{children}</div>;

const articlesListItemLinkIconStyles = css({
	alignSelf: 'auto',
	paddingInlineStart: token('space.050'),
	verticalAlign: 'middle',
});

export const ArticlesListItemLinkIcon = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => (
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx
	<span css={articlesListItemLinkIconStyles} aria-label="Opens in a new window">
		{children}
	</span>
);

const articlesListItemTitleTextStyles = css({
	textDecoration: 'none',
	color: token('color.text'),
	font: token('font.heading.xsmall'),
	display: 'inline-block',
	whiteSpace: 'normal',
	overflow: 'hidden',
	marginBottom: token('space.100'),
});

export const ArticlesListItemTitleText = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => (
	<div css={articlesListItemTitleTextStyles}>
		<Heading size="xsmall" as="h4">
			{children}
		</Heading>
	</div>
);

const articlesListItemDescriptionStyles = css({
	display: 'block',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: '20px',
	color: token('color.text.subtle'),
	margin: 0,
	paddingBottom: token('space.025'),
});

export const ArticlesListItemDescription = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => (
	// eslint-disable-next-line @atlaskit/design-system/use-primitives-text
	<p css={articlesListItemDescriptionStyles}>{children}</p>
);

const articlesListItemSourceStyles = css({
	display: 'flex',
	alignItems: 'center',
	font: token('font.heading.xxsmall'),
	color: token('color.text.subtlest'),
	paddingTop: token('space.050'),
	paddingRight: 0,
	paddingBottom: token('space.050'),
	paddingLeft: 0,
	fontWeight: token('font.weight.bold'),
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	textTransform: 'uppercase',
});

export const ArticlesListItemSource = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => (
	// eslint-disable-next-line @atlaskit/design-system/use-primitives-text
	<div css={articlesListItemSourceStyles}>{children}</div>
);

const articlesListItemTrustFactorStyles = css({
	display: 'flex',
	alignItems: 'center',
	font: token('font.body.small'),
	color: token('color.text.subtlest'),
	paddingTop: token('space.025'),
});

export const ArticlesListItemTrustFactor = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => <div css={articlesListItemTrustFactorStyles}>{children}</div>;

const articlesListItemViewCountStyles = css({
	paddingRight: token('space.100'),
});

export const ArticlesListItemViewCount = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => <span css={articlesListItemViewCountStyles}>{children}</span>;

const articlesListItemHelpfulCountStyles = css({
	display: 'inline-flex',
	paddingRight: token('space.100'),
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'& > span': {
		marginRight: token('space.025'),
	},
});

export const ArticlesListItemHelpfulCount = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => <span css={articlesListItemHelpfulCountStyles}>{children}</span>;

const articlesListItemLastModifiedStyles = css({
	font: token('font.body.small'),
	color: token('color.text.subtlest'),
	paddingTop: token('space.050'),
	paddingRight: 0,
	paddingBottom: token('space.050'),
	paddingLeft: 0,
});

export const ArticlesListItemLastModified = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => <div css={articlesListItemLastModifiedStyles}>{children}</div>;

const articlesListItemDescriptionHighlightStyles = css({
	backgroundColor: token('color.background.accent.yellow.subtlest'),
});

export const ArticlesListItemDescriptionHighlight = ({
	key,
	children,
}: {
	children: React.ReactNode;
	key: number | string;
}): JSX.Element => (
	<mark key={key} css={articlesListItemDescriptionHighlightStyles}>
		{children}
	</mark>
);
