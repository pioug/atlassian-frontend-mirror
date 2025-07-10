/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @atlaskit/design-system/no-css-tagged-template-expression -- Requires manual remediation over time due to use of unsafe nested mixins */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useMemo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import type { SerializedStyles } from '@emotion/react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, useTheme, type Theme } from '@emotion/react';

import { browser } from '@atlaskit/editor-common/browser';
import { telepointerStyle, telepointerStyleWithInitialOnly } from '@atlaskit/editor-common/collab';
import { EmojiSharedCssClassName, defaultEmojiHeight } from '@atlaskit/editor-common/emoji';
import { MentionSharedCssClassName } from '@atlaskit/editor-common/mention';
import { PanelSharedCssClassName } from '@atlaskit/editor-common/panel';
import { gapCursorStyles } from '@atlaskit/editor-common/selection';
import {
	CodeBlockSharedCssClassName,
	MediaSharedClassNames,
	SmartCardSharedCssClassName,
	annotationSharedStyles,
	backgroundColorStyles,
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
	pragmaticStylesLayoutFirstNodeResizeHandleFix,
	pragmaticResizerStylesForTooltip,
	ruleSharedStyles,
	shadowSharedStyle,
	smartCardStyles,
	tasksAndDecisionsStyles,
	textColorStyles,
	unsupportedStyles,
	whitespaceSharedStyles,
} from '@atlaskit/editor-common/styles';
import type { EditorAppearance, FeatureFlags } from '@atlaskit/editor-common/types';
import { blocktypeStyles } from '@atlaskit/editor-plugins/block-type/styles';
import {
	findReplaceStyles,
	findReplaceStylesNewYellow,
	findReplaceStylesNewMagenta,
} from '@atlaskit/editor-plugins/find-replace/styles';
import { textHighlightStyle } from '@atlaskit/editor-plugins/paste-options-toolbar/styles';
import {
	placeholderTextStyles,
	placeholderTextStyles_fg_platform_editor_system_fake_text_highlight_colour,
} from '@atlaskit/editor-plugins/placeholder-text/styles';
import {
	SelectionStyle,
	akEditorCalculatedWideLayoutWidth,
	akEditorCalculatedWideLayoutWidthSmallViewport,
	akEditorDefaultLayoutWidth,
	akEditorDeleteBackgroundWithOpacity,
	akEditorDeleteBorder,
	akEditorFullWidthLayoutWidth,
	akEditorGutterPadding,
	akEditorGutterPaddingDynamic,
	akEditorSelectedBorderColor,
	akEditorSelectedBorderSize,
	akEditorSelectedNodeClassName,
	blockNodesVerticalMargin,
	editorFontSize,
	getSelectionStyles,
} from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token, useThemeObserver } from '@atlaskit/tokens';

import { InlineNodeViewSharedStyles } from '../../nodeviews/getInlineNodeViewProducer.styles';

import { aiPanelStyles } from './ai-panels';
import { codeBidiWarningStyles } from './code-bidi-warning';
import { codeBlockStyles } from './code-block';
import { dateStyles, dateNodeStyles } from './date';
import { expandStyles } from './expand';
import { extensionStyles } from './extension';
import { layoutStyles } from './layout';
import { mediaStyles } from './media';
import { panelStyles } from './panel';
import { statusStyles, statusNodeStyles } from './status';
import {
	taskDecisionStyles,
	taskDecisionIconWithoutVisualRefresh as decisionIconWithoutVisualRefresh,
	taskDecisionIconWithVisualRefresh as decisionIconWithVisualRefresh,
	taskItemStyles,
} from './tasks-and-decisions';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const linkStyles = css`
	.ProseMirror {
		${linkSharedStyle()}
	}
`;

type ContentStylesProps = {
	theme?: Theme;
	colorMode?: 'light' | 'dark';
	featureFlags?: FeatureFlags;
	viewMode?: 'view' | 'edit';
	typographyTheme?:
		| 'typography'
		| 'typography-adg3'
		| 'typography-modernized'
		| 'typography-refreshed';
	isScrollable?: boolean;
	appearance?: EditorAppearance;
};

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

const mentionNodeStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.editor-mention-primitive': {
		display: 'inline',
		borderRadius: '20px',
		cursor: 'pointer',
		padding: '0 0.3em 2px 0.23em',
		// To match `packages/elements/mention/src/components/Mention/PrimitiveMention.tsx` implementation
		// we match the line height exactly
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: '1.714',
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

// The feature-gate for this is dependent on the use of refreshed typography - bear this in mind when cleaning up
// This is currently enforced through statsig prerequisite gates, as per #help-afm recommendation.
// So it will need to be considered if the typography gates are still in use when this is cleaned up.
const mentionNodeStylesMixin_fg_platform_editor_centre_mention_padding = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.editor-mention-primitive': {
		padding: '1px 0.3em 1px 0.23em',
	},
});

const mentionSelectionStyles = css`
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

			/* In SSR the above rule will apply to all p tags because first-child would be a style tag.
			The following rule resets the first p tag back to its original margin
			defined in packages/editor/editor-common/src/styles/shared/paragraph.ts */
			> style:first-child + p {
				margin-top: ${blockNodesVerticalMargin};
			}
		}

		&:not([data-node-type='decisionList']) > li,
    /* This prevents https://product-fabric.atlassian.net/browse/ED-20924 */
    &:not(.${SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER}) > li {
			${browser.safari ? codeBlockInListSafariFix : ''}
		}
	}
`;

const emojiStyles = css`
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

	.${akEditorSelectedNodeClassName} {
		.${EmojiSharedCssClassName.EMOJI_SPRITE}, .${EmojiSharedCssClassName.EMOJI_IMAGE} {
			border-radius: 2px;
			${getSelectionStyles([SelectionStyle.Blanket, SelectionStyle.BoxShadow])}
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

// Make sure the first floating toolbar button has focus ring when focused via .focus()
const firstFloatingToolbarButtonStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'button.first-floating-toolbar-button:focus': {
		outline: `2px solid ${token('color.border.focused', '#2684FF')}`,
	},
});

// The breakpoint for small devices is 1266px, copied from getBreakpoint in platform/packages/editor/editor-common/src/ui/WidthProvider/index.tsx
const akEditorBreakpointForSmallDevice = `1266px`;

// We are going to deprecate this in near future
// Currently, we are migrating content styles in packages/editor/editor-core/src/ui/EditorContentContainer.tsx
// Under editor experiment platform_editor_core_static_emotion
// If you are making changes to this file, please make sure to update in EditorContentContainer.tsx as well
const legacyContentStyles = (props: ContentStylesProps) => css`
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

	--ak-editor--breakout-fallback-width: calc(
		100cqw - var(--ak-editor--breakout-full-page-guttering-padding)
	);

	.fabric-editor--full-width-mode {
		--ak-editor--line-length: min(
			calc(100cqw - var(--ak-editor--large-gutter-padding) * 2),
			var(--ak-editor--full-width-layout-width)
		);

		/* in full width appearances it's not possible to rely on cqw because it doesn't account for the page scrollbar, which depends on users system settings */
		--ak-editor--breakout-fallback-width: 100%;
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
		font-size: ${editorFontSize({ theme: props.theme })}px;
		${whitespaceSharedStyles};
		${paragraphSharedStyles(props.typographyTheme)};
		${listsSharedStyles};
		${indentationSharedStyles};
		${shadowSharedStyle};
		${InlineNodeViewSharedStyles};
	}

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

	${firstFloatingToolbarButtonStyles}
	${placeholderTextStyles}
	${fg('platform_editor_system_fake_text_highlight_colour') &&
	placeholderTextStyles_fg_platform_editor_system_fake_text_highlight_colour}
	${placeholderStyles}
	${editorExperiment('platform_editor_controls', 'variant1') ? placeholderOverflowStyles : null}
	${editorExperiment('platform_editor_controls', 'variant1') &&
	fg('platform_editor_quick_insert_placeholder')
		? placeholderWrapStyles
		: null}

  ${codeBlockStyles()}

  ${blocktypeStyles(props.typographyTheme)}
  ${codeMarkSharedStyles()}
  ${textColorStyles}
  ${backgroundColorStyles()}
  ${listsStyles}
  ${ruleStyles()}
  ${mediaStyles()}
  ${layoutStyles(props.viewMode)}
  ${fg('confluence_team_presence_scroll_to_pointer')
		? telepointerStyle
		: telepointerStyleWithInitialOnly}
  ${gapCursorStyles};
	${panelStyles()}
	${mentionsStyles}
	${mentionNodeStyles}
	${fg('platform_editor_centre_mention_padding') &&
	mentionNodeStylesMixin_fg_platform_editor_centre_mention_padding}
	${mentionSelectionStyles}
  ${emojiStyles}
  ${tasksAndDecisionsStyles}
  ${gridStyles}
  ${linkStyles}
  ${blockMarksSharedStyles}
  ${dateSharedStyle}
  ${extensionStyles}
  ${expandStyles()}
  ${expValEqualsNoExposure('platform_editor_find_and_replace_improvements', 'isEnabled', true)
		? fg('platform_editor_find_and_replace_magenta_match')
			? findReplaceStylesNewMagenta
			: findReplaceStylesNewYellow
		: findReplaceStyles}
  ${textHighlightStyle}
  ${taskDecisionStyles}
	${taskItemStyles}
  /* Switch between the two icons based on the visual refresh feature gate */
	${fg('platform-visual-refresh-icons') && decisionIconWithVisualRefresh}
	${!fg('platform-visual-refresh-icons') && decisionIconWithoutVisualRefresh}
  ${statusStyles}
  ${statusNodeStyles()}
  ${annotationSharedStyles()}
  ${smartCardStyles()}
  ${getSmartCardSharedStyles()}
	${dateStyles}
  ${dateNodeStyles}
  ${embedCardStyles()}
  ${unsupportedStyles}
  ${resizerStyles}
  ${pragmaticResizerStyles()}
  ${pragmaticStylesLayoutFirstNodeResizeHandleFix()}
  ${pragmaticResizerStylesForTooltip()}
  ${aiPanelStyles(props.colorMode)}
  ${firstBlockNodeStylesNew}
	${fg('platform_editor_vanilla_codebidi_warning') && codeBidiWarningStyles}

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

	/* For FullPage only when inside a table
	Related code all lives inside: packages/editor/editor-core/src/ui/Appearance/FullPage/StyledComponents.ts
	In the "editorContentAreaContainerStyle" function */
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

type Props = ContentStylesProps & React.HTMLProps<HTMLDivElement>;

export const createEditorContentStyle = (styles?: SerializedStyles) => {
	return React.forwardRef<HTMLDivElement, Props>((props, ref) => {
		const { className, children, featureFlags } = props;
		const theme = useTheme();
		const { colorMode, typography } = useThemeObserver();
		const memoizedStyle = useMemo(
			() =>
				legacyContentStyles({
					theme,
					colorMode,
					featureFlags,
					viewMode: props.viewMode,
					typographyTheme: typography,
				}),
			[theme, colorMode, featureFlags, props.viewMode, typography],
		);

		if (props.isScrollable) {
			return (
				<div
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={className}
					ref={ref}
					css={[memoizedStyle, styles]}
					data-editor-scroll-container="true"
					data-testid="editor-content-container"
				>
					{children}
				</div>
			);
		}

		return (
			<div
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={className}
				ref={ref}
				css={[memoizedStyle, styles]}
				data-testid="editor-content-container"
			>
				{children}
			</div>
		);
	});
};

export default createEditorContentStyle();
