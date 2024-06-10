import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { N200, N20A } from '@atlaskit/theme/colors';
import checkboxTheme from './theme';

/*
	Increasing specificity with double ampersand to ensure these rules take
	priority over the global styles applied to 'ol' elements.
*/
export const listStyles = css({
	'&&': {
		listStyleType: 'none',
		paddingLeft: 0,
	},
});

export const taskListStyles = css({
	'div + div': {
		marginTop: token('space.050', '4px'),
	},
});

export const contentStyles = css({
	margin: 0,
	wordWrap: 'break-word',
	minWidth: 0,
	flex: '1 1 auto',
});

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
		backgroundColor: token('color.background.neutral', N20A),
		position: 'relative',
		'.decision-item': {
			cursor: 'initial',
		},
	});

export const placeholderStyles = (offset: number) =>
	css({
		margin: `0 0 0 ${offset}px`,
		position: 'absolute',
		color: token('color.text.subtlest', N200),
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
			'&[disabled]': {
				cursor: 'default',
			},
			'+ span': {
				width: '24px',
				height: '24px',
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
			},
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
				color: checkboxTheme.light.boxColor.rest,
				transition: 'color 0.2s ease-in-out, fill 0.2s ease-in-out',
				'path:first-of-type': {
					visibility: 'hidden',
				},
				'rect:first-of-type': {
					stroke: checkboxTheme.light.borderColor.rest,
					strokeWidth: 1,
					transition: 'stroke 0.2s ease-in-out',
				},
			},
			'&:hover + span > svg': {
				color: checkboxTheme.light.boxColor.hovered,
				'rect:first-of-type': {
					stroke: checkboxTheme.light.borderColor.hovered,
				},
			},
			'&:checked:hover + span > svg': {
				color: checkboxTheme.light.boxColor.hoveredAndChecked,
				fill: checkboxTheme.light.tickColor.checked,
				'rect:first-of-type': {
					stroke: checkboxTheme.light.borderColor.hoveredAndChecked,
				},
			},
			'&:checked': {
				'+ span > svg': {
					'path:first-of-type': {
						visibility: 'visible',
					},
					color: checkboxTheme.light.boxColor.checked,
					fill: checkboxTheme.light.tickColor.checked,
					'rect:first-of-type': {
						stroke: checkboxTheme.light.borderColor.checked,
					},
				},
			},
			'&:active + span > svg': {
				color: checkboxTheme.light.boxColor.active,
				'rect:first-of-type': {
					stroke: checkboxTheme.light.borderColor.active,
				},
			},
			'&:checked:active + span > svg': {
				color: checkboxTheme.light.boxColor.active,
				fill: checkboxTheme.light.tickColor.activeAndChecked,
				'rect:first-of-type': {
					stroke: checkboxTheme.light.borderColor.active,
				},
			},
			'&:disabled + span > svg, &:disabled:hover + span > svg, &:disabled:focus + span > svg, &:disabled:active + span > svg':
				{
					color: checkboxTheme.light.boxColor.disabled,
					'rect:first-of-type': {
						stroke: checkboxTheme.light.borderColor.disabled,
					},
				},
			'&:disabled:checked + span > svg': {
				fill: checkboxTheme.light.tickColor.disabledAndChecked,
			},
			'&:focus + span::after': {
				position: 'absolute',
				width: token('space.200', '16px'),
				height: token('space.200', '16px'),
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
