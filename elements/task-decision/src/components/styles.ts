// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import checkboxTheme from './theme';

/*
	Increasing specificity with double ampersand to ensure these rules take
	priority over the global styles applied to 'ol' elements.
*/
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const listStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&&': {
		listStyleType: 'none',
		paddingLeft: 0,
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const taskListStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'div + div': {
		marginTop: token('space.050', '4px'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const contentStyles = css({
	margin: 0,
	wordWrap: 'break-word',
	minWidth: 0,
	flex: '1 1 auto',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const taskStyles = css({
	display: 'flex',
	flexDirection: 'row',
	position: 'relative',
});

export const decisionStyles = () =>
	css({
		display: 'flex',
		flexDirection: 'row',
		margin: `${token('space.100', '8px')} 0 0 0`,
		padding: token('space.100', '8px'),
		paddingLeft: token('space.150', '12px'),
		borderRadius: token('border.radius.100', '3px'),
		backgroundColor: token('color.background.neutral'),
		position: 'relative',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.decision-item': {
			cursor: 'initial',
		},
	});

export const placeholderStyles = (offset: number) =>
	css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		margin: `0 0 0 ${offset}px`,
		position: 'absolute',
		color: token('color.text.subtlest'),
		pointerEvents: 'none',
		textOverflow: 'ellipsis',
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		maxWidth: 'calc(100% - 50px)',
	});

/**
 * References packages/design-system/checkbox/src/checkbox.tsx
 * To be used until mobile editor does not require legacy themed() API anymore,
 * which will allow migration to use @atlaskit/checkbox instead
 */
export const checkboxStyles = (isRenderer: boolean | undefined) =>
	css({
		flex: '0 0 24px',
		width: '24px',
		height: '24px',
		position: 'relative',
		alignSelf: 'start',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		"& > input[type='checkbox']": {
			width: '16px',
			height: '16px',
			zIndex: 1,
			cursor: 'pointer',
			outline: 'none',
			margin: 0,
			opacity: 0,
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			'&[disabled]': {
				cursor: 'default',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			'+ span': {
				width: '24px',
				height: '24px',
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			'+ span > svg': {
				boxSizing: 'border-box',
				display: 'inline',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				maxWidth: 'unset',
				maxHeight: 'unset',
				position: 'absolute',
				overflow: 'hidden',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				color: checkboxTheme.light.boxColor.rest,
				transition: 'color 0.2s ease-in-out, fill 0.2s ease-in-out',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
				'path:first-of-type': {
					visibility: 'hidden',
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
				'rect:first-of-type': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
					stroke: checkboxTheme.light.borderColor.rest,
					strokeWidth: 1,
					transition: 'stroke 0.2s ease-in-out',
				},
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&:hover + span > svg': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				color: checkboxTheme.light.boxColor.hovered,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
				'rect:first-of-type': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
					stroke: checkboxTheme.light.borderColor.hovered,
				},
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&:checked:hover + span > svg': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
				color: checkboxTheme.light.boxColor.hoveredAndChecked,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				fill: checkboxTheme.light.tickColor.checked,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
				'rect:first-of-type': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
					stroke: checkboxTheme.light.borderColor.hoveredAndChecked,
				},
			},
			'&:checked': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
				'+ span > svg': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
					'path:first-of-type': {
						visibility: 'visible',
					},
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
					color: checkboxTheme.light.boxColor.checked,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
					fill: checkboxTheme.light.tickColor.checked,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
					'rect:first-of-type': {
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
						stroke: checkboxTheme.light.borderColor.checked,
					},
				},
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			'&:active + span > svg': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				color: checkboxTheme.light.boxColor.active,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
				'rect:first-of-type': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
					stroke: checkboxTheme.light.borderColor.active,
				},
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			'&:checked:active + span > svg': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				color: checkboxTheme.light.boxColor.active,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				fill: checkboxTheme.light.tickColor.activeAndChecked,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
				'rect:first-of-type': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
					stroke: checkboxTheme.light.borderColor.active,
				},
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			'&:disabled + span > svg, &:disabled:hover + span > svg, &:disabled:focus + span > svg, &:disabled:active + span > svg':
				{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
					color: checkboxTheme.light.boxColor.disabled,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
					'rect:first-of-type': {
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
						stroke: checkboxTheme.light.borderColor.disabled,
					},
				},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			'&:disabled:checked + span > svg': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				fill: checkboxTheme.light.tickColor.disabledAndChecked,
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			'&:focus + span::after': {
				position: 'absolute',
				width: token('space.200', '16px'),
				height: token('space.200', '16px'),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				border: `2px solid ${checkboxTheme.light.borderColor.focused}`,
				borderRadius: token('space.050', '4px'),
				content: "''",
				display: 'block',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
			},
		},
	});
