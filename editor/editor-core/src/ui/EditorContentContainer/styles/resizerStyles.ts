// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, type SerializedStyles } from '@emotion/react';

import { akEditorFullPageNarrowBreakout } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

export const resizerItemClassName = 'resizer-item';
export const resizerHoverZoneClassName = 'resizer-hover-zone';
export const resizerExtendedZone = 'resizer-is-extended';

export const resizerHandleClassName = 'resizer-handle';
export const resizerHandleTrackClassName = `${resizerHandleClassName}-track`;
export const resizerHandleThumbClassName = `${resizerHandleClassName}-thumb`;
export const resizerDangerClassName = `${resizerHandleClassName}-danger`;

export const resizerHandleThumbWidth = 3;
export const handleWrapperClass = 'resizer-handle-wrapper';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766, Seems perfectly safe to autofix, but comments would be lost…
export const resizerStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${resizerItemClassName}`]: {
		willChange: 'width',

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&:hover, &.display-handle': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`& > .${handleWrapperClass} > .${resizerHandleClassName}`]: {
				visibility: 'visible',
				opacity: 1,
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.is-resizing': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`& .${resizerHandleThumbClassName}`]: {
				background: token('color.border.focused'),
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`&.${resizerDangerClassName}`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`& .${resizerHandleThumbClassName}`]: {
				transition: 'none',
				background: token('color.icon.danger'),
			},
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${resizerHandleClassName}`]: {
		display: 'flex',
		visibility: 'hidden',
		opacity: 0,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		width: 7,
		transition: 'visibility 0.2s, opacity 0.2s',

		// NOTE: The below style is targeted at the div element added by the tooltip. We don't have any means of injecting styles
		// into the tooltip
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		"& div[role='presentation']": {
			width: '100%',
			height: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			marginTop: token('space.negative.200', '-16px'),
			whiteSpace: 'normal',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.left': {
			alignItems: 'flex-start',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.right': {
			alignItems: 'flex-end',
		},

		// Handle Sizing
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.small': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`& .${resizerHandleThumbClassName}`]: {
				height: 43,
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.medium': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`& .${resizerHandleThumbClassName}`]: {
				height: 64,
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.large': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`& .${resizerHandleThumbClassName}`]: {
				height: 96,
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.clamped': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`& .${resizerHandleThumbClassName}`]: {
				height: 'clamp(43px, calc(100% - 32px), 96px)',
			},
		},

		// Handle Alignment
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.sticky': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`& .${resizerHandleThumbClassName}`]: {
				position: 'sticky',
				top: token('space.150', '12px'),
				bottom: token('space.150', '12px'),
			},
		},

		'&:hover': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`& .${resizerHandleThumbClassName}`]: {
				background: token('color.border.focused'),
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`& .${resizerHandleTrackClassName}`]: {
				visibility: 'visible',
				opacity: 0.5,
			},
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${resizerHandleThumbClassName}`]: {
		content: "' '",
		display: 'flex',
		width: 3,
		margin: `0 ${token('space.025', '2px')}`,
		height: 64,
		transition: 'background-color 0.2s',
		borderRadius: 6,
		border: 0,
		padding: 0,
		zIndex: 2,
		outline: 'none',
		minHeight: 24,
		background: token('color.border'),

		'&:hover': {
			cursor: 'col-resize',
		},

		'&:focus': {
			background: token('color.border.selected'),

			'&::after': {
				content: "''",
				position: 'absolute',
				top: token('space.negative.050', '-4px'),
				right: token('space.negative.050', '-4px'),
				bottom: token('space.negative.050', '-4px'),
				left: token('space.negative.050', '-4px'),
				border: `2px solid ${token('color.border.focused')}`,
				borderRadius: 'inherit',
				zIndex: -1,
			},
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${resizerHandleTrackClassName}`]: {
		visibility: 'hidden',
		position: 'absolute',
		width: 7,
		height: 'calc(100% - 40px)',
		borderRadius: 4,
		opacity: 0,
		transition: 'background-color 0.2s, visibility 0.2s, opacity 0.2s',

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.none': {
			background: 'none',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.shadow': {
			background: token('color.background.selected'),
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.full-height': {
			background: token('color.background.selected'),
			height: '100%',
			minHeight: 36,
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	'.ak-editor-selected-node': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`& .${resizerHandleThumbClassName}`]: {
			background: token('color.border.focused'),
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.ak-editor-no-interaction .ak-editor-selected-node .${resizerHandleClassName}:not(:hover) .${resizerHandleThumbClassName}`]:
		{
			background: token('color.border'),
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${resizerHoverZoneClassName}`]: {
		position: 'relative',
		display: 'inline-block',
		width: '100%',

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`&.${resizerExtendedZone}`]: {
			padding: `0 ${token('space.150', '12px')}`,
			left: token('space.negative.150', '-12px'),
		},
	},

	// This below style is here to make sure the image width is correct when nested in a table
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`table .${resizerHoverZoneClassName}, table .${resizerHoverZoneClassName}.${resizerExtendedZone}`]:
		{
			padding: 'unset',
			left: 'unset',
		},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const pragmaticResizerStylesForTooltip: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.pm-breakout-resize-handle-rail-wrapper': {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',

		height: '100%',

		cursor: 'col-resize',

		borderRadius: 4,
		zIndex: 2,

		// Tootip element
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[role="presentation"]': {
			height: '100%',
			width: '100%',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.pm-breakout-resize-handle-rail-inside-tooltip': {
			height: '100%',
		},
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const pragmaticStylesLayoutFirstNodeResizeHandleFix: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.fabric-editor-breakout-mark': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:has([data-prosemirror-node-name="layoutSection"].first-node-in-document)': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> .pm-breakout-resize-handle-container': {
				height: 'calc(100% - 8px)',
			},
		},
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const pragmaticResizerStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.fabric-editor-breakout-mark': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:has([data-prosemirror-node-name="codeBlock"])': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> .pm-breakout-resize-handle-container--left': {
				left: '-12px',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> .pm-breakout-resize-handle-container--right': {
				right: '-12px',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> .pm-breakout-resize-handle-container': {
				height: 'calc(100% - 12px)',
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:has([data-prosemirror-node-name="expand"]), &:has([data-prosemirror-node-name="layoutSection"])':
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'> .pm-breakout-resize-handle-container--left': {
					left: '-32px',
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'> .pm-breakout-resize-handle-container--right': {
					right: '-32px',
				},
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:has([data-prosemirror-node-name="expand"])': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> .pm-breakout-resize-handle-container': {
				height: 'calc(100% - 4px)',
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:has([data-prosemirror-node-name="layoutSection"])': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> .pm-breakout-resize-handle-container': {
				height: 'calc(100% - 8px)',
			},
		},
		// the first node in the document always has margin-top = 0
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:has(.first-node-in-document)': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> .pm-breakout-resize-handle-container': {
				height: '100%',
			},
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.pm-breakout-resize-handle-container': {
		position: 'relative',
		alignSelf: 'end',
		gridRow: 1,
		gridColumn: 1,
		height: '100%',
		width: 7,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.pm-breakout-resize-handle-container--left': {
		justifySelf: 'start',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.pm-breakout-resize-handle-container--right': {
		justifySelf: 'end',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.pm-breakout-resize-handle-rail': {
		position: 'relative',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',

		height: '100%',

		cursor: 'col-resize',

		borderRadius: 4,
		transition: 'background-color 0.2s, visibility 0.2s, opacity 0.2s',
		zIndex: 2,

		opacity: 0,

		'&:hover': {
			background: token('color.background.selected'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.pm-breakout-resize-handle-thumb': {
				background: token('color.border.focused'),
			},
		},
	},
	// same as 'hover' styles above
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.pm-breakout-resize-handle-container--active': {
		background: token('color.background.selected'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.pm-breakout-resize-handle-thumb': {
			background: token('color.border.focused'),
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.pm-breakout-resize-handle-hit-box': {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: -20,
		right: -20,
		zIndex: 0,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.pm-breakout-resize-handle-thumb': {
		minWidth: resizerHandleThumbWidth,
		// copied from resizeStyles.clamped
		height: 'clamp(27px, calc(100% - 32px), 96px)',
		background: token('color.border'),
		borderRadius: 6,

		// sticky styles
		position: 'sticky',
		top: token('space.150', '12px'),
		bottom: token('space.150', '12px'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const pragmaticResizerStylesNew: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.fabric-editor-breakout-mark': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:has([data-prosemirror-node-name="codeBlock"])': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> .pm-breakout-resize-handle-container--left': {
				left: '-5px',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> .pm-breakout-resize-handle-container--right': {
				right: '-5px',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> .pm-breakout-resize-handle-container': {
				height: 'calc(100% - 12px)',
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:has([data-prosemirror-node-name="expand"]), &:has([data-prosemirror-node-name="layoutSection"])':
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'> .pm-breakout-resize-handle-container--left': {
					left: '-25px',
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'> .pm-breakout-resize-handle-container--right': {
					right: '-25px',
				},
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:has([data-prosemirror-node-name="expand"])': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> .pm-breakout-resize-handle-container': {
				height: 'calc(100% - 4px)',
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:has([data-prosemirror-node-name="layoutSection"])': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> .pm-breakout-resize-handle-container': {
				height: 'calc(100% - 8px)',
			},
		},
		// the first node in the document always has margin-top = 0
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:has(.first-node-in-document)': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> .pm-breakout-resize-handle-container': {
				height: '100%',
			},
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.pm-breakout-resize-handle-container': {
		position: 'relative',
		alignSelf: 'end',
		gridRow: 1,
		gridColumn: 1,
		height: '100%',
		width: 7,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.pm-breakout-resize-handle-container--left': {
		justifySelf: 'start',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.pm-breakout-resize-handle-container--right': {
		justifySelf: 'end',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.pm-breakout-resize-handle-rail': {
		position: 'relative',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',

		height: '100%',

		cursor: 'col-resize',

		borderRadius: 4,
		transition: 'background-color 0.2s, visibility 0.2s, opacity 0.2s',
		zIndex: 2,

		opacity: 0,

		'&:hover': {
			background: token('color.background.selected'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.pm-breakout-resize-handle-thumb': {
				background: token('color.border.focused'),
			},
		},
	},
	// same as 'hover' styles above
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.pm-breakout-resize-handle-container--active': {
		background: token('color.background.selected'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.pm-breakout-resize-handle-thumb': {
			background: token('color.border.focused'),
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.pm-breakout-resize-handle-hit-box': {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: -20,
		right: -20,
		zIndex: 0,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.pm-breakout-resize-handle-thumb': {
		minWidth: resizerHandleThumbWidth,
		// copied from resizeStyles.clamped
		height: 'clamp(27px, calc(100% - 32px), 96px)',
		background: token('color.border'),
		borderRadius: 6,

		// sticky styles
		position: 'sticky',
		top: token('space.150', '12px'),
		bottom: token('space.150', '12px'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const pragmaticResizerStylesWithReducedEditorGutter: SerializedStyles = css({
	/* container editor-area is defined in platform/packages/editor/editor-core/src/ui/Appearance/FullPage/StyledComponents.ts */
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`@container editor-area (max-width: ${akEditorFullPageNarrowBreakout}px)`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.fabric-editor-breakout-mark': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&:has([data-prosemirror-node-name="expand"]), &:has([data-prosemirror-node-name="layoutSection"])':
				{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
					'> .pm-breakout-resize-handle-container': {
						opacity: 0,
						visibility: 'hidden',
					},
				},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&:has([data-prosemirror-node-name="layoutSection"])': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
				[`.${resizerItemClassName}`]: {
					willChange: 'width',

					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
					'&:hover, &.display-handle': {
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
						[`& > .${handleWrapperClass} > .${resizerHandleClassName}`]: {
							visibility: 'hidden',
							opacity: 0,
						},
					},
				},
			},
		},
	},
});
