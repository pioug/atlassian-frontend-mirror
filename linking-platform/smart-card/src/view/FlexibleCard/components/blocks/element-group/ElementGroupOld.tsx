/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, type SerializedStyles } from '@emotion/react';

import {
	SmartLinkAlignment,
	SmartLinkDirection,
	SmartLinkPosition,
	SmartLinkSize,
	SmartLinkWidth,
} from '../../../../../constants';
import { getMaxLineHeight, getTruncateStyles } from '../../utils';
import { getBaseStyles, getGapSize, renderChildren } from '../utils';

import { type ElementGroupProps } from './types';

const getAlignmentStyles = (align?: SmartLinkAlignment) => {
	switch (align) {
		case SmartLinkAlignment.Right:
			return css({
				WebkitBoxAlign: 'end',
				MsFlexAlign: 'end',
				justifyContent: 'flex-end',
				textAlign: 'right',
			});
		case SmartLinkAlignment.Left:
		default:
			return css({
				WebkitBoxAlign: 'start',
				MsFlexAlign: 'start',
				justifyContent: 'flex-start',
				textAlign: 'left',
			});
	}
};

const getGapStyles = (size: SmartLinkSize, align: SmartLinkAlignment): SerializedStyles => {
	const gap = getGapSize(size);
	if (align === SmartLinkAlignment.Right) {
		return css({
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			'> span': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				marginLeft: `${gap}rem`,
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'> span:first-child': {
				marginLeft: 'initial',
			},
		});
	}

	return css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'> span': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			marginRight: `${gap}rem`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'&:last-child': {
				marginRight: 'initial',
			},
		},
	});
};

const getHorizontalDirectionStyles = (size: SmartLinkSize, align: SmartLinkAlignment) => {
	const lineHeight = getMaxLineHeight(size);
	// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
	return css`
		display: block;
		vertical-align: middle;
		${getTruncateStyles(1, lineHeight + 'rem')}

		> span, > div {
			vertical-align: middle;

			&[data-smart-element-date-time],
			&[data-smart-element-text] {
				// Show all/wrapped/truncated
				display: inline;
			}
		}

		${getGapStyles(size, align)}
	`;
};

export const getElementGroupStyles = (
	direction: SmartLinkDirection,
	size: SmartLinkSize,
	align: SmartLinkAlignment,
	width: SmartLinkWidth,
	position: SmartLinkPosition,
): SerializedStyles =>
	css(
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		getBaseStyles(direction, size),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		getAlignmentStyles(align),
		{
			minWidth: '10%',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		width === SmartLinkWidth.Flexible ? `flex: 1 3;` : '',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		direction === SmartLinkDirection.Horizontal ? getHorizontalDirectionStyles(size, align) : '',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		position === SmartLinkPosition.Top ? 'align-self: flex-start;' : '',
	);

/**
 * Creates a group of Action components. Accepts an array of Actions, in addition to some styling
 * preferences.
 * @internal
 * @param {ActionGroupProps} ActionGroupProps
 * @see Action
 */
const ElementGroup = ({
	align = SmartLinkAlignment.Left,
	children,
	overrideCss,
	direction = SmartLinkDirection.Horizontal,
	size = SmartLinkSize.Medium,
	testId = 'smart-element-group',
	width = SmartLinkWidth.FitToContent,
	position = SmartLinkPosition.Center,
}: ElementGroupProps) => (
	<div
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		css={[getElementGroupStyles(direction, size, align, width, position), overrideCss]}
		data-smart-element-group
		data-testid={testId}
	>
		{renderChildren(children, size)}
	</div>
);

export default ElementGroup;
