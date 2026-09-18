/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- Ignored via go/DSP-18766; jsx required at runtime for @jsxRuntime classic
import { css, jsx, type SerializedStyles, useTheme } from '@emotion/react';

import { getBrowserInfo } from '@atlaskit/editor-common/browser';
import { richMediaClassName, tableSharedStyle } from '@atlaskit/editor-common/styles';
import type {
	EditorAppearance,
	EditorContentMode,
	FeatureFlags,
} from '@atlaskit/editor-common/types';
import { akEditorGutterPaddingDynamic, editorFontSize } from '@atlaskit/editor-shared-styles';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { UNSAFE_expValNoExposure } from '@atlaskit/platform-feature-experiments/unsafe-exp-val-no-exposure';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/editor-experiment';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { token } from '@atlaskit/tokens';
import { useThemeObserver } from '@atlaskit/tokens/use-theme-observer';

import { getBaseFontSize } from '../../composable-editor/utils/getBaseFontSize';
import { agentShimmerStyle } from './styles/agentShimmerStyles';
import {
	aiPanelBaseFirefoxStyles,
	aiPanelBaseStyles,
	aiPanelDarkFirefoxStyles,
	aiPanelDarkStyles,
} from './styles/aiPanel';
import { annotationStyles } from './styles/annotationStyles';
import {
	backgroundColorStyles,
	highlightLinksUnsetStyles,
	textHighlightPaddingStyles,
} from './styles/backgroundColorStyles';
import {
	baseStyles,
	baseStylesMaxContainerWidthFixes,
	editorGutterPaddingBaseStyles,
	editorLargeGutterPuddingReducedBaseStyles,
	maxModeReizeFixStyles,
} from './styles/baseStyles';
import { blockMarksStyles } from './styles/blockMarksStyles';
import { blockSpacingVarScaledStyles, blockSpacingVarStyles } from './styles/blockSpacingStyles';
import {
	blockquoteDangerStyles,
	blockquoteSelectedNodeStyles,
	blocktypeStyles,
	blocktypeStylesNestedDnd,
	blocktypeStyles_fg_platform_editor_typography_ugc,
	headingScrollMarginStyles,
	listDangerStyles,
	listSelectedNodeStyles,
	textDangerStyles,
	textSelectedNodeStyles,
} from './styles/blockTypeStyles';
import {
	codeBlockStyles,
	codeBlockStylesWithEmUnits,
	firstCodeBlockWithNoMargin,
} from './styles/codeBlockStyles';
import { codeMarkStyles, codeMarkStylesA11yFix } from './styles/codeMarkStyles';
import { commentEditorStyles } from './styles/commentEditorStyles';
import { nonFullPageContainerTypeStyles } from './styles/containerTypeStyles';
import { contributorTagStyles } from './styles/contributorTagStyles';
import { cursorStyles } from './styles/cursorStyles';
import { dangerDateStyles, dateStyles, dateVanillaStyles } from './styles/dateStyles';
import { editorUGCSmallText, editorUGCTokensRefreshed } from './styles/editorUGCTokenStyles';
import { embedCardStyles } from './styles/embedCardStyles';
import {
	directEmojiSelectionStyles,
	emojiDangerStyles,
	emojiSelectionStyles,
	emojiStyles,
	getDenseEmojiStyles,
	getScaledDenseEmojiStyles,
	scaledEmojiStyles,
} from './styles/emoji';
import {
	expandStyles,
	expandStylesBase,
	expandStylesMixin_chromeless_expand_fix,
	expandStylesMixinNestedDnd,
	expandStylesMixin_fg_platform_visual_refresh_icons,
	getDenseExpandTitleStyles,
} from './styles/expandStyles';
import { extensionWithBreakoutStyles } from './styles/extensionBreakoutStyles';
import { extensionDiffStyles, getExtensionStyles } from './styles/extensionStyles';
import {
	findReplaceStyles,
	findReplaceStylesWithCodeblockColorContrastFix,
	findReplaceStylesWithRefSyncBlock,
} from './styles/findReplaceStyles';
import { firstBlockNodeStyles, firstNodeWidgetFixStyles } from './styles/firstBlockNodeStyles';
import { firstFloatingToolbarButtonStyles } from './styles/floatingToolbarStyles';
import { fontSizeStyles } from './styles/fontSizeStyles';
import { fullPageEditorStyles } from './styles/fullPageEditorStyles';
import { gapCursorStyles, gapCursorStylesVisibilityFix } from './styles/gapCursorStyles';
import { gridStyles } from './styles/gridStyles';
import { indentationStyles } from './styles/indentationStyles';
import { InlineNodeViewSharedStyles } from './styles/inlineNodeViewSharedStyles';
import {
	layoutBaseStyles,
	layoutBaseStylesAdvanced,
	layoutColumnMartinTopFixes,
	layoutColumnDividerStyles,
	layoutColumnDividerStylesNestedDnD,
	layoutColumnResizeStyles,
	layoutColumnResponsiveStyles,
	layoutColumnStylesAdvanced,
	layoutColumnStylesNotAdvanced,
	layoutResponsiveBaseStyles,
	layoutResponsiveStylesForView,
	layoutDragHandleWrapperStylesLegacy,
	layoutSectionStylesAdvanced,
	layoutSectionStylesNotAdvanced,
	layoutSelectedStylesAdvanced,
	layoutSelectedStylesForViewAdvanced,
	layoutSelectedStylesForViewNotAdvanced,
	layoutSelectedStylesNotAdvanced,
	layoutStylesForView,
	layoutSelectedStylesAdvancedFix,
	layoutBaseStylesNestedDndExcludingBodiedSync,
} from './styles/layout';
import { hyperLinkFloatingToolbarStyles, linkStyles } from './styles/link';
import {
	diffListStyles,
	getDenseListStyles,
	listItemHiddenMarkerStyles,
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
	vanillaCaptionStyles,
} from './styles/mediaStyles';
import {
	mentionDangerStyles,
	mentionNodeStyles,
	mentionsSelectionStyles,
	mentionsStyles,
} from './styles/mentions';
import {
	nestedPanelBorderStylesMixin,
	nestedPanelDangerStyles,
	panelStyles,
	panelStylesMixin,
	panelStylesMixinNestedDnd,
	panelViewStyles,
} from './styles/panelStyles';
import {
	paragraphStylesUGCRefreshed,
	paragraphStylesWithScaledMargin,
} from './styles/paragraphStyles';
import {
	placeholderOverflowStyles,
	placeholderStyles,
	placeholderTextStyles,
} from './styles/placeholderStyles';
import {
	pragmaticResizerStyles,
	pragmaticResizerStylesCodeBlockSyncedBlockPatch,
	pragmaticResizerStylesExtensions,
	pragmaticResizerStylesForTooltip,
	pragmaticResizerStylesPanelAndRule,
	pragmaticResizerStylesSyncedBlock,
	pragmaticResizerStylesWithReducedEditorGutter,
	pragmaticStylesLayoutFirstNodeResizeHandleFix,
	resizerBottomHandleStyles,
	resizerStyles,
} from './styles/resizerStyles';
import { dangerRuleStyles, ruleStyles } from './styles/rule';
import { ruleWithAttrsStyles } from './styles/ruleWithAttrs';
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
	smartCardStylesWithSearchMatchAndBlockMenuDangerStyles,
	smartCardStylesWithSearchMatchAndPreviewPanelResponsiveness,
	smartLinksInLivePagesStyles,
} from './styles/smartCardStyles';
import {
	statusDangerStyles,
	statusStyles,
	statusStylesMixin_fg_platform_component_visual_refresh_with_search_match,
	statusStylesMixin_without_fg_platform_component_visual_refresh_with_search_match,
	statusStylesTeam26,
} from './styles/statusStyles';
import { syncBlockInteractiveCursorStyles } from './styles/syncBlockInteractiveCursorStyles';
import {
	syncBlockStyles,
	syncBlockStylesBase,
	syncBlockFirstNodeStyles,
	syncBlockOverflowStyles,
	syncBlockTextSelectionStyles,
} from './styles/syncBlockStyles';
import {
	tableCommentEditorStyles,
	tableContainerStyles,
	tableEmptyRowStyles,
	tableRoundedCornerStyles,
	tableScrollInlineShadowStyles,
	tableLayoutFixesWithFontSize,
	tableContentModeExtensionContainmentStyles,
	tableContentModeStyles,
	tableContentModeNestedTableStyles,
} from './styles/tableStyles';
import {
	decisionDangerStyles,
	decisionIconWithVisualRefresh,
	decisionStyles,
	getDenseTasksAndDecisionsStyles,
	taskItemCheckboxStyles,
	taskItemStyles,
	taskItemStylesWithBlockTaskItem,
	tasksAndDecisionsStyles,
} from './styles/tasksAndDecisionsStyles';
import { telepointerColorAndCommonStyle, telepointerStyle } from './styles/telepointerStyles';
import { textColorStyles } from './styles/textColorStyles';
import { textHighlightStyle } from './styles/textHighlightStyles';
import { unsupportedStyles, vanillaUnsupportedStyles } from './styles/unsupportedStyles';
import { vanillaTooltipDefaultStyles } from './styles/vanillaTooltipStyles';
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
	/**
	 * When true, nodes maintain their standard width without negative margins
	 * For when the drag handle is visible and the editor has limited space.
	 */
	useStandardNodeWidth?: boolean;
	viewMode?: 'view' | 'edit';
};

const syncBlockSelectedStyles: SerializedStyles = css({
	'--ak-editor-sync-block-selected-border-color': token('color.border.selected'),
	'--ak-editor-sync-block-selected-label-background-color': token('elevation.surface.hovered'),
});

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

// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required
/**
 * EditorContentStyles is a wrapper component that applies styles to its children
 * based on the provided feature flags, view mode, and other props.
 * It uses Emotion for styling and supports scrollable content.
 *
 * @deprecated
 * Migration WIP
 * If you are touching EditorContentContainer-emotion.tsx, please also updated in EditorContentContainer-compiled.tsx,
 * If you are not sure, please contact with #proj-cc-editor-full-compiled-css-migration
 * https://home.atlassian.com/o/2346a038-3c8c-498b-a79b-e7847859868d/s/a436116f-02ce-4520-8fbb-7301462a1674/project/ATLAS-120555
 */
/**
 * Pre-experiment semantic mapping for every named colour except neutral. Replaced
 * (not overlaid) by statusStylesNamedAccent when platform_editor_update_status_colors
 * is on, and deleted wholesale when that experiment is cleaned up.
 * See EDITOR-7600: keep in sync with EditorContentContainer-compiled.tsx.
 */
const statusStylesNamedSemantic: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] > [data-color=purple] > .lozenge-wrapper': {
		backgroundColor: token('color.background.discovery.subtler'),
		borderColor: token('color.border.discovery.subtle'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] > [data-color=purple] .lozenge-text': {
		color: token('color.text.discovery.bolder'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] > [data-color=blue] > .lozenge-wrapper': {
		backgroundColor: token('color.background.information.subtler'),
		borderColor: token('color.border.information.subtle'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] > [data-color=blue] .lozenge-text': {
		color: token('color.text.information.bolder'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] > [data-color=red] > .lozenge-wrapper': {
		backgroundColor: token('color.background.danger.subtler'),
		borderColor: token('color.border.danger.subtle'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] > [data-color=red] .lozenge-text': {
		color: token('color.text.danger.bolder'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] > [data-color=yellow] > .lozenge-wrapper': {
		backgroundColor: token('color.background.warning.subtler'),
		borderColor: token('color.border.warning.subtle'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] > [data-color=yellow] .lozenge-text': {
		color: token('color.text.warning.bolder'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] > [data-color=green] > .lozenge-wrapper': {
		backgroundColor: token('color.background.success.subtler'),
		borderColor: token('color.border.success.subtle'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] > [data-color=green] .lozenge-text': {
		color: token('color.text.success.bolder'),
	},
});
/**
 * Accent mapping for every named colour except neutral, used when
 * platform_editor_update_status_colors is on. Replaces statusStylesNamedSemantic.
 * yellow/green map to the orange/lime accents: their tokens are byte-identical to
 * warning/success in both themes, so this is not a recolour. Neutral stays on Team26.
 * See EDITOR-7600: keep in sync with EditorContentContainer-compiled.tsx.
 */
const statusStylesNamedAccent: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] > [data-color=blue] > .lozenge-wrapper': {
		backgroundColor: token('color.background.accent.blue.subtler'),
		borderColor: token('color.border.accent.blue.subtle'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] > [data-color=blue] .lozenge-text': {
		color: token('color.text.accent.blue.bolder'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] > [data-color=purple] > .lozenge-wrapper': {
		backgroundColor: token('color.background.accent.purple.subtler'),
		borderColor: token('color.border.accent.purple.subtle'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] > [data-color=purple] .lozenge-text': {
		color: token('color.text.accent.purple.bolder'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] > [data-color=red] > .lozenge-wrapper': {
		backgroundColor: token('color.background.accent.red.subtler'),
		borderColor: token('color.border.accent.red.subtle'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] > [data-color=red] .lozenge-text': {
		color: token('color.text.accent.red.bolder'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] > [data-color=yellow] > .lozenge-wrapper': {
		backgroundColor: token('color.background.accent.orange.subtler'),
		borderColor: token('color.border.accent.orange.subtle'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] > [data-color=yellow] .lozenge-text': {
		color: token('color.text.accent.orange.bolder'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] > [data-color=green] > .lozenge-wrapper': {
		backgroundColor: token('color.background.accent.lime.subtler'),
		borderColor: token('color.border.accent.lime.subtle'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] > [data-color=green] .lozenge-text': {
		color: token('color.text.accent.lime.bolder'),
	},
});
/**
 * Hex IDs the 10-color picker persists (hues that cannot use a named colour).
 * Applied when platform_editor_gracefully_render_status_color or
 * platform_editor_update_status_colors is on.
 * See EDITOR-7600: keep in sync with EditorContentContainer-compiled.tsx.
 */
const statusStylesHexAccent: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] > [data-color="#B3F5FF"] > .lozenge-wrapper': {
		backgroundColor: token('color.background.accent.teal.subtler'),
		borderColor: token('color.border.accent.teal.subtle'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] > [data-color="#B3F5FF"] .lozenge-text': {
		color: token('color.text.accent.teal.bolder'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] > [data-color="#ABF5D1"] > .lozenge-wrapper': {
		backgroundColor: token('color.background.accent.green.subtler'),
		borderColor: token('color.border.accent.green.subtle'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] > [data-color="#ABF5D1"] .lozenge-text': {
		color: token('color.text.accent.green.bolder'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] > [data-color="#D3F1A7"] > .lozenge-wrapper': {
		backgroundColor: token('color.background.accent.lime.subtler'),
		borderColor: token('color.border.accent.lime.subtle'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] > [data-color="#D3F1A7"] .lozenge-text': {
		color: token('color.text.accent.lime.bolder'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] > [data-color="#FFF0B3"] > .lozenge-wrapper': {
		backgroundColor: token('color.background.accent.yellow.subtler'),
		borderColor: token('color.border.accent.yellow.subtle'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] > [data-color="#FFF0B3"] .lozenge-text': {
		color: token('color.text.accent.yellow.bolder'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] > [data-color="#FCE4A6"] > .lozenge-wrapper': {
		backgroundColor: token('color.background.accent.orange.subtler'),
		borderColor: token('color.border.accent.orange.subtle'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] > [data-color="#FCE4A6"] .lozenge-text': {
		color: token('color.text.accent.orange.bolder'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] > [data-color="#FDD0EC"] > .lozenge-wrapper': {
		backgroundColor: token('color.background.accent.magenta.subtler'),
		borderColor: token('color.border.accent.magenta.subtle'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] > [data-color="#FDD0EC"] .lozenge-text': {
		color: token('color.text.accent.magenta.bolder'),
	},
});

export const EditorContentContainerEmotion: React.ForwardRefExoticComponent<
	EditorContentContainerProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, EditorContentContainerProps>((props, ref) => {
	const {
		className,
		children,
		viewMode,
		isScrollable,
		appearance,
		contentMode,
		useStandardNodeWidth,
	} = props;
	const theme = useTheme();
	const { colorMode } = useThemeObserver();

	const isFullPage =
		appearance === 'full-page' ||
		appearance === 'full-width' ||
		((expValEqualsNoExposure('editor_tinymce_full_width_mode', 'isEnabled', true) ||
			expValEqualsNoExposure('confluence_max_width_content_appearance', 'isEnabled', true)) &&
			appearance === 'max');
	const isComment = appearance === 'comment';
	const isChromeless = appearance === 'chromeless';

	// Evaluated unconditionally so the experiment exposure is tracked correctly
	// (must not be preconditioned by other gates in the style expression below).
	const isSyncBlockActivationEnabled = expValEquals(
		'platform_editor_sync_block_activation',
		'isEnabled',
		true,
	);

	const baseFontSize = getBaseFontSize(appearance, contentMode);

	// Under the static-CSS experiment, --ak-editor-base-font-size is set earlier on the
	// root div in editor-internal.tsx and inherited via the CSS cascade — do not set it here.
	// For the legacy path, compute it from the Emotion theme as before.
	const style = React.useMemo(
		() => ({
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			...(!expValEquals('platform_editor_core_non_ecc_static_css', 'isEnabled', true) && {
				'--ak-editor-base-font-size': `${editorFontSize({ theme })}px`,
			}),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			...(!editorExperiment('platform_editor_preview_panel_responsiveness', true, {
				exposure: true,
			}) && {
				'--ak-editor--large-gutter-padding': `${akEditorGutterPaddingDynamic()}px`,
			}),
		}),
		[theme],
	);

	const browser = getBrowserInfo();

	// Evaluate the block-spacing experiment once per render.
	const isBlockSpacingEnabled = isExperimentEnabled('platform_editor_extension_block_spacing');
	const isFloatingTocEnabled = isExperimentEnabled('platform_editor_floating_toc');
	const isUpdateStatusColorsEnabled = UNSAFE_expValNoExposure(
		'platform_editor_update_status_colors',
		'isEnabled',
		false,
	);
	const isStatusStylesTeam26 = fg('platform-dst-lozenge-tag-badge-visual-uplifts');

	return (
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className || undefined}
			ref={ref}
			css={[
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				baseStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				maxModeReizeFixStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				baseStylesMaxContainerWidthFixes,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				editorGutterPaddingBaseStyles,
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
				fontSizeStyles,
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
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				codeBlockStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				contentMode === 'compact' && codeBlockStylesWithEmUnits,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				editorUGCTokensRefreshed,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				editorUGCSmallText,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				blocktypeStyles,
				isFloatingTocEnabled &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					headingScrollMarginStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				blockquoteSelectedNodeStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				listSelectedNodeStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				textSelectedNodeStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				blocktypeStyles_fg_platform_editor_typography_ugc,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				blocktypeStylesNestedDnd,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				codeMarkStyles,
				expValEquals('platform_editor_a11y_scrollable_region', 'isEnabled', true) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					codeMarkStylesA11yFix,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				textColorStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				backgroundColorStyles,
				!expValEquals('platform_editor_lovability_text_bg_color', 'isEnabled', true) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					highlightLinksUnsetStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				textHighlightPaddingStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				listsStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				listItemHiddenMarkerStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				diffListStyles,
				// Condense vertical spacing between list items when content mode dense is active
				contentMode === 'compact' &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					getDenseListStyles(baseFontSize),
				isFullPage &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					listsStylesMarginLayoutShiftFix,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				ruleStyles,
				isExperimentEnabled('platform_editor_lovability_dividers_attributes') &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					ruleWithAttrsStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				smartCardDiffStyles,
				expValEquals('platform_editor_enghealth_a11y_jan_fixes', 'isEnabled', true)
					? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						showDiffDeletedNodeStylesNew
					: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						showDiffDeletedNodeStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				mediaStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				isExperimentEnabled('platform_editor_vanilla_node_views_phase1') && vanillaCaptionStyles,
				contentMode === 'compact' &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					mediaCaptionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				firstWrappedMediaStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				telepointerStyle,
				/* This needs to be after telepointer styles as some overlapping rules have equal specificity, and so the order is significant */
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				telepointerColorAndCommonStyle,
				// Agent-edit shimmer styles only apply when the experiment is on; no-exposure because this
				// render path is hot and the real exposure is logged where an agent edit actually lands.
				expValEqualsNoExposure('platform_editor_agent_be_streaming', 'isEnabled', true) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					agentShimmerStyle,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				gapCursorStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				gapCursorStylesVisibilityFix,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				panelStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				nestedPanelBorderStylesMixin,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				panelStylesMixinNestedDnd,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				panelStylesMixin,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				mentionsStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				tasksAndDecisionsStyles,
				// condense vertical spacing between tasks/decisions items when content mode dense is active
				contentMode === 'compact' &&
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
				fg('platform_editor_lovability_resize_exts_gracefully') && extensionWithBreakoutStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				extensionDiffStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				expandStylesBase,
				// Apply expand delta styles conditionally based on useStandardNodeWidth (negative margins or not)
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				!useStandardNodeWidth && expandStyles,
				contentMode === 'compact' &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					getDenseExpandTitleStyles(baseFontSize),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				expandStylesMixinNestedDnd,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				expandStylesMixin_fg_platform_visual_refresh_icons,
				isChromeless &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					expandStylesMixin_chromeless_expand_fix,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				findReplaceStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				findReplaceStylesWithRefSyncBlock,
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
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				taskItemCheckboxStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				decisionIconWithVisualRefresh,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				statusStyles,
				isStatusStylesTeam26
					? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						statusStylesTeam26
					: fg('platform-component-visual-refresh')
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							statusStylesMixin_fg_platform_component_visual_refresh_with_search_match
						: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							statusStylesMixin_without_fg_platform_component_visual_refresh_with_search_match,
				isStatusStylesTeam26 &&
					isUpdateStatusColorsEnabled &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					statusStylesNamedAccent,
				isStatusStylesTeam26 &&
					!isUpdateStatusColorsEnabled &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					statusStylesNamedSemantic,
				(fg('platform_editor_gracefully_render_status_color') || isUpdateStatusColorsEnabled) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					statusStylesHexAccent,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				annotationStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				smartCardStylesWithSearchMatchAndBlockMenuDangerStyles,
				editorExperiment('platform_editor_preview_panel_responsiveness', true) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					smartCardStylesWithSearchMatchAndPreviewPanelResponsiveness,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				editorControlsSmartCardStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				embedCardStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				unsupportedStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				vanillaTooltipDefaultStyles,
				fg('confluence_ncs_step_diffing_version_history') &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					contributorTagStyles,
				isExperimentEnabled('platform_editor_vanilla_node_views_phase1') &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					vanillaUnsupportedStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				resizerStyles,
				expValEqualsNoExposure('cc-maui-experiment', 'isEnabled', true) &&
					expValEquals('databases-native-embeds-v2', 'isEnabled', true) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					resizerBottomHandleStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				layoutBaseStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				alignMultipleWrappedImageInLayoutStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				syncBlockStylesBase,
				fg('platform-dst-tokens-finesse') && syncBlockSelectedStyles,
				// Apply sync block delta styles conditionally based on useStandardNodeWidth (negative margins or not)
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				!useStandardNodeWidth &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					syncBlockStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				syncBlockOverflowStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				syncBlockTextSelectionStyles,
				isSyncBlockActivationEnabled &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					syncBlockInteractiveCursorStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				syncBlockFirstNodeStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				editorExperiment('advanced_layouts', true) && layoutBaseStylesAdvanced,
				editorExperiment('advanced_layouts', true)
					? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						layoutSectionStylesAdvanced
					: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						layoutSectionStylesNotAdvanced,
				editorExperiment('advanced_layouts', true) &&
					!fg('platform-dst-top-layer-tooltip') &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					layoutDragHandleWrapperStylesLegacy,
				editorExperiment('advanced_layouts', true) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					layoutColumnDividerStyles,
				editorExperiment('advanced_layouts', true) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					layoutColumnDividerStylesNestedDnD,
				editorExperiment('advanced_layouts', true)
					? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						layoutColumnStylesAdvanced
					: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						layoutColumnStylesNotAdvanced,
				editorExperiment('advanced_layouts', true) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					layoutColumnResizeStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				editorExperiment('advanced_layouts', true)
					? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						layoutSelectedStylesAdvanced
					: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						layoutSelectedStylesNotAdvanced,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				layoutSelectedStylesAdvancedFix,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				editorExperiment('advanced_layouts', true) && layoutColumnResponsiveStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				editorExperiment('advanced_layouts', true) && layoutResponsiveBaseStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				layoutBaseStylesNestedDndExcludingBodiedSync,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				layoutColumnMartinTopFixes,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				smartLinksInLivePagesStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				linkingVisualRefreshV1Styles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				dateVanillaStyles,
				contentMode === 'compact'
					? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						paragraphStylesWithScaledMargin
					: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						paragraphStylesUGCRefreshed,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				linkStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				browser.safari && listsStylesSafariFix,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				pragmaticResizerStylesSyncedBlock,
				expValEqualsNoExposure('platform_editor_breakout_resizing', 'isEnabled', true)
					? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						pragmaticResizerStyles
					: undefined,
				expValEqualsNoExposure('platform_editor_breakout_resizing', 'isEnabled', true) &&
					expValEqualsNoExposure(
						'platform_editor_lovability_resize_dividers_panels',
						'isEnabled',
						true,
					) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					pragmaticResizerStylesPanelAndRule,
				expValEqualsNoExposure('platform_editor_breakout_resizing', 'isEnabled', true) &&
					isExperimentEnabled('platform_editor_lovability_resize_extensions') &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					pragmaticResizerStylesExtensions,
				expValEqualsNoExposure('platform_editor_breakout_resizing', 'isEnabled', true)
					? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						pragmaticResizerStylesCodeBlockSyncedBlockPatch
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
				// Non-full-page appearances (comment, chromeless) have no `container-type` ancestor,
				// so `cqw`-based content sizing (native embeds, media) falls back to the viewport and
				// does not shrink when a sidebar narrows the content column. Make the content area a
				// query container so `--ak-editor-max-container-width` resolves against the actual
				// (sidebar-aware) editor width. Full-page keeps using the `editor-area` container.
				(isComment || isChromeless) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					nonFullPageContainerTypeStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				isFullPage && fullPageEditorStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				isFullPage && scrollbarStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				firstCodeBlockWithNoMargin,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				firstBlockNodeStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				firstNodeWidgetFixStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				mentionNodeStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				mentionsSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				expValEquals('platform_editor_lovability_emoji_scaling', 'isEnabled', true)
					? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						scaledEmojiStyles
					: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						emojiStyles,
				isFloatingTocEnabled
					? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						directEmojiSelectionStyles
					: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						emojiSelectionStyles,
				// Dense emoji scaling based on base font size
				contentMode === 'compact'
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
				tableLayoutFixesWithFontSize,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				tableContainerStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				tableSharedStyle(),
				isExperimentEnabled('platform_editor_table_css_overflow_shadow') &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					tableScrollInlineShadowStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				tableEmptyRowStyles,
				// SSR-safe rounded corners (see tableRoundedCornerStyles). Gated to match the table plugin
				// migration that drops roundedTableCellCornerStyles() from the client-only <Global> styles.
				expValEquals('platform_editor_table_q4_loveability', 'isEnabled', true) &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					tableRoundedCornerStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				tableContentModeStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				tableContentModeExtensionContainmentStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				tableContentModeNestedTableStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				hyperLinkFloatingToolbarStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				selectionToolbarAnimationStyles,
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
				// Block spacing hook — opt-in via --ak-editor-extension-block-spacing.
				// Applied last so the var-based margins override the base block margins by source
				// order. Gated by an experiment so it can be disabled.
				isBlockSpacingEnabled &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					blockSpacingVarStyles,
				isBlockSpacingEnabled &&
					contentMode === 'compact' &&
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					blockSpacingVarScaledStyles,
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
});
