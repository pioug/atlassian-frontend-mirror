// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

import {
	blanketSelectionStyles,
	borderSelectionStyles,
	hideNativeBrowserTextSelectionStyles,
} from './selectionStyles';

const gridMediumMaxWidth = 1024;
const akEditorSelectedNodeClassName = 'ak-editor-selected-node';

const columnLayoutSharedStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'[data-layout-section]': {
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

const columnLayoutResponsiveSharedStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-layout-section]': {
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

const firstNodeWithNotMarginTop = () =>
	fg('platform_editor_nested_dnd_styles_changes')
		? // eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
			css({
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
				'> :nth-child(1 of :not(style, .ProseMirror-gapcursor, .ProseMirror-widget, span))': {
					marginTop: 0,
				},
			})
		: // eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
			css({
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
				'> :not(style):first-child, > style:first-child + *': {
					marginTop: 0,
				},

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
				'> .ProseMirror-gapcursor:first-child + *, > style:first-child + .ProseMirror-gapcursor + *':
					{
						marginTop: 0,
					},

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
				'> .ProseMirror-gapcursor:first-child + span + *': {
					marginTop: 0,
				},
			});

const layoutColumnStyles = () =>
	editorExperiment('advanced_layouts', true)
		? // eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
			css({
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
							borderRadius: token('border.radius', '3px'),
						},
					},
				],
			})
		: // eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
			css({
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
			});

const layoutSectionStyles = () =>
	editorExperiment('advanced_layouts', true)
		? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			css(columnLayoutResponsiveSharedStyle, {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'.layout-section-container [data-layout-section]': {
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
			})
		: columnLayoutSharedStyle;

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
const layoutBorderBaseStyles = css({
	// TODO: DSP-4441 - Remove the border styles below once design tokens have been enabled and fallbacks are no longer triggered.
	//       This is because the default state already uses the same token and, as such, the hover style won't change anything.
	//       https://product-fabric.atlassian.net/browse/DSP-4441
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
});

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
const layoutBorderViewStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&.selected [data-layout-column], &:hover [data-layout-column]': {
		border: 0,
	},
});

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
const columnSeparatorBaseStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-layout-content]::before': {
		content: "''",
		borderLeft: `1px solid ${token('color.border')}`,
		position: 'absolute',
		height: 'calc(100% - 24px)',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		marginLeft: -25,
	},
});

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
const columnSeparatorViewStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-layout-content]::before': {
		borderLeft: 0,
	},
});

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
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

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
const rowSeparatorViewStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-layout-content]::before': {
		borderTop: 0,
	},
});

// jest warning: JSDOM version (22) doesn't support the new @container CSS rule
const layoutWithSeparatorBorderResponsiveBaseStyles = (
	breakpoint: number,
	// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
) =>
	css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`&.selected, &:hover, &.selected.danger, &.${akEditorSelectedNodeClassName}:not(.danger)`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
			'[data-layout-column]:not(:first-of-type)': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries,@atlaskit/ui-styling-standard/no-unsafe-values
				[`@container editor-area (max-width:${breakpoint}px)`]: rowSeparatorBaseStyles,
			},
		},
	});

// jest warning: JSDOM version (22) doesn't support the new @container CSS rule
const layoutWithSeparatorBorderResponsiveViewStyles = (
	breakpoint: number,
	// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
) =>
	css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`&.selected, &:hover, &.selected.danger, &.${akEditorSelectedNodeClassName}:not(.danger)`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
			'[data-layout-column]:not(:first-of-type)': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries,@atlaskit/ui-styling-standard/no-unsafe-values
				[`@container editor-area (max-width:${breakpoint}px)`]: rowSeparatorViewStyles,
			},
		},
	});

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
const layoutWithSeparatorBorderBaseStyles = css({
	"&.selected [data-layout-column]:not(:first-of-type), [data-empty-layout='true'] [data-layout-column]:not(:first-of-type), &:hover [data-layout-column]:not(:first-of-type)":
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		columnSeparatorBaseStyles,

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&.selected.danger [data-layout-section]': {
		backgroundColor: token('color.background.danger'),
		boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
		borderRadius: 4,

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		'[data-layout-column]:not(:first-of-type)': columnSeparatorBaseStyles,
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`&.${akEditorSelectedNodeClassName}:not(.danger) [data-layout-section]`]: {
		boxShadow: `0 0 0 1px ${token('color.border.selected')}`,
		borderRadius: 4,
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

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		'[data-layout-column]:not(:first-of-type)': columnSeparatorBaseStyles,
	},
});

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
const layoutWithSeparatorBorderViewStyles = css({
	"&.selected [data-layout-column]:not(:first-of-type), [data-empty-layout='true'] [data-layout-column]:not(:first-of-type), &:hover [data-layout-column]:not(:first-of-type)":
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		columnSeparatorViewStyles,

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&.selected.danger [data-layout-section]': {
		boxShadow: `0 0 0 0 ${token('color.border.danger')}`,

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		'[data-layout-column]:not(:first-of-type)': columnSeparatorViewStyles,
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-nested-selectors
	[`&.${akEditorSelectedNodeClassName}:not(.danger) [data-layout-section]`]: {
		boxShadow: `0 0 0 0 ${token('color.border.selected')}`,

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		'[data-layout-column]:not(:first-of-type)': columnSeparatorViewStyles,
	},
});

// jest warning: JSDOM version (22) doesn't support the new @container CSS rule
// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
const layoutResponsiveBaseStyles = css({
	// chosen breakpoints in container queries are to make sure layout responsiveness in editor aligns with renderer
	// not resized layout in full-width editor
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.fabric-editor--full-width-mode .ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		'> .layoutSectionView-content-wrap': [
			{
				'[data-layout-section]': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries
					'@container editor-area (max-width:724px)': {
						flexDirection: 'column',
					},
				},
			},
			layoutWithSeparatorBorderResponsiveBaseStyles(724),
		],
	},

	// not resized layout in fixed-width editor
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
	'.ak-editor-content-area:not(.fabric-editor--full-width-mode) .ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		'> .layoutSectionView-content-wrap': [
			{
				'[data-layout-section]': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries
					'@container editor-area (max-width:788px)': {
						flexDirection: 'column',
					},
				},
			},
			layoutWithSeparatorBorderResponsiveBaseStyles(788),
		],
	},

	// resized layout in full/fixed-width editor
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror .fabric-editor-breakout-mark': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		'.layoutSectionView-content-wrap': [
			{
				'[data-layout-section]': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries
					'@container editor-area (max-width:820px)': {
						flexDirection: 'column',
					},
				},
			},
			layoutWithSeparatorBorderResponsiveBaseStyles(820),
		],
	},
});

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
const layoutResponsiveViewStyles = css({
	// chosen breakpoints in container queries are to make sure layout responsiveness in editor aligns with renderer
	// not resized layout in full-width editor
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.fabric-editor--full-width-mode .ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		'> .layoutSectionView-content-wrap': layoutWithSeparatorBorderResponsiveViewStyles(724),
	},

	// not resized layout in fixed-width editor
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
	'.ak-editor-content-area:not(.fabric-editor--full-width-mode) .ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		'> .layoutSectionView-content-wrap': layoutWithSeparatorBorderResponsiveViewStyles(788),
	},

	// resized layout in full/fixed-width editor
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror .fabric-editor-breakout-mark': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		'.layoutSectionView-content-wrap': layoutWithSeparatorBorderResponsiveViewStyles(820),
	},
});

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Needs manual remediation
export const layoutBaseStyles = () =>
	css(
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			'.ProseMirror': [
				layoutSectionStyles(),
				{
					'[data-layout-section]': [
						{
							// TODO: EDF-123 - Migrate away from gridSize
							//       Recommendation: Replace directly with 7px
							//       Ignored via go/ees007
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							margin: `${token('space.100', '8px')} -${12 + (fg('platform_editor_nested_dnd_styles_changes') ? 8 : 0)}px 0`,
							transition: 'border-color 0.3s cubic-bezier(0.15, 1, 0.3, 1)',
							cursor: 'pointer',

							// Inner cursor located 26px from left
							'[data-layout-column]': {
								flex: 1,
								position: 'relative',
								minWidth: 0,
								/* disable 4 borders when in view mode and advanced layouts is on */
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
								border: `${editorExperiment('advanced_layouts', true) ? 0 : 1}px solid ${token('color.border')}`,
								borderRadius: 4,
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
								padding: `12px ${12 + (fg('platform_editor_nested_dnd_styles_changes') ? 8 : 0)}px`,
								boxSizing: 'border-box',

								'> div': [
									firstNodeWithNotMarginTop(),
									{
										'> .embedCardView-content-wrap:first-of-type .rich-media-item': {
											marginTop: 0,
										},

										'> .mediaSingleView-content-wrap:first-of-type .rich-media-item': {
											marginTop: 0,
										},

										'> .ProseMirror-gapcursor.-right:first-child + .mediaSingleView-content-wrap .rich-media-item, > style:first-child + .ProseMirror-gapcursor.-right + .mediaSingleView-content-wrap .rich-media-item, > .ProseMirror-gapcursor.-right:first-of-type + .embedCardView-content-wrap .rich-media-item':
											{
												marginTop: 0,
											},

										'> .ProseMirror-gapcursor:first-child + span + .mediaSingleView-content-wrap .rich-media-item, > style:first-child + .ProseMirror-gapcursor + span + .mediaSingleView-content-wrap .rich-media-item':
											{
												marginTop: 0,
											},

										// Prevent first DecisionWrapper's margin-top: 8px from shifting decisions down and shrinking layout's node selectable area (leniency margin)
										"> [data-node-type='decisionList']": {
											'li:first-of-type [data-decision-wrapper]': {
												marginTop: 0,
											},
										},
									},
								],

								// Make the 'content' fill the entire height of the layout column to allow click handler of layout section nodeview to target only data-layout-column
								'[data-layout-content]': {
									height: '100%',
									cursor: 'text',

									'.mediaGroupView-content-wrap': {
										clear: 'both',
									},
								},
							},
						},
						layoutColumnStyles(),
					],

					// styles to support borders for layout
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					'[data-layout-section], .layoutSectionView-content-wrap': editorExperiment(
						'advanced_layouts',
						true,
					)
						? layoutWithSeparatorBorderBaseStyles
						: layoutBorderBaseStyles,
				},
			],

			// hide separator when element is dragging on top of a layout column
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'[data-blocks-drop-target-container] ~ [data-layout-column] > [data-layout-content]::before':
				{
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
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
		editorExperiment('advanced_layouts', true) && layoutResponsiveBaseStyles,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
		editorExperiment('advanced_layouts', false) &&
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			fg('platform_editor_nested_dnd_styles_changes') && {
				'.ak-editor-content-area.appearance-full-page .ProseMirror [data-layout-section]': {
					margin: `${token('space.100', '8px')} -20px 0`,
				},
			},
	);

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/ui-styling-standard/no-exported-styles -- Needs manual remediation
export const layoutViewStyles = css(
	{
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

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
			'[data-layout-section], .layoutSectionView-content-wrap': editorExperiment(
				'advanced_layouts',
				true,
			)
				? layoutWithSeparatorBorderViewStyles
				: layoutBorderViewStyles,
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
	editorExperiment('advanced_layouts', true) && layoutResponsiveViewStyles,
);
