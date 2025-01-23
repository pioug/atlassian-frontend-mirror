/* eslint-disable @compiled/shorthand-property-sorting */
/* eslint-disable @atlaskit/design-system/use-tokens-typography */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useMemo } from 'react';

import { css, cssMap, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { SmartLinkSize, SmartLinkTheme } from '../../../../../constants';
import { useMouseDownEvent } from '../../../../../state/analytics/useLinkClicked';
import { hasWhiteSpace } from '../../utils';

import LinkOld from './LinkOld';
import { type LinkProps } from './types';

const DEFAULT_MAX_LINES = 2;
const MAXIMUM_MAX_LINES = 2;
const MINIMUM_MAX_LINES = 1;

const containerStyles = css({
	flex: '1 1 auto',
});

const getMaxLines = (maxLines: number): 1 | 2 => {
	if (maxLines > MAXIMUM_MAX_LINES) {
		return DEFAULT_MAX_LINES;
	}

	if (maxLines < MINIMUM_MAX_LINES) {
		return MINIMUM_MAX_LINES;
	}

	return maxLines as 1 | 2;
};

const withTooltip = (trigger: React.ReactNode, content: string, testId: string) => (
	<Tooltip content={content} testId={`${testId}-tooltip`} tag="span">
		{trigger}
	</Tooltip>
);

const linkStyleSizeMap = cssMap({
	xlarge: {
		font: token('font.heading.medium'),
		fontWeight: token('font.weight.regular'),
		lineHeight: '1.5rem',
	},
	large: {
		font: token('font.body'),
		fontWeight: token('font.weight.regular'),
		lineHeight: '1rem',
	},
	medium: {
		font: token('font.body'),
		fontWeight: token('font.weight.regular'),
		lineHeight: '1rem',
	},
	small: {
		font: token('font.body.UNSAFE_small'),
		fontWeight: token('font.weight.regular'),
		lineHeight: '1rem',
	},
});

const baseAnchorStyle = css({
	flex: '1 1 auto',
});

const workBreakStyleMap = cssMap({
	true: {
		wordBreak: 'break-word',
	},
	false: {
		wordBreak: 'break-all',
	},
});

const anchorConstantsStyles = css({
	display: '-webkit-box',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	WebkitBoxOrient: 'vertical',
});

const anchorLineClampMap = cssMap({
	1: {
		WebkitLineClamp: 1,
	},
	2: {
		WebkitLineClamp: 2,
	},
});

const anchorLinkLineHeight1Map = cssMap({
	xlarge: {
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: 'calc(1 * 1.5rem)',
		},
	},
	large: {
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: 'calc(1 * 1rem)',
		},
	},
	medium: {
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: 'calc(1 * 1rem)',
		},
	},
	small: {
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: 'calc(1 * 1rem)',
		},
	},
});

const anchorLinkLineHeight2Map = cssMap({
	xlarge: {
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: 'calc(2 * 1.5rem)',
		},
	},
	large: {
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: 'calc(2 * 1rem)',
		},
	},
	medium: {
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: 'calc(2 * 1rem)',
		},
	},
	small: {
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: 'calc(2 * 1rem)',
		},
	},
});

const themeStyleMap = cssMap({
	grey: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'a&': {
			color: token('color.text.subtlest', '#626F86'),
			'&:active, &:visited, &:focus, &:hover': {
				color: token('color.text.subtlest', '#626F86'),
				textDecoration: 'underline',
			},
			font: token('font.body.UNSAFE_small'),
		},
	},
	black: {
		color: token('color.text.subtle', '#44546F'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&:active': {
			color: token('color.text', '#172B4D'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&:hover': {
			color: token('color.text.subtle', '#44546F'),
			textDecoration: 'underline',
		},
	},
	link: {
		color: token('color.link', '#0C66E4'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&:active': {
			color: token('color.link.pressed', '#0055CC'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&:hover': {
			color: token('color.link', '#0C66E4'),
			textDecoration: 'underline',
		},
	},
});

/**
 * A base element that represent an anchor.
 * @internal
 * @param {LinkProps} LinkProps - The props necessary for the Link element.
 * @see LinkIcon
 */
const LinkNew = ({
	hideTooltip,
	maxLines = DEFAULT_MAX_LINES,
	name,
	className,
	size = SmartLinkSize.Medium,
	testId = 'smart-element-link',
	text,
	theme = SmartLinkTheme.Link,
	url,
	onClick,
	target = '_blank',
}: LinkProps) => {
	const onMouseDown = useMouseDownEvent();

	const hasSpace = useMemo(() => (text ? hasWhiteSpace(text) : false), [text]);

	const anchor = (
		// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
		<a
			css={[
				baseAnchorStyle,
				linkStyleSizeMap[size],
				anchorLineClampMap[getMaxLines(maxLines)],
				anchorConstantsStyles,
				workBreakStyleMap[hasSpace ? 'true' : 'false'],
				getMaxLines(maxLines) === 1 && anchorLinkLineHeight1Map[size],
				getMaxLines(maxLines) === 2 && anchorLinkLineHeight2Map[size],
				themeStyleMap[theme],
			]}
			data-smart-element={name}
			data-smart-element-link
			data-testid={testId}
			onClick={onClick}
			onMouseDown={onMouseDown}
			href={url}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
			// We do not want set the target if it is the default value of '_self'. This prevents link
			// click issues in Confluence and Trello which rely on it not being set unless necessary.
			{...(target !== '_self' && { target })}
		>
			{text}
		</a>
	);

	return (
		<span css={containerStyles}>
			{hideTooltip || text === undefined ? anchor : withTooltip(anchor, text, testId)}
		</span>
	);
};

const Link = (props: LinkProps): JSX.Element => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <LinkNew {...props} />;
	} else {
		return <LinkOld {...props} />;
	}
};

export default Link;
