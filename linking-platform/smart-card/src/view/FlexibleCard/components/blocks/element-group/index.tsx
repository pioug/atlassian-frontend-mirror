/* eslint-disable @atlaskit/design-system/use-tokens-typography */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, cssMap, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import {
	SmartLinkAlignment,
	SmartLinkDirection,
	SmartLinkPosition,
	SmartLinkSize,
	SmartLinkWidth,
} from '../../../../../constants';
import { renderChildren } from '../utils';

import { type ElementGroupProps } from './types';

const alignmentStyleMap = cssMap({
	right: {
		WebkitBoxAlign: 'end',
		MsFlexAlign: 'end',
		justifyContent: 'flex-end',
		textAlign: 'right',
	},
	left: {
		WebkitBoxAlign: 'start',
		MsFlexAlign: 'start',
		justifyContent: 'flex-start',
		textAlign: 'left',
	},
});

// TODO: Remove on fg cleanup: platform-linking-visual-refresh-v1
const baseStyleBySizeOld = cssMap({
	xlarge: {
		alignItems: 'center',
		display: 'flex',
		gap: token('space.250', '1.25rem'),
		minWidth: 0,
		overflow: 'hidden',
		lineHeight: '1rem',
	},
	large: {
		alignItems: 'center',
		display: 'flex',
		gap: token('space.200', '1rem'),
		minWidth: 0,
		overflow: 'hidden',
		lineHeight: '1rem',
	},
	medium: {
		alignItems: 'center',
		display: 'flex',
		gap: token('space.100', '0.5rem'),
		minWidth: 0,
		overflow: 'hidden',
		lineHeight: '1rem',
	},
	small: {
		alignItems: 'center',
		display: 'flex',
		gap: token('space.050', '0.25rem'),
		minWidth: 0,
		overflow: 'hidden',
		lineHeight: '1rem',
	},
});

const baseStyleBySize = cssMap({
	xlarge: {
		alignItems: 'center',
		display: 'flex',
		gap: token('space.250'),
		minWidth: 0,
		overflow: 'hidden',
	},
	large: {
		alignItems: 'center',
		display: 'flex',
		gap: token('space.200'),
		minWidth: 0,
		overflow: 'hidden',
	},
	medium: {
		alignItems: 'center',
		display: 'flex',
		gap: token('space.100'),
		minWidth: 0,
		overflow: 'hidden',
	},
	small: {
		alignItems: 'center',
		display: 'flex',
		gap: token('space.050'),
		minWidth: 0,
		overflow: 'hidden',
	},
});

const baseStyleByDirection = cssMap({
	horizontal: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	vertical: {
		flexDirection: 'column',
		alignItems: 'flex-start',
	},
});

const baseStyleOld = css({
	'&:empty': {
		display: 'none',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > *': {
		minWidth: 0,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > [data-fit-to-content]': {
		minWidth: 'fit-content',
	},
});

const baseStyles = css({
	'&:empty': {
		display: 'none',
	},
});

const widthStyle = cssMap({
	flexible: {
		flex: '1 3',
	},
	'fit-to-content': {},
});

const positionStyle = cssMap({
	top: {
		alignSelf: 'flex-start',
	},
	center: {},
});

const horizontalStyleBase = css({
	display: 'block',
	verticalAlign: 'middle',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'> span, > div': {
		verticalAlign: 'middle',

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&[data-smart-element-date-time], &[data-smart-element-text]': {
			// Show all/wrapped/truncated
			display: 'inline',
		},
	},
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	wordBreak: 'break-word',
	WebkitLineClamp: 1,
	WebkitBoxOrient: 'vertical',
});

// TODO: Remove on fg cleanup: platform-linking-visual-refresh-v1
const horizontalStyleByHeightOld = cssMap({
	xlarge: {
		display: '-webkit-box',
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: `calc(1 * 1.75rem)`,
		},
	},
	large: {
		display: '-webkit-box',
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: `calc(1 * 1.75rem)`,
		},
	},
	medium: {
		display: '-webkit-box',
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: `calc(1 * 1.5rem)`,
		},
	},
	small: {
		display: '-webkit-box',
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: `calc(1 * 1.5rem)`,
		},
	},
});

const horizontalStyleByHeight = cssMap({
	xlarge: {
		display: '-webkit-box',
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: `calc(1 * ${token('space.400')})`,
		},
	},
	large: {
		display: '-webkit-box',
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: `calc(1 *  ${token('space.400')})`,
		},
	},
	medium: {
		display: '-webkit-box',
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: `calc(1 * ${token('space.300')})`,
		},
	},
	small: {
		display: '-webkit-box',
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: `calc(1 * ${token('space.300')})`,
		},
	},
});

const gapStylesLeft = cssMap({
	xlarge: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'> span': {
			marginRight: token('space.250'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'&:last-child': {
				marginRight: 'initial',
			},
		},
	},
	large: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'> span': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			marginRight: token('space.200'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'&:last-child': {
				marginRight: 'initial',
			},
		},
	},
	medium: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'> span': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			marginRight: token('space.100'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'&:last-child': {
				marginRight: 'initial',
			},
		},
	},
	small: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'> span': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			marginRight: token('space.050'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'&:last-child': {
				marginRight: 'initial',
			},
		},
	},
});

const gapStylesRight = cssMap({
	xlarge: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'> span': {
			marginLeft: token('space.250'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'> span:first-of-type': {
			marginLeft: 'initial',
		},
	},
	large: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'> span': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			marginLeft: token('space.200'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'> span:first-of-type': {
			marginLeft: 'initial',
		},
	},
	medium: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'> span': {
			marginLeft: token('space.100'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'> span:first-of-type': {
			marginLeft: 'initial',
		},
	},
	small: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'> span': {
			marginLeft: token('space.050'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'> span:first-of-type': {
			marginLeft: 'initial',
		},
	},
});

const minWidthStyle = css({ minWidth: '10%' });

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
	direction = SmartLinkDirection.Horizontal,
	size = SmartLinkSize.Medium,
	testId = 'smart-element-group',
	width = SmartLinkWidth.FitToContent,
	position = SmartLinkPosition.Center,
	className,
}: ElementGroupProps) => {
	const isHorizontal = direction === SmartLinkDirection.Horizontal;
	return (
		<div
			css={[
				!fg('platform-linking-visual-refresh-v1') && baseStyleBySizeOld[size],
				fg('platform-linking-visual-refresh-v1') && baseStyleBySize[size],
				baseStyleByDirection[direction],
				!fg('platform-linking-visual-refresh-v1') && baseStyleOld,
				fg('platform-linking-visual-refresh-v1') && baseStyles,
				alignmentStyleMap[align],
				minWidthStyle,
				widthStyle[width],
				isHorizontal && horizontalStyleBase,
				isHorizontal &&
					!fg('platform-linking-visual-refresh-v1') &&
					horizontalStyleByHeightOld[size],
				isHorizontal && fg('platform-linking-visual-refresh-v1') && horizontalStyleByHeight[size],
				isHorizontal && align === SmartLinkAlignment.Left && gapStylesLeft[size],
				isHorizontal && align === SmartLinkAlignment.Right && gapStylesRight[size],
				positionStyle[position],
			]}
			data-smart-element-group
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
		>
			{renderChildren(children, size)}
		</div>
	);
};

export default ElementGroup;
