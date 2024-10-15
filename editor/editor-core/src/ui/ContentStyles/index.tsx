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
import { css, jsx, type Theme, useTheme } from '@emotion/react';

import { browser } from '@atlaskit/editor-common/browser';
import { telepointerStyle } from '@atlaskit/editor-common/collab';
import { EmojiSharedCssClassName } from '@atlaskit/editor-common/emoji';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { MentionSharedCssClassName } from '@atlaskit/editor-common/mention';
import { PanelSharedCssClassName } from '@atlaskit/editor-common/panel';
import { gapCursorStyles } from '@atlaskit/editor-common/selection';
import {
	annotationSharedStyles,
	backgroundColorStyles,
	blockMarksSharedStyles,
	codeBlockInListSafariFix,
	CodeBlockSharedCssClassName,
	codeMarkSharedStyles,
	dateSharedStyle,
	embedCardStyles,
	expandClassNames,
	gridStyles,
	indentationSharedStyles,
	linkSharedStyle,
	listsSharedStyles,
	MediaSharedClassNames,
	paragraphSharedStyles,
	resizerStyles,
	ruleSharedStyles,
	shadowSharedStyle,
	SmartCardSharedCssClassName,
	smartCardSharedStyles,
	smartCardStyles,
	tasksAndDecisionsStyles,
	textColorStyles,
	unsupportedStyles,
	whitespaceSharedStyles,
} from '@atlaskit/editor-common/styles';
import { type OptionalPlugin } from '@atlaskit/editor-common/types';
import { blocktypeStyles } from '@atlaskit/editor-plugins/block-type/styles';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugins/editor-viewmode';
import { findReplaceStyles } from '@atlaskit/editor-plugins/find-replace/styles';
import { textHighlightStyle } from '@atlaskit/editor-plugins/paste-options-toolbar/styles';
import { placeholderTextStyles } from '@atlaskit/editor-plugins/placeholder-text/styles';
import {
	akEditorCalculatedWideLayoutWidth,
	akEditorCalculatedWideLayoutWidthSmallViewport,
	akEditorDefaultLayoutWidth,
	akEditorDeleteBackgroundWithOpacity,
	akEditorDeleteBorder,
	akEditorFullWidthLayoutWidth,
	akEditorGutterPadding,
	akEditorSelectedBorderColor,
	akEditorSelectedBorderSize,
	akEditorSelectedNodeClassName,
	blockNodesVerticalMargin,
	editorFontSize,
	getSelectionStyles,
	SelectionStyle,
} from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { token, useThemeObserver } from '@atlaskit/tokens';

import { InlineNodeViewSharedStyles } from '../../nodeviews/getInlineNodeViewProducer.styles';
import { usePresetContext } from '../../presets/context';
import type { FeatureFlags } from '../../types/feature-flags';

import { aiPanelStyles } from './ai-panels';
import { codeBlockStyles } from './code-block';
import { dateStyles } from './date';
import { expandStyles } from './expand';
import { extensionStyles } from './extension';
import { layoutStyles } from './layout';
import { mediaStyles } from './media';
import { panelStyles } from './panel';
import { statusStyles } from './status';
import { taskDecisionStyles } from './tasks-and-decisions';
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const linkStyles = css`
	.ProseMirror {
		${linkSharedStyle}
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

const emojiStyles = css`
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

/**
 * fix layout issue of first block node
 */
export const fixBlockControlStylesSSR = () => {
	return fg('platform_editor_ssr_fix_block_controls') ? firstBlockNodeStyles : null;
};

// The breakpoint for small devices is 1266px, copied from getBreakpoint in platform/packages/editor/editor-common/src/ui/WidthProvider/index.tsx
const akEditorBreakpointForSmallDevice = `1266px`;
const contentStyles = (props: ContentStylesProps) => css`
	--ak-editor--default-gutter-padding: ${akEditorGutterPadding}px;
	/* 52 is from akEditorGutterPaddingDynamic via editor-shared-styles */
	--ak-editor--large-gutter-padding: 52px;
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
		font-size: ${editorFontSize({ theme: props.theme })}px;
		${whitespaceSharedStyles};
		${paragraphSharedStyles(props.typographyTheme)};
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

	.ProseMirror-selectednode {
		outline: none;
	}

	.ProseMirror-selectednode:empty {
		outline: 2px solid ${token('color.border.focused', '#8cf')};
	}

	${fg('platform_editor_mark_boundary_cursor')
		? css`
				.ProseMirror.ProseMirror-focused:has(.ProseMirror-mark-boundary-cursor) {
					caret-color: transparent;
				}
				.ProseMirror:not(.ProseMirror-focused) .ProseMirror-mark-boundary-cursor {
					display: none;
				}
			`
		: null}

	${placeholderTextStyles}
	${placeholderStyles}
  ${codeBlockStyles()}

  ${blocktypeStyles(props.typographyTheme)}
  ${codeMarkSharedStyles()}
  ${textColorStyles}
  ${backgroundColorStyles()}
  ${listsStyles}
  ${ruleStyles()}
  ${mediaStyles}
  ${layoutStyles(props.viewMode)}
  ${telepointerStyle}
  ${gapCursorStyles};
	${panelStyles()}
	${mentionsStyles}
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
  ${statusStyles}
  ${annotationSharedStyles()}
  ${smartCardStyles()}
  ${smartCardSharedStyles}
  ${dateStyles}
  ${embedCardStyles}
  ${unsupportedStyles}
  ${resizerStyles}
  ${aiPanelStyles(props.colorMode)}
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

	/* Link icon in the Atlaskit package
     is bigger than the others
  */
	.hyperlink-open-link {
		min-width: 24px;
		svg {
			max-width: 18px;
		}
	}
`;

type Props = ContentStylesProps & React.HTMLProps<HTMLDivElement>;

export const createEditorContentStyle = (styles?: SerializedStyles) => {
	return React.forwardRef<HTMLDivElement, Props>((props, ref) => {
		const { className, children, featureFlags } = props;
		const theme = useTheme();
		const { colorMode, typography } = useThemeObserver();
		const editorAPI = usePresetContext<[OptionalPlugin<EditorViewModePlugin>]>();
		const { editorViewModeState } = useSharedPluginState(editorAPI, ['editorViewMode']);
		const memoizedStyle = useMemo(
			() =>
				contentStyles({
					theme,
					colorMode,
					featureFlags,
					viewMode: fg('platform_editor_remove_use_preset_context')
						? props.viewMode
						: editorViewModeState?.mode,
					typographyTheme: typography,
				}),
			[theme, colorMode, featureFlags, editorViewModeState?.mode, props.viewMode, typography],
		);

		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			<div className={className} ref={ref} css={[memoizedStyle, styles]}>
				{children}
			</div>
		);
	});
};

export default createEditorContentStyle();
