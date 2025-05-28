/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @atlaskit/design-system/no-css-tagged-template-expression -- Requires manual remediation over time due to use of unsafe nested mixins */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, useTheme } from '@emotion/react';

import { browser } from '@atlaskit/editor-common/browser';
import { gapCursorStyles } from '@atlaskit/editor-common/selection';
import { GRID_GUTTER } from '@atlaskit/editor-common/styles';
import type { EditorAppearance, FeatureFlags } from '@atlaskit/editor-common/types';
import { blocktypeStyles } from '@atlaskit/editor-plugins/block-type/styles';
import { findReplaceStyles } from '@atlaskit/editor-plugins/find-replace/styles';
import { textHighlightStyle } from '@atlaskit/editor-plugins/paste-options-toolbar/styles';
import { placeholderTextStyles } from '@atlaskit/editor-plugins/placeholder-text/styles';
import { tableCommentEditorStyles } from '@atlaskit/editor-plugins/table/ui/common-styles';
import {
	akEditorCalculatedWideLayoutWidth,
	akEditorCalculatedWideLayoutWidthSmallViewport,
	akEditorDefaultLayoutWidth,
	akEditorFullWidthLayoutWidth,
	akEditorGutterPadding,
	akEditorGutterPaddingDynamic,
	editorFontSize,
} from '@atlaskit/editor-shared-styles';
import { scrollbarStyles } from '@atlaskit/editor-shared-styles/scrollbar';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token, useThemeObserver } from '@atlaskit/tokens';

import { InlineNodeViewSharedStyles } from '../../nodeviews/getInlineNodeViewProducer.styles';
import { expandStyles } from '../ContentStyles/expand';
import { extensionStyles } from '../ContentStyles/extension';
import { panelStyles } from '../ContentStyles/panel';
import { statusStyles, vanillaStatusStyles } from '../ContentStyles/status';
import {
	taskDecisionStyles,
	vanillaTaskDecisionIconWithoutVisualRefresh as vanillaDecisionIconWithoutVisualRefresh,
	vanillaTaskDecisionIconWithVisualRefresh as vanillaDecisionIconWithVisualRefresh,
	vanillaTaskDecisionStyles as vanillaDecisionStyles,
	vanillaTaskItemStyles,
} from '../ContentStyles/tasks-and-decisions';

import {
	aiPanelBaseFirefoxStyles,
	aiPanelBaseStyles,
	aiPanelDarkFirefoxStyles,
	aiPanelDarkStyles,
} from './styles/aiPanel';
import { annotationStyles } from './styles/annotationStyles';
import { backgroundColorStyles } from './styles/backgroundColorStyles';
import { blockMarksStyles } from './styles/blockMarksStyles';
import {
	codeBlockStyles,
	firstCodeBlockWithNoMargin,
	firstCodeBlockWithNoMarginOld,
} from './styles/codeBlockStyles';
import { codeMarkStyles } from './styles/codeMarkStyles';
import { dateStyles, dateVanillaStyles } from './styles/dateStyles';
import { embedCardStyles } from './styles/embedCardStyles';
import { reactEmojiStyles, vanillaEmojiStyles } from './styles/emoji';
import { firstBlockNodeStyles, firstBlockNodeStylesOld } from './styles/firstBlockNodeStyles';
import { gridStyles } from './styles/gridStyles';
import { indentationStyles } from './styles/indentationStyles';
import { layoutBaseStyles, layoutViewStyles } from './styles/layout';
import { linkStyles, linkStylesOld } from './styles/link';
import { listsStyles, listsStylesSafariFix } from './styles/list';
import { mediaStyles } from './styles/mediaStyles';
import {
	mentionsStyles,
	vanillaMentionsStyles,
	vanillaMentionsSelectionStyles,
} from './styles/mentions';
import {
	paragraphStylesOld,
	paragraphStylesUGCModernized,
	paragraphStylesUGCRefreshed,
} from './styles/paragraphStyles';
import { resizerStyles, pragmaticResizerStyles } from './styles/resizerStyles';
import { ruleStyles } from './styles/rule';
import { shadowStyles } from './styles/shadowStyles';
import {
	linkingVisualRefreshV1Styles,
	smartCardStyles,
	smartLinksInLivePagesStyles,
	smartLinksInLivePagesStylesOld,
} from './styles/smartCardStyles';
import { tasksAndDecisionsStyles } from './styles/tasksAndDecisionsStyles';
import {
	telepointerColorAndCommonStyle,
	telepointerStyle,
	telepointerStyleWithInitialOnly,
} from './styles/telepointerStyles';
import { textColorStyles } from './styles/textColorStyles';
import { unsupportedStyles } from './styles/unsupportedStyles';
import { whitespaceStyles } from './styles/whitespaceStyles';

const isFirefox: boolean =
	typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

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

		${whitespaceStyles};

		${indentationStyles};

		${shadowStyles};

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

  ${codeBlockStyles}

  ${blocktypeStyles()}

  ${codeMarkStyles}

  ${textColorStyles}

  ${backgroundColorStyles}

  ${listsStyles}

  ${ruleStyles}

  ${mediaStyles}

  ${fg('confluence_team_presence_scroll_to_pointer')
		? telepointerStyle
		: telepointerStyleWithInitialOnly}

  /* This needs to be after telepointer styles as some overlapping rules have equal specificity, and so the order is significant */
  ${telepointerColorAndCommonStyle}

  ${gapCursorStyles};

	${panelStyles()}

	${mentionsStyles}

  ${tasksAndDecisionsStyles}

  ${gridStyles}

  ${blockMarksStyles}

  ${dateStyles}

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

  ${annotationStyles}

  ${smartCardStyles}

  ${embedCardStyles}

  ${unsupportedStyles}

  ${resizerStyles}

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

	.hyperlink-floating-toolbar {
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
 *
 * This will be used in near future to replace the current editor content styles from index.tsx
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
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					layoutBaseStyles(),
					fg('linking_platform_smart_links_in_live_pages')
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							smartLinksInLivePagesStyles
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							smartLinksInLivePagesStylesOld,
					fg('platform-linking-visual-refresh-v1') &&
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						linkingVisualRefreshV1Styles,
					editorExperiment('platform_editor_vanilla_dom', true) &&
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						dateVanillaStyles,
					fg('platform_editor_typography_ugc')
						? fg('platform-dst-jira-web-fonts') ||
							fg('confluence_typography_refreshed') ||
							fg('atlas_editor_typography_refreshed')
							? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
								paragraphStylesUGCRefreshed
							: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
								paragraphStylesUGCModernized
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							paragraphStylesOld,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					fg('platform_editor_hyperlink_underline') ? linkStyles : linkStylesOld,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					browser.safari && listsStylesSafariFix,
					editorExperiment('platform_editor_breakout_resizing', true) &&
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						pragmaticResizerStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					aiPanelBaseStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					isFirefox && aiPanelBaseFirefoxStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					colorMode === 'dark' && aiPanelDarkStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					colorMode === 'dark' && isFirefox && aiPanelDarkFirefoxStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					viewMode === 'view' && layoutViewStyles,
					isComment && commentEditorStyles,
					isFullPage && fullPageEditorStyles,
					fg('platform_editor_ssr_fix_lists') && listLayoutShiftFix,
					fg('platform_editor_nested_dnd_styles_changes')
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							firstCodeBlockWithNoMargin
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							firstCodeBlockWithNoMarginOld,
					fg('platform_editor_element_dnd_nested_fix_patch_6')
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							firstBlockNodeStyles
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							firstBlockNodeStylesOld,
					editorExperiment('platform_editor_vanilla_dom', true, { exposure: false }) &&
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						vanillaMentionsStyles,
					editorExperiment('platform_editor_vanilla_dom', true, { exposure: false }) &&
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						vanillaMentionsSelectionStyles,
					editorExperiment('platform_editor_vanilla_dom', true, { exposure: false })
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							vanillaEmojiStyles
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							reactEmojiStyles,
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
