/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @atlaskit/design-system/no-css-tagged-template-expression -- Requires manual remediation over time due to use of unsafe nested mixins */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, keyframes, useTheme } from '@emotion/react';

import { browser } from '@atlaskit/editor-common/browser';
import { telepointerStyle, telepointerStyleWithInitialOnly } from '@atlaskit/editor-common/collab';
import { EmojiSharedCssClassName, defaultEmojiHeight } from '@atlaskit/editor-common/emoji';
import { MentionSharedCssClassName } from '@atlaskit/editor-common/mention';
import { PanelSharedCssClassName } from '@atlaskit/editor-common/panel';
import { gapCursorStyles } from '@atlaskit/editor-common/selection';
import {
	CodeBlockSharedCssClassName,
	GRID_GUTTER,
	LAYOUT_COLUMN_PADDING,
	LAYOUT_SECTION_MARGIN,
	MediaSharedClassNames,
	SmartCardSharedCssClassName,
	annotationSharedStyles,
	blockMarksSharedStyles,
	codeBlockInListSafariFix,
	codeMarkSharedStyles,
	dateSharedStyle,
	embedCardStyles,
	expandClassNames,
	getSmartCardSharedStyles,
	gridStyles,
	indentationSharedStyles,
	linkSharedStyle,
	listsSharedStyles,
	paragraphSharedStyles,
	resizerStyles,
	pragmaticResizerStyles,
	ruleSharedStyles,
	shadowSharedStyle,
	smartCardSharedStyles,
	smartCardStyles,
	tasksAndDecisionsStyles,
	textColorStyles,
	unsupportedStyles,
	whitespaceSharedStyles,
} from '@atlaskit/editor-common/styles';
import type { EditorAppearance, FeatureFlags } from '@atlaskit/editor-common/types';
import { blocktypeStyles } from '@atlaskit/editor-plugins/block-type/styles';
import { findReplaceStyles } from '@atlaskit/editor-plugins/find-replace/styles';
import { textHighlightStyle } from '@atlaskit/editor-plugins/paste-options-toolbar/styles';
import { placeholderTextStyles } from '@atlaskit/editor-plugins/placeholder-text/styles';
import { TableCssClassName } from '@atlaskit/editor-plugins/table/types';
import { tableCommentEditorStyles } from '@atlaskit/editor-plugins/table/ui/common-styles';
import { tableMarginFullWidthMode } from '@atlaskit/editor-plugins/table/ui/consts';
import {
	SelectionStyle,
	akEditorCalculatedWideLayoutWidth,
	akEditorCalculatedWideLayoutWidthSmallViewport,
	akEditorDefaultLayoutWidth,
	akEditorDeleteBackground,
	akEditorDeleteBackgroundWithOpacity,
	akEditorDeleteBorder,
	akEditorFullWidthLayoutWidth,
	akEditorGutterPadding,
	akEditorGutterPaddingDynamic,
	akEditorSelectedBorderColor,
	akEditorSelectedBorderSize,
	akEditorSelectedNodeClassName,
	akEditorSwoopCubicBezier,
	akLayoutGutterOffset,
	blockNodesVerticalMargin,
	editorFontSize,
	getSelectionStyles,
	gridMediumMaxWidth,
} from '@atlaskit/editor-shared-styles';
import { scrollbarStyles } from '@atlaskit/editor-shared-styles/scrollbar';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token, useThemeObserver } from '@atlaskit/tokens';

import { InlineNodeViewSharedStyles } from '../../nodeviews/getInlineNodeViewProducer.styles';
import { codeBlockStyles } from '../ContentStyles/code-block';
import { dateStyles, dateVanillaStyles } from '../ContentStyles/date';
import { expandStyles } from '../ContentStyles/expand';
import { extensionStyles } from '../ContentStyles/extension';
import { mediaStyles } from '../ContentStyles/media';
import { panelStyles } from '../ContentStyles/panel';
import { statusStyles, vanillaStatusStyles } from '../ContentStyles/status';
import {
	taskDecisionStyles,
	vanillaTaskDecisionIconWithoutVisualRefresh as vanillaDecisionIconWithoutVisualRefresh,
	vanillaTaskDecisionIconWithVisualRefresh as vanillaDecisionIconWithVisualRefresh,
	vanillaTaskDecisionStyles as vanillaDecisionStyles,
	vanillaTaskItemStyles,
} from '../ContentStyles/tasks-and-decisions';

import { backgroundColorStyles } from './styles/backgroundColorStyles';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const linkStyles = css`
	.ProseMirror {
		${linkSharedStyle()}
	}
`;

const ruleStyles = () => css`
	.ProseMirror {
		${ruleSharedStyles()};

		hr {
			cursor: pointer;
			padding: ${token('space.050', '4px')} 0;
			margin: ${token('space.300', '24px')} 0;
			background-clip: content-box;

			&.${akEditorSelectedNodeClassName} {
				outline: none;
				background-color: ${token('color.border.selected', akEditorSelectedBorderColor)};
			}
		}
	}
`;

const vanillaMentionsStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.editor-mention-primitive': {
		display: 'inline',
		borderRadius: '20px',
		cursor: 'pointer',
		padding: '0 0.3em 2px 0.23em',
		fontWeight: token('font.weight.regular'),
		wordBreak: 'break-word',
		background: token('color.background.neutral'),
		border: '1px solid transparent',
		color: token('color.text.subtle'),

		'&:hover': {
			background: token('color.background.neutral.hovered'),
		},
		'&:active': {
			background: token('color.background.neutral.pressed'),
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.editor-mention-primitive.mention-restricted': {
		background: 'transparent',
		border: `1px solid ${token('color.border.bold')}`,
		color: token('color.text'),

		'&:hover': {
			background: 'transparent',
		},
		'&:active': {
			background: 'transparent',
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.editor-mention-primitive.mention-self': {
		background: token('color.background.brand.bold'),
		border: '1px solid transparent',
		color: token('color.text.inverse'),

		'&:hover': {
			background: token('color.background.brand.bold.hovered'),
		},
		'&:active': {
			background: token('color.background.brand.bold.pressed'),
		},
	},
});

const vanillaSelectionStyles = css`
	.danger {
		.editor-mention-primitive {
			box-shadow: 0 0 0 ${akEditorSelectedBorderSize}px ${akEditorDeleteBorder};
			background-color: ${token('color.background.danger', akEditorDeleteBackgroundWithOpacity)};
		}
	}

	.${akEditorSelectedNodeClassName} > .editor-mention-primitive,
	.${akEditorSelectedNodeClassName} > .editor-mention-primitive.mention-self,
	.${akEditorSelectedNodeClassName} > .editor-mention-primitive.mention-restricted {
		${getSelectionStyles([SelectionStyle.BoxShadow, SelectionStyle.Background])}
		/* need to specify dark text colour because personal mentions
		   (in dark blue) have white text by default */
		color: ${token('color.text.subtle')}
	}
`;

const mentionsStyles = css`
	.${MentionSharedCssClassName.MENTION_CONTAINER} {
		&.${akEditorSelectedNodeClassName} [data-mention-id] > span {
			${getSelectionStyles([SelectionStyle.BoxShadow, SelectionStyle.Background])}

			/* need to specify dark text colour because personal mentions
		 (in dark blue) have white text by default */
	  color: ${token('color.text.subtle')};
		}
	}

	.danger {
		.${MentionSharedCssClassName.MENTION_CONTAINER}.${akEditorSelectedNodeClassName}
			> span
			> span
			> span {
			box-shadow: 0 0 0 ${akEditorSelectedBorderSize}px ${akEditorDeleteBorder};
			background-color: ${token('color.background.danger', akEditorDeleteBackgroundWithOpacity)};
		}
		.${MentionSharedCssClassName.MENTION_CONTAINER} > span > span > span {
			background-color: ${token('color.background.neutral')};
			color: ${token('color.text.subtle')};
		}
	}
`;

const listsStyles = css`
	.ProseMirror {
		li {
			position: relative;

			> p:not(:first-child) {
				margin: ${token('space.050', '4px')} 0 0 0;
			}

			// In SSR the above rule will apply to all p tags because first-child would be a style tag.
			// The following rule resets the first p tag back to its original margin
			// defined in packages/editor/editor-common/src/styles/shared/paragraph.ts
			> style:first-child + p {
				margin-top: ${blockNodesVerticalMargin};
			}
		}

		&:not([data-node-type='decisionList']) > li,
	// This prevents https://product-fabric.atlassian.net/browse/ED-20924
	&:not(.${SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER}) > li {
			${browser.safari ? codeBlockInListSafariFix : ''}
		}
	}
`;

const reactEmojiStyles = css`
	.${EmojiSharedCssClassName.EMOJI_CONTAINER} {
		display: inline-block;

		.${EmojiSharedCssClassName.EMOJI_NODE} {
			cursor: pointer;

			&.${EmojiSharedCssClassName.EMOJI_IMAGE} > span {
				/** needed for selection style to cover custom emoji image properly */
				display: flex;
			}
		}

		&.${akEditorSelectedNodeClassName} {
			.${EmojiSharedCssClassName.EMOJI_SPRITE}, .${EmojiSharedCssClassName.EMOJI_IMAGE} {
				border-radius: 2px;
				${getSelectionStyles([SelectionStyle.Blanket, SelectionStyle.BoxShadow])}
			}
		}
	}
`;

const emojiStyles = css`
	[data-prosemirror-node-view-type='vanilla'] {
		.${EmojiSharedCssClassName.EMOJI_CONTAINER} {
			display: inline-block;
		}

		.${EmojiSharedCssClassName.EMOJI_SPRITE}, .${EmojiSharedCssClassName.EMOJI_IMAGE} {
			background: no-repeat transparent;
			display: inline-block;
			height: ${defaultEmojiHeight}px;
			max-height: ${defaultEmojiHeight}px;
			cursor: pointer;
			vertical-align: middle;
			user-select: all;
		}

		&.${akEditorSelectedNodeClassName} {
			.${EmojiSharedCssClassName.EMOJI_SPRITE}, .${EmojiSharedCssClassName.EMOJI_IMAGE} {
				border-radius: 2px;
				${getSelectionStyles([SelectionStyle.Blanket, SelectionStyle.BoxShadow])}
			}
		}
	}
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const placeholderStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.ProseMirror .placeholder-decoration': {
		color: token('color.text.subtlest'),
		width: '100%',
		pointerEvents: 'none',
		userSelect: 'none',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.placeholder-android': {
			pointerEvents: 'none',
			outline: 'none',
			userSelect: 'none',
			position: 'absolute',
		},
	},
});

const placeholderOverflowStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'.ProseMirror p:has(.placeholder-decoration-hide-overflow)': {
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',
	},
});

const placeholderWrapStyles = css({
	// As part of controls work, we add placeholder `Search` to quick insert command
	// This style is to prevent `/Search` being wrapped if it's triggered at the end of the line
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'.ProseMirror mark[data-type-ahead-query="true"]:has(.placeholder-decoration-wrap)': {
		whiteSpace: 'nowrap',
	},
});

const firstBlockNodeStyles = css`
	.ProseMirror {
		> .${PanelSharedCssClassName.prefix},
			> .${CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER},
			> .${SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER},
			> div[data-task-list-local-id],
		> div[data-layout-section],
		> .${expandClassNames.prefix} {
			&:first-child {
				margin-top: 0;
			}
		}

		> hr:first-of-type {
			margin-top: 0;
		}
	}
`;

const firstBlockNodeStylesNew = css`
	.ProseMirror {
		> .${PanelSharedCssClassName.prefix},
			> .${CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER},
			> .${SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER},
			> div[data-task-list-local-id],
		> div[data-layout-section],
		> .${expandClassNames.prefix} {
			&:first-child {
				margin-top: 0;
			}
		}

		> hr:first-child,
		> .ProseMirror-widget:first-child + hr {
			margin-top: 0;
		}
	}
`;

export const fixBlockControlStylesSSR = () => {
	if (fg('platform_editor_element_dnd_nested_fix_patch_6')) {
		return firstBlockNodeStylesNew;
	}

	return firstBlockNodeStyles;
};

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

/**
 * layout styles
 * was imported from packages/editor/editor-core/src/ui/ContentStyles/layout.ts
 * @example
 * @returns {string}
 */
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
const layoutBorderBaseStyles = css`
	/* TODO: Remove the border styles below once design tokens have been enabled and fallbacks are no longer triggered.
	This is because the default state already uses the same token and, as such, the hover style won't change anything.
	https://product-fabric.atlassian.net/browse/DSP-4441 */
	/* Shows the border when cursor is inside a layout */
	&.selected [data-layout-column],
	&:hover [data-layout-column] {
		border: ${akEditorSelectedBorderSize}px solid ${token('color.border')};
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
const layoutBorderViewStyles = css`
	&.selected [data-layout-column],
	&:hover [data-layout-column] {
		border: 0;
	}
`;

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
const columnSeparatorBaseStyles = css`
	[data-layout-content]::before {
		content: '';
		border-left: ${akEditorSelectedBorderSize}px solid ${token('color.border')};
		position: absolute;
		height: calc(100% - 24px);
		margin-left: -25px;
	}
`;

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
const columnSeparatorViewStyles = css`
	[data-layout-content]::before {
		border-left: 0;
	}
`;

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
const rowSeparatorBaseStyles = css`
	[data-layout-content]::before {
		content: '';
		border-top: ${akEditorSelectedBorderSize}px solid ${token('color.border')};
		position: absolute;
		width: calc(100% - 32px);
		margin-top: -13px;

		/* clear styles for column separator */
		border-left: unset;
		margin-left: unset;
		height: unset;
	}
`;

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
const rowSeparatorViewStyles = css`
	[data-layout-content]::before {
		border-top: 0;
	}
`;

// jest warning: JSDOM version (22) doesn't support the new @container CSS rule
const layoutWithSeparatorBorderResponsiveBaseStyles = (
	breakpoint: number,
	// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
) => css`
	&.selected,
	&:hover,
	&.selected.danger,
	&.${akEditorSelectedNodeClassName}:not(.danger) {
		[data-layout-column]:not(:first-of-type) {
			@container editor-area (max-width:${breakpoint}px) {
				${rowSeparatorBaseStyles}
			}
		}
	}
`;

// jest warning: JSDOM version (22) doesn't support the new @container CSS rule
const layoutWithSeparatorBorderResponsiveViewStyles = (
	breakpoint: number,
	// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
) => css`
	&.selected,
	&:hover,
	&.selected.danger,
	&.${akEditorSelectedNodeClassName}:not(.danger) {
		[data-layout-column]:not(:first-of-type) {
			@container editor-area (max-width:${breakpoint}px) {
				${rowSeparatorViewStyles}
			}
		}
	}
`;

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
const layoutWithSeparatorBorderBaseStyles = css`
	&.selected [data-layout-column]:not(:first-of-type),
	[data-empty-layout='true'] [data-layout-column]:not(:first-of-type),
	&:hover [data-layout-column]:not(:first-of-type) {
		${columnSeparatorBaseStyles}
	}

	&.selected.danger [data-layout-section] {
		background-color: ${token('color.background.danger', akEditorDeleteBackground)};

		box-shadow: 0 0 0 ${akEditorSelectedBorderSize}px ${akEditorDeleteBorder};
		border-radius: 4px;
		[data-layout-column]:not(:first-of-type) {
			${columnSeparatorBaseStyles}
		}
	}

	&.${akEditorSelectedNodeClassName}:not(.danger) [data-layout-section] {
		box-shadow: 0 0 0 ${akEditorSelectedBorderSize}px ${token('color.border.selected')};
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
			${columnSeparatorBaseStyles}
		}
	}
`;

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
const layoutWithSeparatorBorderViewStyles = css`
	&.selected [data-layout-column]:not(:first-of-type),
	[data-empty-layout='true'] [data-layout-column]:not(:first-of-type),
	&:hover [data-layout-column]:not(:first-of-type) {
		${columnSeparatorViewStyles}
	}

	&.selected.danger [data-layout-section] {
		box-shadow: 0 0 0 0 ${akEditorDeleteBorder};
		[data-layout-column]:not(:first-of-type) {
			${columnSeparatorViewStyles}
		}
	}

	&.${akEditorSelectedNodeClassName}:not(.danger) [data-layout-section] {
		box-shadow: 0 0 0 0 ${token('color.border.selected')};
		[data-layout-column]:not(:first-of-type) {
			${columnSeparatorViewStyles}
		}
	}
`;

// jest warning: JSDOM version (22) doesn't support the new @container CSS rule
// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
const layoutResponsiveBaseStyles = css`
	/* chosen breakpoints in container queries are to make sure layout responsiveness in editor aligns with renderer */
	/* not resized layout in full-width editor */
	.fabric-editor--full-width-mode .ProseMirror {
		> .layoutSectionView-content-wrap {
			[data-layout-section] {
				@container editor-area (max-width:724px) {
					flex-direction: column;
				}
			}

			${layoutWithSeparatorBorderResponsiveBaseStyles(724)}
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

			${layoutWithSeparatorBorderResponsiveBaseStyles(788)}
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

			${layoutWithSeparatorBorderResponsiveBaseStyles(820)}
		}
	}
`;

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
const layoutResponsiveViewStyles = css`
	/* chosen breakpoints in container queries are to make sure layout responsiveness in editor aligns with renderer */
	/* not resized layout in full-width editor */
	.fabric-editor--full-width-mode .ProseMirror {
		> .layoutSectionView-content-wrap {
			${layoutWithSeparatorBorderResponsiveViewStyles(724)}
		}
	}

	/* not resized layout in fixed-width editor */
	.ak-editor-content-area:not(.fabric-editor--full-width-mode) .ProseMirror {
		> .layoutSectionView-content-wrap {
			${layoutWithSeparatorBorderResponsiveViewStyles(788)}
		}
	}

	/* resized layout in full/fixed-width editor */
	.ProseMirror .fabric-editor-breakout-mark {
		.layoutSectionView-content-wrap {
			${layoutWithSeparatorBorderResponsiveViewStyles(820)}
		}
	}
`;

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Needs manual remediation
const layoutBaseStyles = () => css`
	.ProseMirror {
		${layoutSectionStyles()}
		[data-layout-section] {
			/* Ignored via go/ees007
			TODO: Migrate away from gridSize
			Recommendation: Replace directly with 7px */
			margin: ${token('space.100', '8px')} -${akLayoutGutterOffset +
				(fg('platform_editor_nested_dnd_styles_changes') ? 8 : 0)}px 0;
			transition: border-color 0.3s ${akEditorSwoopCubicBezier};
			cursor: pointer;

			/* Inner cursor located 26px from left */
			[data-layout-column] {
				flex: 1;
				position: relative;

				min-width: 0;
				/* disable 4 borders when in view mode and advanced layouts is on */
				border: ${editorExperiment('advanced_layouts', true) ? 0 : akEditorSelectedBorderSize}px
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
				? layoutWithSeparatorBorderBaseStyles
				: layoutBorderBaseStyles}
		}
	}

	${editorExperiment('advanced_layouts', true) && layoutResponsiveBaseStyles}

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

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Needs manual remediation
const layoutViewStyles = css`
	.ProseMirror {
		[data-layout-section] {
			cursor: default;
			[data-layout-column] {
				border: 0;
			}
		}
		[data-layout-section],
		.layoutSectionView-content-wrap {
			${editorExperiment('advanced_layouts', true)
				? layoutWithSeparatorBorderViewStyles
				: layoutBorderViewStyles}
		}
	}

	${editorExperiment('advanced_layouts', true) && layoutResponsiveViewStyles}
`;

/**
 * aiPanelStyles
 * was imported from packages/editor/editor-core/src/ui/ContentStyles/ai-panels.ts
 */
const isFirefox: boolean =
	typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

const rotationAnimation = keyframes({
	'0%': {
		'--panel-gradient-angle': '0deg',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		...(isFirefox ? { backgroundPosition: '100%' } : {}),
	},
	'100%': {
		'--panel-gradient-angle': '360deg',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		...(isFirefox ? { backgroundPosition: '-100%' } : {}),
	},
});

const aiPrismColor = {
	['prism.border.step.1']: {
		light: '#0065FF',
		dark: '#0065FF80',
	},
	['prism.border.step.2']: {
		light: '#0469FF',
		dark: '#0469FF80',
	},
	['prism.border.step.3']: {
		light: '#BF63F3',
		dark: '#BF63F380',
	},
	['prism.border.step.4']: {
		light: '#FFA900',
		dark: '#FFA90080',
	},
};

const prismBorderAnimationStyles = css({
	'&::before, &::after': {
		animationName: rotationAnimation,
		animationDuration: '2s',
		animationTimingFunction: 'linear',
		animationIterationCount: 'infinite',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		...(isFirefox ? { animationDirection: 'normal', animationDuration: '1s' } : {}),
		'@media (prefers-reduced-motion)': {
			animation: 'none',
		},
	},
});

const prismBorderBaseStyles = css({
	content: "''",
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	position: 'absolute',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	zIndex: -1,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: `calc(100% + 2px)`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	height: `calc(100% + 2px)`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	top: `-1px`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	left: `-1px`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderRadius: `calc(${token('border.radius.100', '3px')} + 1px)`,
	transform: 'translate3d(0, 0, 0)',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	...(isFirefox
		? {
				background: `linear-gradient(90deg,
								${aiPrismColor['prism.border.step.1']['light']} 0%,
								${aiPrismColor['prism.border.step.2']['light']} 12%,
								${aiPrismColor['prism.border.step.3']['light']} 24%,
								${aiPrismColor['prism.border.step.4']['light']} 48%,
								${aiPrismColor['prism.border.step.3']['light']} 64%,
								${aiPrismColor['prism.border.step.2']['light']} 80%,
								${aiPrismColor['prism.border.step.1']['light']} 100%
							)`,
				backgroundSize: '200%',
			}
		: {
				background: `conic-gradient(
								from var(--panel-gradient-angle, 270deg),
								${aiPrismColor['prism.border.step.1']['light']} 0%,
								${aiPrismColor['prism.border.step.2']['light']} 20%,
								${aiPrismColor['prism.border.step.3']['light']} 50%,
								${aiPrismColor['prism.border.step.4']['light']} 56%,
								${aiPrismColor['prism.border.step.1']['light']} 100%
							)`,
			}),
});

const prismBorderDarkStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	...(isFirefox
		? {
				background: `linear-gradient(90deg,
								${aiPrismColor['prism.border.step.1']['dark']} 0%,
								${aiPrismColor['prism.border.step.2']['dark']} 12%,
								${aiPrismColor['prism.border.step.3']['dark']} 24%,
								${aiPrismColor['prism.border.step.4']['dark']} 48%,
								${aiPrismColor['prism.border.step.3']['dark']} 64%,
								${aiPrismColor['prism.border.step.2']['dark']} 80%,
								${aiPrismColor['prism.border.step.1']['dark']} 100%
							)`,
				backgroundSize: '200%',
			}
		: {
				background: `conic-gradient(
								from var(--panel-gradient-angle, 270deg),
								${aiPrismColor['prism.border.step.1']['dark']} 0%,
								${aiPrismColor['prism.border.step.2']['dark']} 20%,
								${aiPrismColor['prism.border.step.3']['dark']} 50%,
								${aiPrismColor['prism.border.step.4']['dark']} 56%,
								${aiPrismColor['prism.border.step.1']['dark']} 100%
							)`,
			}),
});

const prismBorderHoverStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	background: token('color.border.input'),
});

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Ignored via go/DSP-18766
const aiPanelBaseStyles = css`
	@property --panel-gradient-angle {
		syntax: '<angle>';
		initial-value: 270deg;
		inherits: false;
	}

	div[extensionType='com.atlassian.ai-blocks'] {
		/* This hides the label for the extension */
		.extension-label {
			display: none;
		}

		/* This styles the ai panel correctly when its just sitting on the page and there
		is no user interaction */
		.extension-container {
			position: relative;
			box-shadow: none;
			overflow: unset;
			background-color: ${token('elevation.surface')} !important;
			&::before,
			&::after {
				${prismBorderBaseStyles}
			}
			&.with-hover-border {
				&::before,
				&::after {
					${prismBorderHoverStyles}
				}
			}
			& .with-margin-styles {
				background-color: ${token('elevation.surface')} !important;
				border-radius: ${token('border.radius.100', '3px')};
			}
		}
	}

	/* This styles the ai panel correctly when its streaming */
	div[extensionType='com.atlassian.ai-blocks']:has(.streaming) {
		.extension-container {
			box-shadow: none;
			overflow: unset;
			${prismBorderAnimationStyles}
			&::before,
			&::after {
				${prismBorderBaseStyles}
			}
		}
	}

	/* This styles the ai panel correctly when a user is hovering over the delete button in the floating panel */
	div[extensionType='com.atlassian.ai-blocks'].danger {
		.extension-container {
			box-shadow: 0 0 0 1px ${token('color.border.danger')};
		}
	}

	/* This removes the margin from the action list when inside an ai panel */
	div[extensiontype='com.atlassian.ai-blocks'][extensionkey='ai-action-items-block:aiActionItemsBodiedExtension'] {
		div[data-node-type='actionList'] {
			margin: 0 !important;
		}
	}
`;

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Ignored via go/DSP-18766
const aiPanelDarkStyles = css`
	div[extensionType='com.atlassian.ai-blocks'] {
		.extension-container {
			&::before,
			&::after {
				${prismBorderDarkStyles}
			}
		}
	}

	/* This styles the ai panel correctly when its streaming */
	div[extensionType='com.atlassian.ai-blocks']:has(.streaming) {
		.extension-container {
			&::before,
			&::after {
				${prismBorderDarkStyles}
			}
		}
	}
`;

// The breakpoint for small devices is 1266px, copied from getBreakpoint in platform/packages/editor/editor-common/src/ui/WidthProvider/index.tsx
const akEditorBreakpointForSmallDevice = `1266px`;

// jest warning: JSDOM version (22) doesn't support the new @container CSS rule
const contentStyles = () => css`
	--ak-editor--default-gutter-padding: ${akEditorGutterPadding}px;
	/* 52 is from akEditorGutterPaddingDynamic via editor-shared-styles */
	--ak-editor--large-gutter-padding: ${akEditorGutterPaddingDynamic()}px;
	--ak-editor--default-layout-width: ${akEditorDefaultLayoutWidth}px;
	--ak-editor--full-width-layout-width: ${akEditorFullWidthLayoutWidth}px;
	/* calculate editor line length, 100cqw is the editor container width */
	--ak-editor--line-length: min(
		calc(100cqw - var(--ak-editor--large-gutter-padding) * 2),
		var(--ak-editor--default-layout-width)
	);
	--ak-editor--breakout-wide-layout-width: ${akEditorCalculatedWideLayoutWidthSmallViewport}px;
	--ak-editor--breakout-full-page-guttering-padding: calc(
		var(--ak-editor--large-gutter-padding) * 2 + var(--ak-editor--default-gutter-padding)
	);

	.fabric-editor--full-width-mode {
		--ak-editor--line-length: min(
			calc(100cqw - var(--ak-editor--large-gutter-padding) * 2),
			var(--ak-editor--full-width-layout-width)
		);
	}

	.ProseMirror {
		--ak-editor-max-container-width: calc(100cqw - var(--ak-editor--large-gutter-padding));
	}

	/* We can't allow nodes that are inside other nodes to bleed from the parent container */
	.ProseMirror > div[data-prosemirror-node-block] [data-prosemirror-node-block] {
		--ak-editor-max-container-width: 100%;
	}

	/* container editor-area is defined in platform/packages/editor/editor-core/src/ui/Appearance/FullPage/StyledComponents.ts */
	@container editor-area (width >= ${akEditorBreakpointForSmallDevice}) {
		.ProseMirror {
			--ak-editor--breakout-wide-layout-width: ${akEditorCalculatedWideLayoutWidth}px;
		}
	}

	.ProseMirror {
		outline: none;
		font-size: var(--ak-editor-base-font-size);

		${whitespaceSharedStyles};

		${paragraphSharedStyles()};

		${listsSharedStyles};

		${indentationSharedStyles};

		${shadowSharedStyle};

		${InlineNodeViewSharedStyles};
	}

	${fg('editor_request_to_edit_task')
		? null
		: css`
				.ProseMirror[contenteditable='false'] .taskItemView-content-wrap {
					pointer-events: none;
					opacity: 0.7;
				}
			`}

	.ProseMirror-hideselection *::selection {
		background: transparent;
	}

	.ProseMirror-hideselection *::-moz-selection {
		background: transparent;
	}

	/**
	 * This prosemirror css style: https://github.com/ProseMirror/prosemirror-view/blob/f37ebb29befdbde3cd194fe13fe17b78e743d2f2/style/prosemirror.css#L24
	 *
	 * 1. Merge and Release platform_editor_hide_cursor_when_pm_hideselection
	 * 2. Cleanup duplicated style from platform_editor_advanced_code_blocks
	 *    https://product-fabric.atlassian.net/browse/ED-26331
	 */
	${fg('platform_editor_hide_cursor_when_pm_hideselection')
		? css`
				.ProseMirror-hideselection {
					caret-color: transparent;
				}
			`
		: null}

	/* This prosemirror css style: https://github.com/ProseMirror/prosemirror-view/blob/f37ebb29befdbde3cd194fe13fe17b78e743d2f2/style/prosemirror.css#L24 */
	${editorExperiment('platform_editor_advanced_code_blocks', true)
		? css`
				.ProseMirror-hideselection {
					caret-color: transparent;
				}
			`
		: null}

	.ProseMirror-selectednode {
		outline: none;
	}

	.ProseMirror-selectednode:empty {
		outline: 2px solid ${token('color.border.focused', '#8cf')};
	}

	.ProseMirror.ProseMirror-focused:has(.ProseMirror-mark-boundary-cursor) {
		caret-color: transparent;
	}
	.ProseMirror:not(.ProseMirror-focused) .ProseMirror-mark-boundary-cursor {
		display: none;
	}

	${placeholderTextStyles}

	${placeholderStyles}

	${editorExperiment('platform_editor_controls', 'variant1') ? placeholderOverflowStyles : null}

	${editorExperiment('platform_editor_controls', 'variant1') &&
	fg('platform_editor_quick_insert_placeholder')
		? placeholderWrapStyles
		: null}

  ${codeBlockStyles()}

  ${blocktypeStyles()}

  ${codeMarkSharedStyles()}

  ${textColorStyles}

  ${backgroundColorStyles}

  ${listsStyles}

  ${ruleStyles()}

  ${mediaStyles()}

  ${fg('confluence_team_presence_scroll_to_pointer')
		? telepointerStyle
		: telepointerStyleWithInitialOnly}
  ${gapCursorStyles};

	${panelStyles()}

	${mentionsStyles}

  ${editorExperiment('platform_editor_vanilla_dom', true, { exposure: false }) &&
	vanillaMentionsStyles}

  ${editorExperiment('platform_editor_vanilla_dom', true, { exposure: false }) &&
	vanillaSelectionStyles}

  ${editorExperiment('platform_editor_vanilla_dom', true, { exposure: false })
		? emojiStyles
		: reactEmojiStyles}

  ${emojiStyles}

  ${tasksAndDecisionsStyles}

  ${gridStyles}

  ${linkStyles}

  ${blockMarksSharedStyles}

  ${dateSharedStyle}

  ${extensionStyles}

  ${expandStyles()}

  ${findReplaceStyles}

  ${textHighlightStyle}

  ${taskDecisionStyles}

  ${editorExperiment('platform_editor_vanilla_dom', true, { exposure: false }) &&
	vanillaTaskItemStyles}

  ${editorExperiment('platform_editor_vanilla_dom', true, { exposure: false }) &&
	vanillaDecisionStyles}

  // Switch between the two icons based on the visual refresh feature gate
  ${editorExperiment('platform_editor_vanilla_dom', true, { exposure: false }) &&
	fg('platform-visual-refresh-icons') &&
	vanillaDecisionIconWithVisualRefresh}

  ${editorExperiment('platform_editor_vanilla_dom', true, { exposure: false }) &&
	!fg('platform-visual-refresh-icons') &&
	vanillaDecisionIconWithoutVisualRefresh}

  ${statusStyles}

  ${editorExperiment('platform_editor_vanilla_dom', true) ? vanillaStatusStyles() : null}

  ${annotationSharedStyles()}

  ${smartCardStyles()}

  ${fg('platform-linking-visual-refresh-v1') ? getSmartCardSharedStyles() : smartCardSharedStyles}

  ${editorExperiment('platform_editor_vanilla_dom', true) ? dateVanillaStyles : null}

	${dateStyles}

  ${embedCardStyles()}

  ${unsupportedStyles}

  ${resizerStyles}

  ${pragmaticResizerStyles()}

  ${fixBlockControlStylesSSR()}

  .panelView-content-wrap {
		box-sizing: border-box;
	}

	.mediaGroupView-content-wrap ul {
		padding: 0;
	}

	/** Needed to override any cleared floats, e.g. image wrapping */

	div.fabric-editor-block-mark[class^='fabric-editor-align'] {
		clear: none !important;
	}

	.fabric-editor-align-end {
		text-align: right;
	}

	.fabric-editor-align-start {
		text-align: left;
	}

	.fabric-editor-align-center {
		text-align: center;
	}

	// For FullPage only when inside a table
	// Related code all lives inside: packages/editor/editor-core/src/ui/Appearance/FullPage/StyledComponents.ts
	// In the "editorContentAreaContainerStyle" function
	.fabric-editor--full-width-mode {
		.pm-table-container {
			.code-block,
			.extension-container,
			.multiBodiedExtension--container {
				max-width: 100%;
			}
		}
	}

	.pm-table-header-content-wrap :not(.fabric-editor-alignment),
	.pm-table-header-content-wrap :not(p, .fabric-editor-block-mark) + div.fabric-editor-block-mark,
	.pm-table-cell-content-wrap :not(p, .fabric-editor-block-mark) + div.fabric-editor-block-mark {
		p:first-of-type {
			margin-top: 0;
		}
	}
	.pm-table-cell-content-wrap .mediaGroupView-content-wrap {
		clear: both;
	}

	.hyperlink-floating-toolbar,
	.${MediaSharedClassNames.FLOATING_TOOLBAR_COMPONENT} {
		padding: 0;
	}

	/* Legacy Link icon in the Atlaskit package
	 is bigger than the others, new ADS icon does not have this issue
  */
	${!fg('platform-visual-refresh-icons')
		? css`
				.hyperlink-open-link {
					min-width: 24px;
					svg {
						max-width: 18px;
					}
				}
			`
		: null}
`;

export type EditorContentContainerProps = {
	className?: string;
	children?: React.ReactNode;
	featureFlags?: FeatureFlags;
	viewMode?: 'view' | 'edit';
	isScrollable?: boolean;
	appearance?: EditorAppearance;
};

const CommentEditorMargin = 14;

// Originally copied from packages/editor/editor-core/src/ui/Appearance/Comment/Comment.tsx
const commentEditorStyles = css(
	{
		flexGrow: 1,
		overflowX: 'clip',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: '24px',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.ProseMirror': {
			margin: token('space.150', '12px'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.gridParent': {
			marginLeft: token('space.025', '2px'),
			marginRight: token('space.025', '2px'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			width: `calc(100% + ${CommentEditorMargin - GRID_GUTTER}px)`,
		},
		padding: token('space.250', '20px'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	tableCommentEditorStyles,
);

// Originally copied from scrollStyles in packages/editor/editor-core/src/ui/Appearance/FullPage/StyledComponents.ts
const fullPageEditorStyles = css(
	{
		flexGrow: 1,
		height: '100%',
		overflowY: 'scroll',
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		scrollBehavior: 'smooth',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	scrollbarStyles,
);

const listLayoutShiftFix = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror ul, .ProseMirror ol': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		marginTop: '10px',
	},
});

/**
 * EditorContentStyles is a wrapper component that applies styles to its children
 * based on the provided feature flags, view mode, and other props.
 * It uses Emotion for styling and supports scrollable content.
 * The component is memoized to optimize performance.
 *
 * This will be used in near future to replace the current editor content styles from index.tsx
 *
 * @param {EditorContentContainerProps} props - The props for the component.
 * @param {string} props.className - Additional class name for the component.
 * @param {React.ReactNode} props.children - The content to be rendered inside the component.
 * @param {FeatureFlags} props.featureFlags - Feature flags to control the styles.
 * @param {'view' | 'edit'} props.viewMode - The view mode of the editor.
 * @param {boolean} props.isScrollable - Whether the content is scrollable.
 * @param {'full-page' | 'full-width' | 'comment' | 'chromeless'} props.appearance - The appearance of the editor.
 * @returns {JSX.Element} The styled content component.
 */
const EditorContentContainer = React.forwardRef<HTMLDivElement, EditorContentContainerProps>(
	(props, ref) => {
		const { className, children, viewMode, isScrollable, appearance } = props;
		const theme = useTheme();
		const { colorMode } = useThemeObserver();

		const isFullPage = appearance === 'full-page' || appearance === 'full-width';
		const isComment = appearance === 'comment';

		return (
			<div
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={className}
				ref={ref}
				css={[
					contentStyles(),
					layoutBaseStyles(),
					aiPanelBaseStyles,
					colorMode === 'dark' && aiPanelDarkStyles,
					viewMode === 'view' && layoutViewStyles,
					isComment && commentEditorStyles,
					isFullPage && fullPageEditorStyles,
					fg('platform_editor_ssr_fix_lists') && listLayoutShiftFix,
				]}
				data-editor-scroll-container={isScrollable ? 'true' : undefined}
				data-testid="editor-content-container"
				style={
					{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						'--ak-editor-base-font-size': `${editorFontSize({ theme })}px`,
					} as React.CSSProperties
				}
			>
				{children}
			</div>
		);
	},
);

export default EditorContentContainer;
