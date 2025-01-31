/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-values */
/* eslint-disable @atlaskit/design-system/use-tokens-typography */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';
import { FormattedMessage, type IntlShape, type MessageDescriptor } from 'react-intl-next';
import Loadable from 'react-loadable';

import { type Spacing } from '@atlaskit/button';
import { fg } from '@atlaskit/platform-feature-flags';
import type { Space } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { SmartLinkSize } from '../../../constants';

import { type MessageProps } from './types';

export const sizeToButtonSpacing: Record<SmartLinkSize, Spacing> = {
	[SmartLinkSize.Small]: 'none',
	[SmartLinkSize.Medium]: 'compact',
	[SmartLinkSize.Large]: 'compact',
	[SmartLinkSize.XLarge]: 'default',
};

export const getFormattedMessage = (message?: MessageProps) => {
	if (message) {
		const { descriptor, values } = message;
		return <FormattedMessage {...descriptor} values={values} />;
	}
};

export const getFormattedMessageAsString = (
	intl: IntlShape,
	message: MessageDescriptor,
	context?: string,
) => {
	const { formatMessage } = intl;
	return message ? formatMessage(message, { context }) : '';
};

/**
 * @deprecated remove on FF bandicoots-compiled-migration-smartcard clean up
 */
const getIconDimensionStyles = (value: string): SerializedStyles =>
	css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		height: value,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		minHeight: value,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		maxHeight: value,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		width: value,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		minWidth: value,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		maxWidth: value,
	});

/**
 * @deprecated remove on FF bandicoots-compiled-migration-smartcard clean up
 */
export const getIconSizeStyles = (width: string): SerializedStyles => {
	const sizeStyles = getIconDimensionStyles(width);
	// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
	return css`
		flex: 0 0 auto;
		${sizeStyles}
		span,
    svg,
    img {
			${sizeStyles}
		}
		svg {
			padding: 0;
		}
	`;
};

// TODO Delete when cleaning platform-smart-card-icon-migration
export const getIconWidthOld = (size?: SmartLinkSize): string => {
	switch (size) {
		case SmartLinkSize.XLarge:
			return '2rem';
		case SmartLinkSize.Large:
			return '1.5rem';
		case SmartLinkSize.Medium:
			return '1rem';
		case SmartLinkSize.Small:
		default:
			return '.75rem';
	}
};

// TODO Rename to getIconWidth when cleaning platform-smart-card-icon-migration
export const getIconWidthNew = (size?: SmartLinkSize): string => {
	switch (size) {
		case SmartLinkSize.XLarge:
		case SmartLinkSize.Large:
			return token('space.300');
		case SmartLinkSize.Medium:
		case SmartLinkSize.Small:
		default:
			return token('space.200');
	}
};

// TODO Delete when cleaning platform-smart-card-icon-migration
export const getIconWidth = (size?: SmartLinkSize): string => {
	return fg('platform-smart-card-icon-migration') ? getIconWidthNew(size) : getIconWidthOld(size);
};

export const importIcon = (importFn: () => Promise<any>): any => {
	return Loadable({
		loader: () => importFn().then((module) => module.default),
		loading: () => null,
	}) as any; // Because we're using dynamic loading here, TS will not be able to infer the type.
};

/**
 * @deprecated remove FF bandicoots-compiled-migration-smartcard clean up
 */
export const getLinkLineHeight = (size: SmartLinkSize): string => {
	switch (size) {
		case SmartLinkSize.XLarge:
			return '1.5rem';
		case SmartLinkSize.Large:
		case SmartLinkSize.Medium:
		case SmartLinkSize.Small:
		default:
			return '1rem';
	}
};

/**
 * @deprecated remove FF bandicoots-compiled-migration-smartcard clean up
 */
export const getLinkSizeStyles = (size: SmartLinkSize): SerializedStyles => {
	switch (size) {
		case SmartLinkSize.XLarge:
			return css({
				font: token('font.heading.medium'),
				fontWeight: token('font.weight.regular'),
				lineHeight: getLinkLineHeight(size),
			});
		case SmartLinkSize.Large:
		case SmartLinkSize.Medium:
			return css({
				font: token('font.body'),
				fontWeight: token('font.weight.regular'),
				lineHeight: getLinkLineHeight(size),
			});
		case SmartLinkSize.Small:
		default:
			return css({
				font: token('font.body.UNSAFE_small'),
				fontWeight: token('font.weight.regular'),
				lineHeight: getLinkLineHeight(size),
			});
	}
};

export const getMaxLineHeight = (size: SmartLinkSize) => {
	// The maximum line height based on all elements in specific size.
	// These heights belongs to AvatarGroup.
	switch (size) {
		case SmartLinkSize.XLarge:
		case SmartLinkSize.Large:
			return 1.75;
		case SmartLinkSize.Medium:
		case SmartLinkSize.Small:
		default:
			return 1.5;
	}
};

export const getMaxLines = (value: number, defaultValue: number, max: number, min: number) => {
	if (value > max) {
		return defaultValue;
	}

	if (value < min) {
		return min;
	}

	return value;
};

/**
 * A space between element based on smart link size
 * To replace blocks/utils.tsz getGapSize() with space token for primitives
 */
export const getPrimitivesInlineSpaceBySize = (size: SmartLinkSize): Space => {
	switch (size) {
		case SmartLinkSize.XLarge:
			return 'space.250';
		case SmartLinkSize.Large:
			return 'space.200';
		case SmartLinkSize.Medium:
			return 'space.100';
		case SmartLinkSize.Small:
		default:
			return 'space.050';
	}
};

/**
 * Get container padding based on smart link size
 * To replace container/index.tsx getPadding() with space token for primitives
 * @deprecated remove on FF clean up bandicoots-compiled-migration-smartcard
 */
export const getPrimitivesPaddingSpaceBySize = (size: SmartLinkSize): Space => {
	switch (size) {
		case SmartLinkSize.XLarge:
			return 'space.300';
		case SmartLinkSize.Large:
			return 'space.250';
		case SmartLinkSize.Medium:
			return 'space.200';
		case SmartLinkSize.Small:
		default:
			return 'space.100';
	}
};

/**
 * @deprecated remove FF bandicoots-compiled-migration-smartcard clean up
 */
export const getTruncateStyles = (
	maxLines: number,
	lineHeight: string = '1rem',
	wordBreak: 'break-word' | 'break-all' = 'break-word',
): SerializedStyles =>
	css({
		display: '-webkit-box',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		wordBreak: wordBreak,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		WebkitLineClamp: maxLines,
		WebkitBoxOrient: 'vertical',
		'@supports not (-webkit-line-clamp: 1)': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			maxHeight: `calc(${maxLines} * ${lineHeight})`,
		},
	});

export const hasWhiteSpace = (str: string): boolean => {
	return str.search(/\s/) >= 0;
};
