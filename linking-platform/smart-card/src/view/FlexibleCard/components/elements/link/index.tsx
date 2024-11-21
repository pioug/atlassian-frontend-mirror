/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useMemo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, type SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { SmartLinkInternalTheme, SmartLinkSize, SmartLinkTheme } from '../../../../../constants';
import { useMouseDownEvent } from '../../../../../state/analytics/useLinkClicked';
import {
	getLinkLineHeight,
	getLinkSizeStyles,
	getTruncateStyles,
	hasWhiteSpace,
} from '../../utils';

import { type LinkProps } from './types';

const DEFAULT_MAX_LINES = 2;
const MAXIMUM_MAX_LINES = 2;
const MINIMUM_MAX_LINES = 1;

const containerStyles = css({
	flex: '1 1 auto',
});

const getThemeStyles = (theme: SmartLinkTheme | SmartLinkInternalTheme): SerializedStyles => {
	switch (theme) {
		case SmartLinkInternalTheme.Grey:
			// We are being specifc with the CSS selectors to ensure that Confluence overrides
			// do not affect our internal Smart Card styles
			return css({
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
				'a&': {
					color: token('color.text.subtlest', '#626F86'),
					'&:active, &:visited, &:focus, &:hover': {
						color: token('color.text.subtlest', '#626F86'),
						textDecoration: 'underline',
					},
					font: token('font.body.UNSAFE_small'),
				},
			});
		// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
		case SmartLinkTheme.Black:
			return css({
				color: token('color.text.subtle', '#44546F'),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
				':active': {
					color: token('color.text', '#172B4D'),
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
				':hover': {
					color: token('color.text.subtle', '#44546F'),
					textDecoration: 'underline',
				},
			});
		case SmartLinkTheme.Link:
		default:
			return css({
				color: token('color.link', '#0C66E4'),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
				':active': {
					color: token('color.link.pressed', '#0055CC'),
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
				':hover': {
					color: token('color.link', '#0C66E4'),
					textDecoration: 'underline',
				},
			});
	}
};

const getAnchorStyles = (
	size: SmartLinkSize,
	theme: SmartLinkTheme | SmartLinkInternalTheme,
	maxLines: number,
	hasSpace: boolean,
): SerializedStyles => {
	const sizeStyles = getLinkSizeStyles(size);
	return css(
		{
			flex: '1 1 auto',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		sizeStyles,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		getTruncateStyles(maxLines, getLinkLineHeight(size), hasSpace ? 'break-word' : 'break-all'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		getThemeStyles(theme),
	);
};

const getMaxLines = (maxLines: number) => {
	if (maxLines > MAXIMUM_MAX_LINES) {
		return DEFAULT_MAX_LINES;
	}

	if (maxLines < MINIMUM_MAX_LINES) {
		return MINIMUM_MAX_LINES;
	}

	return maxLines;
};

const withTooltip = (trigger: React.ReactNode, content: string, testId: string) => (
	<Tooltip content={content} testId={`${testId}-tooltip`} tag="span">
		{trigger}
	</Tooltip>
);

/**
 * A base element that represent an anchor.
 * @internal
 * @param {LinkProps} LinkProps - The props necessary for the Link element.
 * @see LinkIcon
 */
const Link = ({
	hideTooltip,
	maxLines = DEFAULT_MAX_LINES,
	name,
	overrideCss,
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
		<a
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			css={[getAnchorStyles(size, theme, getMaxLines(maxLines), hasSpace), overrideCss]}
			data-smart-element={name}
			data-smart-element-link
			data-testid={testId}
			onClick={onClick}
			onMouseDown={onMouseDown}
			href={url}
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

export default Link;
