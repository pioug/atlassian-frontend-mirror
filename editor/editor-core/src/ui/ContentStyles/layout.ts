/**
 * TODO ED-26957 - remove legacy styles when static emotion refactor is complete
 * We are moving this to new location under FF: platform_editor_core_static_emotion
 * New location: packages/editor/editor-core/src/ui/EditorContentContainer.tsx
 * If you are making updates to this file, please updates in new location as well.
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import {
	columnLayoutResponsiveSharedStyle,
	columnLayoutSharedStyle,
	LAYOUT_COLUMN_PADDING,
	LAYOUT_SECTION_MARGIN,
} from '@atlaskit/editor-common/styles';
import { TableCssClassName } from '@atlaskit/editor-plugins/table/types';
import { tableMarginFullWidthMode } from '@atlaskit/editor-plugins/table/ui/consts';
import {
	akEditorDeleteBackground,
	akEditorDeleteBorder,
	akEditorSelectedBorderSize,
	akEditorSelectedNodeClassName,
	akEditorSwoopCubicBezier,
	akLayoutGutterOffset,
	getSelectionStyles,
	gridMediumMaxWidth,
	SelectionStyle,
} from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

const akNestedDndGutterOffset = 8;
const firstNodeWithNotMarginTop = () =>
	fg('platform_editor_nested_dnd_styles_changes')
		? // eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
			css`
				> :nth-child(1 of :not(style, .ProseMirror-gapcursor, .ProseMirror-widget, span)) {
					margin-top: 0;
				}
			`
		: // eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
			css`
				> :not(style):first-child,
				> style:first-child + * {
					margin-top: 0;
				}

				> .ProseMirror-gapcursor:first-child + *,
				> style:first-child + .ProseMirror-gapcursor + * {
					margin-top: 0;
				}

				> .ProseMirror-gapcursor:first-child + span + * {
					margin-top: 0;
				}
			`;
// Ignored via go/ees007
// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
// TODO handle responsive
const layoutColumnStyles = () =>
	editorExperiment('advanced_layouts', true)
		? // eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
			css`
				> [data-layout-column] {
					margin: 0 ${LAYOUT_SECTION_MARGIN / 2}px;
				}

				> [data-layout-column]:first-of-type {
					margin-left: 0;
				}

				> [data-layout-column]:last-of-type {
					margin-right: 0;
				}

				@media screen and (max-width: ${gridMediumMaxWidth}px) {
					[data-layout-column] + [data-layout-column] {
						margin: 0;
					}
				}

				> [data-layout-column].${akEditorSelectedNodeClassName}:not(.danger) {
					${getSelectionStyles([SelectionStyle.Blanket])};
					/* layout column selection shorter after layout border has been removed */
					::before {
						width: calc(100% - 8px);
						left: 4px;
						border-radius: ${token('border.radius', '3px')};
					}
				}
			`
		: // eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
			css`
				[data-layout-column] + [data-layout-column] {
					margin-left: ${LAYOUT_SECTION_MARGIN}px;
				}

				@media screen and (max-width: ${gridMediumMaxWidth}px) {
					[data-layout-column] + [data-layout-column] {
						margin-left: 0;
					}
				}
			`;

const layoutSectionStyles = () =>
	editorExperiment('advanced_layouts', true)
		? // eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
			css`
				${columnLayoutResponsiveSharedStyle};
				.layout-section-container [data-layout-section] {
					> .ProseMirror-widget {
						flex: none;
						display: contents !important;

						&[data-blocks-drag-handle-container] div {
							display: contents !important;
						}

						&[data-blocks-drop-target-container] {
							display: block !important;
							margin: ${token('space.negative.050', '-4px')};

							[data-drop-target-for-element] {
								position: absolute;
							}
						}

						& + [data-layout-column] {
							margin: 0;
						}
					}

					> [data-layout-column] {
						margin: 0;
					}
				}
			`
		: // eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
			css`
				${columnLayoutSharedStyle}
			`;

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
const layoutBorderStyles = (viewMode?: 'edit' | 'view') => css`
	/* TODO: Remove the border styles below once design tokens have been enabled and fallbacks are no longer triggered.
	This is because the default state already uses the same token and, as such, the hover style won't change anything.
	https://product-fabric.atlassian.net/browse/DSP-4441 */
	/* Shows the border when cursor is inside a layout */
	&.selected [data-layout-column],
	&:hover [data-layout-column] {
		border: ${viewMode === 'view' ? 0 : akEditorSelectedBorderSize}px solid ${token('color.border')};
	}

	&.selected.danger [data-layout-column] {
		background-color: ${token('color.background.danger', akEditorDeleteBackground)};
		border-color: ${token('color.border.danger', akEditorDeleteBorder)};
	}

	&.${akEditorSelectedNodeClassName}:not(.danger) {
		[data-layout-column] {
			${getSelectionStyles([SelectionStyle.Border, SelectionStyle.Blanket])}
			::after {
				background-color: transparent;
			}
		}
	}
`;

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
const columnSeparatorStyles = (viewMode?: 'edit' | 'view') => css`
	[data-layout-content]::before {
		content: '';
		border-left: ${viewMode === 'view' ? 0 : akEditorSelectedBorderSize}px solid
			${token('color.border')};
		position: absolute;
		height: calc(100% - 24px);
		margin-left: -25px;
	}
`;
// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
const rowSeparatorStyles = (viewMode?: 'edit' | 'view') => css`
	[data-layout-content]::before {
		content: '';
		border-top: ${viewMode === 'view' ? 0 : akEditorSelectedBorderSize}px solid
			${token('color.border')};
		position: absolute;
		width: calc(100% - 32px);
		margin-top: -13px;

		/* clear styles for column separator */
		border-left: unset;
		margin-left: unset;
		height: unset;
	}
`;

// jest warning: JSDOM version (22) doesn't support the new @container CSS rule
const layoutWithSeparatorBorderResponsiveStyles = (
	breakpoint: number,
	viewMode?: 'edit' | 'view',
	// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
) => css`
	&.selected,
	&:hover,
	&.selected.danger,
	&.${akEditorSelectedNodeClassName}:not(.danger) {
		[data-layout-column]:not(:first-of-type) {
			@container editor-area (max-width:${breakpoint}px) {
				${rowSeparatorStyles(viewMode)}
			}
		}
	}
`;

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
const layoutWithSeparatorBorderStyles = (viewMode?: 'edit' | 'view') => {
	// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
	return css`
		&.selected [data-layout-column]:not(:first-of-type),
		[data-empty-layout='true'] [data-layout-column]:not(:first-of-type),
		&:hover [data-layout-column]:not(:first-of-type) {
			${columnSeparatorStyles(viewMode)}
		}

		&.selected.danger [data-layout-section] {
			background-color: ${token('color.background.danger', akEditorDeleteBackground)};

			box-shadow: 0 0 0 ${viewMode === 'view' ? 0 : akEditorSelectedBorderSize}px
				${akEditorDeleteBorder};
			border-radius: 4px;
			[data-layout-column]:not(:first-of-type) {
				${columnSeparatorStyles(viewMode)}
			}
		}

		&.${akEditorSelectedNodeClassName}:not(.danger) [data-layout-section] {
			box-shadow: 0 0 0 ${viewMode === 'view' ? 0 : akEditorSelectedBorderSize}px
				${token('color.border.selected')};
			border-radius: 4px;
			background-color: ${token('color.background.selected')};
			[data-layout-column] {
				${getSelectionStyles([SelectionStyle.Blanket])}
				border: 0px;
				::before {
					background-color: transparent;
				}
			}
			[data-layout-column]:not(:first-of-type) {
				${columnSeparatorStyles(viewMode)}
			}
		}
	`;
};

// jest warning: JSDOM version (22) doesn't support the new @container CSS rule
const layoutResponsiveStyles = (viewMode?: 'edit' | 'view') =>
	// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
	css`
		/* chosen breakpoints in container queries are to make sure layout responsiveness in editor aligns with renderer */
		/* not resized layout in full-width editor */
		.fabric-editor--full-width-mode .ProseMirror {
			> .layoutSectionView-content-wrap {
				[data-layout-section] {
					@container editor-area (max-width:724px) {
						flex-direction: column;
					}
				}

				${layoutWithSeparatorBorderResponsiveStyles(724, viewMode)}
			}
		}

		/* not resized layout in fixed-width editor */
		.ak-editor-content-area:not(.fabric-editor--full-width-mode) .ProseMirror {
			> .layoutSectionView-content-wrap {
				[data-layout-section] {
					@container editor-area (max-width:788px) {
						flex-direction: column;
					}
				}

				${layoutWithSeparatorBorderResponsiveStyles(788, viewMode)}
			}
		}

		/* resized layout in full/fixed-width editor */
		.ProseMirror .fabric-editor-breakout-mark {
			.layoutSectionView-content-wrap {
				[data-layout-section] {
					@container editor-area (max-width:820px) {
						flex-direction: column;
					}
				}

				${layoutWithSeparatorBorderResponsiveStyles(820, viewMode)}
			}
		}
	`;

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Needs manual remediation
export const layoutStyles = (viewMode?: 'edit' | 'view') => css`
	.ProseMirror {
		${layoutSectionStyles()}
		[data-layout-section] {
			/* Ignored via go/ees007
			TODO: Migrate away from gridSize
			Recommendation: Replace directly with 7px */
			margin: ${token('space.100', '8px')} -${akLayoutGutterOffset +
				(fg('platform_editor_nested_dnd_styles_changes') ? akNestedDndGutterOffset : 0)}px 0;
			transition: border-color 0.3s ${akEditorSwoopCubicBezier};
			cursor: ${viewMode === 'view' ? 'default' : 'pointer'};

			/* Inner cursor located 26px from left */
			[data-layout-column] {
				flex: 1;
				position: relative;

				min-width: 0;
				/* disable 4 borders when in view mode and advanced layouts is on */
				border: ${viewMode === 'view' || editorExperiment('advanced_layouts', true)
						? 0
						: akEditorSelectedBorderSize}px
					solid ${token('color.border')};
				border-radius: 4px;
				padding: ${LAYOUT_COLUMN_PADDING}px
					${LAYOUT_COLUMN_PADDING + (fg('platform_editor_nested_dnd_styles_changes') ? 8 : 0)}px;
				box-sizing: border-box;

				> div {
					${firstNodeWithNotMarginTop()}

					> .embedCardView-content-wrap:first-of-type .rich-media-item {
						margin-top: 0;
					}

					> .mediaSingleView-content-wrap:first-of-type .rich-media-item {
						margin-top: 0;
					}

					> .ProseMirror-gapcursor.-right:first-child
						+ .mediaSingleView-content-wrap
						.rich-media-item,
					> style:first-child
						+ .ProseMirror-gapcursor.-right
						+ .mediaSingleView-content-wrap
						.rich-media-item,
					> .ProseMirror-gapcursor.-right:first-of-type
						+ .embedCardView-content-wrap
						.rich-media-item {
						margin-top: 0;
					}

					> .ProseMirror-gapcursor:first-child
						+ span
						+ .mediaSingleView-content-wrap
						.rich-media-item,
					> style:first-child
						+ .ProseMirror-gapcursor
						+ span
						+ .mediaSingleView-content-wrap
						.rich-media-item {
						margin-top: 0;
					}

					/* Prevent first DecisionWrapper's margin-top: 8px from shifting decisions down
             and shrinking layout's node selectable area (leniency margin) */
					> [data-node-type='decisionList'] {
						li:first-of-type [data-decision-wrapper] {
							margin-top: 0;
						}
					}
				}

				/* Make the 'content' fill the entire height of the layout column to allow click
           handler of layout section nodeview to target only data-layout-column */
				[data-layout-content] {
					height: 100%;
					cursor: text;
					.mediaGroupView-content-wrap {
						clear: both;
					}
				}
			}

			${layoutColumnStyles()}
		}

		/* styles to support borders for layout */
		[data-layout-section],
		.layoutSectionView-content-wrap {
			${editorExperiment('advanced_layouts', true)
				? layoutWithSeparatorBorderStyles(viewMode)
				: layoutBorderStyles(viewMode)}
		}
	}

	${editorExperiment('advanced_layouts', true) && layoutResponsiveStyles(viewMode)}

	/* hide separator when element is dragging on top of a layout column */
	[data-blocks-drop-target-container] ~ [data-layout-column] > [data-layout-content]::before {
		display: none;
	}

	.fabric-editor--full-width-mode .ProseMirror {
		[data-layout-section] {
			.${TableCssClassName.TABLE_CONTAINER} {
				margin: 0 ${tableMarginFullWidthMode}px;
			}
		}
	}

	${editorExperiment('advanced_layouts', false) &&
	fg('platform_editor_nested_dnd_styles_changes') &&
	`.ak-editor-content-area.appearance-full-page .ProseMirror [data-layout-section] {
				margin: ${token('space.100', '8px')} -${akLayoutGutterOffset + 8}px 0;
				}`}
`;
