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
import { baseStyles } from './styles/baseStyles';
import { blockMarksStyles } from './styles/blockMarksStyles';
import {
	blocktypeStyles,
	blocktypeStyles_fg_platform_editor_nested_dnd_styles_changes,
	blocktypeStyles_fg_platform_editor_typography_ugc,
	blocktypeStyles_without_fg_platform_editor_typography_ugc,
} from './styles/blockTypeStyles';
import {
	codeBlockStyles,
	firstCodeBlockWithNoMargin,
	firstCodeBlockWithNoMarginOld,
} from './styles/codeBlockStyles';
import { codeMarkStyles } from './styles/codeMarkStyles';
import { commentEditorStyles } from './styles/commentEditorStyles';
import { cursorStyles } from './styles/cursorStyles';
import { dateStyles, dateVanillaStyles } from './styles/dateStyles';
import {
	editorUGCTokensDefault,
	editorUGCTokensModernized,
	editorUGCTokensRefreshed,
} from './styles/editorUGCTokenStyles';
import { embedCardStyles } from './styles/embedCardStyles';
import { reactEmojiStyles, vanillaEmojiStyles } from './styles/emoji';
import {
	expandStyles,
	expandStylesMixin_fg_platform_editor_nested_dnd_styles_changes,
	expandStylesMixin_fg_platform_visual_refresh_icons,
	expandStylesMixin_without_fg_platform_editor_nested_dnd_styles_changes,
} from './styles/expandStyles';
import { extensionStyles } from './styles/extensionStyles';
import { findReplaceStyles } from './styles/findReplaceStyles';
import { firstBlockNodeStyles } from './styles/firstBlockNodeStyles';
import { firstFloatingToolbarButtonStyles } from './styles/floatingToolbarStyles';
import { fullPageEditorStyles } from './styles/fullPageEditorStyles';
import { gapCursorStyles } from './styles/gapCursorStyles';
import { gridStyles } from './styles/gridStyles';
import { indentationStyles } from './styles/indentationStyles';
import { InlineNodeViewSharedStyles } from './styles/inlineNodeViewSharedStyles';
import {
	layoutColumnResponsiveStyles,
	layoutBaseStyles,
	layoutBaseStylesAdvanced,
	layoutBaseStylesFixesUnderNestedDnDFG,
	layoutSelectedStylesNotAdvanced,
	layoutSelectedStylesForViewNotAdvanced,
	layoutColumnMartinTopFixesNew,
	layoutColumnMartinTopFixesOld,
	layoutColumnStylesAdvanced,
	layoutColumnStylesNotAdvanced,
	layoutResponsiveBaseStyles,
	layoutResponsiveStylesForView,
	layoutSectionStylesAdvanced,
	layoutSectionStylesNotAdvanced,
	layoutStylesForView,
	layoutSelectedStylesAdvanced,
	layoutSelectedStylesForViewAdvanced,
} from './styles/layout';
import {
	hyperLinkFloatingToolbarStyles,
	linkStyles,
	linkStylesOld,
	linkLegacyIconStylesFix,
} from './styles/link';
import { listLayoutShiftFix, listsStyles, listsStylesSafariFix } from './styles/list';
import { mediaAlignmentStyles, mediaGroupStyles, mediaStyles } from './styles/mediaStyles';
import {
	mentionsStyles,
	vanillaMentionsStyles,
	vanillaMentionsSelectionStyles,
} from './styles/mentions';
import {
	panelStyles,
	panelStylesMixin_fg_platform_editor_add_border_for_nested_panel,
	panelStylesMixin_fg_platform_editor_lcm_nested_panel_icon_fix,
	panelStylesMixin_fg_platform_editor_nested_dnd_styles_changes,
	panelStylesMixin_without_fg_platform_editor_lcm_nested_panel_icon_fix,
	panelViewStyles,
} from './styles/panelStyles';
import {
	paragraphStylesOld,
	paragraphStylesUGCModernized,
	paragraphStylesUGCRefreshed,
} from './styles/paragraphStyles';
import {
	placeholderOverflowStyles,
	placeholderStyles,
	placeholderTextStyles,
	placeholderWrapStyles,
} from './styles/placeholderStyles';
import {
	resizerStyles,
	pragmaticResizerStyles,
	pragmaticResizerStylesForTooltip,
} from './styles/resizerStyles';
import { ruleStyles } from './styles/rule';
import { scrollbarStyles } from './styles/scrollbarStyles';
import {
	hideCursorWhenHideSelectionStyles,
	hideSelectionStyles,
	selectedNodeStyles,
} from './styles/selectionStyles';
import { shadowStyles } from './styles/shadowStyles';
import {
	linkingVisualRefreshV1Styles,
	smartCardStyles,
	smartLinksInLivePagesStyles,
	smartLinksInLivePagesStylesOld,
} from './styles/smartCardStyles';
import {
	statusStyles,
	statusStylesMixin_fg_platform_component_visual_refresh,
	statusStylesMixin_without_fg_platform_component_visual_refresh,
	vanillaStatusStyles,
	vanillaStatusStylesMixin_fg_platform_component_visual_refresh,
	vanillaStatusStylesMixin_without_fg_platform_component_visual_refresh,
} from './styles/statusStyles';
import { tableCommentEditorStyles, tableLayoutFixes } from './styles/tableStyles';
import {
	decisionStyles,
	tasksAndDecisionsStyles,
	vanillaDecisionIconWithoutVisualRefresh,
	vanillaDecisionIconWithVisualRefresh,
	vanillaDecisionStyles,
	vanillaTaskItemStyles,
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

		return (
			<div
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={className}
				ref={ref}
				css={[
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					baseStyles,
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
					(fg('platform_editor_hide_cursor_when_pm_hideselection') ||
						editorExperiment('platform_editor_advanced_code_blocks', true)) &&
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						hideCursorWhenHideSelectionStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					selectedNodeStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					cursorStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					fg('platform_editor_fix_floating_toolbar_focus') && firstFloatingToolbarButtonStyles,
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
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					!fg('platform_editor_typography_ugc') && editorUGCTokensDefault,
					(fg('platform-dst-jira-web-fonts') ||
						fg('confluence_typography_refreshed') ||
						fg('atlas_editor_typography_refreshed')) &&
						fg('platform_editor_typography_ugc') &&
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						editorUGCTokensRefreshed,
					!(
						fg('platform-dst-jira-web-fonts') ||
						fg('confluence_typography_refreshed') ||
						fg('atlas_editor_typography_refreshed')
					) &&
						fg('platform_editor_typography_ugc') &&
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						editorUGCTokensModernized,
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
					fg('platform_editor_lcm_nested_panel_icon_fix')
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							panelStylesMixin_fg_platform_editor_lcm_nested_panel_icon_fix
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							panelStylesMixin_without_fg_platform_editor_lcm_nested_panel_icon_fix,
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
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					findReplaceStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					textHighlightStyle,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					decisionStyles,
					editorExperiment('platform_editor_vanilla_dom', true, { exposure: false }) &&
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						vanillaTaskItemStyles,
					editorExperiment('platform_editor_vanilla_dom', true, { exposure: false }) &&
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						vanillaDecisionStyles,
					editorExperiment('platform_editor_vanilla_dom', true, { exposure: false }) &&
						fg('platform-visual-refresh-icons') &&
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						vanillaDecisionIconWithVisualRefresh,
					editorExperiment('platform_editor_vanilla_dom', true, { exposure: false }) &&
						!fg('platform-visual-refresh-icons') &&
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						vanillaDecisionIconWithoutVisualRefresh,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					statusStyles,
					fg('platform-component-visual-refresh')
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							statusStylesMixin_fg_platform_component_visual_refresh
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							statusStylesMixin_without_fg_platform_component_visual_refresh,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					editorExperiment('platform_editor_vanilla_dom', true) && vanillaStatusStyles,
					editorExperiment('platform_editor_vanilla_dom', true) &&
						fg('platform-component-visual-refresh') &&
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						vanillaStatusStylesMixin_fg_platform_component_visual_refresh,
					editorExperiment('platform_editor_vanilla_dom', true) &&
						!fg('platform-component-visual-refresh') &&
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						vanillaStatusStylesMixin_without_fg_platform_component_visual_refresh,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					annotationStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					smartCardStyles,
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
					editorExperiment('platform_editor_breakout_resizing', true) &&
						fg('platform_editor_breakout_resizing_hello_release') &&
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						pragmaticResizerStylesForTooltip,
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
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					fg('platform_editor_ssr_fix_lists') && listLayoutShiftFix,
					fg('platform_editor_nested_dnd_styles_changes')
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							firstCodeBlockWithNoMargin
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							firstCodeBlockWithNoMarginOld,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					firstBlockNodeStyles,
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
				]}
				data-editor-scroll-container={isScrollable ? 'true' : undefined}
				data-testid="editor-content-container"
				style={
					{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						'--ak-editor-base-font-size': `${editorFontSize({ theme })}px`,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						'--ak-editor--large-gutter-padding': `${akEditorGutterPaddingDynamic()}px`,
					} as React.CSSProperties
				}
			>
				{children}
			</div>
		);
	},
);

export default EditorContentContainer;
