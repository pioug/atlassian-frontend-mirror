/* eslint-disable @atlaskit/platform/ensure-feature-flag-prefix */
/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, useTheme } from '@emotion/react';

import { browser } from '@atlaskit/editor-common/browser';
import type { EditorAppearance, FeatureFlags } from '@atlaskit/editor-common/types';
import { akEditorGutterPaddingDynamic, editorFontSize } from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { useThemeObserver } from '@atlaskit/tokens';

import {
	aiPanelBaseFirefoxStyles,
	aiPanelBaseStyles,
	aiPanelDarkFirefoxStyles,
	aiPanelDarkStyles,
} from './styles/aiPanel';
import { annotationStyles } from './styles/annotationStyles';
import { backgroundColorStyles } from './styles/backgroundColorStyles';
import {
	baseStyles,
	editorLargeGutterPuddingBaseStyles,
	editorLargeGutterPuddingBaseStylesEditorControls,
	editorLargeGutterPuddingReducedBaseStyles,
} from './styles/baseStyles';
import { blockMarksStyles } from './styles/blockMarksStyles';
import {
	blocktypeStyles,
	blocktypeStyles_fg_platform_editor_nested_dnd_styles_changes,
	blocktypeStyles_fg_platform_editor_typography_ugc,
	blocktypeStyles_without_fg_platform_editor_typography_ugc,
} from './styles/blockTypeStyles';
import { codeBidiWarningStyles } from './styles/codeBidiWarningStyles';
import {
	codeBlockStyles,
	codeBgColorStyles,
	firstCodeBlockWithNoMargin,
	firstCodeBlockWithNoMarginOld,
} from './styles/codeBlockStyles';
import { codeMarkStyles } from './styles/codeMarkStyles';
import { commentEditorStyles } from './styles/commentEditorStyles';
import { cursorStyles } from './styles/cursorStyles';
import { dateStyles, dateVanillaStyles } from './styles/dateStyles';
import { editorUGCTokensDefault, editorUGCTokensRefreshed } from './styles/editorUGCTokenStyles';
import { embedCardStyles } from './styles/embedCardStyles';
import { emojiStyles, emojiStylesWithSelectorFixes } from './styles/emoji';
import {
	expandStyles,
	expandStylesMixin_fg_platform_editor_nested_dnd_styles_changes,
	expandStylesMixin_fg_platform_visual_refresh_icons,
	expandStylesMixin_without_fg_platform_editor_nested_dnd_styles_changes,
} from './styles/expandStyles';
import { extensionStyles } from './styles/extensionStyles';
import {
	findReplaceStyles,
	findReplaceStylesNew,
	findReplaceStylesNewNoImportant,
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
import { hyperLinkFloatingToolbarStyles, linkLegacyIconStylesFix, linkStyles } from './styles/link';
import { listsStyles, listsStylesSafariFix } from './styles/list';
import { mediaAlignmentStyles, mediaGroupStyles, mediaStyles } from './styles/mediaStyles';
import {
	mentionsStyles,
	mentionsSelectionStyles,
	mentionNodeStyles,
	mentionsStylesMixin_platform_editor_centre_mention_padding,
	mentionsSelectionStylesWithSearchMatch,
} from './styles/mentions';
import {
	panelStyles,
	panelStylesMixin,
	panelStylesMixin_fg_platform_editor_add_border_for_nested_panel,
	panelStylesMixin_fg_platform_editor_nested_dnd_styles_changes,
	panelViewStyles,
} from './styles/panelStyles';
import { paragraphStylesOld, paragraphStylesUGCRefreshed } from './styles/paragraphStyles';
import {
	placeholderOverflowStyles,
	placeholderStyles,
	placeholderTextStyles,
	placeholderTextStylesMixin_fg_platform_editor_system_fake_text_highlight_colour,
	placeholderWrapStyles,
} from './styles/placeholderStyles';
import {
	pragmaticResizerStyles,
	pragmaticResizerStylesNew,
	pragmaticStylesLayoutFirstNodeResizeHandleFix,
	pragmaticResizerStylesForTooltip,
	pragmaticResizerStylesWithReducedEditorGutter,
	resizerStyles,
} from './styles/resizerStyles';
import { ruleStyles } from './styles/rule';
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
	smartCardStyles,
	smartCardStylesWithSearchMatch,
	smartCardStylesWithSearchMatchAndPreviewPanelResponsiveness,
	smartLinksInLivePagesStyles,
} from './styles/smartCardStyles';
import {
	statusStyles,
	statusStylesMixin_fg_platform_component_visual_refresh,
	statusStylesMixin_fg_platform_component_visual_refresh_with_search_match,
	statusStylesMixin_without_fg_platform_component_visual_refresh,
	statusStylesMixin_without_fg_platform_component_visual_refresh_with_search_match,
} from './styles/statusStyles';
import { tableCommentEditorStyles, tableLayoutFixes } from './styles/tableStyles';
import {
	decisionStyles,
	tasksAndDecisionsStyles,
	decisionIconWithVisualRefresh,
	decisionIconWithoutVisualRefresh,
	taskItemStyles,
	taskItemStylesWithBlockTaskItem,
} from './styles/tasksAndDecisionsStyles';
import {
	telepointerColorAndCommonStyle,
	telepointerStyle,
	telepointerStyleWithInitialOnly,
} from './styles/telepointerStyles';
import { textColorStyles } from './styles/textColorStyles';
import { textHighlightStyle } from './styles/textHighlightStyles';
import { unsupportedStyles } from './styles/unsupportedStyles';
import { whitespaceStyles } from './styles/whitespaceStyles';

const isFirefox: boolean =
	typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

export type EditorContentContainerProps = {
	className?: string;
	children?: React.ReactNode;
	featureFlags?: FeatureFlags;
	viewMode?: 'view' | 'edit';
	isScrollable?: boolean;
	appearance?: EditorAppearance;
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
		const { className, children, viewMode, isScrollable, appearance } = props;
		const theme = useTheme();
		const { colorMode } = useThemeObserver();

		const isFullPage = appearance === 'full-page' || appearance === 'full-width';
		const isComment = appearance === 'comment';

		const style = expValEquals('platform_editor_preview_panel_responsiveness', 'isEnabled', true)
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

		return (
			<div
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={className}
				ref={ref}
				css={[
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					baseStyles,
					// eslint-disable-next-line @atlaskit/platform/no-preconditioning
					fg('platform_editor_controls_increase_full_page_gutter') &&
					editorExperiment('platform_editor_controls', 'variant1')
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							editorLargeGutterPuddingBaseStylesEditorControls
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							editorLargeGutterPuddingBaseStyles,
					expValEquals('platform_editor_preview_panel_responsiveness', 'isEnabled', true) &&
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
					fg('platform_editor_system_fake_text_highlight_colour') &&
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						placeholderTextStylesMixin_fg_platform_editor_system_fake_text_highlight_colour,
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
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					!fg('platform_editor_fix_code_block_bg_color_in_macro_2') && codeBgColorStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					!fg('platform_editor_typography_ugc') && editorUGCTokensDefault,
					fg('platform_editor_typography_ugc') &&
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						editorUGCTokensRefreshed,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					blocktypeStyles,
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
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					listsStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					ruleStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					mediaStyles,
					fg('confluence_team_presence_scroll_to_pointer')
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							telepointerStyle
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							telepointerStyleWithInitialOnly,
					/* This needs to be after telepointer styles as some overlapping rules have equal specificity, and so the order is significant */
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					telepointerColorAndCommonStyle,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					gapCursorStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					panelStyles,
					fg('platform_editor_add_border_for_nested_panel') &&
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						panelStylesMixin_fg_platform_editor_add_border_for_nested_panel,
					fg('platform_editor_nested_dnd_styles_changes') &&
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						panelStylesMixin_fg_platform_editor_nested_dnd_styles_changes,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					panelStylesMixin,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					mentionsStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					tasksAndDecisionsStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					gridStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					blockMarksStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					dateStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					extensionStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					expandStyles,
					fg('platform_editor_nested_dnd_styles_changes')
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							expandStylesMixin_fg_platform_editor_nested_dnd_styles_changes
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							expandStylesMixin_without_fg_platform_editor_nested_dnd_styles_changes,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					fg('platform-visual-refresh-icons') && expandStylesMixin_fg_platform_visual_refresh_icons,
					expValEquals('platform_editor_find_and_replace_improvements', 'isEnabled', true)
						? fg('platform_editor_find_and_replace_improvements_1')
							? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
								findReplaceStylesNewNoImportant
							: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
								findReplaceStylesNew
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							findReplaceStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					textHighlightStyle,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					decisionStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					expValEqualsNoExposure('platform_editor_blocktaskitem_node', 'isEnabled', true)
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							taskItemStylesWithBlockTaskItem
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							taskItemStyles,
					fg('platform-visual-refresh-icons') &&
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						decisionIconWithVisualRefresh,
					!fg('platform-visual-refresh-icons') &&
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						decisionIconWithoutVisualRefresh,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					statusStyles,
					fg('platform-component-visual-refresh')
						? expValEqualsNoExposure(
								'platform_editor_find_and_replace_improvements',
								'isEnabled',
								true,
							) && fg('platform_editor_find_and_replace_improvements_1')
							? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
								statusStylesMixin_fg_platform_component_visual_refresh_with_search_match
							: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
								statusStylesMixin_fg_platform_component_visual_refresh
						: expValEqualsNoExposure(
									'platform_editor_find_and_replace_improvements',
									'isEnabled',
									true,
							  ) && fg('platform_editor_find_and_replace_improvements_1')
							? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
								statusStylesMixin_without_fg_platform_component_visual_refresh_with_search_match
							: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
								statusStylesMixin_without_fg_platform_component_visual_refresh,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					annotationStyles,
					expValEqualsNoExposure(
						'platform_editor_find_and_replace_improvements',
						'isEnabled',
						true,
					) && fg('platform_editor_find_and_replace_improvements_1')
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							smartCardStylesWithSearchMatch
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							smartCardStyles,
					expValEqualsNoExposure(
						'platform_editor_preview_panel_responsiveness',
						'isEnabled',
						true,
					) &&
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						smartCardStylesWithSearchMatchAndPreviewPanelResponsiveness,
					((expValEqualsNoExposure('platform_editor_controls', 'cohort', 'variant1') &&
						fg('platform_editor_controls_patch_15')) ||
						expValEqualsNoExposure(
							'platform_editor_preview_panel_linking_exp',
							'isEnabled',
							true,
						)) &&
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
							paragraphStylesUGCRefreshed
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							paragraphStylesOld,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					linkStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					browser.safari && listsStylesSafariFix,
					expValEqualsNoExposure('platform_editor_breakout_resizing', 'isEnabled', true)
						? fg('platform_editor_breakout_resizing_width_changes')
							? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
								pragmaticResizerStylesNew
							: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
								pragmaticResizerStyles
						: undefined,
					editorExperiment('advanced_layouts', true) &&
						expValEqualsNoExposure('platform_editor_breakout_resizing', 'isEnabled', true) &&
						fg('platform_editor_breakout_resizing_hello_release') &&
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						pragmaticStylesLayoutFirstNodeResizeHandleFix,
					expValEqualsNoExposure('platform_editor_breakout_resizing', 'isEnabled', true) &&
						fg('platform_editor_breakout_resizing_hello_release') &&
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						pragmaticResizerStylesForTooltip,
					expValEqualsNoExposure(
						'platform_editor_preview_panel_responsiveness',
						'isEnabled',
						true,
					) &&
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
					expValEqualsNoExposure(
						'platform_editor_find_and_replace_improvements',
						'isEnabled',
						true,
					) && fg('platform_editor_find_and_replace_improvements_1')
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							mentionsSelectionStylesWithSearchMatch
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							mentionsSelectionStyles,
					fg('platform_editor_centre_mention_padding') &&
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						mentionsStylesMixin_platform_editor_centre_mention_padding,
					fg('platform_editor_fix_emoji_style_selectors')
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							emojiStylesWithSelectorFixes
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							emojiStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					panelViewStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					mediaGroupStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					mediaAlignmentStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					tableLayoutFixes,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					hyperLinkFloatingToolbarStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					!fg('platform-visual-refresh-icons') && linkLegacyIconStylesFix,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					fg('confluence_floating_toolbar_animation') && selectionToolbarAnimationStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					fg('platform_editor_vanilla_codebidi_warning') && codeBidiWarningStyles,
				]}
				data-editor-scroll-container={isScrollable ? 'true' : undefined}
				data-testid="editor-content-container"
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				style={style as React.CSSProperties}
				// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Adding tabIndex here because this is a scrollable container and it needs to be focusable so keyboard users can scroll it.
				tabIndex={isScrollable && fg('platform_editor_editor_container_a11y_focus') ? 0 : undefined}
				role={
					isScrollable && fg('platform_editor_editor_container_a11y_focus') ? 'region' : undefined
				}
			>
				{children}
			</div>
		);
	},
);

export default EditorContentContainer;
