/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, useTheme } from '@emotion/react';

import { browser as browserLegacy, getBrowserInfo } from '@atlaskit/editor-common/browser';
import { richMediaClassName, tableSharedStyle } from '@atlaskit/editor-common/styles';
import type {
	EditorAppearance,
	EditorContentMode,
	FeatureFlags,
} from '@atlaskit/editor-common/types';
import { akEditorGutterPaddingDynamic, editorFontSize } from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { expVal, expValNoExposure } from '@atlaskit/tmp-editor-statsig/expVal';
import { useThemeObserver } from '@atlaskit/tokens';

import { getBaseFontSize } from '../../composable-editor/utils/getBaseFontSize';

import {
	aiPanelBaseFirefoxStyles,
	aiPanelBaseStyles,
	aiPanelDarkFirefoxStyles,
	aiPanelDarkStyles,
} from './styles/aiPanel';
import { annotationStyles } from './styles/annotationStyles';
import { backgroundColorStyles, textHighlightPaddingStyles } from './styles/backgroundColorStyles';
import {
	baseStyles,
	baseStylesMaxContainerWidthFixes,
	editorLargeGutterPuddingBaseStyles,
	editorLargeGutterPuddingBaseStylesEditorControls,
	editorLargeGutterPuddingReducedBaseStyles,
} from './styles/baseStyles';
import { blockMarksStyles } from './styles/blockMarksStyles';
import {
	blockquoteDangerStyles,
	blockquoteSelectedNodeStyles,
	blockquoteZeroPadding,
	blocktypeStyles,
	blocktypeStyles_fg_platform_editor_nested_dnd_styles_changes,
	blocktypeStyles_fg_platform_editor_typography_ugc,
	blocktypeStyles_without_fg_platform_editor_typography_ugc,
	listDangerStyles,
	listSelectedNodeStyles,
	textDangerStyles,
	textSelectedNodeStyles,
} from './styles/blockTypeStyles';
import {
	codeBlockStyles,
	codeBlockStylesWithEmUnits,
	firstCodeBlockWithNoMargin,
	firstCodeBlockWithNoMarginOld,
} from './styles/codeBlockStyles';
import { codeMarkStyles } from './styles/codeMarkStyles';
import { commentEditorStyles } from './styles/commentEditorStyles';
import { cursorStyles } from './styles/cursorStyles';
import { dangerDateStyles, dateStyles, dateVanillaStyles } from './styles/dateStyles';
import { editorUGCTokensDefault, editorUGCTokensRefreshed } from './styles/editorUGCTokenStyles';
import { embedCardStyles } from './styles/embedCardStyles';
import {
	emojiDangerStyles,
	emojiStyles,
	getDenseEmojiStyles,
	getScaledDenseEmojiStyles,
	scaledEmojiStyles,
} from './styles/emoji';
import {
	expandStyles,
	expandStylesMixin_fg_platform_editor_nested_dnd_styles_changes,
	expandStylesMixin_fg_platform_visual_refresh_icons,
	expandStylesMixin_without_fg_platform_editor_nested_dnd_styles_changes,
	getDenseExpandTitleStyles,
} from './styles/expandStyles';
import { extensionDiffStyles, getExtensionStyles } from './styles/extensionStyles';
import {
	findReplaceStyles,
	findReplaceStylesNew,
	findReplaceStylesNewWithA11Y,
	findReplaceStylesNewWithCodeblockColorContrastFix,
	findReplaceStylesWithCodeblockColorContrastFix,
} from './styles/findReplaceStyles';
import { firstBlockNodeStyles } from './styles/firstBlockNodeStyles';
import { firstFloatingToolbarButtonStyles } from './styles/floatingToolbarStyles';
import { fullPageEditorStyles } from './styles/fullPageEditorStyles';
import { gapCursorStyles } from './styles/gapCursorStyles';
import { gridStyles } from './styles/gridStyles';
import { indentationStyles } from './styles/indentationStyles';
import { InlineNodeViewSharedStyles } from './styles/inlineNodeViewSharedStyles';
import {
	layoutBaseStyles,
	layoutBaseStylesAdvanced,
	layoutBaseStylesWithTableExcerptsFix,
	layoutBaseStylesFixesUnderNestedDnDFG,
	layoutColumnMartinTopFixesNew,
	layoutColumnMartinTopFixesOld,
	layoutColumnResponsiveStyles,
	layoutColumnStylesAdvanced,
	layoutColumnStylesNotAdvanced,
	layoutResponsiveBaseStyles,
	layoutResponsiveStylesForView,
	layoutSectionStylesAdvanced,
	layoutSectionStylesNotAdvanced,
	layoutSelectedStylesAdvanced,
	layoutSelectedStylesForViewAdvanced,
	layoutSelectedStylesForViewNotAdvanced,
	layoutSelectedStylesNotAdvanced,
	layoutStylesForView,
} from './styles/layout';
import { hyperLinkFloatingToolbarStyles, linkStyles } from './styles/link';
import {
	diffListStyles,
	getDenseListStyles,
	listsStyles,
	listsStylesMarginLayoutShiftFix,
	listsStylesSafariFix,
} from './styles/list';
import {
	mediaAlignmentStyles,
	mediaCaptionStyles,
	mediaDangerStyles,
	mediaGroupStyles,
	mediaStyles,
} from './styles/mediaStyles';
import {
	mentionDangerStyles,
	mentionNodeStyles,
	mentionsSelectionStyles,
	mentionsSelectionStylesWithSearchMatch,
	mentionsStyles,
} from './styles/mentions';
import {
	nestedPanelBorderStylesMixin,
	nestedPanelDangerStyles,
	panelStyles,
	panelStylesMixin,
	panelStylesMixin_fg_platform_editor_nested_dnd_styles_changes,
	panelViewStyles,
} from './styles/panelStyles';
import {
	paragraphStylesOld,
	paragraphStylesOldWithScaledMargin,
	paragraphStylesUGCRefreshed,
	paragraphStylesWithScaledMargin,
} from './styles/paragraphStyles';
import {
	placeholderOverflowStyles,
	placeholderStyles,
	placeholderTextStyles,
	placeholderWrapStyles,
} from './styles/placeholderStyles';
import {
	pragmaticResizerStyles,
	pragmaticResizerStylesCodeBlockLegacy,
	pragmaticResizerStylesCodeBlockSyncedBlockPatch,
	pragmaticResizerStylesForTooltip,
	pragmaticResizerStylesSyncedBlock,
	pragmaticResizerStylesWithReducedEditorGutter,
	pragmaticStylesLayoutFirstNodeResizeHandleFix,
	resizerStyles,
} from './styles/resizerStyles';
import { dangerRuleStyles, ruleStyles } from './styles/rule';
import { scrollbarStyles } from './styles/scrollbarStyles';
import {
	hideCursorWhenHideSelectionStyles,
	hideSelectionStyles,
	selectedNodeStyles,
} from './styles/selectionStyles';
import { selectionToolbarAnimationStyles } from './styles/selectionToolbarStyles';
import { shadowStyles } from './styles/shadowStyles';
import {
	editorControlsSmartCardStyles,
	linkingVisualRefreshV1Styles,
	showDiffDeletedNodeStyles,
	showDiffDeletedNodeStylesNew,
	smartCardDiffStyles,
	smartCardStyles,
	smartCardStylesWithSearchMatch,
	smartCardStylesWithSearchMatchAndBlockMenuDangerStyles,
	smartCardStylesWithSearchMatchAndPreviewPanelResponsiveness,
	smartLinksInLivePagesStyles,
} from './styles/smartCardStyles';
import {
	statusDangerStyles,
	statusStyles,
	statusStylesMixin_fg_platform_component_visual_refresh,
	statusStylesMixin_fg_platform_component_visual_refresh_with_search_match,
	statusStylesMixin_without_fg_platform_component_visual_refresh,
	statusStylesMixin_without_fg_platform_component_visual_refresh_with_search_match,
} from './styles/statusStyles';
import { syncBlockStyles, syncBlockOverflowStyles } from './styles/syncBlockStyles';
import {
	tableCommentEditorStyles,
	tableContainerOverflowY,
	tableContainerStyles,
	tableEmptyRowStyles,
	tableLayoutFixes,
} from './styles/tableStyles';
import {
	decisionDangerStyles,
	decisionIconWithVisualRefresh,
	decisionStyles,
	getDenseTasksAndDecisionsStyles,
	taskItemCheckboxStyles,
	taskItemCheckboxStylesWithBlockTaskItem,
	taskItemNextCheckboxStyles,
	taskItemStyles,
	taskItemStylesWithBlockTaskItem,
	tasksAndDecisionsStyles,
} from './styles/tasksAndDecisionsStyles';
import { telepointerColorAndCommonStyle, telepointerStyle } from './styles/telepointerStyles';
import { textColorStyles } from './styles/textColorStyles';
import { textHighlightStyle } from './styles/textHighlightStyles';
import { unsupportedStyles } from './styles/unsupportedStyles';
import { whitespaceStyles } from './styles/whitespaceStyles';

const isFirefox: boolean =
	typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

export type EditorContentContainerProps = {
	appearance?: EditorAppearance;
	children?: React.ReactNode;
	className?: string;
	contentMode?: EditorContentMode;
	featureFlags?: FeatureFlags;
	isScrollable?: boolean;
	viewMode?: 'view' | 'edit';
};

const alignMultipleWrappedImageInLayoutStyles = {
	'.ProseMirror [data-layout-section] [data-layout-column] > div': {
		// apply marginTop to wrapped mediaSingle that has preceding wrapped mediaSingle (even when there's gap cursor in between them)
		// Given the first wrapped mediaSingle in layout has 0 marginTop, this is needed to make sure fellow wrapped mediaSingle align with it horizontally
		'.mediaSingleView-content-wrap[layout^=wrap] + .mediaSingleView-content-wrap[layout^=wrap], .mediaSingleView-content-wrap[layout^=wrap] + .ProseMirror-gapcursor + .mediaSingleView-content-wrap[layout^=wrap]':
		{
			'.rich-media-item': {
				marginTop: 0,
			},
		},

		// Due to the above rule, wrapped mediaSingle (not the first node in layout) that are followed by wrapped mediaSingle should also have 0 marginTop
		// so it's aligned with the following wrapped mediaSingle
		'.mediaSingleView-content-wrap[layout^=wrap]:has( + .mediaSingleView-content-wrap[layout^=wrap])':
		{
			'.rich-media-item': {
				marginTop: 0,
			},
		},
	},
};

const firstWrappedMediaStyles = {
	'.ProseMirror': {
		// Remove gap between first wrapped mediaSingle and its fellow wrapped mediaSingle
		"& [layout^='wrap-']:has(+ [layout^='wrap-']), & [layout^='wrap-']:has(+ .ProseMirror-gapcursor + [layout^='wrap-'])":
		{
			[`& .${richMediaClassName}`]: {
				marginLeft: 0,
				marginRight: 0,
			},
		},
	},
};

/**
 * EditorContentStyles is a wrapper component that applies styles to its children
 * based on the provided feature flags, view mode, and other props.
 * It uses Emotion for styling and supports scrollable content.
 *
 * This will be used in near future to replace the current editor content styles from index.tsx
 */
const EditorContentContainer = React.forwardRef<HTMLDivElement, EditorContentContainerProps>(
	(props, ref) => {
		const { className, children, viewMode, isScrollable, appearance, contentMode } = props;
		const theme = useTheme();
		const { colorMode } = useThemeObserver();

		const isFullPage =
			appearance === 'full-page' ||
			appearance === 'full-width' ||
			((expValEqualsNoExposure('editor_tinymce_full_width_mode', 'isEnabled', true) ||
				expValEqualsNoExposure('confluence_max_width_content_appearance', 'isEnabled', true)) &&
				appearance === 'max');
		const isComment = appearance === 'comment';

		const baseFontSize = getBaseFontSize(appearance, contentMode);

		const style = editorExperiment('platform_editor_preview_panel_responsiveness', true, {
			exposure: true,
		})
			? {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				'--ak-editor-base-font-size': `${editorFontSize({ theme })}px`,
			}
			: {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				'--ak-editor-base-font-size': `${editorFontSize({ theme })}px`,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				'--ak-editor--large-gutter-padding': `${akEditorGutterPaddingDynamic()}px`,
			};

		const browser = expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
			? getBrowserInfo()
			: browserLegacy;

		return (
			<div
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={className}
				ref={ref}
				css={[
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					baseStyles,
					expValEquals('platform_editor_media_vc_fixes', 'isEnabled', true) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					baseStylesMaxContainerWidthFixes,
					// eslint-disable-next-line @atlaskit/platform/no-preconditioning
					fg('platform_editor_controls_increase_full_page_gutter') &&
						editorExperiment('platform_editor_controls', 'variant1')
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						editorLargeGutterPuddingBaseStylesEditorControls
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						editorLargeGutterPuddingBaseStyles,
					editorExperiment('platform_editor_preview_panel_responsiveness', true, {
						exposure: true,
					}) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					editorLargeGutterPuddingReducedBaseStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					whitespaceStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					indentationStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					shadowStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					InlineNodeViewSharedStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					hideSelectionStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					hideCursorWhenHideSelectionStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					selectedNodeStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					cursorStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					firstFloatingToolbarButtonStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					placeholderTextStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					placeholderStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					editorExperiment('platform_editor_controls', 'variant1') && placeholderOverflowStyles,
					editorExperiment('platform_editor_controls', 'variant1') &&
					fg('platform_editor_quick_insert_placeholder') &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					placeholderWrapStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					codeBlockStyles,
					contentMode === 'compact' &&
					(expValEquals('confluence_compact_text_format', 'isEnabled', true) ||
						// eslint-disable-next-line @atlaskit/platform/no-preconditioning
						(expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
							fg('platform_editor_content_mode_button_mvp'))) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					codeBlockStylesWithEmUnits,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					!fg('platform_editor_typography_ugc') && editorUGCTokensDefault,
					fg('platform_editor_typography_ugc') &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					editorUGCTokensRefreshed,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					blocktypeStyles,
					expValEquals('platform_editor_block_menu', 'isEnabled', true) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					blockquoteSelectedNodeStyles,
					expValEquals('platform_editor_block_menu', 'isEnabled', true) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					listSelectedNodeStyles,
					expValEquals('platform_editor_block_menu', 'isEnabled', true) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					textSelectedNodeStyles,
					expVal('platform_editor_blockquote_zero_padding', 'isEnabled', false)
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						blockquoteZeroPadding
						: null,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					fg('platform_editor_typography_ugc')
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						blocktypeStyles_fg_platform_editor_typography_ugc
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						blocktypeStyles_without_fg_platform_editor_typography_ugc,
					fg('platform_editor_nested_dnd_styles_changes') &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					blocktypeStyles_fg_platform_editor_nested_dnd_styles_changes,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					codeMarkStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					textColorStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					backgroundColorStyles,
					expValEquals('platform_editor_text_highlight_padding', 'isEnabled', true) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					textHighlightPaddingStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					listsStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					diffListStyles,
					// Condense vertical spacing between list items when content mode dense is active
					contentMode === 'compact' &&
					(expValEquals('confluence_compact_text_format', 'isEnabled', true) ||
						// eslint-disable-next-line @atlaskit/platform/no-preconditioning
						(expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
							fg('platform_editor_content_mode_button_mvp'))) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					getDenseListStyles(baseFontSize),
					expValEquals('cc_editor_ttvc_release_bundle_one', 'listLayoutShiftFix', true) &&
					isFullPage &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					listsStylesMarginLayoutShiftFix,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					ruleStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					smartCardDiffStyles,
					fg('platform_editor_jan_a11y_fixes')
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						showDiffDeletedNodeStylesNew
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						showDiffDeletedNodeStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					mediaStyles,
					contentMode === 'compact' &&
					(expValEquals('confluence_compact_text_format', 'isEnabled', true) ||
						// eslint-disable-next-line @atlaskit/platform/no-preconditioning
						(expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
							fg('platform_editor_content_mode_button_mvp'))) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					mediaCaptionStyles,
					// merge firstWrappedMediaStyles with mediaStyles when clean up platform_editor_fix_media_in_renderer
					fg('platform_editor_fix_media_in_renderer') && firstWrappedMediaStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					telepointerStyle,
					/* This needs to be after telepointer styles as some overlapping rules have equal specificity, and so the order is significant */
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					telepointerColorAndCommonStyle,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					gapCursorStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					panelStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					nestedPanelBorderStylesMixin,
					fg('platform_editor_nested_dnd_styles_changes') &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					panelStylesMixin_fg_platform_editor_nested_dnd_styles_changes,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					panelStylesMixin,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					mentionsStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					tasksAndDecisionsStyles,
					// condense vertical spacing between tasks/decisions items when content mode dense is active
					contentMode === 'compact' &&
					(expValEquals('confluence_compact_text_format', 'isEnabled', true) ||
						// eslint-disable-next-line @atlaskit/platform/no-preconditioning
						(expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
							fg('platform_editor_content_mode_button_mvp'))) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					getDenseTasksAndDecisionsStyles(baseFontSize),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					gridStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					blockMarksStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					dateStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					getExtensionStyles(contentMode),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					extensionDiffStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					expandStyles,
					contentMode === 'compact' &&
					(expValEquals('confluence_compact_text_format', 'isEnabled', true) ||
						// eslint-disable-next-line @atlaskit/platform/no-preconditioning
						(expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
							fg('platform_editor_content_mode_button_mvp'))) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					getDenseExpandTitleStyles(baseFontSize),
					fg('platform_editor_nested_dnd_styles_changes')
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						expandStylesMixin_fg_platform_editor_nested_dnd_styles_changes
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						expandStylesMixin_without_fg_platform_editor_nested_dnd_styles_changes,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					expandStylesMixin_fg_platform_visual_refresh_icons,
					expValEquals('platform_editor_find_and_replace_improvements', 'isEnabled', true)
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						fg('platform_editor_a11y_find_replace_focus_ring')
							? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							findReplaceStylesNewWithA11Y
							: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							findReplaceStylesNew
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						findReplaceStyles,
					expValEquals('platform_editor_find_and_replace_improvements', 'isEnabled', true) &&
					fg('platform_editor_find_codeblock_color_contrast_fix') &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					findReplaceStylesNewWithCodeblockColorContrastFix,
					!expValEquals('platform_editor_find_and_replace_improvements', 'isEnabled', true) &&
					fg('platform_editor_find_codeblock_color_contrast_fix') &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					findReplaceStylesWithCodeblockColorContrastFix,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					textHighlightStyle,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					decisionStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					expValEqualsNoExposure('platform_editor_blocktaskitem_node_tenantid', 'isEnabled', true)
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						taskItemStylesWithBlockTaskItem
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						taskItemStyles,
					expValEquals('platform_editor_task_item_styles', 'isEnabled', true)
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						taskItemNextCheckboxStyles
						: expValEqualsNoExposure(
							'platform_editor_blocktaskitem_node_tenantid',
							'isEnabled',
							true,
						)
							? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							taskItemCheckboxStylesWithBlockTaskItem
							: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							taskItemCheckboxStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					decisionIconWithVisualRefresh,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					statusStyles,
					fg('platform-component-visual-refresh')
						? expValEqualsNoExposure(
							'platform_editor_find_and_replace_improvements',
							'isEnabled',
							true,
						)
							? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							statusStylesMixin_fg_platform_component_visual_refresh_with_search_match
							: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							statusStylesMixin_fg_platform_component_visual_refresh
						: expValEqualsNoExposure(
							'platform_editor_find_and_replace_improvements',
							'isEnabled',
							true,
						)
							? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							statusStylesMixin_without_fg_platform_component_visual_refresh_with_search_match
							: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							statusStylesMixin_without_fg_platform_component_visual_refresh,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					annotationStyles,
					expValEqualsNoExposure('platform_editor_find_and_replace_improvements', 'isEnabled', true)
						? expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)
							? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							smartCardStylesWithSearchMatchAndBlockMenuDangerStyles
							: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							smartCardStylesWithSearchMatch
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						smartCardStyles,
					editorExperiment('platform_editor_preview_panel_responsiveness', true) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					smartCardStylesWithSearchMatchAndPreviewPanelResponsiveness,
					(expValEqualsNoExposure('platform_editor_controls', 'cohort', 'variant1') ||
						editorExperiment('platform_editor_preview_panel_linking_exp', true)) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					editorControlsSmartCardStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					embedCardStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					unsupportedStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					resizerStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					layoutBaseStyles,
					expValEquals('platform_editor_table_excerpts_fix', 'isEnabled', true) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					layoutBaseStylesWithTableExcerptsFix,
					// merge alignMultipleWrappedImageInLayoutStyles with layoutBaseStyles when clean up platform_editor_fix_media_in_renderer
					fg('platform_editor_fix_media_in_renderer') && alignMultipleWrappedImageInLayoutStyles,
					editorExperiment('platform_synced_block', true) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					syncBlockStyles,
					editorExperiment('platform_synced_block', true) &&
					fg('platform_synced_block_dogfooding') &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					syncBlockOverflowStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					editorExperiment('advanced_layouts', true) && layoutBaseStylesAdvanced,
					editorExperiment('advanced_layouts', true)
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						layoutSectionStylesAdvanced
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						layoutSectionStylesNotAdvanced,
					editorExperiment('advanced_layouts', true)
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						layoutColumnStylesAdvanced
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						layoutColumnStylesNotAdvanced,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					editorExperiment('advanced_layouts', true)
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						layoutSelectedStylesAdvanced
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						layoutSelectedStylesNotAdvanced,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					editorExperiment('advanced_layouts', true) && layoutColumnResponsiveStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					editorExperiment('advanced_layouts', true) && layoutResponsiveBaseStyles,
					fg('platform_editor_nested_dnd_styles_changes') &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					layoutBaseStylesFixesUnderNestedDnDFG,
					fg('platform_editor_nested_dnd_styles_changes')
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						layoutColumnMartinTopFixesNew
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						layoutColumnMartinTopFixesOld,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					smartLinksInLivePagesStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					linkingVisualRefreshV1Styles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					dateVanillaStyles,
					fg('platform_editor_typography_ugc')
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						contentMode === 'compact' &&
							(expValEquals('confluence_compact_text_format', 'isEnabled', true) ||
								// eslint-disable-next-line @atlaskit/platform/no-preconditioning
								(expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
									fg('platform_editor_content_mode_button_mvp')))
							? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							paragraphStylesWithScaledMargin
							: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							paragraphStylesUGCRefreshed
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						contentMode === 'compact' &&
							(expValEquals('confluence_compact_text_format', 'isEnabled', true) ||
								// eslint-disable-next-line @atlaskit/platform/no-preconditioning
								(expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
									fg('platform_editor_content_mode_button_mvp')))
							? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							paragraphStylesOldWithScaledMargin
							: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							paragraphStylesOld,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					linkStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					browser.safari && listsStylesSafariFix,
					editorExperiment('platform_synced_block', true) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					pragmaticResizerStylesSyncedBlock,
					expValEqualsNoExposure('platform_editor_breakout_resizing', 'isEnabled', true)
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						pragmaticResizerStyles
						: undefined,
					expValEqualsNoExposure('platform_editor_breakout_resizing', 'isEnabled', true) ?
						(fg('platform_synced_block_patch_1')
							? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
								pragmaticResizerStylesCodeBlockSyncedBlockPatch
							: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
								pragmaticResizerStylesCodeBlockLegacy)
						: undefined,
					editorExperiment('advanced_layouts', true) &&
					expValEqualsNoExposure('platform_editor_breakout_resizing', 'isEnabled', true) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					pragmaticStylesLayoutFirstNodeResizeHandleFix,
					expValEqualsNoExposure('platform_editor_breakout_resizing', 'isEnabled', true) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					pragmaticResizerStylesForTooltip,
					editorExperiment('platform_editor_preview_panel_responsiveness', true) &&
					(editorExperiment('advanced_layouts', true) ||
						expValEqualsNoExposure('platform_editor_breakout_resizing', 'isEnabled', true)) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					pragmaticResizerStylesWithReducedEditorGutter,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					aiPanelBaseStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					isFirefox && aiPanelBaseFirefoxStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					colorMode === 'dark' && aiPanelDarkStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					colorMode === 'dark' && isFirefox && aiPanelDarkFirefoxStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					viewMode === 'view' && layoutStylesForView,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					viewMode === 'view' &&
					editorExperiment('advanced_layouts', true) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					layoutSelectedStylesForViewAdvanced,
					viewMode === 'view' &&
					editorExperiment('advanced_layouts', false) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					layoutSelectedStylesForViewNotAdvanced,
					viewMode === 'view' &&
					editorExperiment('advanced_layouts', true) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					layoutResponsiveStylesForView,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					isComment && commentEditorStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					isComment && tableCommentEditorStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					isFullPage && fullPageEditorStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					isFullPage && scrollbarStyles,
					fg('platform_editor_nested_dnd_styles_changes')
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						firstCodeBlockWithNoMargin
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						firstCodeBlockWithNoMarginOld,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					firstBlockNodeStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					mentionNodeStyles,
					expValEqualsNoExposure('platform_editor_find_and_replace_improvements', 'isEnabled', true)
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						mentionsSelectionStylesWithSearchMatch
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						mentionsSelectionStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					expValEquals('platform_editor_lovability_emoji_scaling', 'isEnabled', true)
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						scaledEmojiStyles
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						emojiStyles,
					// Dense emoji scaling based on base font size
					contentMode === 'compact' &&
						(expValEquals('confluence_compact_text_format', 'isEnabled', true) ||
							// eslint-disable-next-line @atlaskit/platform/no-preconditioning
							(expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
								fg('platform_editor_content_mode_button_mvp')))
						? expValEquals('platform_editor_lovability_emoji_scaling', 'isEnabled', true)
							? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							getScaledDenseEmojiStyles(baseFontSize)
							: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							getDenseEmojiStyles(baseFontSize)
						: undefined,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					panelViewStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					mediaGroupStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					mediaAlignmentStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					tableLayoutFixes,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					tableContainerStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					!fg('platform_editor_table_container_y_overflow_fix') && tableContainerOverflowY,
					expValEquals('platform_editor_ssr_renderer', 'isEnabled', true) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					tableSharedStyle(),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					expValEquals('platform_editor_ssr_renderer', 'isEnabled', true) && tableEmptyRowStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					hyperLinkFloatingToolbarStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					selectionToolbarAnimationStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					expValNoExposure('platform_editor_block_menu', 'isEnabled', false) && [
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						blockquoteDangerStyles,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						textDangerStyles,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						listDangerStyles,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						dangerDateStyles,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						emojiDangerStyles,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						mentionDangerStyles,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						decisionDangerStyles,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						statusDangerStyles,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						dangerRuleStyles,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						mediaDangerStyles,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						nestedPanelDangerStyles,
					],
				]}
				data-editor-scroll-container={isScrollable ? 'true' : undefined}
				data-testid="editor-content-container"
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				style={style as React.CSSProperties}
				tabIndex={isScrollable ? 0 : undefined}
				role={isScrollable ? 'region' : undefined}
			>
				{children}
			</div>
		);
	},
);

export default EditorContentContainer;
