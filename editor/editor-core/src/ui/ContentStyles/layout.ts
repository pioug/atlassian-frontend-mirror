// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import {
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

export { LAYOUT_COLUMN_PADDING, LAYOUT_SECTION_MARGIN };

const firstNodeWithNotMarginTop = () =>
	editorExperiment('nested-dnd', true)
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

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Needs manual remediation
export const layoutStyles = (viewMode?: 'edit' | 'view') => css`
	.ProseMirror {
		${columnLayoutSharedStyle} [data-layout-section] {
			// TODO: Migrate away from gridSize
			// Recommendation: Replace directly with 7px
			margin: ${token('space.100', '8px')} -${akLayoutGutterOffset}px 0;
			transition: border-color 0.3s ${akEditorSwoopCubicBezier};
			cursor: ${viewMode === 'view' ? 'default' : 'pointer'};

			/* Inner cursor located 26px from left */
			[data-layout-column] {
				flex: 1;
				${fg('platform_editor_drag_and_drop_target_v2') ? 'position: relative;' : ''}

				min-width: 0;
				border: ${viewMode === 'view' ? 0 : akEditorSelectedBorderSize}px solid
					${token('color.border')};
				border-radius: 4px;
				padding: ${LAYOUT_COLUMN_PADDING}px
					${LAYOUT_COLUMN_PADDING + (editorExperiment('nested-dnd', true) ? 8 : 0)}px;
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

			[data-layout-column] + [data-layout-column] {
				margin-left: ${LAYOUT_SECTION_MARGIN}px;
			}

			@media screen and (max-width: ${gridMediumMaxWidth}px) {
				[data-layout-column] + [data-layout-column] {
					margin-left: 0;
				}
			}

			// TODO: Remove the border styles below once design tokens have been enabled and fallbacks are no longer triggered.
			// This is because the default state already uses the same token and, as such, the hover style won't change anything.
			// https://product-fabric.atlassian.net/browse/DSP-4441
			/* Shows the border when cursor is inside a layout */
			&.selected [data-layout-column],
			&:hover [data-layout-column] {
				border: ${viewMode === 'view' ? 0 : akEditorSelectedBorderSize}px solid
					${token('color.border')};
			}

			&.selected.danger > [data-layout-column] {
				background-color: ${token('color.background.danger', akEditorDeleteBackground)};
				border-color: ${token('color.border.danger', akEditorDeleteBorder)};
			}

			&.${akEditorSelectedNodeClassName}:not(.danger) {
				[data-layout-column] {
					${getSelectionStyles([SelectionStyle.Border, SelectionStyle.Blanket])}
				}
			}
		}
	}

	.fabric-editor--full-width-mode .ProseMirror {
		[data-layout-section] {
			.${TableCssClassName.TABLE_CONTAINER} {
				margin: 0 ${tableMarginFullWidthMode}px;
			}
		}
	}

	${editorExperiment('nested-dnd', true) &&
	`.ak-editor-content-area.appearance-full-page .ProseMirror [data-layout-section] {
				margin: ${token('space.100', '8px')} -${akLayoutGutterOffset + 8}px 0;
				}`}
`;
