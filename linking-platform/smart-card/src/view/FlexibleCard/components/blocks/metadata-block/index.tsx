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
import { useFlexibleCardContext } from '../../../../../state/flexible-ui-context';
import Block from '../block';
import ElementGroup from '../element-group';
import { type ElementItem } from '../types';
import { type ElementDisplaySchemaType, renderElementItems } from '../utils';

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

const ElementItemRenderer = ({
	align = SmartLinkAlignment.Left,
	items = [],
	display = 'inline',
	size = SmartLinkSize.Medium,
	maxLines = DEFAULT_MAX_LINES,
}: {
	align?: SmartLinkAlignment;
	items?: ElementItem[];
	display?: ElementDisplaySchemaType;
	size?: SmartLinkSize;
	maxLines?: 1 | 2;
}) => {
	const elements = renderElementItems(items, display);

	return (
		elements && (
			<ElementGroup
				align={align}
				direction={SmartLinkDirection.Horizontal}
				width={SmartLinkWidth.Flexible}
				css={[
					truncateStyles[maxLines],
					!fg('platform-linking-visual-refresh-v1') && sizeStylesOld[size],
					fg('platform-linking-visual-refresh-v1') && sizeStyles[size],
				]}
				size={size}
			>
				{elements}
			</ElementGroup>
		)
	);
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
	const cardContext = fg('platform-linking-flexible-card-context')
		? // eslint-disable-next-line react-hooks/rules-of-hooks
			useFlexibleCardContext()
		: undefined;

	if (fg('platform-linking-flexible-card-context')) {
		if (
			(primary.length === 0 && secondary.length === 0) ||
			cardContext?.status !== SmartLinkStatus.Resolved
		) {
			return null;
		}
	} else {
		if ((primary.length === 0 && secondary.length === 0) || status !== SmartLinkStatus.Resolved) {
			return null;
		}
	}

	const { size: sizeProp = SmartLinkSize.Medium } = blockProps;
	const size = fg('platform-linking-flexible-card-context')
		? blockProps?.size ?? cardContext?.ui?.size ?? SmartLinkSize.Medium
		: sizeProp;

	const maxLinesTotal = getMaxLines(maxLines);

	if (fg('platform-linking-flexible-card-context')) {
		return (
			<Block {...blockProps} size={size} testId={`${testId}-resolved-view`}>
				<ElementItemRenderer items={primary} size={size} maxLines={maxLinesTotal} />
				<ElementItemRenderer
					align={SmartLinkAlignment.Right}
					items={secondary}
					size={size}
					maxLines={maxLinesTotal}
				/>
			</Block>
		);
	}

	const primaryElements = renderElementItems(primary);
	const secondaryElements = renderElementItems(secondary);

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
