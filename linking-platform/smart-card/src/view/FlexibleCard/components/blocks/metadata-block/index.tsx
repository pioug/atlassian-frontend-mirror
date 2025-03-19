/* eslint-disable @atlaskit/design-system/use-tokens-typography */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';

import {
	SmartLinkAlignment,
	SmartLinkDirection,
	SmartLinkSize,
	SmartLinkStatus,
	SmartLinkWidth,
} from '../../../../../constants';
import Block from '../block';
import ElementGroup from '../element-group';
import { renderElementItems } from '../utils';

import { type MetadataBlockProps } from './types';

const DEFAULT_MAX_LINES = 2;
const MAXIMUM_MAX_LINES = 2;
const MINIMUM_MAX_LINES = 1;

const truncateStyles = cssMap({
	'1': {
		display: '-webkit-box',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		wordBreak: 'break-word',
		WebkitLineClamp: '1',
		WebkitBoxOrient: 'vertical',
	},
	'2': {
		display: '-webkit-box',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		wordBreak: 'break-word',
		WebkitLineClamp: '2',
		WebkitBoxOrient: 'vertical',
	},
});

const sizeStylesOld = cssMap({
	xlarge: {
		lineHeight: '1.75rem',
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: `3.5rem`,
		},
	},
	large: {
		lineHeight: '1.75rem',
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: `3.5rem`,
		},
	},
	medium: {
		lineHeight: '1.5rem',
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: '3rem',
		},
	},
	small: {
		lineHeight: '1.5rem',
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: '3rem',
		},
	},
});

const sizeStyles = cssMap({
	xlarge: {
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: '56px',
		},
	},
	large: {
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: '56px',
		},
	},
	medium: {
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: '48px',
		},
	},
	small: {
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: '48px',
		},
	},
});

const getMaxLines = (maxLines: number): 2 | 1 => {
	if (maxLines > MAXIMUM_MAX_LINES) {
		return DEFAULT_MAX_LINES;
	}

	if (maxLines < MINIMUM_MAX_LINES) {
		return MINIMUM_MAX_LINES;
	}

	return maxLines as 2 | 1;
};

/**
 * Represents a MetadataBlock, designed to contain groups of metadata in the form of elements.
 * Accepts an array of elements to be shown either primary (left hand side) or secondary (right hand side).
 * @public
 * @param {MetadataBlockProps} MetadataBlockProps
 * @see Block
 */
const MetadataBlock = ({
	maxLines = DEFAULT_MAX_LINES,
	status = SmartLinkStatus.Fallback,
	testId = 'smart-block-metadata',
	primary = [],
	secondary = [],
	...blockProps
}: MetadataBlockProps) => {
	if ((primary.length === 0 && secondary.length === 0) || status !== SmartLinkStatus.Resolved) {
		return null;
	}

	const primaryElements = renderElementItems(primary);
	const secondaryElements = renderElementItems(secondary);

	const { size = SmartLinkSize.Medium } = blockProps;
	const maxLinesTotal = getMaxLines(maxLines);
	return (
		<Block {...blockProps} testId={`${testId}-resolved-view`}>
			{primaryElements && (
				<ElementGroup
					align={SmartLinkAlignment.Left}
					direction={SmartLinkDirection.Horizontal}
					width={SmartLinkWidth.Flexible}
					css={[
						truncateStyles[maxLinesTotal],
						!fg('platform-linking-visual-refresh-v1') && sizeStylesOld[size],
						fg('platform-linking-visual-refresh-v1') && sizeStyles[size],
					]}
					size={size}
				>
					{primaryElements}
				</ElementGroup>
			)}
			{secondaryElements && (
				<ElementGroup
					align={SmartLinkAlignment.Right}
					direction={SmartLinkDirection.Horizontal}
					width={SmartLinkWidth.Flexible}
					css={[
						truncateStyles[maxLinesTotal],
						!fg('platform-linking-visual-refresh-v1') && sizeStylesOld[size],
						fg('platform-linking-visual-refresh-v1') && sizeStyles[size],
					]}
					size={size}
				>
					{secondaryElements}
				</ElementGroup>
			)}
		</Block>
	);
};

export default MetadataBlock;
