import React from 'react';
import { css, type SerializedStyles } from '@emotion/react';

import { type MetadataBlockProps } from './types';
import {
	SmartLinkAlignment,
	SmartLinkDirection,
	SmartLinkSize,
	SmartLinkStatus,
	SmartLinkWidth,
} from '../../../../../constants';
import { renderElementItems } from '../utils';
import Block from '../block';
import ElementGroup from '../element-group';
import { getMaxLineHeight, getTruncateStyles } from '../../utils';

const DEFAULT_MAX_LINES = 2;
const MAXIMUM_MAX_LINES = 2;
const MINIMUM_MAX_LINES = 1;

const getElementGroupStyles = (size: SmartLinkSize, maxLines: number): SerializedStyles => {
	// MetadataBlock allows metadata elements to be displayed in
	// multiple lines, with maximum of 2 lines.
	// We need the height of the line to be equal on both left and right
	// sides so they line up nicely.
	const lineHeight = getMaxLineHeight(size);
	return css(
		{
			lineHeight: `${lineHeight}rem`,
		},
		getTruncateStyles(maxLines, lineHeight + 'rem'),
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

/**
 * Represents a MetadataBlock, designed to contain groups of metadata in the form of elements.
 * Accepts an array of elements to be shown either primary (left hand side) or secondary (right hand side).
 * @public
 * @param {MetadataBlockProps} MetadataBlockProps
 * @see Block
 */
const MetadataBlock: React.FC<MetadataBlockProps> = ({
	maxLines = DEFAULT_MAX_LINES,
	status = SmartLinkStatus.Fallback,
	testId = 'smart-block-metadata',
	primary = [],
	secondary = [],
	...blockProps
}) => {
	if ((primary.length === 0 && secondary.length === 0) || status !== SmartLinkStatus.Resolved) {
		return null;
	}

	const primaryElements = renderElementItems(primary);
	const secondaryElements = renderElementItems(secondary);

	const { size = SmartLinkSize.Medium } = blockProps;
	const elementGroupStyles = getElementGroupStyles(size, getMaxLines(maxLines));

	return (
		<Block {...blockProps} testId={`${testId}-resolved-view`}>
			{primaryElements && (
				<ElementGroup
					align={SmartLinkAlignment.Left}
					overrideCss={elementGroupStyles}
					direction={SmartLinkDirection.Horizontal}
					width={SmartLinkWidth.Flexible}
				>
					{primaryElements}
				</ElementGroup>
			)}
			{secondaryElements && (
				<ElementGroup
					align={SmartLinkAlignment.Right}
					overrideCss={elementGroupStyles}
					direction={SmartLinkDirection.Horizontal}
					width={SmartLinkWidth.Flexible}
				>
					{secondaryElements}
				</ElementGroup>
			)}
		</Block>
	);
};

export default MetadataBlock;
