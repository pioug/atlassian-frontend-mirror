// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, type SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import {
	blanketSelectionStyles,
	borderSelectionStyles,
	hideNativeBrowserTextSelectionStyles,
} from './selectionStyles';

const gridMediumMaxWidth = 1024;
const akEditorSelectedNodeClassName = 'ak-editor-selected-node';
const selectorForNotResizedLayoutInFulllWidthEditor =
	'.fabric-editor--full-width-mode .ProseMirror > .layoutSectionView-content-wrap';
const selectorForNotResizedLayoutInFixedWidthEditor =
	'.ak-editor-content-area:not(.fabric-editor--full-width-mode) .ProseMirror > .layoutSectionView-content-wrap';
const selectorForResizedLayoutInFullOrFixedWidthEditor =
	'.ProseMirror .fabric-editor-breakout-mark .layoutSectionView-content-wrap';
const layoutResponsiveSelectedSelector = `&.selected, &:hover, &.selected.danger, &.${akEditorSelectedNodeClassName}:not(.danger)`;
const layoutSelectedSelector = `&.selected, [data-empty-layout='true'], &:hover, &.selected.danger [data-layout-section], &.${akEditorSelectedNodeClassName}:not(.danger) [data-layout-section]`;

/**
 * Layout columns styles when advanced layouts experiment is on
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const layoutColumnStylesAdvanced: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror [data-layout-section]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'> [data-layout-column]': {
			margin: '0 4px',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
		'> [data-layout-column]:first-of-type': {
			marginLeft: 0,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
		'> [data-layout-column]:last-of-type': {
			marginRight: 0,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[`@media screen and (max-width: ${gridMediumMaxWidth}px)`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'[data-layout-column] + [data-layout-column]': {
				margin: 0,
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[`> [data-layout-column].${akEditorSelectedNodeClassName}:not(.danger)`]: [
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			blanketSelectionStyles,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			hideNativeBrowserTextSelectionStyles,
			{
				// layout column selection shorter after layout border has been removed
				'::before': {
					width: 'calc(100% - 8px)',
					left: 4,
					borderRadius: token('radius.small', '3px'),
				},
			},
		],
	},
});

/**
 * Layout columns styles when advanced layouts experiment is off
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const layoutColumnStylesNotAdvanced: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror [data-layout-section]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-layout-column] + [data-layout-column]': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginLeft: 8,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[`@media screen and (max-width: ${gridMediumMaxWidth}px)`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'[data-layout-column] + [data-layout-column]': {
				marginLeft: 0,
			},
		},
	},
});

/**
 * Responsive styles for layout columns when advanced layouts experiment is on
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const layoutColumnResponsiveStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror [data-layout-section]': {
		display: 'flex',
		flexDirection: 'row',
		gap: token('space.100', '8px'),

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > *': {
			flex: 1,
			minWidth: 0,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > .unsupportedBlockView-content-wrap': {
			minWidth: 'initial',
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.layout-section-container': {
		containerType: 'inline-size',
		containerName: 'layout-area',
	},
});

/**
 * Layout section styles when advanced layouts experiment is on
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-exported-styles
export const layoutSectionStylesAdvanced: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror .layout-section-container [data-layout-section]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'> .ProseMirror-widget': {
			flex: 'none',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			display: 'contents !important',

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&[data-blocks-drag-handle-container] div': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				display: 'contents !important',
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&[data-blocks-drop-target-container]': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				display: 'block !important',
				margin: token('space.negative.050', '-4px'),

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'[data-drop-target-for-element]': {
					position: 'absolute',
				},
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'& + [data-layout-column]': {
				margin: 0,
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'> [data-layout-column]': {
			margin: 0,
		},
	},
});

/**
 * Layout section styles when advanced layouts experiment is off
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const layoutSectionStylesNotAdvanced: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.ProseMirror [data-layout-section]': {
		position: 'relative',
		display: 'flex',
		flexDirection: 'row',

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& > *': {
			flex: 1,
			minWidth: 0,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& > .unsupportedBlockView-content-wrap': {
			minWidth: 'initial',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		[`@media screen and (max-width: ${gridMediumMaxWidth}px)`]: {
			flexDirection: 'column',
		},
	},
});

/**
 * Selected styles for layout when advanced layouts experiment is off
 */
// TODO: DSP-4441 - Remove the border styles below once design tokens have been enabled and fallbacks are no longer triggered.
//       This is because the default state already uses the same token and, as such, the hover style won't change anything.
//       https://product-fabric.atlassian.net/browse/DSP-4441
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const layoutSelectedStylesNotAdvanced: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-layout-section], .layoutSectionView-content-wrap': {
			// Shows the border when cursor is inside a layout
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.selected [data-layout-column], &:hover [data-layout-column]': {
				border: `1px solid ${token('color.border')}`,
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.selected.danger [data-layout-column]': {
				backgroundColor: token('color.background.danger'),
				borderColor: token('color.border.danger'),
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`&.${akEditorSelectedNodeClassName}:not(.danger)`]: {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				'[data-layout-column]': [
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					borderSelectionStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					blanketSelectionStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					hideNativeBrowserTextSelectionStyles,
					{
						'::after': {
							backgroundColor: 'transparent',
						},
					},
				],
			},
		},
	},
});

// TODO: ED-28075 - inline rowSeparatorBaseStyles to unblock Compiled CSS migration
const rowSeparatorBaseStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-layout-content]::before': {
		content: "''",
		borderTop: `1px solid ${token('color.border')}`,
		position: 'absolute',
		width: 'calc(100% - 32px)',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		marginTop: -13,
		// clear styles for column separator
		borderLeft: 'unset',
		marginLeft: 'unset',
		height: 'unset',
	},
});

/**
 * Selected styles for layout when advanced layouts experiment is on
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const layoutSelectedStylesAdvanced: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-layout-section], .layoutSectionView-content-wrap': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
			[layoutSelectedSelector]: {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
				'[data-layout-column]:not(:first-of-type) [data-layout-content]::before': {
					content: "''",
					borderLeft: `1px solid ${token('color.border')}`,
					position: 'absolute',
					height: 'calc(100% - 24px)',
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
					marginLeft: -25,
				},
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.selected.danger [data-layout-section]': {
				backgroundColor: token('color.background.danger'),
				boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
				borderRadius: token('radius.small'),
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`&.${akEditorSelectedNodeClassName}:not(.danger) [data-layout-section]`]: {
				boxShadow: `0 0 0 1px ${token('color.border.selected')}`,
				borderRadius: token('radius.small'),
				backgroundColor: token('color.background.selected'),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				'[data-layout-column]': [
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					blanketSelectionStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					hideNativeBrowserTextSelectionStyles,
					{
						border: 0,
						'::before': {
							backgroundColor: 'transparent',
						},
					},
				],
			},
		},
	},
});

// Fix for layoutSelectedStylesAdvanced that addresses an issue where the delete indicator
// sometimes doesn't appear when inside a synced block.
// Separated as a distinct style to allow feature-gating without affecting module-level styles.
// This prevents style inconsistencies before the feature flag is initialized.
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const layoutSelectedStylesAdvancedFix: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-layout-section], .layoutSectionView-content-wrap': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.selected.danger [data-layout-section]': {
				boxShadow: `inset 0 0 0 1px ${token('color.border.danger')}`,
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`&.${akEditorSelectedNodeClassName}:not(.danger) [data-layout-section]`]: {
				boxShadow: `inset 0 0 0 1px ${token('color.border.selected')}`,
			},
		},
	},
});

/**
 * Base responsive styles for layout
 */
// jest warning: JSDOM version (22) doesn't support the new @container CSS rule
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const layoutResponsiveBaseStyles: SerializedStyles = css({
	// chosen breakpoints in container queries are to make sure layout responsiveness in editor aligns with renderer
	// not resized layout in full-width editor
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	[selectorForNotResizedLayoutInFulllWidthEditor]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-layout-section]': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries
			'@container editor-area (max-width:724px)': {
				flexDirection: 'column',
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
		[layoutResponsiveSelectedSelector]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
			'[data-layout-column]:not(:first-of-type)': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries,@atlaskit/ui-styling-standard/no-unsafe-values
				[`@container editor-area (max-width:724px)`]: rowSeparatorBaseStyles,
			},
		},
	},
	// not resized layout in fixed-width editor
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	[selectorForNotResizedLayoutInFixedWidthEditor]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-layout-section]': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries
			'@container editor-area (max-width:788px)': {
				flexDirection: 'column',
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
		[layoutResponsiveSelectedSelector]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
			'[data-layout-column]:not(:first-of-type)': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries,@atlaskit/ui-styling-standard/no-unsafe-values
				[`@container editor-area (max-width:788px)`]: rowSeparatorBaseStyles,
			},
		},
	},
	// resized layout in full/fixed-width editor
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	[selectorForResizedLayoutInFullOrFixedWidthEditor]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-layout-section]': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries
			'@container editor-area (max-width:820px)': {
				flexDirection: 'column',
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
		[layoutResponsiveSelectedSelector]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
			'[data-layout-column]:not(:first-of-type)': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries,@atlaskit/ui-styling-standard/no-unsafe-values
				[`@container editor-area (max-width:820px)`]: rowSeparatorBaseStyles,
			},
		},
	},
});

/**
 * Responsive styles for layout in view mode
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const layoutResponsiveStylesForView: SerializedStyles = css({
	// chosen breakpoints in container queries are to make sure layout responsiveness in editor aligns with renderer
	// not resized layout in full-width editor
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	[selectorForNotResizedLayoutInFulllWidthEditor]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
		[layoutResponsiveSelectedSelector]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
			'[data-layout-column]:not(:first-of-type)': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries,@atlaskit/ui-styling-standard/no-unsafe-values
				[`@container editor-area (max-width:724px)`]: {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
					'[data-layout-content]::before': {
						borderTop: 0,
					},
				},
			},
		},
	},

	// not resized layout in fixed-width editor
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	[selectorForNotResizedLayoutInFixedWidthEditor]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
		[layoutResponsiveSelectedSelector]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
			'[data-layout-column]:not(:first-of-type)': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries,@atlaskit/ui-styling-standard/no-unsafe-values
				[`@container editor-area (max-width:788px)`]: {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
					'[data-layout-content]::before': {
						borderTop: 0,
					},
				},
			},
		},
	},

	// resized layout in full/fixed-width editor
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	[selectorForResizedLayoutInFullOrFixedWidthEditor]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
		[layoutResponsiveSelectedSelector]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
			'[data-layout-column]:not(:first-of-type)': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries,@atlaskit/ui-styling-standard/no-unsafe-values
				[`@container editor-area (max-width:820px)`]: {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
					'[data-layout-content]::before': {
						borderTop: 0,
					},
				},
			},
		},
	},
});

/**
 * Base styles for layout
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Needs manual remediation
export const layoutBaseStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-layout-section]': {
			margin: `${token('space.100', '8px')} -12px 0`,
			transition: 'border-color 0.3s cubic-bezier(0.15, 1, 0.3, 1)',
			cursor: 'pointer',

			// Inner cursor located 26px from left
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'[data-layout-column]': {
				flex: 1,
				position: 'relative',
				minWidth: 0,
				/* disable 4 borders when in view mode and advanced layouts is on */
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				border: `${token('border.width')} solid ${token('color.border')}`,
				borderRadius: token('radius.small'),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				padding: token('space.150'),
				boxSizing: 'border-box',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'> div': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
					'> .embedCardView-content-wrap:first-of-type .rich-media-item': {
						marginTop: 0,
					},
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
					'> .mediaSingleView-content-wrap:first-of-type .rich-media-item': {
						marginTop: 0,
					},
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
					'> .ProseMirror-gapcursor.-right:first-child + .mediaSingleView-content-wrap .rich-media-item, > style:first-child + .ProseMirror-gapcursor.-right + .mediaSingleView-content-wrap .rich-media-item, > .ProseMirror-gapcursor.-right:first-of-type + .embedCardView-content-wrap .rich-media-item':
						{
							marginTop: 0,
						},
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
					'> .ProseMirror-gapcursor:first-child + span + .mediaSingleView-content-wrap .rich-media-item, > style:first-child + .ProseMirror-gapcursor + span + .mediaSingleView-content-wrap .rich-media-item':
						{
							marginTop: 0,
						},
					// Prevent first DecisionWrapper's margin-top: 8px from shifting decisions down and shrinking layout's node selectable area (leniency margin)
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
					"> [data-node-type='decisionList']": {
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
						'li:first-of-type [data-decision-wrapper]': {
							marginTop: 0,
						},
					},
				},

				// Make the 'content' fill the entire height of the layout column to allow click handler of layout section nodeview to target only data-layout-column
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'[data-layout-content]': {
					height: '100%',
					cursor: 'text',

					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
					'.mediaGroupView-content-wrap': {
						clear: 'both',
					},
				},
			},
		},
	},

	// hide separator when element is dragging on top of a layout column
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-blocks-drop-target-container] ~ [data-layout-column] > [data-layout-content]::before': {
		display: 'none',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.fabric-editor--full-width-mode .ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-layout-section]': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.pm-table-container': {
				margin: '0 2px',
			},
		},
	},
});
// on exp 'platform_editor_table_excerpts_fix' cleanup, merge this style to the one above
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Needs manual remediation
export const layoutBaseStylesWithTableExcerptsFix: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-layout-section]': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'[data-layout-column]': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'> div': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
					'.pm-table-container': {
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
						width: '100% !important',
					},
				},
			},
		},
	},
});

/**
 * Base styles overrides for layout columns when advanced layouts experiment is on
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const layoutBaseStylesAdvanced: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror [data-layout-section] [data-layout-column]': {
		border: 0,
	},
});

/**
 * Spacing overrides when platform_editor_nested_dnd_styles_changes is on
 */
// TODO: EDF-123 - Migrate away from gridSize
// Recommendation: Replace directly with 7px
// Ignored via go/ees007
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const layoutBaseStylesFixesUnderNestedDnDFG: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror [data-layout-section]': {
		margin: `${token('space.100', '8px')} -20px 0`,
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror [data-layout-section] [data-layout-column]': {
		padding: '12px 20px',
	},
});

/**
 * Spacing overrides when platform_editor_nested_dnd_styles_changes is on,
 * excluding layouts inside bodied sync blocks
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const layoutBaseStylesFixesUnderNestedDnDFGExcludingBodiedSync: SerializedStyles = css({
	// Apply -20px margin to all sections
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror [data-layout-section]': {
		margin: `${token('space.100', '8px')} -20px 0`,
	},

	// Reset to default margin when inside bodied sync block
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror [data-prosemirror-node-name="bodiedSyncBlock"] [data-layout-section]': {
		margin: `${token('space.100', '8px')} -12px 0`,
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror [data-layout-section] [data-layout-column]': {
		padding: '12px 20px',
	},
});

/**
 * Layout in view mode styles for selected state when advanced layouts experiment is on.
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Needs manual remediation
export const layoutSelectedStylesForViewAdvanced: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-layout-section], .layoutSectionView-content-wrap': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-nested-selectors
			[layoutSelectedSelector]: {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
				'[data-layout-column]:not(:first-of-type) [data-layout-content]::before': {
					borderLeft: 0,
				},
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.selected.danger [data-layout-section]': {
				boxShadow: `0 0 0 0 ${token('color.border.danger')}`,
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-nested-selectors
			[`&.${akEditorSelectedNodeClassName}:not(.danger) [data-layout-section]`]: {
				boxShadow: `0 0 0 0 ${token('color.border.selected')}`,
			},
		},
	},
});

/**
 * Layout in view mode styles for selected state when advanced layouts experiment is off.
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const layoutSelectedStylesForViewNotAdvanced: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-layout-section], .layoutSectionView-content-wrap': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.selected [data-layout-column], &:hover [data-layout-column]': {
				border: 0,
			},
		},
	},
});

/*
 * Layout in view mode styles, overrides over layout base styles
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Needs manual remediation
export const layoutStylesForView: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-layout-section]': {
			cursor: 'default',

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'[data-layout-column]': {
				border: 0,
			},
		},
	},
});

/*
 * marginTop fixes when platform_editor_nested_dnd_styles_changes is on
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const layoutColumnMartinTopFixesNew: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror [data-layout-section] [data-layout-column] > div': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'> :nth-child(1 of :not(style, .ProseMirror-gapcursor, .ProseMirror-widget, span))': {
			marginTop: 0,
		},
	},
});

/*
 * marginTop fixes when platform_editor_nested_dnd_styles_changes is off
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const layoutColumnMartinTopFixesOld: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror [data-layout-section] [data-layout-column] > div': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
		'> :not(style):first-child, > style:first-child + *': {
			marginTop: 0,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
		'> .ProseMirror-gapcursor:first-child + *, > style:first-child + .ProseMirror-gapcursor + *': {
			marginTop: 0,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
		'> .ProseMirror-gapcursor:first-child + span + *': {
			marginTop: 0,
		},
	},
});
