import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';
import { FormattedMessage, type IntlShape, type MessageDescriptor } from 'react-intl-next';
import Loadable from 'react-loadable';

import { type Spacing } from '@atlaskit/button';
import type { Space } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { SmartLinkSize } from '../../../constants';
import { type PreviewActionData } from '../../../state/flexible-ui-context/types';
import { type EmbedModalProps } from '../../EmbedModal/types';
import { openEmbedModal } from '../../EmbedModal/utils';

import Icon from './elements/icon';
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

export const getIconWidth = (size?: SmartLinkSize): string => {
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

export const importIcon = (importFn: () => Promise<any>): any => {
	return Loadable({
		loader: () => importFn().then((module) => module.default),
		loading: () => null,
	}) as any; // Because we're using dynamic loading here, TS will not be able to infer the type.
};

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

export const getLinkSizeStyles = (size: SmartLinkSize): SerializedStyles => {
	switch (size) {
		case SmartLinkSize.XLarge:
			return css({
				fontSize: '1.25rem',
				fontWeight: token('font.weight.regular'),
				letterSpacing: '-0.008em',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				lineHeight: getLinkLineHeight(size),
			});
		case SmartLinkSize.Large:
		case SmartLinkSize.Medium:
			return css({
				fontSize: '0.875rem',
				fontWeight: token('font.weight.regular'),
				letterSpacing: '-0.003em',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				lineHeight: getLinkLineHeight(size),
			});
		case SmartLinkSize.Small:
		default:
			return css({
				fontSize: '0.75rem',
				fontWeight: token('font.weight.regular'),
				letterSpacing: '0em',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
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

/**
 * TODO: Remove on cleanup of platform-smart-card-migrate-embed-modal-analytics
 */
export const openEmbedModalWithFlexibleUiIcon = ({
	linkIcon,
	...props
}: Partial<EmbedModalProps> & Pick<PreviewActionData, 'linkIcon'>) => {
	const icon = {
		icon: <Icon {...linkIcon} size={SmartLinkSize.Large} />,
		isFlexibleUi: true,
	};
	return openEmbedModal({
		...props,
		icon,
		// Flex should not send origin as block card. It should be able to support
		// its internal parent components like hover card, block card and
		// itself as a standalone. To be investigated and fix in EDM-7520.
		origin: 'smartLinkCard',
	});
};
