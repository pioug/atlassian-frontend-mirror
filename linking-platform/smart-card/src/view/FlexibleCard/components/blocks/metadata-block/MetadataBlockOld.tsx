import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';

import {
	SmartLinkAlignment,
	SmartLinkDirection,
	SmartLinkSize,
	SmartLinkStatus,
	SmartLinkWidth,
} from '../../../../../constants';
import { getMaxLineHeight, getTruncateStyles } from '../../utils';
import Block from '../block';
import ElementGroup from '../element-group';
import { renderElementItems } from '../utils';

import { type MetadataBlockProps } from './types';

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
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/use-tokens-typography -- Ignored via go/DSP-18766
			lineHeight: `${lineHeight}rem`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
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
const MetadataBlockOld = ({
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

export default MetadataBlockOld;
